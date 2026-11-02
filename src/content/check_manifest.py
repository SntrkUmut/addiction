"""Content CI: JSON Schema + rules the schema can't express. Usage: check_manifest.py manifest.json [--channel prod|beta] [--previous prev.json] [--spell-unknown]
rev 5.5: Turkish diacritic spelling (tr_spell.py) = WARNING on beta, ERROR on prod."""
import json, sys, argparse
from jsonschema import Draft202012Validator, FormatChecker
ap=argparse.ArgumentParser(); ap.add_argument("manifest"); ap.add_argument("--channel",default="beta"); ap.add_argument("--previous"); ap.add_argument("--spell-unknown",action="store_true")
a=ap.parse_args(); here=__file__.rsplit("/",1)[0]
schema=json.load(open(f"{here}/manifest.schema.json")); m=json.load(open(a.manifest)); errs=[]; warns=[]
for e in Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(m): errs.append(f"schema: {'/'.join(map(str,e.path))}: {e.message}")
if not errs:
    items={i["id"] for i in m["items"]}; seen=set()
    for kind,ids in [("item",[i["id"] for i in m["items"]]),("chapter",[c["id"] for c in m["chapters"]]),
                     ("piece",[p["id"] for c in m["chapters"] for p in c["pieces"]]),("goal",[g["id"] for g in m.get("goalPool",[])])]:
        d={x for x in ids if ids.count(x)>1}; d and errs.append(f"duplicate {kind} ids: {sorted(d)}")
    orders=[c["order"] for c in sorted(m["chapters"],key=lambda c:c["order"])]
    orders!=list(range(1,len(orders)+1)) and errs.append(f"chapter orders must be 1..n contiguous, got {orders}")
    m["upcoming"]["chapterOrder"]!=len(orders)+1 and errs.append("upcoming.chapterOrder must be last chapter + 1")
    opens=m["upcoming"].get("opensAt")
    if opens is not None:
        try:
            from datetime import datetime
            datetime.fromisoformat(str(opens).replace("Z", "+00:00"))
        except Exception:
            errs.append("upcoming/opensAt must be ISO-8601 date-time")
    refs=[("chapter "+c["id"],c["completionReward"]) for c in m["chapters"]]+[("milestone "+x["key"],x["reward"]) for x in m.get("milestones",[])]\
        +[("goal "+g["id"],g["reward"]) for g in m.get("goalPool",[])]+[("season "+s["id"],s["reward"]) for s in m.get("seasons",[])]
    for who,r in refs: r not in items and errs.append(f"{who} rewards unknown item {r}")
    rew=[r for _,r in refs]; d={r for r in rew if rew.count(r)>1}; d and errs.append(f"item granted by more than one source: {sorted(d)}")
    chids={c["id"] for c in m["chapters"]}
    for g in m.get("goalPool",[]): g.get("chapterId") and g["chapterId"] not in chids and errs.append(f"goal {g['id']} unknown chapterId")
    for x in m.get("milestones",[]): x["key"]!=f"day-{x['day']}" and errs.append(f"milestone key/day mismatch {x['key']}")
    for s in m.get("seasons",[]): s["startsAt"]>=s["endsAt"] and errs.append(f"season {s['id']} ends before it starts")
    banned=["nikotin","kanser","akciğer","sağlık","tedavi","yoksunluk","bağımlı","başarısız","kaybettin","sıfırla","tilki adı"]
    sys.path.insert(0, here); from editorial import tr_lower, burn_verbs
    blob=tr_lower(json.dumps(m,ensure_ascii=False))
    for b in banned: b in blob and errs.append(f"editorial: banned word '{b}'")
    # fire / smoke / smoking cues in any copy or icon (rev 5.1: no fire imagery anywhere)
    import re
    cue=re.compile(r"\b(ateş\w*|alev\w*|şömine\w*|kamp ateşi|köz\w*|kor|korlar\w*|mum|mumlar\w*|mumu\w*|tütsü\w*|kül|külü\w*|küller\w*|duman\w*|is|isli|sigara\w*|çakmak\w*|kibrit\w*|buhar\w*)\b")
    for f in sorted(set(cue.findall(blob))): errs.append(f"editorial: fire/smoke cue word '{f}' in content")
    # rev 5.2: the verb 'yak-' (sigara yakmak) and 'yan-' in its burn sense are banned; use parla- / kazan / açıl-
    for root,w in burn_verbs(blob):
        errs.append(f"editorial: banned verb '{w}' ({'yak- evokes sigara yakmak' if root=='yak' else 'yan- burn sense'}); use parla- / kazan / açıl-")
    icons=re.findall(r'"(?:icon|previewIcons)":\s*(?:"([a-z0-9-]+)"|\[([^\]]*)\])', blob)
    names={x for a,b in icons for x in ([a] if a else re.findall(r'"([a-z0-9-]+)"', b))}
    for f in sorted(names & {"fire","fire-simple","flame","campfire","candle","cigarette","cigarette-slash","coffee","fire-extinguisher","fire-truck"}):
        errs.append(f"editorial: fire/smoke/steam icon '{f}'")
    # rev 5.5: Turkish diacritic spelling (ı/i, ş/s, ğ/g, ç/c, ö/o, ü/u, â/a) — warning on beta, error on prod
    import tr_spell
    for path,t,sug,kind in tr_spell.check(m):
        msg=f"spelling: '{t}' at {path} looks like {'ASCII-fied' if kind=='ascii' else 'a diacritic swap of'} '{sug}' (fix it, or add the word to tr_words.txt allowlist)"
        (errs if a.channel=="prod" else warns).append(msg)
    if a.spell_unknown:
        u=tr_spell.unknown(m); u and print("info: words not in tr_words.txt (review, then rebuild): "+" ".join(u))
    if a.channel=="prod":
        pend=[o.get("id") or o.get("key") for o in m["chapters"]+m.get("milestones",[])+m.get("goalPool",[])+m.get("seasons",[]) if o["copyStatus"]=="pending"]
        pend and errs.append(f"prod channel: copy still PENDING APPROVAL: {pend}")
    if a.previous:
        p=json.load(open(a.previous))
        p["version"]>=m["version"] and errs.append("version must increase")
        old={x["id"] for x in p["items"]}|{c["id"] for c in p["chapters"]}|{q["id"] for c in p["chapters"] for q in c["pieces"]}
        new=items|chids|{q["id"] for c in m["chapters"] for q in c["pieces"]}
        gone=old-new; gone and errs.append(f"published ids removed (retire instead): {sorted(gone)}")
warns and not errs and print("\n".join("warning: "+w for w in warns))
print("\n".join(errs) if errs else f"OK  {a.manifest}  channel={a.channel}  v{m['version']}  chapters={len(m['chapters'])}  pieces={sum(len(c['pieces']) for c in m['chapters'])}  items={len(m['items'])}")
sys.exit(1 if errs else 0)
