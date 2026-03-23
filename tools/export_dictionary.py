import json
import sqlite3
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SOURCE_DB = ROOT / 'db' / 'kamus.sqlite'
OUTPUT_JSON = ROOT / 'public' / 'data' / 'dictionary.json'
OUTPUT_MANIFEST = ROOT / 'public' / 'data' / 'manifest.json'


def normalize_token(value: str) -> str:
    return value.strip().lower()


def tokenize(value: str) -> list[str]:
    tokens = set()
    for part in value.replace(',', ' ').split():
        token = normalize_token(part)
        if token:
            tokens.add(token)
    return sorted(tokens)


def normalize_kr(value: str) -> str:
    return ''.join(value.split()).lower()


def to_bigrams(value: str) -> list[str]:
    normalized = normalize_kr(value)
    if not normalized:
        return []
    if len(normalized) == 1:
        return [normalized]
    grams = {normalized[i : i + 2] for i in range(len(normalized) - 1)}
    return sorted(grams)


def to_prefixes(value: str, limit: int = 24) -> list[str]:
    normalized = normalize_token(value)
    if not normalized:
        return []
    return sorted({normalized[:idx] for idx in range(1, min(len(normalized), limit) + 1)})


def main() -> None:
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(SOURCE_DB)
    cursor = conn.cursor()

    entries = []
    for row in cursor.execute('SELECT "ID", "in", "rt", "en", "kr" FROM data ORDER BY "ID"'):
        entry_id, in_word, root_word, english, korean = row
        in_word = in_word or ''
        root_word = root_word or ''
        english = english or ''
        korean = korean or ''

        entries.append(
            {
                'id': entry_id,
                'inWord': in_word,
                'inNorm': normalize_token(in_word),
                'inPrefixes': to_prefixes(in_word),
                'rt': root_word,
                'en': english,
                'kr': korean,
                'enTokens': tokenize(english),
                'rtTokens': tokenize(root_word),
                'krGrams': to_bigrams(korean),
            }
        )

    h2r = {}
    for row in cursor.execute('SELECT "han", "rom" FROM h2r'):
        han, rom = row
        h2r[han] = rom

    payload = {
        'version': 2,
        'entries': entries,
        'h2r': h2r,
    }
    manifest = {'version': payload['version']}

    with OUTPUT_JSON.open('w', encoding='utf-8') as out_file:
        json.dump(payload, out_file, ensure_ascii=False, separators=(',', ':'))
    with OUTPUT_MANIFEST.open('w', encoding='utf-8') as out_file:
        json.dump(manifest, out_file, ensure_ascii=False, separators=(',', ':'))

    conn.close()
    print(f'Wrote {len(entries)} entries to {OUTPUT_JSON}')
    print(f'Wrote manifest to {OUTPUT_MANIFEST}')


if __name__ == '__main__':
    main()
