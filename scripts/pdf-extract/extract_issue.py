from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import fitz
from pypdf import PdfReader

try:
    from opencc import OpenCC
except ImportError:  # pragma: no cover
    OpenCC = None


ROOT = Path(__file__).resolve().parents[2]
ISSUE_ID = "issue-01"
SIMP_PDF = ROOT / "Celestial_Reserve_《漢留》第一集（簡體版）20260309.pdf"
TRAD_PDF = ROOT / "Celestial_Reserve_《漢留》第一集（繁體版）20260309.pdf"
DATA_DIR = ROOT / "data" / "issues" / ISSUE_ID
PUBLIC_DIR = ROOT / "public" / "generated" / ISSUE_ID
CORRUPTED_SUFFIX_PATTERN = re.compile(r"(?:\d+[A-F]){2,}$", re.IGNORECASE)


def main() -> None:
    ensure_exists(SIMP_PDF)
    ensure_exists(TRAD_PDF)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    converter = OpenCC("s2t") if OpenCC else None

    simp_reader = PdfReader(str(SIMP_PDF))
    outline = extract_outline(simp_reader, converter)
    articles = build_articles(outline, len(simp_reader.pages))

    manifest = {
        "issueId": ISSUE_ID,
        "title": "漢留",
        "subtitle": "第一集 复汉·兴华·拯天下",
        "cover": f"/generated/{ISSUE_ID}/zh-Hans/pages/page-001.jpg",
        "defaultLocale": "zh-Hans",
        "pageCount": len(simp_reader.pages),
        "articles": articles,
        "toc": outline,
    }

    simp_doc = fitz.open(SIMP_PDF)
    trad_doc = fitz.open(TRAD_PDF)
    pages_hans = extract_pages(simp_doc, "zh-Hans")
    pages_hant = extract_pages(trad_doc, "zh-Hant")

    write_json(DATA_DIR / "manifest.json", manifest)
    write_json(DATA_DIR / "pages.zh-Hans.json", pages_hans)
    write_json(DATA_DIR / "pages.zh-Hant.json", pages_hant)

    print(f"Wrote manifest to {DATA_DIR / 'manifest.json'}")
    print(f"Wrote {len(pages_hans)} simplified pages and {len(pages_hant)} traditional pages.")


def ensure_exists(file_path: Path) -> None:
    if not file_path.exists():
        raise FileNotFoundError(file_path)


def clean_outline_title(value: str) -> str:
    return CORRUPTED_SUFFIX_PATTERN.sub("", value).strip()


def extract_outline(reader: PdfReader, converter: Any | None) -> list[dict[str, Any]]:
    entries: list[dict[str, Any]] = []

    def walk(items: list[Any], level: int = 0) -> None:
        for item in items:
            if isinstance(item, list):
                walk(item, level + 1)
                continue

            if level == 0:
                continue

            title_hans = clean_outline_title(getattr(item, "title", str(item)))
            title_hant = converter.convert(title_hans) if converter else title_hans
            page = reader.get_destination_page_number(item) + 1
            entries.append(
                {
                    "level": level,
                    "page": page,
                    "titleHans": title_hans,
                    "titleHant": title_hant,
                }
            )

    walk(reader.outline)
    return entries


def build_articles(outline: list[dict[str, Any]], page_count: int) -> list[dict[str, Any]]:
    top_level_entries = [entry for entry in outline if entry["level"] == 1]
    articles: list[dict[str, Any]] = []

    for index, entry in enumerate(top_level_entries):
        next_entry = top_level_entries[index + 1] if index + 1 < len(top_level_entries) else None
        start_page = entry["page"]
        end_page = (next_entry["page"] - 1) if next_entry else page_count
        slug = f"page-{start_page:03d}"
        sections = [
            {
                "level": section["level"],
                "page": section["page"],
                "titleHans": section["titleHans"],
                "titleHant": section["titleHant"],
            }
            for section in outline
            if section["level"] >= 2
            and section["page"] >= start_page
            and (next_entry is None or section["page"] < next_entry["page"])
        ]
        articles.append(
            {
                "articleId": f"{ISSUE_ID}-a{index + 1:03d}",
                "slug": slug,
                "titleHans": entry["titleHans"],
                "titleHant": entry["titleHant"],
                "startPage": start_page,
                "endPage": end_page,
                "sections": sections,
                "commentThreadId": f"{ISSUE_ID}:{slug}",
            }
        )

    return articles


def extract_pages(doc: fitz.Document, locale: str) -> list[dict[str, Any]]:
    pages_dir = PUBLIC_DIR / locale / "pages"
    images_dir = PUBLIC_DIR / locale / "images"
    pages_dir.mkdir(parents=True, exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)

    result: list[dict[str, Any]] = []

    for page_index in range(doc.page_count):
        page = doc[page_index]
        page_number = page_index + 1
        page_file = pages_dir / f"page-{page_number:03d}.jpg"
        page_asset = f"/generated/{ISSUE_ID}/{locale}/pages/page-{page_number:03d}.jpg"

        if not page_file.exists():
            pixmap = page.get_pixmap(dpi=144, alpha=False)
            pixmap.save(page_file)

        text_blocks = []
        for block in page.get_text("blocks", sort=True):
            x0, y0, x1, y1, text, *_tail = block
            block_type = block[6] if len(block) > 6 else 0
            if block_type != 0:
                continue

            normalized = normalize_block_text(text)
            if not normalized:
                continue

            if normalized == str(page_number) and y0 > page.rect.height * 0.88:
                continue

            text_blocks.append(
                {
                    "x": round(x0, 2),
                    "y": round(y0, 2),
                    "width": round(x1 - x0, 2),
                    "height": round(y1 - y0, 2),
                    "text": normalized,
                }
            )

        images = extract_page_images(doc, page, page_number, locale, images_dir)

        result.append(
            {
                "pageId": f"{ISSUE_ID}-p{page_number:03d}",
                "locale": locale,
                "pageNumber": page_number,
                "pageLabel": str(page_number),
                "renderedPageAsset": page_asset,
                "viewport": {
                    "width": round(page.rect.width, 2),
                    "height": round(page.rect.height, 2),
                },
                "textBlocks": text_blocks,
                "images": images,
            }
        )

    return result


def extract_page_images(
    doc: fitz.Document,
    page: fitz.Page,
    page_number: int,
    locale: str,
    images_dir: Path,
) -> list[dict[str, Any]]:
    images: list[dict[str, Any]] = []
    seen: set[int] = set()

    for index, image_info in enumerate(page.get_images(full=True), start=1):
        xref = image_info[0]
        if xref in seen:
            continue
        seen.add(xref)

        extracted = doc.extract_image(xref)
        if not extracted:
            continue

        ext = extracted.get("ext", "png")
        filename = f"page-{page_number:03d}-{index:02d}.{ext}"
        file_path = images_dir / filename
        if not file_path.exists():
            file_path.write_bytes(extracted["image"])

        images.append(
            {
                "src": f"/generated/{ISSUE_ID}/{locale}/images/{filename}",
                "alt": f"《漢留》第 {page_number} 页插图 {index}",
                "width": extracted.get("width", 0),
                "height": extracted.get("height", 0),
            }
        )

    return images


def normalize_block_text(text: str) -> str:
    lines = [line.strip() for line in text.splitlines()]
    paragraphs: list[str] = []
    current: list[str] = []

    for line in lines:
        if not line:
            if current:
                paragraphs.append("".join(current))
                current = []
            continue
        current.append(line)

    if current:
        paragraphs.append("".join(current))

    return "\n\n".join(paragraphs).strip()


def write_json(file_path: Path, payload: Any) -> None:
    file_path.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf8")


if __name__ == "__main__":
    main()
