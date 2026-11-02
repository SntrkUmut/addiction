from lib import *
from fog import fog, teaser, iconbtn
from s_path import node, flag, mlab, lab, pathline, tooltip, unit
def head(lights, caption='Her 2 ışık yolda yeni bir durak açar.'):
    b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + scene(250, horizon_y=176, sparkles=(70,10,260,.45), fade=True) + status()
    b += f'<div class="abs row" style="left:20px;right:20px;top:52px;justify-content:space-between"><div class="title-lg">Sığınağın</div><div class="row" style="gap:8px">{iconbtn("diamonds-four")}{light_chip(lights)}</div></div>'
    b += f'<div class="abs caption" style="left:20px;top:92px;color:{T["ink"]}">{caption}</div>'
    return b

# ---- rev4-siginak: auto-scrolled Bölüm 1 with stops + fogged Bölüm 2 teaser
start('rev4-siginak')
b = head(7)
P=[(120,150),(150,236),(260,296),(160,384),(280,454),(190,516),(100,586),(195,640)]
b += pathline(P)
b += unit(120,'Bölüm 1 · Temel','Sığınağın ilk odası','3 / 6 parça',.5)
b += flag(150,214,True) + mlab(182,218,7,'28 Ekim',True)
b += node(260,262,'armchair','done') + lab(0,286,'Dinlenme köşesi',T['sec'],right_edge=216)
b += node(160,350,'grid-four','next',frac=.5) + tooltip(36,304,'Pencere · 1 ışık kaldı')
b += flag(280,432,False) + mlab(0,438,14,'2 gün sonra',False,right_edge=248)
b += node(190,482,'plant','lock') + lab(234,506,'Yeşil köşe',T['ter'])
b += node(100,552,'books','lock') + lab(144,576,'Kitaplık',T['ter'])
b += img('fox_happy',18,396,100)
b += fog(560,200) + teaser(612,'Bölüm 2 · Bahçe','Sisin ardında yeni bir yer var','12. ışıkta açılır · 5 ışık kaldı','door-open')
b += tabbar('Sığınak')
page('rev4-siginak', b)

# ---- rev4-icerik-sonu: caught up with published content (50 lights, chapters 1-4 published)
start('rev4-icerik-sonu')
b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + scene(290, horizon_y=210, sparkles=(60,20,270,.5)) + status()
b += f'<div class="abs row" style="left:20px;right:20px;top:52px;justify-content:space-between"><div class="title-lg">Sığınağın</div><div class="row" style="gap:8px">{iconbtn("diamonds-four")}{light_chip(50)}</div></div>'
b += img('fox_calm',120,96,150)
b += fog(196,90)
b += f'''<div class="abs col" style="left:0;right:0;top:266px;bottom:0;background:{T['canvas']};border-radius:32px 32px 0 0;padding:16px 20px 0;gap:10px">
  <div class="row" style="gap:8px">{ic('cloud-fog',T['acc_text'],18)}<span class="eyebrow" style="color:{T['acc_text']}">Bölüm 5 · Yıldız terası</span></div>
  <div class="title-lg" style="margin-top:-4px">Sisin ardında yeni bir yer hazırlanıyor.</div>
  <div class="body-md" style="color:{T['sec']}">Şu an açık olan her parçayı yerine koydun. Işıkların birikmeye devam ediyor; yeni bölüm açılınca yolunu hemen aydınlatacak.</div>
  <div class="card row" style="padding:12px 14px;gap:12px;border-radius:20px">
    <div style="width:44px;height:44px;border-radius:14px;background:{T['gold_soft']};display:flex;align-items:center;justify-content:center">{ic('hourglass',T['gold_deep'],22)}</div>
    <div class="col" style="flex:1"><div class="caption" style="color:{T['sec']}">Açılmasına</div><div class="title-sm" style="font-weight:800">4 gün</div></div>
    <div class="col" style="align-items:flex-end"><div class="row caption" style="gap:4px;color:{T['sec']};font-weight:800">{light_token(18,False)} 2 ışık hazır</div><div class="caption" style="color:{T['sec']}">ilk parçaya gider</div></div></div>
  <div class="eyebrow" style="color:{T['sec']};margin-top:4px;padding:0 4px">Bu arada</div>
  <div class="row" style="gap:10px">
    <div class="card col" style="flex:1;padding:12px 14px;gap:6px;border-radius:20px">{ic('target',T['acc_text'],22)}<div class="sm-strong" style="font-weight:800">Haftalık hedefler</div><div class="caption" style="color:{T['sec']}">1 / 3 tamam</div></div>
    <div class="card col" style="flex:1;padding:12px 14px;gap:6px;border-radius:20px">{ic('diamonds-four',T['acc_text'],22)}<div class="sm-strong" style="font-weight:800">Koleksiyon</div><div class="caption" style="color:{T['sec']}">9 / 24 parça</div></div></div>
  <div class="btn2" style="height:52px">{ic('paint-brush',T['ink'],20)}Sığınağını düzenle</div>
</div>'''
b += tabbar('Sığınak')
page('rev4-icerik-sonu', b)

# ---- rev4-koleksiyon: seasonal event + weekly goals + collections
start('rev4-koleksiyon')
b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + status()
b += f'<div class="abs row" style="left:16px;right:20px;top:50px;justify-content:space-between"><div class="row" style="gap:8px"><div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center">{ic("caret-left",T["ink"],24)}</div><div class="title-md">Koleksiyon</div></div>{light_chip(7)}</div>'
def ringn(a,n,done=False):
    if done:
        return f'<div style="width:40px;height:40px;border-radius:50%;background:{T["teal_deep"]};display:flex;align-items:center;justify-content:center">{ic("check","#fff",20)}</div>'
    return f'<div style="position:relative;width:40px;height:40px">{ring(40,4,a/n,T["gold"],T["border"])}<div class="abs caption" style="inset:0;display:flex;align-items:center;justify-content:center;font-weight:800">{a}/{n}</div></div>'
def goal(a,n,t,reward,icon,done=False,last=False):
    rc = T['teal_deep'] if done else T['sec']
    return f'''<div class="row" style="min-height:60px;padding:8px 14px;gap:12px;{'' if last else 'border-bottom:1px solid '+T['border']}">{ringn(a,n,done)}
      <div class="col" style="flex:1;min-width:0"><div class="sm-strong" style="font-size:14px;font-weight:700">{t}</div><div class="row caption" style="gap:4px;color:{rc}">{ic(icon,rc,14)}{reward}</div></div></div>'''
def item(icon,name,owned,src=''):
    if owned:
        art=f'<div style="width:48px;height:48px;border-radius:50%;background:{T["gold_soft"]};border:2px solid {T["gold"]};display:flex;align-items:center;justify-content:center">{ic(icon,T["gold_deep"],24)}</div>'
        cap=f'<span class="caption" style="font-weight:800">{name}</span>'
    else:
        art=f'<div style="width:48px;height:48px;border-radius:50%;border:2px dashed {T["tc300"]};display:flex;align-items:center;justify-content:center">{ic(icon,"#A9ADA6",22)}</div>'
        cap=f'<span class="caption" style="color:{T["sec"]}">{src}</span>'
    return f'<div class="card col" style="width:108px;height:100px;align-items:center;justify-content:center;gap:6px;border-radius:18px">{art}{cap}</div>'
b += f'''<div class="abs col" style="left:20px;right:20px;top:104px;gap:8px">
  <div class="row" style="gap:12px;padding:12px 14px;border-radius:20px;background:{T['hero']}">
    <div style="width:44px;height:44px;border-radius:14px;background:rgba(255,254,252,.8);display:flex;align-items:center;justify-content:center">{ic('leaf',T['acc_text'],24,'fill')}</div>
    <div class="col" style="flex:1"><div class="eyebrow" style="color:{T['acc_text']}">Mevsim etkinliği · 30 Kasım’a kadar</div><div class="sm-strong" style="font-weight:800;font-size:15px">Sonbahar şenliği</div>
      <div class="row" style="gap:8px;margin-top:4px"><div style="flex:1;height:8px;border-radius:999px;background:rgba(255,254,252,.8)"><div style="width:60%;height:8px;border-radius:999px;background:{T['gold']}"></div></div><span class="caption" style="color:{T['ink']};font-weight:800">3 / 5 ışık</span></div></div></div>
  <div class="row" style="justify-content:space-between;padding:0 4px;margin-top:8px"><div class="title-sm" style="font-weight:800">Bu haftanın hedefleri</div><div class="caption" style="color:{T['sec']}">Pazartesi yenilenir</div></div>
  <div class="card" style="border-radius:20px;overflow:hidden">
    {goal(2,3,'3 gün check-in yap','Kristal lamba','diamond')}
    {goal(2,2,'2 kez bir baş etme aracı dene','Kazandın: Kuvars','check-circle',done=True)}
    {goal(0,1,'Sığınağında bir parçanın yerini değiştir','Tilki için atkı','t-shirt',last=True)}</div>
  <div class="caption" style="color:{T['sec']};padding:0 4px">Hedefler isteğe bağlı. Tamamlanmayan hedef bir şey kaybettirmez; yeni hafta yeni hedeflerle başlar.</div>
  <div class="row" style="justify-content:space-between;padding:0 4px;margin-top:8px"><div class="title-sm" style="font-weight:800">Koleksiyonlar</div><div class="caption" style="color:{T['sec']}">9 / 24</div></div>
  <div class="row" style="gap:8px">
    <div class="chip" style="white-space:nowrap;background:{T['ink']};color:#fff;border-color:{T['ink']}">Kristaller 4/6</div><div class="chip" style="white-space:nowrap">Aksesuarlar 2/6</div><div class="chip" style="white-space:nowrap">Süsler 3/12</div></div>
  <div style="display:flex;flex-wrap:wrap;gap:9px">
    {item('diamond','Ametist',True)}{item('diamonds-four','Kuvars',True)}{item('sketch-logo','Akuamarin',True)}
    {item('drop','Ay taşı',True)}{item('diamond','',False,'Gün 60')}{item('sketch-logo','',False,'Haftalık hedef')}</div>
</div>'''
page('rev4-koleksiyon', b)
json.dump(LAYERS, open('layers_endless.json','w'))
