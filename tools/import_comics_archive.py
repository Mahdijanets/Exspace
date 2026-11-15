"""Append paired PDFs from a ZIP to the local comic catalog."""
import json
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tmp/pdf-render'))
import fitz

catalog_path = ROOT / 'dist/js/comics-data.js'
catalog = json.loads(catalog_path.read_text(encoding='utf-8').split('=', 1)[1].strip().rstrip(';'))
dest = ROOT / 'dist/assets/comics'
worlds = {
    'Moon': 'Apollo_11 Artemis_I Artemis_II',
    'Earth orbit': 'Apollo_1 Apollo_8 Apollo_13 Echo_1 Explorer_1 Friendship_7 Gemini_Program Robonaut_2',
    'Earth': 'Aqua GRACE ICESat_2 Landsat SMAP Terra TIROS_1',
    'Deep space': 'Chandra COBE Compton_Gamma_Ray_Observatory Fermi GALEX Hubble James_Webb Spitzer Swift TESS WISE_and_NEOWISE WMAP Voyager_1',
    'Sun': 'SOHO Solar_Dynamics_Observatory STEREO Ulysses Genesis',
    'Venus': 'Magellan Pioneer_Venus',
    'Mercury': 'MESSENGER Mariner_10',
    'Jupiter': 'Juno', 'Saturn': 'Cassini_Huygens',
    'Asteroids': 'DART Psyche', 'Pluto / Kuiper belt': 'New_Horizons',
}
world_by_name = {name: world for world, names in worlds.items() for name in names.split()}
with zipfile.ZipFile(sys.argv[1]) as archive:
    names = {Path(info.filename).name: info for info in archive.infolist() if not info.is_dir()}
    bases = sorted(name[:-10] for name in names if name.endswith('_comic.pdf'))
    assert bases and all(f'{base}_story.pdf' in names for base in bases), 'Missing story pair'
    added = []
    for base in bases:
        slug = base.lower().replace('_', '-')
        title = base.replace('_', ' ').replace(' and ', ' & ')
        item = dict(id=slug, title=title, missions=[slug], world=world_by_name[base])
        item['summary'] = f'Explore {title} through an illustrated comic and its companion story.'
        for mode in ('comic', 'story'):
            target = dest / f'{slug}-{mode}.pdf'
            with archive.open(names[f'{base}_{mode}.pdf']) as source, target.open('wb') as output:
                shutil.copyfileobj(source, output)
            with fitz.open(target) as doc:
                assert len(doc) > 0 and not doc.needs_pass, target
                doc[0].get_pixmap(matrix=fitz.Matrix(.8, .8), alpha=False).save(dest / f'{slug}-{mode}.jpg')
                item['pages' if mode == 'comic' else 'storyPages'] = len(doc)
            item['pdf' if mode == 'comic' else 'storyPdf'] = f'assets/comics/{slug}-{mode}.pdf'
            item['cover' if mode == 'comic' else 'storyCover'] = f'assets/comics/{slug}-{mode}.jpg'
        added.append(item)
        print(f'Imported {title}', flush=True)
catalog = [item for item in catalog if item['id'] not in {entry['id'] for entry in added}] + added
catalog_path.write_text('export const comics = ' + json.dumps(catalog, indent=2) + ';\n', encoding='utf-8')
print(f'Added {len(added)} pairs; catalog now contains {len(catalog)} comics.')
