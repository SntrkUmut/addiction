"""Turkish diacritic spelling check for manifest copy (rev 5.5).

Not a full spellchecker. It catches the typos that actually happen when Turkish is typed on a non-Turkish
keyboard or relayed through tools: ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u (and â/a, î/i, û/u) swapped or ASCII-fied.

Rule: a copy token that is NOT in the wordlist, but whose diacritic-folded form equals the folded form of a
wordlist word, is flagged ("kis" → "kış", "Kucuk" → "küçük", "BOLUM" → "bölüm"). Tokens that are unknown and
collide with nothing are ignored (no false alarms on new words; add them with --spell-unknown).

Wordlist: content/tr_words.txt = every token of the approved copy + a small common-words dictionary +
an allowlist of real words that differ only by diacritics (sen/şen, kar/kâr, …), so both forms are accepted.
Only copy fields are checked; ids, icons, art paths, dates and enums are not."""
import re, os
from editorial import tr_lower

FOLD = str.maketrans("ışğçöüâîû", "isgcouaiu")
WORD = re.compile(r"[a-zçğıöşüâîû]+")
COPY_KEYS = {"name", "title", "line", "body", "cta", "eyebrow", "teaserLine", "hint", "lead", "slipEyebrow", "slipLead", "slipBody"}
HERE = os.path.dirname(os.path.abspath(__file__))

def fold(w: str) -> str:
    return w.translate(FOLD)

def load_words(path=f"{HERE}/tr_words.txt"):
    return {l.strip() for l in open(path, encoding="utf8") if l.strip() and not l.startswith("#")}

def copy_strings(node, path=""):
    """Yield (json-path, text) for every copy string in a manifest."""
    if isinstance(node, dict):
        for k, v in node.items():
            p = f"{path}/{k}"
            if isinstance(v, str) and k in COPY_KEYS: yield p, v
            elif isinstance(v, (dict, list)): yield from copy_strings(v, p)
    elif isinstance(node, list):
        for i, v in enumerate(node): yield from copy_strings(v, f"{path}/{i}")

def tokens(text: str):
    return WORD.findall(tr_lower(text))

def check(manifest, words=None):
    """Return [(path, token, suggestion, kind)] with kind 'ascii' (diacritics dropped) or 'swap' (wrong diacritic)."""
    words = words if words is not None else load_words()
    index = {}
    for w in words: index.setdefault(fold(w), set()).add(w)
    out = []
    for path, text in copy_strings(manifest):
        for t in tokens(text):
            if t in words: continue
            cand = sorted(index.get(fold(t), set()) - {t})
            if cand: out.append((path, t, "/".join(cand), "ascii" if t.isascii() else "swap"))
    return out

def unknown(manifest, words=None):
    words = words if words is not None else load_words()
    return sorted({t for _, s in copy_strings(manifest) for t in tokens(s)} - words)

if __name__ == "__main__":
    import json, sys
    if len(sys.argv) < 2:
        sys.stderr.write("usage: tr_spell.py MANIFEST.json\n")
        sys.exit(2)
    path = sys.argv[1]
    manifest = json.load(open(path, encoding="utf-8"))
    hits = check(manifest)
    if hits:
        for loc, token, suggestion, kind in hits:
            kind_label = "ASCII-fied" if kind == "ascii" else "a diacritic swap of"
            print(f"spelling: '{token}' at {loc} looks like {kind_label} '{suggestion}'")
        sys.exit(1)
    print(f"OK  {path}  spelling")
