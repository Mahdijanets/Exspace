"""Publish a source-only review branch while the full media upload is running."""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SAFE = f'safe.directory={ROOT.as_posix()}'

def git(*args, data=None):
    result = subprocess.run(['git', '-c', SAFE, *args], cwd=ROOT,
                            input=data, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
    return result.stdout

entries = git('ls-tree', '-r', '-z', 'HEAD').split(b'\0')
tree = {}
count = 0
for entry in entries:
    if not entry:
        continue
    info, path = entry.split(b'\t', 1)
    name = path.decode()
    if name.startswith('.github/') or name.startswith('dist/assets/'):
        continue
    mode, kind, sha = info.decode().split()
    node = tree
    parts = name.split('/')
    for part in parts[:-1]:
        node = node.setdefault(part, {})
    node[parts[-1]] = (mode, kind, sha)
    count += 1

note = b'''# Source review branch\n\nThis branch contains the project source code for immediate review.\nThe complete project, including comics, photographs and reader pages, is being uploaded to the main branch.\nMedia under dist/assets is intentionally absent from this lightweight branch.\nUse main for the complete runnable project when its upload finishes.\nNo private API keys or local account database are included.\n'''
sha = git('hash-object', '-w', '--stdin', data=note).decode().strip()
tree['REVIEW_STATUS.md'] = ('100644', 'blob', sha)

def build(node):
    lines = []
    for name, value in node.items():
        if isinstance(value, dict):
            mode, kind, sha = '040000', 'tree', build(value)
        else:
            mode, kind, sha = value
        lines.append(f'{mode} {kind} {sha}\t{name}\n')
    return git('mktree', data=''.join(lines).encode()).decode().strip()

root = build(tree)
git('fetch', '--quiet', 'origin', 'source-review')
parent = git('rev-parse', 'FETCH_HEAD').decode().strip()
if git('rev-parse', f'{parent}^{{tree}}').decode().strip() == root:
    print('Source review is already up to date.')
    raise SystemExit(0)
commit = git('-c', 'user.name=Mahdijanets', '-c', 'user.email=Mahdijanets@users.noreply.github.com',
             'commit-tree', root, '-p', parent, '-m', 'Update EXSPACE source code for review').decode().strip()
print(f'Prepared {count} source files, commit {commit[:7]}', flush=True)
subprocess.run(['git', '-c', SAFE,
                '-c', 'http.version=HTTP/1.1', 'push', 'origin',
                f'{commit}:refs/heads/source-review'], cwd=ROOT, check=True)
