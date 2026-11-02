"""Content CI: JSON Schema + rules the schema can't express. Usage: check_manifest.py manifest.json [--channel prod|beta] [--previous prev.json]"""
import json, sys, argparse
from jsonschema import Draft202012Validator, FormatChecker
ap=argparse.ArgumentParser(); ap.add_argument("manifest"); ap.add_argument("--channel",default="beta"); ap.add_argument("--previous")
a=ap.parse_args(); here=__file__.rsplit("/",1)[0]
schema=json.load(open(f"{here}/manifest.schema.json")); m=json.load(open(a.manifest)); errs=[]
for e in Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(m): errs.append(f"schema: {'/'.join(map(str,e.path))}: {e.message}")
if not errs:
    items={i["id"] for i in m["items"]}; seen=set()
    for kind,ids in [("item",[i["id"] for i in m["items"]]),("chapter",[c["id"] for c in m["chapters"]]),
                     ("piece",[p["id"] for c in m["chapters"] for p in c["pieces"]]),("goal",[g["id"] for g in m.get("goalPool",[])])]:
        d={x for x in ids if ids.count(x)>1}; d and errs.append(f"duplicate {kind} ids: {sorted(d)}")
    orders=[c["order"] for c in sorted(m["chapters"],key=lambda c:c["order"])]
    orders!=list(range(1,len(orders)+1)) and errs.append(f"chapter orders must be 1..n contiguous, got {orders}")
    m["upcoming"]["chapterOrder"]!=len(orders)+1 and errs.append("upcoming.chapterOrder must be last chapter + 1")
    refs=[("chapter "+c["id"],c["completionReward"]) for c in m["chapters"]]+[("milestone "+x["key"],x["reward"]) for x in m.get("milestones",[])]\
        +[("goal "+g["id"],g["reward"]) for g in m.get("goalPool",[])]+[("season "+s["id"],s["reward"]) for s in m.get("seasons",[])]
    for who,r in refs: r not in items and errs.append(f"{who} rewards unknown item {r}")
    rew=[r for _,r in refs]; d={r for r in rew if rew.count(r)>1}; d and errs.append(f"item granted by more than one source: {sorted(d)}")
    chids={c["id"] for c in m["chapters"]}
    for g in m.get("goalPool",[]): g.get("chapterId") and g["chapterId"] not in chids and errs.append(f"goal {g['id']} unknown chapterId")
    for x in m.get("milestones",[]): x["key"]!=f"day-{x['day']}" and errs.append(f"milestone key/day mismatch {x['key']}")
    for s in m.get("seasons",[]): s["startsAt"]>=s["endsAt"] and errs.append(f"season {s['id']} ends before it starts")
    banned=["nikotin","kanser","akciğer","sağlık","tedavi","yoksunluk","bağımlı","başarısız","kaybettin","sıfırla","tilki adı"]
    blob=json.dumps(m,ensure_ascii=False).lower()
    for b in banned: b in blob and errs.append(f"editorial: banned word '{b}'")
    for f in ("ateş","sigara","duman","çakmak","kül"):  # smoking cues in decorative copy
        f in blob and errs.append(f"editorial: smoking-cue word '{f}' in content")
    if a.channel=="prod":
        pend=[o.get("id") or o.get("key") for o in m["chapters"]+m.get("milestones",[])+m.get("goalPool",[])+m.get("seasons",[]) if o["copyStatus"]=="pending"]
        pend and errs.append(f"prod channel: copy still PENDING APPROVAL: {pend}")
    if a.previous:
        p=json.load(open(a.previous))
        p["version"]>=m["version"] and errs.append("version must increase")
        old={x["id"] for x in p["items"]}|{c["id"] for c in p["chapters"]}|{q["id"] for c in p["chapters"] for q in c["pieces"]}
        new=items|chids|{q["id"] for c in m["chapters"] for q in c["pieces"]}
        gone=old-new; gone and errs.append(f"published ids removed (retire instead): {sorted(gone)}")
print("\n".join(errs) if errs else f"OK  {a.manifest}  channel={a.channel}  v{m['version']}  chapters={len(m['chapters'])}  pieces={sum(len(c['pieces']) for c in m['chapters'])}  items={len(m['items'])}")
sys.exit(1 if errs else 0)
