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
sys.path.insert(0, here); from editorial import burn_verbs
POS="yak yaktı yaktın yakar yakıyor yakıyoruz yakmak yakma yakmadan yakalım yakacak yakan yakılır yakabilir YAKTI Yak yandı yanıyor yanan yanar yanmak yanmış yanık yanıp yanacak yanabilir YANDI".split()
NEG="yakın yakında yakınında yaklaşık yaklaşıyor yaklaş yaka yakası yakala yakalamak yakaladın yakışıyor yakıt yakut yakarış YAKINDA yan yana yanı yanında yanına yanıt yanıtla yanlış yanak yanaş yanaşmak yansıyor yansıma yanılmak yanyana parladı kazan açıldı".split()
def words_ok():
    miss=[w for w in POS if not burn_verbs(w)]; false=[w for w in NEG if burn_verbs(w)]
    ok=not miss and not false
    print(("PASS " if ok else "FAIL ")+f"verb matcher: {len(POS)} burn forms caught, {len(NEG)} look-alikes allowed"+("" if ok else f"\n  missed {miss}, false hits {false}")); return ok
PENDING54=["ch-teras","ch-kis-odasi","ch-kiyi","ch-tepe","g-teras-checkin-3","g-teras-reason-1","g-kis-checkin-3","g-kis-coping-2",
 "g-kiyi-checkin-3","g-kiyi-coping-2","g-tepe-checkin-3","g-tepe-reason-1","s-kis-2026"]
def approved_only(m):
    """Drop pending chapters/goals/seasons; upcoming becomes the first dropped chapter (as a prod drop would look)."""
    m=copy.deepcopy(m); keep=[c for c in m["chapters"] if c["copyStatus"]=="approved"]; nxt=len(keep)+1
    if len(keep)==len(m["chapters"]): return m   # rev 5.5: nothing pending
    nc=next(c for c in base["chapters"] if c["order"]==nxt); m["chapters"]=keep
    m["upcoming"]=dict(chapterOrder=nxt,eyebrow=nc["eyebrow"],title=nc["title"],teaserLine=nc["teaser"]["line"],opensAt="2026-11-16T09:00:00+03:00")
    m["goalPool"]=[g for g in m["goalPool"] if g["copyStatus"]=="approved"]; m["seasons"]=[x for x in m["seasons"] if x["copyStatus"]=="approved"]
    return m
def spell(name, mutate, token, sugg):
    """rev 5.5: a diacritic typo is a WARNING on beta (exit 0) and an ERROR on prod (exit 1)."""
    m=copy.deepcopy(base); mutate(m); cb,ob=run(m); cp,op=run(m,"--channel","prod")
    ok = cb==0 and f"warning: spelling: '{token}'" in ob and f"'{sugg}'" in ob and cp==1 and f"spelling: '{token}'" in op
    print(("PASS " if ok else "FAIL ")+f"spelling {name}: '{token}' → '{sugg}' (beta warns, prod fails)"+("" if ok else f"\n  beta {cb}: {ob}\n  prod {cp}: {op}")); return ok
def spell_clean(name, mutate):
    m=copy.deepcopy(base); mutate(m); cb,ob=run(m); cp,op=run(m,"--channel","prod")
    ok = cb==0 and cp==0 and "spelling" not in ob+op
    print(("PASS " if ok else "FAIL ")+f"spelling no false positive: {name}"+("" if ok else f"\n  {ob}{op}")); return ok
sea=lambda m: m["seasons"][1]
res=[run(base)[0]==0 and print("PASS example OK on beta") is None,
 # rev 5.5: ch5–8, their goals and Kış şenliği are APPROVED -> the full example passes prod, and still against v10
 run(base,"--channel","prod")[0]==0 and print("PASS example OK on prod (rev 5.5: all copy approved)") is None,
 (lambda m: (m["chapters"][2].__setitem__("copyStatus","pending"), (lambda c,o: c==1 and "PENDING APPROVAL" in o and "ch-dere" in o and print("PASS prod rejects pending (ch-dere on the approved-only subset)") is None)(*run(m,"--channel","prod")))[1])(approved_only(base)),
 spell("ş→s (Kis şenliği)", lambda m: sea(m).__setitem__("title","Kis şenliği"), "kis", "kış"),
 spell("ı→i, ASCII-fied (Yildiz haritasi)", lambda m: ch(m,4)["pieces"][1].__setitem__("name","Yildiz haritasi"), "yildiz", "yıldız"),
 spell("ü/ç→u/c, ASCII-fied (Kucuk yelkenli)", lambda m: ch(m,6)["pieces"][1].__setitem__("name","Kucuk yelkenli"), "kucuk", "küçük"),
 spell("ğ→g (Dag yolu)", lambda m: ch(m,7)["pieces"][0].__setitem__("name","Dag yolu"), "dag", "dağ"),
 spell("ö→o (Golge ağacı)", lambda m: ch(m,1)["pieces"][5].__setitem__("name","Golge ağacı"), "golge", "gölge"),
 spell("i→ı swap (ışik)", lambda m: m["goalPool"][0].__setitem__("title","3 gün check-in yap, ışik kazan"), "ışik", "ışık"),
 spell("uppercase eyebrow, Turkish casing (BOLUM 6)", lambda m: ch(m,5)["intro"].__setitem__("eyebrow","BOLUM 6 · KIŞ ODASI"), "bolum", "bölüm"),
 spell("circumflex dropped (rüzgar)", lambda m: ch(m,6)["teaser"].__setitem__("line","Rüzgarda tuzlu bir deniz kokusu var."), "rüzgarda", "rüzgârda"),
 spell_clean("allowlist sen/şen (both real words)", lambda m: ch(m,4)["pieces"][0].__setitem__("line","Bu ışık sen dinlenirken şen bir köşe yapıyor.")),
 spell_clean("uppercase I is dotless ı (KIŞ ODASI, YILDIZ TERASI)", lambda m: None),
 spell_clean("ASCII ids/icons are not copy (ch-kis-odasi, s-kis-2026)", lambda m: sea(m).__setitem__("icon","snowflake")),
 spell_clean("unknown word with no diacritic twin is ignored (Zeplin)", lambda m: ch(m,7)["pieces"][3].__setitem__("line","Tepenin üstünden bir zeplin geçiyor.")),
 case("5 pieces", lambda m: ch(m,2)["pieces"].pop(), "schema"),
 case("bad date", setp(["upcoming","opensAt"],"16.11.2026"), "upcoming/opensAt"),
 case("unknown reward", setp(["chapters",2,"completionReward"],"it-yok"), "unknown item"),
 case("duplicate piece", lambda m: ch(m,3)["pieces"].__setitem__(1, dict(ch(m,3)["pieces"][1], id=ch(m,3)["pieces"][0]["id"])), "duplicate piece"),
 case("missing intro", lambda m: ch(m,2).pop("intro"), "schema"),
 case("name too long", lambda m: ch(m,2)["pieces"][0].__setitem__("name","Çok uzun bir parça adı burada"), "schema"),
 case("smoking cue", lambda m: ch(m,3)["pieces"][2].__setitem__("name","Kamp ateşi"), "fire/smoke cue"),
 case("fireplace cue", lambda m: ch(m,3)["pieces"][2].__setitem__("name","Şömine"), "fire/smoke cue"),
 case("candle cue", lambda m: ch(m,3)["pieces"][2].__setitem__("line","Pencerede bir mum."), "fire/smoke cue"),
 case("yak verb (Bugünün ışığını yak)", lambda m: ch(m,2)["intro"].__setitem__("body","Bugünün ışığını yak, yol açılsın."), "banned verb 'yak'"),
 case("yak verb, Turkish uppercase (YAKTIN)", lambda m: ch(m,3)["pieces"][2].__setitem__("name","IŞIĞI YAKTIN"), "banned verb 'yaktın'"),
 case("yan- burn sense (teaser yanıyor)", setp(["upcoming","teaserLine"],"Yukarıda bir terasın ışıkları yanıyor."), "banned verb 'yanıyor'"),
 case("yan- burn sense (yandı)", lambda m: ch(m,3)["pieces"][2].__setitem__("line","Fener bütün gece yandı."), "banned verb 'yandı'"),
 run(dict(copy.deepcopy(base), upcoming=dict(base["upcoming"], teaserLine="Yakında: kıyıya yakın, yanında yaklaşık bir yol."))) [0]==0 and print("PASS look-alikes allowed in a manifest (yakında, yakın, yanında, yaklaşık)") is None,
 words_ok(),
 case("fire icon", lambda m: ch(m,3)["pieces"][2].__setitem__("icon","campfire"), "icon 'campfire'"),
 case("steam icon", lambda m: ch(m,3)["pieces"][2].__setitem__("icon","coffee"), "icon 'coffee'"),
 case("typo field", lambda m: ch(m,2).__setitem__("titel","x"), "schema"),
 case("order gap", setp(["chapters",3,"order"],5), "contiguous"),
 case("removed id", lambda m: m.__setitem__("version", m["version"]+1) or ch(m,3)["pieces"].__setitem__(5, dict(ch(m,3)["pieces"][5], id="pc-yeni")), "removed", prev=base),
]
print(f"{sum(map(bool,res))}/{len(res)} pass"); sys.exit(0 if all(res) else 1)
