"""Editorial word rules shared by check_manifest.py and its tests (rev 5.2).
The verb 'yakmak' evokes 'sigara yakmak', so it is never used in app copy; 'yanmak' is banned in its
burn/light sense. Matching is whole-word and morphology-aware, so look-alikes such as yakın, yaklaşık,
yaka, yakala-, yakış-, yakıt, yakut, yan, yanında, yanıt, yanlış, yanak, yanaş-, yansı-, yanıl- pass."""
import re

def tr_lower(s: str) -> str:
    return s.replace("I", "ı").replace("İ", "i").lower()

# yak- (to burn / to light): bare imperative + verb suffixes only. Never bare 'yaka', 'yakın', 'yakl…', 'yakış…', 'yakıt'.
YAK = re.compile(r"\byak(?:"
    r"|ar|arım|arsın|arız|arlar|arsa\w*|arken|ardı\w*|armış\w*"      # aorist  (not yakarış: \b)
    r"|ıyor\w*|tı\w*|tık\w*|tığ\w*|mak\w*|ma|madan|mayın|maz\w*|masın\w*|mış\w*"
    r"|acak\w*|acağ\w*|alım|ayım|sın|sınlar|an|anlar|arak|ınca"
    r"|ıl(?:dı|mış|an|acak|ır|sın)\w*|abil\w*|amaz\w*|ayalım)\b")
# yan- in the burn/light sense: verb forms only. Never 'yan', 'yana', 'yanı', 'yanında', 'yanıt', 'yanlış', 'yanak', 'yanaş', 'yansı…', 'yanıl…'.
YAN = re.compile(r"\byan(?:dı\w*|dığ\w*|ıyor\w*|an|anlar\w*|ar|arak|mak\w*|ma|madan|maz\w*|mış\w*"
    r"|acak\w*|acağ\w*|sın|ık\w*|ıp|abil\w*|ınca)\b")

def burn_verbs(text: str):
    t = tr_lower(text)
    return sorted({("yak", m.group(0)) for m in YAK.finditer(t)} | {("yan", m.group(0)) for m in YAN.finditer(t)})

if __name__ == "__main__":
    import json, sys
    if len(sys.argv) < 2:
        sys.stderr.write("usage: editorial.py MANIFEST.json\n")
        sys.exit(2)
    path = sys.argv[1]
    manifest = json.load(open(path, encoding="utf-8"))
    blob = tr_lower(json.dumps(manifest, ensure_ascii=False))
    errs = []
    banned = ["nikotin", "kanser", "akciğer", "sağlık", "tedavi", "yoksunluk", "bağımlı", "başarısız", "kaybettin", "sıfırla", "tilki adı"]
    for word in banned:
        if word in blob:
            errs.append(f"editorial: banned word '{word}'")
    cue = re.compile(r"\b(ateş\w*|alev\w*|şömine\w*|kamp ateşi|köz\w*|kor|korlar\w*|mum|mumlar\w*|mumu\w*|tütsü\w*|kül|külü\w*|küller\w*|duman\w*|is|isli|sigara\w*|çakmak\w*|kibrit\w*|buhar\w*)\b")
    for found in sorted(set(cue.findall(blob))):
        errs.append(f"editorial: fire/smoke cue word '{found}' in content")
    for root, word in burn_verbs(blob):
        why = "yak- evokes sigara yakmak" if root == "yak" else "yan- burn sense"
        errs.append(f"editorial: banned verb '{word}' ({why}); use parla- / kazan / açıl-")
    if errs:
        print("\n".join(errs))
        sys.exit(1)
    print(f"OK  {path}  editorial")
