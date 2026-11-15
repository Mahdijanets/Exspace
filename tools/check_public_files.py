"""Check proposed public files without printing secret values."""
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
paths = sorted(set(filter(None, subprocess.check_output(
    ['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z'], cwd=ROOT
).decode('utf-8').split('\0'))))
secrets = []
env = ROOT / '.env'
if env.exists():
    for line in env.read_text(encoding='utf-8-sig').splitlines():
        if '=' in line:
            name, value = line.split('=', 1)
            value = value.strip().strip('\"\'')
            if any(word in name.upper() for word in ('KEY', 'TOKEN', 'PASSWORD', 'SECRET')) and len(value) >= 12:
                secrets.append(value.encode())
patterns = [re.compile(rb'AIza[0-9A-Za-z_-]{35}'),
            re.compile(rb'gh[pousr]_[0-9A-Za-z]{30,}'),
            re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----')]
errors = []
total = 0
for name in paths:
    path = ROOT / name
    if not path.is_file():
        continue
    if (any(p in ('.openai', '.aws', '.codex', '.agents', 'data') for p in Path(name).parts)
            or (path.name.startswith('.env') and path.name != '.env.example')
            or path.suffix in ('.db', '.sqlite', '.sqlite3', '.pem', '.key', '.pfx', '.p12')):
        errors.append(f'Private file included: {name}')
    size = path.stat().st_size
    total += size
    if size > 100 * 1024 * 1024:
        errors.append(f'File exceeds GitHub 100 MiB limit: {name}')
    data = path.read_bytes()
    if any(secret in data for secret in secrets) or any(pattern.search(data) for pattern in patterns):
        errors.append(f'Possible secret detected: {name}')
if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'PASS: {len(paths)} public files, {total / 1024**2:.0f} MiB; no configured secrets or oversized files detected.')
