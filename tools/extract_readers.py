"""Extract original PDF page images for the browser reader, without changing PDFs."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tmp/pdf-render'))
import fitz

catalog = json.loads((ROOT / 'dist/js/comics-data.js').read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
manifest = {}
for mission in catalog:
    manifest[mission['id']] = {}
    for mode, key in [('comic', 'pdf'), ('text', 'storyPdf')]:
        folder = ROOT / 'dist/assets/readers' / mission['id'] / mode
        folder.mkdir(parents=True, exist_ok=True)
        pages = []
        with fitz.open(ROOT / 'dist' / mission[key]) as doc:
            for index, page in enumerate(doc):
                target = folder / f'{index + 1:02}.jpg'
                if not target.exists():
                    # These PDFs contain full-page artwork, including their text.
                    images = page.get_images(full=True)
                    if len(images) == 1:
                        embedded = doc.extract_image(images[0][0])
                        # Preserve the original full-page JPEG without recompression.
                        if embedded['ext'] in ('jpg', 'jpeg'):
                            target.write_bytes(embedded['image'])
                            pages.append(target.relative_to(ROOT / 'dist').as_posix())
                            continue
                        pix = fitz.Pixmap(doc, images[0][0])
                        if pix.colorspace is None or pix.n != 3:
                            pix = fitz.Pixmap(fitz.csRGB, pix)
                    else:
                        pix = page.get_pixmap(matrix=fitz.Matrix(1.7, 1.7), alpha=False)
                    if pix.width > 1800:
                        pix = page.get_pixmap(matrix=fitz.Matrix(1800 / page.rect.width, 1800 / page.rect.width), alpha=False)
                    pix.save(str(target), jpg_quality=90)
                pages.append(target.relative_to(ROOT / 'dist').as_posix())
        manifest[mission['id']][mode] = pages
        print(f"{mission['id']} {mode}: {len(pages)} pages", flush=True)
(ROOT / 'dist/js/reader-data.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
