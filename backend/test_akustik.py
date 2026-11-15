import io
import json
import unittest
from unittest.mock import patch
from backend.akustik import answer


class ProviderTests(unittest.TestCase):
    @patch('backend.akustik.config', return_value={
        'AI_PROVIDER': 'gemini', 'GEMINI_API_KEY': 'test-key',
        'GEMINI_MODEL': 'gemini-2.5-flash', 'OPENAI_MODEL': '', 'OPENAI_API_KEY': '',
    })
    @patch('backend.akustik.urlopen')
    def test_gemini_payload_and_reply(self, request, settings):
        request.return_value = io.BytesIO(json.dumps({'candidates': [{'content': {'parts': [
            {'text': 'private thought', 'thought': True}, {'text': 'Hello from Akustik!'}
        ]}}]}).encode())
        status, body = answer([{'role': 'user', 'content': 'Hi'},
                               {'role': 'assistant', 'content': 'Hello'},
                               {'role': 'user', 'content': 'Tell me about Mars'}])
        self.assertEqual((status, body), (200, {'reply': 'Hello from Akustik!'}))
        sent = request.call_args.args[0]
        payload = json.loads(sent.data)
        self.assertIn('generativelanguage.googleapis.com', sent.full_url)
        self.assertNotIn('test-key', sent.full_url)
        self.assertEqual(payload['contents'][1]['role'], 'model')
        self.assertIn('Akustik', payload['systemInstruction']['parts'][0]['text'])

    @patch('backend.akustik.config', return_value={'AI_PROVIDER': 'gemini', 'GEMINI_API_KEY': ''})
    @patch('backend.akustik.urlopen')
    def test_missing_key_does_not_send_request(self, request, settings):
        self.assertEqual(answer([{'role': 'user', 'content': 'Hi'}])[0], 503)
        request.assert_not_called()


if __name__ == '__main__':
    unittest.main()
