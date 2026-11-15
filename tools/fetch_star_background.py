"""Save the selected NASA/Hubble photo locally; no desktop/browser automation."""
from pathlib import Path
import hashlib
import json
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
URL = 'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/hubble/releases/2015/11/STScI-01EVT26J52T32NX81JDJHNKKWM.tif?w=1600&fit=clip'


def main():
    request = urllib.request.Request(URL, headers={'User-Agent': 'AcustikSpace/0.3 educational site'})
    with urllib.request.urlopen(request, timeout=25) as response:
        data = response.read(5_000_001)
        content_type = response.headers.get_content_type()
    extension = '.jpg' if data.startswith(b'\xff\xd8\xff') else '.webp' if data[:4] == b'RIFF' and data[8:12] == b'WEBP' else None
    if not extension or len(data) > 5_000_000 or not content_type.startswith('image/'):
        raise ValueError('Expected a valid JPEG/WebP under 5 MB')
    directory = ROOT / 'dist' / 'assets' / 'space'
    directory.mkdir(parents=True, exist_ok=True)
    target = directory / ('hubble-sweeps-stars' + extension)
    temporary = target.with_suffix('.part')
    temporary.write_bytes(data)
    temporary.replace(target)
    config = ROOT / 'dist' / 'js' / 'space-background.js'
    code = config.read_text(encoding='utf-8')
    code = code.replace('local: null,', f"local: 'assets/space/{target.name}',")
    config.write_text(code, encoding='utf-8')
    (directory / 'download.json').write_text(json.dumps({'url': URL, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}, indent=2), encoding='utf-8')
    print(f'Saved {target.name}: {len(data)} bytes')


if __name__ == '__main__':
    main()
