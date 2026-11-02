from lib import *
def bg(): return f'<div class="abs" style="inset:0;background:{T["o900"]}"></div>'
TOOLS=[('wind','Yavaş nefes','Ritmi yumuşat, omuzlarını bırak.',3,'teal'),
       ('person-simple-walk','Kısa bir yürüyüş','Bulunduğun yeri değiştir ve biraz hareket et.',5,'acc'),
       ('drop','Su iç','Bir bardak su alıp yavaşça iç.',2,'teal'),
       ('heart','Nedenlerimi hatırla','Bırakmaya karar verdiğin nedeni yeniden oku.',1,'acc')]
# ---------- İstek
start('rev3-istek')
b = bg()+scene(330, night=True, horizon_y=250, sparkles=(40,40,310,.35)) + status(True)
b += f'<div class="abs row" style="left:20px;right:20px;top:52px;justify-content:space-between">{closebtn()}{light_chip(7,True)}</div>'
b += img('fx_shield',85,60,220,.95)+img('fx_crystals',70,120,250,.8)+img('fox_craving',125,100,140)+img('fx_shield',85,60,220,.35)
def tool(i,t,d,m,c):
    bgc = T['teal_soft'] if c=='teal' else T['hero']; col = T['teal_deep'] if c=='teal' else T['acc_text']
    return f'''<div class="card row" style="height:68px;padding:0 14px 0 12px;gap:12px"><div style="width:44px;height:44px;border-radius:14px;background:{bgc};display:flex;align-items:center;justify-content:center">{ic(i,col,24)}</div>
      <div class="col" style="flex:1;min-width:0"><div class="title-sm">{t}</div><div class="caption" style="color:{T['sec']};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{d}</div></div>
      <div class="col" style="align-items:flex-end;gap:2px"><span class="caption" style="color:{T['sec']}">{m} dk</span><span class="row caption" style="gap:3px;color:{T['sec']};font-weight:800">+1 {light_token(16,False)}</span></div></div>'''
b += f'''<div class="abs col" style="left:0;right:0;top:296px;bottom:0;background:{T['canvas']};border-radius:32px 32px 0 0;padding:22px 20px 0;gap:8px">
  <div class="title-lg">Şu an bir sonraki küçük adımı seç.</div>
  <div class="body-md" style="color:{T['sec']};margin-bottom:6px">Bu anı hemen çözmek zorunda değilsin. Sana uygun bir araç seçebilir ya da nedenlerini hatırlayabilirsin.</div>
  {''.join(tool(*x) for x in TOOLS)}
  <div class="textbtn" style="color:{T['sec']}">Şimdi değil</div></div>'''
page('rev3-istek', b)
# ---------- Nefes
def nefes(name, cue, scale, t):
    start(name)
    b = bg()+scene(844, night=True, horizon_y=710, sparkles=None) + status(True)
    b += f'<div class="abs row" style="left:20px;right:20px;top:52px;justify-content:space-between">{closebtn()}<div class="eyebrow" style="color:{T["on_dark_muted"]}">Yavaş nefes</div><div style="width:44px"></div></div>'
    b += f'<div class="abs title-lg" style="left:0;right:0;top:108px;text-align:center;color:{T["on_dark"]}">Sadece bu ana odaklan.</div>'
    s=300; x=(390-s)/2; y=160
    b += f'<div class="abs" style="left:{x}px;top:{y}px">{ring(s,6,0.07 if t=="02:48" else 0.09,T["teal"],T["o700"])}</div>'
    rs=int(272*scale); rx=(390-rs)/2; ry=y+(s-rs)/2
    b += img('fx_breath_ring',rx,ry,rs,1 if scale==1 else .8)
    b += img('fx_bubbles',rx,ry,rs,.55 if scale==1 else .35)
    b += img('fox_calm',125,y+70,140)
    b += f'<div class="abs title-md" style="left:0;right:0;top:{y+s+22}px;text-align:center;color:{T["teal"]}">{cue}</div>'
    b += f'<div class="abs col" style="left:0;right:0;top:{y+s+60}px;align-items:center"><div class="timer" style="color:{T["on_dark"]}">{t}</div><div class="caption" style="color:{T["on_dark_muted"]}">kendine ayırdığın süre</div></div>'
    b += f'<div class="abs body-md" style="left:40px;right:40px;top:{y+s+148}px;text-align:center;color:{T["on_dark_muted"]}">Rahat ettiğin bir ritimde nefes al. Saymak zorunda değilsin; istediğin an durabilirsin.</div>'
    b += f'<div class="abs col" style="left:20px;right:20px;bottom:34px;gap:10px"><div class="btn">Bu adımı tamamladım</div><div class="btn-dark">Başka bir araç seç</div></div>'
    page(name,b)
nefes('rev3-nefes-al','Nefes al',1.0,'02:48')
nefes('rev3-nefes-ver','Nefes ver',0.85,'02:44')
# ---------- 07
def today_card(lights, frac_lbl='2/2'):
    return f'''<div class="row" style="gap:10px;padding:8px 14px 8px 8px;border-radius:999px;background:rgba(255,255,255,.10)">{ring(40,5,1.0,T['gold'],T['o600'],f'<span class="caption" style="color:{T["on_dark"]};font-weight:800">{frac_lbl}</span>')}
      <div class="col"><span class="caption" style="color:{T['on_dark_muted']}">Bugünün ışıkları</span><span class="sm-strong" style="color:{T['on_dark']};font-weight:800">{lights} ışık</span></div></div>'''
start('rev3-07a-isik')
b = bg()+scene(844, night=True, horizon_y=660, sparkles=(10,120,370,.7)) + status(True)
b += f'<div class="abs row" style="left:0;right:0;top:56px;justify-content:center">{today_card(8)}</div>'
b += f'<div class="abs" style="left:95px;top:240px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(217,172,88,.38),rgba(217,172,88,0) 70%)"></div>'
b += img('fox_cheer',80,220,230)
# light float trail from fox to today ring
b += f'''<svg class="abs" style="left:0;top:0" width="390" height="844"><path d="M200 300 C 300 250, 290 160, 156 82" stroke="{T['gold']}" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round" fill="none" opacity=".9"/></svg>'''
b += f'<div class="abs" style="left:236px;top:150px;filter:drop-shadow(0 0 14px rgba(217,172,88,.8))">{light_token(44)}</div>'
b += f'<div class="abs caption" style="left:290px;top:160px;padding:4px 10px;border-radius:999px;background:{T["o800"]};border:1px solid {T["gold_edge"]};color:{T["gold"]};font-weight:800">+1 ışık</div>'
b += f'<div class="abs title-lg" style="left:24px;right:24px;top:500px;text-align:center;color:{T["on_dark"]}">Bu an için kendine alan açtın.</div>'
b += f'<div class="abs body-md" style="left:40px;right:40px;top:574px;text-align:center;color:{T["on_dark_muted"]}">Işığın bugünün halkasına eklendi.</div>'
page('rev3-07a-isik', b)

start('rev3-07b-istek-nasil')
b = bg()+scene(380, night=True, horizon_y=300, sparkles=(40,90,310,.55)) + status(True)
b += f'<div class="abs row" style="left:0;right:0;top:56px;justify-content:center">{today_card(8)}</div>'
b += f'<div class="abs" style="left:115px;top:140px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(217,172,88,.32),rgba(217,172,88,0) 70%)"></div>'
b += img('fox_cheer',110,122,170)
chip=lambda t: f'<div class="row" style="flex:1;height:48px;justify-content:center;border-radius:999px;background:{T["card"]};border:1.5px solid {T["tc300"]};font-weight:800;font-size:15px">{t}</div>'
b += f'''<div class="abs col" style="left:0;right:0;top:330px;bottom:0;background:{T['canvas']};border-radius:32px 32px 0 0;padding:24px 20px 0;gap:10px">
  <div class="title-lg">Bu an için kendine alan açtın.</div>
  <div class="title-sm" style="color:{T['sec']};margin-top:4px">İstek şimdi nasıl?</div>
  <div class="row" style="gap:8px">{chip('Azaldı')}{chip('Aynı')}{chip('Geri geldi')}</div>
  <div class="card row" style="margin-top:10px;height:76px;padding:0 14px 0 12px;gap:12px;background:{T['gold_soft']};border-color:#EFE2BE">
    <div style="width:48px;height:48px;border-radius:50%;background:{T['card']};box-shadow:0 0 0 2px {T['gold']};display:flex;align-items:center;justify-content:center">{ic('grid-four',T['gold_deep'],24)}</div>
    <div class="col" style="flex:1"><div class="title-sm">Yeni parça açıldı: Pencere</div><div class="caption" style="color:{T['sec']}">Sığınağında seni bekliyor.</div></div>{ic('caret-right',T['sec'],20)}</div>
  </div>'''
b += f'<div class="abs" style="left:20px;right:20px;bottom:34px"><div class="btn">Ana ekrana dön</div></div>'
page('rev3-07b-istek-nasil', b)
# ---------- milestones
MS={1:('fox_wave',('İlk gün','1 gün','İlk günü geride bıraktın.','Bir başlangıç yaptın ve bugün buradasın. Attığın her küçük adım burada duruyor.'),
         ('Yola çıktın','1 gün','İlk günün geride kaldı.','Bugün kolay geçmemiş olabilir; bu da yolun bir parçası. Burada olman yeterli bir adım.')),
    7:('fox_happy',('Bir hafta oldu','7 gün','Bir haftadır kendine alan açıyorsun.','Yedi gün boyunca küçük adımlar attın. Sığınağın da seninle birlikte büyüyor.'),
         ('Yolculuğun devam ediyor','7 gün','Bir haftadır bu yoldasın.','Kaymalar oldu ama yolun kesilmedi. Her yeniden başlayış da sayılır.')),
    14:('fox_cheer',('İki hafta oldu','14 gün','İki haftadır kendi ritmini buluyorsun.','Zor anlarda bile bir sonraki küçük adımı seçtin. Bu birikim senin.'),
         ('Yolculuğun devam ediyor','14 gün','İki haftadır bu yoldasın.','Bazı günler daha zor geçti; yine de buradasın. Açtığın hiçbir ışık sönmedi.')),
    30:('fox_hero',('Bir ay oldu','30 gün','Otuz gün boyunca kendine alan açtın.','Her gün küçük bir adım attın ve bu adımlar birikti. Bugün durup bunu fark etmeye değer.'),
         ('Yolculuğun devam ediyor','30 gün','30 gündür bu yoldasın.','Yol boyunca kaymalar da oldu; hiçbiri kurduğun şeyi silmedi. Önemli olan, her seferinde yeniden devam etmen.'))}
def milestone(d, slip):
    pose, a, s = MS[d]; e,n,lead,body = s if slip else a
    name=f'rev3-gun{d}'+('-kayma' if slip else '')
    start(name)
    b = bg()+scene(844, night=True, horizon_y=700, sparkles=None) + status(True)
    b += f'<div class="abs row" style="left:20px;right:20px;top:52px;justify-content:space-between">{closebtn()}{day_chip(d,True)}</div>'
    st=350; sx=20; sy=103
    b += f'<div class="abs" style="left:{sx}px;top:{sy}px;width:{st}px;height:{st}px;border-radius:50%;background:radial-gradient(circle,rgba(217,172,88,.38),rgba(217,172,88,0) 68%)"></div>'
    b += img('fx_sparkles',sx,sy,st,1) + img(pose,sx+56,sy+70,238) + img('fx_sparkles',sx,sy,st,.35)
    b += f'''<div class="abs col" style="left:24px;right:24px;top:{sy+st+4}px;align-items:center;gap:6px;text-align:center">
      <div class="eyebrow" style="color:{T['gold']}">{e}</div>
      <div class="display-xl" style="color:{T['on_dark']}">{n}</div>
      <div class="title-sm" style="color:{T['on_dark']}">{lead}</div>
      <div class="body-lg" style="color:{T['on_dark_muted']}">{body}</div></div>'''
    b += f'<div class="abs col" style="left:24px;right:24px;bottom:34px;gap:10px"><div class="btn">Sığınağı gör {ic("arrow-right","#fff",20)}</div><div class="btn-dark">Ana ekrana dön</div></div>'
    page(name,b)
for d in (1,7,14,30):
    milestone(d,False); milestone(d,True)
json.dump(LAYERS, open('layers_dark.json','w'))
