LIGHT=dict(canvas='#F8F6F1',card='#FFFEFC',sunken='#F2F1EB',border='#EAE4DC',ink='#202522',sec='#666C66',ter='#6E726A',gold_text='#866018',
 primary='#C84F2E',pressed='#A5412B',shadow='#8E3623',acc_soft='#FDF0EC',hero='#FCEBE3',urge='#F7E9E2',tc300='#F0DDD2',acc_text='#A5412B',
 gold='#D9AC58',gold_deep='#B98A2E',gold_edge='#A9822F',gold_soft='#F7F0DC',teal='#5ED6CF',teal_deep='#2E7F7A',teal_soft='#E3F7F5',
 o950='#14171B',o900='#1B1F24',o800='#202B37',o700='#2C3440',o600='#3A4350',on_dark='#FFFEFC',on_dark_muted='#C9C3B8',sky_top='#FBE3D6')
DARK=dict(LIGHT,
 canvas='#14171B', card='#1E2228', sunken='#272C33', border='#353C46',
 ink='#F3EFE8', sec='#B5AFA5', ter='#8C8F87',
 primary='#C84F2E', pressed='#B04529', shadow='#6A2818',
 acc_soft='#3A2621', hero='#3A2824', urge='#2C2224', tc300='#5A4038', acc_text='#F2906F',
 gold='#D9AC58', gold_text='#D9AC58', gold_deep='#E7C27A', gold_edge='#8A6A26', gold_soft='#352D1E',
 teal='#5ED6CF', teal_deep='#6FDCD4', teal_soft='#18322F',
 sky_top='#171A26')
# dusk scene for day-scene screens in dark mode
DUSK=dict(top='#171A26', mid='#272230', low='#3A2A2E', hill='#4A3431', hill2='#5C3F37', glow='rgba(200,79,46,.20)')
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
PAIRS=[('ink','canvas',4.5,'body text'),('ink','card',4.5,'body text on card'),('ink','sunken',4.5,'text on sunken/btn2'),
 ('sec','canvas',4.5,'secondary text'),('sec','card',4.5,'secondary on card'),('sec','sunken',4.5,'secondary on sunken'),
 ('ter','canvas',4.5,'tertiary text (rev 5.1: AA)'),('ter','card',4.5,'tertiary on card'),('ter','sunken',4.5,'ter on sunken: NOT allowed, use sec'),
 ('acc_text','canvas',4.5,'accent text / eyebrow'),('acc_text','card',4.5,'accent on card / active tab'),('acc_text','hero',4.5,'active tab label on pill'),('acc_text','acc_soft',4.5,'icon on accent tile'),
 ('#FFFFFF','primary',4.5,'primary button label'),('primary','canvas',3.0,'primary button vs canvas (UI component)'),
 ('gold','canvas',3.0,'gold progress/ring vs canvas'),('gold','card',3.0,'gold bar on card'),('gold_deep','gold_soft',3.0,'gold icon on gold tile'),
 ('gold_text','canvas',4.5,'gold/ochre text'),('gold_text','card',4.5,'gold text on card'),('gold_text','gold_soft',4.5,'gold text on gold tile'),('gold_text','hero',4.5,'gold text on hero'),('gold_text','sunken',4.5,'gold text on sunken'),('gold','o800',4.5,'gold eyebrow / +1 pill on night'),
 ('teal_deep','teal_soft',3.0,'teal icon on teal tile'),('teal_deep','card',4.5,'teal text on card'),
 ('border','canvas',1.3,'border visible (decorative)'),('ink','hero',4.5,'text on hero/urge surface')]
def table(T):
    out=[]
    for a,b,need,what in PAIRS:
        ca=T.get(a,a); cb=T.get(b,b); r=cr(ca,cb); out.append((a,b,ca,cb,r,need,what,r>=need))
    return out
if __name__=='__main__':
    for name,T in (('LIGHT',LIGHT),('DARK',DARK)):
        print('==',name)
        for a,b,ca,cb,r,need,what,ok in table(T): print(f'{"OK " if ok else "LOW"} {a:10} on {b:9} {ca} / {cb}  {r:5.2f}:1  (≥{need})  {what}')
