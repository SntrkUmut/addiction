"""Negative fixtures for check_manifest.py. Run: python3 content/test_check_manifest.py"""
import json, copy, subprocess, tempfile, os, sys
here=os.path.dirname(os.path.abspath(__file__)); base=json.load(open(f"{here}/manifest.example.json"))
def run(m, *extra, prev=None):
    with tempfile.TemporaryDirectory() as d:
        p=f"{d}/m.json"; json.dump(m,open(p,"w"),ensure_ascii=False); args=[sys.executable,f"{here}/check_manifest.py",p,*extra]
        if prev is not None: json.dump(prev,open(f"{d}/p.json","w"),ensure_ascii=False); args+=["--previous",f"{d}/p.json"]
        r=subprocess.run(args,capture_output=True,text=True); return r.returncode, r.stdout
def case(name, mutate, expect, *extra, prev=None):
    m=copy.deepcopy(base); mutate(m); code,out=run(m,*extra,prev=prev)
    ok = code==1 and expect in out; print(("PASS " if ok else "FAIL ")+name+("" if ok else f"\n  got: {out}")); return ok
def setp(path,val):
    def f(m):
        o=m
        for k in path[:-1]: o=o[k]
        o[path[-1]]=val
    return f
ch=lambda m,i: m["chapters"][i]
res=[run(base)[0]==0 and print("PASS example OK on beta") is None,
 case("prod rejects pending", lambda m:None, "PENDING APPROVAL", "--channel","prod"),
 case("5 pieces", lambda m: ch(m,2)["pieces"].pop(), "schema"),
 case("bad date", setp(["upcoming","opensAt"],"16.11.2026"), "upcoming/opensAt"),
 case("unknown reward", setp(["chapters",2,"completionReward"],"it-yok"), "unknown item"),
 case("duplicate piece", lambda m: ch(m,3)["pieces"].__setitem__(1, dict(ch(m,3)["pieces"][1], id=ch(m,3)["pieces"][0]["id"])), "duplicate piece"),
 case("missing intro", lambda m: ch(m,2).pop("intro"), "schema"),
 case("name too long", lambda m: ch(m,2)["pieces"][0].__setitem__("name","Çok uzun bir parça adı burada"), "schema"),
 case("smoking cue", lambda m: ch(m,3)["pieces"][2].__setitem__("name","Kamp ateşi"), "smoking-cue"),
 case("typo field", lambda m: ch(m,2).__setitem__("titel","x"), "schema"),
 case("order gap", setp(["chapters",3,"order"],5), "contiguous"),
 case("removed id", lambda m: m.__setitem__("version", m["version"]+1) or ch(m,3)["pieces"].__setitem__(5, dict(ch(m,3)["pieces"][5], id="pc-yeni")), "removed", prev=base),
]
print(f"{sum(map(bool,res))}/{len(res)} pass"); sys.exit(0 if all(res) else 1)
