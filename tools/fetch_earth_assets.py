"""Download official NASA assets into dist; validates before replacing files.

Run: python tools/fetch_earth_assets.py
Optional: --model-file path/to/downloaded-nasa-earth.glb
No account, browser automation or API key is used.
"""
import argparse
import hashlib
import html
import json
from pathlib import Path
import re
import struct
import urllib.request
from urllib.parse import urljoin, urlsplit

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / 'dist' / 'assets' / 'earth'
MODEL_PAGE = 'https://science.nasa.gov/resource/earth-with-clouds-3d-model/'
SURFACE = 'https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography-bathymetry/june/world.topo.bathy.200406.3x5400x2700.jpg'


def download(url):
    host = urlsplit(url).hostname or ''
    if not (host == 'nasa.gov' or host.endswith('.nasa.gov')):
        raise ValueError('Expected an official NASA download')
    request = urllib.request.Request(url, headers={'User-Agent': 'AcustikSpace/0.3 (educational asset download)'})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read(40 * 1024 * 1024 + 1)
    if len(data) > 40 * 1024 * 1024:
        raise ValueError('Asset exceeds 40 MB')
    return data


def validate_glb(data):
    if len(data) < 20:
        raise ValueError('GLB is incomplete')
    magic, version, length = struct.unpack_from('<4sII', data)
    if (magic, version, length) != (b'glTF', 2, len(data)):
        raise ValueError('Invalid GLB header')
    size, kind = struct.unpack_from('<I4s', data, 12)
    if kind != b'JSON' or size > len(data) - 20:
        raise ValueError('Invalid GLB JSON chunk')
    document = json.loads(data[20:20 + size])
    if not document.get('meshes') or not document.get('scenes'):
        raise ValueError('GLB has no scene/mesh')
    for entry in document.get('buffers', []) + document.get('images', []):
        uri = entry.get('uri', '')
        if uri and not uri.startswith('data:'):
            raise ValueError('Expected a self-contained GLB')


def save(name, data, source):
    DEST.mkdir(parents=True, exist_ok=True)
    target = DEST / name
    temporary = target.with_suffix(target.suffix + '.part')
    temporary.write_bytes(data)
    temporary.replace(target)
    return {'file': name, 'source': source, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model-file', type=Path)
    args = parser.parse_args()
    records = []
    failures = []
    try:
        if args.model_file:
            data = args.model_file.read_bytes()
            source = MODEL_PAGE
        else:
            page = html.unescape(download(MODEL_PAGE).decode('utf-8')).replace('\\/', '/')
            candidates = re.findall(r'(?:https?:)?//[^\s"<>\x27]+?\.glb(?:\?[^\s"<>\x27]*)?', page, flags=re.I)
            if not candidates:
                raise ValueError('NASA page did not expose a GLB link; use --model-file for the official download')
            source = urljoin(MODEL_PAGE, candidates[0])
            data = download(source)
        validate_glb(data)
        records.append(save('nasa-earth.glb', data, source))
        print('Downloaded and validated NASA Earth GLB')
    except Exception as error:
        failures.append('Model: ' + str(error))
    try:
        data = download(SURFACE)
        if not data.startswith(b'\xff\xd8\xff'):
            raise ValueError('Expected a JPEG surface map')
        records.append(save('blue-marble-bathymetry-june.jpg', data, SURFACE))
        print('Downloaded NASA Blue Marble surface map')
    except Exception as error:
        failures.append('Surface: ' + str(error))
    if records:
        (DEST / 'downloads.json').write_text(json.dumps(records, indent=2), encoding='utf-8')
    if records:
        config_path = ROOT / 'dist' / 'js' / 'earth-assets.js'
        config = config_path.read_text(encoding='utf-8')
        for record in records:
            key = 'model' if record['file'].endswith('.glb') else 'surface'
            path = 'assets/earth/' + record['file']
            config = re.sub(r'^  ' + key + r':[^\n]*', f"  {key}: '{path}',", config, flags=re.M)
        config_path.write_text(config, encoding='utf-8')
    for failure in failures:
        print(failure)
    return 1 if failures else 0


if __name__ == '__main__':
    raise SystemExit(main())
