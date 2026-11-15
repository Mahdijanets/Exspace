"""Server-only AI providers. No API credentials are served to browsers."""
import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent


def config():
    values = {}
    path = ROOT / '.env'
    if path.exists():
        for line in path.read_text(encoding='utf-8-sig').splitlines():
            if '=' in line and not line.lstrip().startswith('#'):
                key, value = line.split('=', 1)
                values[key.strip()] = value.strip().strip('\"\'')
    return {key: os.environ.get(key, values.get(key, default)) for key, default in
            [('AI_PROVIDER', 'openai'), ('OPENAI_API_KEY', ''), ('OPENAI_MODEL', 'gpt-4.1-mini'),
             ('GEMINI_API_KEY', ''), ('GEMINI_MODEL', 'gemini-3.8-flash')]}


def answer(messages):
    settings = config()
    gemini = settings['AI_PROVIDER'].lower() == 'gemini'
    if settings['AI_PROVIDER'].lower() not in ('openai', 'gemini'):
        return 503, {'error': 'invalid_provider'}
    if not settings['GEMINI_API_KEY' if gemini else 'OPENAI_API_KEY']:
        return 503, {'error': 'not_configured'}
    instructions = (ROOT / 'backend/akustik_instructions.txt').read_text(encoding='utf-8')
    payload = {
        'model': settings['OPENAI_MODEL'],
        'instructions': instructions,
        'input': messages,
        'max_output_tokens': 700,
        'store': False,
    }
    request = Request('https://api.openai.com/v1/responses',
                      data=json.dumps(payload).encode('utf-8'),
                      headers={'Authorization': 'Bearer ' + settings['OPENAI_API_KEY'],
                               'Content-Type': 'application/json'})
    if gemini:
        payload = {
            'systemInstruction': {'parts': [{'text': instructions}]},
            'contents': [{'role': 'model' if m['role'] == 'assistant' else 'user',
                          'parts': [{'text': m['content']}]} for m in messages],
            'generationConfig': {'maxOutputTokens': 2048},
        }
        model = quote(settings['GEMINI_MODEL'], safe='')
        request = Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
                          data=json.dumps(payload).encode('utf-8'),
                          headers={'x-goog-api-key': settings['GEMINI_API_KEY'],
                                   'Content-Type': 'application/json'})
    try:
        with urlopen(request, timeout=45) as response:
            result = json.load(response)
        if gemini:
            candidates = result.get('candidates', [])
            parts = candidates[0].get('content', {}).get('parts', []) if candidates else []
            text = '\n'.join(part.get('text', '') for part in parts if not part.get('thought'))
        else:
            text = '\n'.join(part.get('text', '') for item in result.get('output', [])
                             if item.get('type') == 'message' for part in item.get('content', [])
                             if part.get('type') == 'output_text')
        return (200, {'reply': text}) if text.strip() else (502, {'error': 'empty_response'})
    except HTTPError as error:
        return 502, {'error': 'provider_error', 'provider_status': error.code}
    except (URLError, TimeoutError, ValueError, OSError):
        return 502, {'error': 'provider_unavailable'}
