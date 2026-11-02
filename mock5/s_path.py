from lib import *
from fog import fog, teaser, iconbtn
def node(cx,y,icon,state,size=68,frac=.5):
    x=cx-size//2
    if state=='done':
        return f'<div class="abs" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;border-radius:50%;background:{T["primary"]};box-shadow:0 6px 0 {T["shadow"]};display:flex;align-items:center;justify-content:center">{ic(icon,"#FFFFFF",30)}</div>'
    if state=='next':
        return f'''<div class="abs" style="left:{x-10}px;top:{y-10}px">{ring(size+20,5,frac,T['gold'],T['border'])}</div>
        <div class="abs" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;border-radius:50%;background:{T["gold_soft"]};border:3px solid {T["gold"]};box-shadow:0 6px 0 {T["gold_edge"]};display:flex;align-items:center;justify-content:center">{ic(icon,T["gold_deep"],30)}</div>'''
    return f'<div class="abs" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;border-radius:50%;background:{T["border"]};box-shadow:0 6px 0 #D6CEC2;display:flex;align-items:center;justify-content:center">{ic("lock-simple","#8A8F88",26)}</div>'
def flag(cx,y,reached):
    x=cx-22
    if reached:
        return f'<div class="abs" style="left:{x}px;top:{y}px;width:44px;height:44px;border-radius:50%;background:{T["gold_soft"]};border:2px solid {T["gold"]};box-shadow:0 4px 0 {T["gold_edge"]};display:flex;align-items:center;justify-content:center">{ic("flag",T["gold_deep"],22,"fill")}</div>'
    return f'<div class="abs" style="left:{x}px;top:{y}px;width:44px;height:44px;border-radius:50%;background:{T["card"]};border:2px dashed {T["tc300"]};display:flex;align-items:center;justify-content:center">{ic("flag-banner","#8A8F88",22)}</div>'
def lab(x,y,t,c,right_edge=None,bold=False):
    w='font-weight:800;' if bold else ''
    if right_edge: return f'<div class="abs caption" style="left:{right_edge-160}px;width:160px;text-align:right;top:{y}px;color:{c};{w}">{t}</div>'
    return f'<div class="abs caption" style="left:{x}px;top:{y}px;color:{c};{w}">{t}</div>'
def mlab(x,y,day,sub,reached,right_edge=None):
    c = T['ink'] if reached else T['sec']
    html=f'<div class="col" style="{"align-items:flex-end;" if right_edge else ""}"><span class="caption" style="color:{c};font-weight:800">Gün {day}</span><span class="caption" style="color:{T["sec"]}">{sub}</span></div>'
    if right_edge: return f'<div class="abs" style="left:{right_edge-140}px;width:140px;top:{y}px;display:flex;justify-content:flex-end">{html}</div>'
    return f'<div class="abs" style="left:{x}px;top:{y}px">{html}</div>'
def pathline(pts):
    d=' '.join(f'{"M" if i==0 else "L"}{p[0]} {p[1]}' for i,p in enumerate(pts))
    return f'<svg class="abs" style="left:0;top:0" width="390" height="844"><path d="{d}" stroke="{T["tc300"]}" stroke-width="6" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/></svg>'
def tooltip(x,y,t):
    return f'<div class="abs row" style="left:{x}px;top:{y}px;gap:6px;background:{T["ink"]};border-radius:12px;padding:5px 10px 5px 5px">{light_token(20,False)}<span class="caption" style="color:#fff">{t}</span></div>'
def header(lights, bg_fade=True):
    b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + scene(250, horizon_y=176, sparkles=(70,10,260,.45), fade=True) + status()
    b += f'<div class="abs row" style="left:20px;right:20px;top:54px;justify-content:space-between"><div class="title-lg">Sığınağın</div>{light_chip(lights)}</div>'
    b += f'<div class="abs caption" style="left:20px;top:92px;color:{T["ink"]}">Her 2 ışık yolda yeni bir durak açar.</div>'
    return b
def unit(top, eyebrow, title, count, frac):
    return f'''<div class="abs card col" style="left:20px;right:20px;top:{top}px;padding:14px 16px;gap:8px;box-shadow:0 6px 18px rgba(92,56,36,.08)">
  <div class="row" style="justify-content:space-between"><div class="col"><div class="eyebrow" style="color:{T['acc_text']}">{eyebrow}</div><div class="title-sm" style="font-weight:800">{title}</div></div><div class="caption" style="color:{T['sec']}">{count}</div></div>
  <div style="height:10px;border-radius:999px;background:{T['sunken']}"><div style="width:{frac*100:.0f}%;height:10px;border-radius:999px;background:{T['gold']}"></div></div></div>'''

# ---------- rev4-siginak (Bölüm 1 with milestone stops), day 12, 7 lights
start('rev4-siginak-taslar')
b = header(7) + unit(120,'Bölüm 1 · Temel','Sığınağın ilk odası','3 / 6 parça',.5)
P=[(200,260),(130,328),(110,396),(170,466),(270,528),(170,634),(290,712),(200,774)]
b += pathline(P)
b += node(200,226,'house-simple','done') + lab(244,250,'Sığınak temeli',T['sec'])
b += flag(130,306,True) + mlab(0,312,1,'22 Ekim',True,right_edge=100)
b += node(110,362,'lamp','done') + lab(154,386,'Sıcak ışıklar',T['sec'])
b += flag(170,444,True) + mlab(202,448,7,'28 Ekim',True)
b += node(270,494,'armchair','done') + lab(0,518,'Dinlenme köşesi',T['sec'],right_edge=228)
b += node(170,600,'grid-four','next',frac=.5) + tooltip(70,556,'Pencere · 1 ışık kaldı')
b += flag(290,690,False) + mlab(0,694,14,'2 gün sonra',False,right_edge=260)
b += node(200,740,'plant','lock')
b += img('fox_happy',8,612,104)
b += tabbar('Sığınak')
page('rev4-siginak-taslar', b)

# ---------- Bölüm 2 transition 1: Bölüm 1 tamamlandı (night)
start('rev4-bolum2-1-tamam')
b = f'<div class="abs" style="inset:0;background:{T["o900"]}"></div>' + scene(844, night=True, horizon_y=700) + status(True)
b += f'<div class="abs row" style="left:20px;right:20px;top:52px;justify-content:space-between">{closebtn()}{light_chip(12,True)}</div>'
st=330; sx=30; sy=100
b += f'<div class="abs" style="left:{sx}px;top:{sy}px;width:{st}px;height:{st}px;border-radius:50%;background:radial-gradient(circle,rgba(217,172,88,.38),rgba(217,172,88,0) 68%)"></div>'
b += img('fx_sparkles',sx,sy,st,1) + img('fox_cheer',90,140,210) + img('fx_sparkles',sx,sy,st,.35)
icons=['house-simple','lamp','armchair','grid-four','plant','books']
row=''.join(f'<div style="width:44px;height:44px;border-radius:50%;background:{T["primary"]};box-shadow:0 4px 0 {T["shadow"]};display:flex;align-items:center;justify-content:center">{ic(i,"#FFFFFF",22)}</div>' for i in icons)
b += f'<div class="abs row" style="left:0;right:0;top:420px;justify-content:center;gap:10px">{row}</div>'
b += f'''<div class="abs col" style="left:24px;right:24px;top:494px;align-items:center;gap:6px;text-align:center">
  <div class="eyebrow" style="color:{T['gold']}">Bölüm 1 tamamlandı</div>
  <div class="title-lg" style="color:{T['on_dark']}">Sığınağın ilk odası hazır.</div>
  <div class="body-lg" style="color:{T['on_dark_muted']}">On iki ışıkla altı parçayı yerine koydun. Hepsi burada kalıyor; şimdi yol bahçeye uzanıyor.</div></div>'''
b += f'<div class="abs col" style="left:24px;right:24px;bottom:34px;gap:10px"><div class="btn">Bölüm 2’ye bak {ic("arrow-right","#fff",20)}</div><div class="btn-dark">Ana ekrana dön</div></div>'
page('rev4-bolum2-1-tamam', b)

# ---------- Bölüm 2 transition 2: Bahçe handoff (day)
start('rev4-bolum2-2-bahce')
b = scene(330, horizon_y=240, sparkles=(60,40,270,.5)) + status()
b += f'<div class="abs row" style="left:20px;right:20px;top:54px;justify-content:space-between"><div style="width:44px"></div>{light_chip(12)}</div>'
b += img('fox_wave',110,72,170)
b += f'<div class="abs" style="left:0;right:0;top:296px;bottom:0;background:{T["canvas"]};border-radius:32px 32px 0 0"></div>'
P2=[('door-open','Bahçe kapısı','next'),('footprints','Taş yol','lock'),('flower-tulip','Çiçek tarhı','lock'),('bird','Kuş evi','lock'),('lightbulb','Bahçe feneri','lock'),('tree','Gölge ağacı','lock')]
def tile(i,t,s,n):
    if s=='next':
        art=f'<div style="width:52px;height:52px;border-radius:50%;background:{T["gold_soft"]};border:2.5px solid {T["gold"]};display:flex;align-items:center;justify-content:center">{ic(i,T["gold_deep"],26)}</div>'
        sub=f'<span class="caption" style="color:{T["acc_text"]};font-weight:800">2 ışık kaldı</span>'
    else:
        art=f'<div style="width:52px;height:52px;border-radius:50%;background:{T["sunken"]};display:flex;align-items:center;justify-content:center">{ic(i,"#8A8F88",24)}</div>'
        sub=''
    return f'<div class="card col" style="width:108px;height:124px;align-items:center;justify-content:center;gap:6px;border-radius:20px;{"border:1.5px solid "+T["gold"]+";" if s=="next" else ""}">{art}<span class="caption" style="font-weight:800">{t}</span>{sub}</div>'
grid=''.join(tile(i,t,s,(k+1)*2) for k,(i,t,s) in enumerate(P2))
b += f'''<div class="abs col" style="left:20px;right:20px;top:318px;gap:8px">
  <div class="eyebrow" style="color:{T['acc_text']}">Bölüm 2 · Bahçe</div>
  <div class="title-lg">Sırada sığınağın bahçesi var.</div>
  <div class="body-md" style="color:{T['sec']}">Aynı yol devam ediyor: her 2 ışık bahçeye yeni bir parça ekler. İlk odan olduğu gibi yerinde kalır.</div>
  <div style="display:flex;flex-wrap:wrap;gap:9px;margin-top:6px">{grid}</div></div>'''
b += f'<div class="abs" style="left:20px;right:20px;bottom:34px"><div class="btn">Yola devam et</div></div>'
page('rev4-bolum2-2-bahce', b)

# ---------- Sığınak in Bölüm 2: day 26, 15 lights
start('rev4-siginak-bolum2')
b = header(15)
mini=''.join(f'<div style="width:22px;height:22px;border-radius:50%;background:{T["primary"]};display:flex;align-items:center;justify-content:center">{ic(i,"#fff",12)}</div>' for i in icons)
b += f'''<div class="abs row" style="left:20px;right:20px;top:118px;height:44px;padding:0 12px 0 14px;gap:8px;border-radius:16px;background:rgba(255,254,252,.85);border:1px solid {T['border']}">
  {ic('seal-check',T['acc_text'],20,'fill')}<span class="sm-strong" style="font-weight:800;flex:1">Bölüm 1 · Temel</span><div class="row" style="gap:3px">{mini}</div>{ic('caret-down',T['sec'],16)}</div>'''
b += unit(172,'Bölüm 2 · Bahçe','Sığınağın bahçesi','1 / 6 parça',1/6)
P=[(200,296),(120,384),(260,452),(180,560),(230,640)]
b += pathline(P)
b += node(200,262,'door-open','done') + lab(244,286,'Bahçe kapısı',T['sec'])
b += node(120,350,'footprints','next',frac=.5) + tooltip(174,374,'Taş yol · 1 ışık kaldı')
b += flag(260,430,False) + mlab(0,436,30,'4 gün sonra',False,right_edge=230)
b += node(180,526,'flower-tulip','lock') + lab(224,550,'Çiçek tarhı',T['ter'])
b += img('fox_happy',6,440,104)
b += fog(586,180) + teaser(616,'Bölüm 3 · Dere kenarı','Sisin ardında yeni bir yer var','24. ışıkta açılır · 9 ışık kaldı','bridge')
b += tabbar('Sığınak')
page('rev4-siginak-bolum2', b)
json.dump(LAYERS, open('layers_path.json','w'))
