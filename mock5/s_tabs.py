from lib import *
from appearance import appearance_row
def toggle(on=True):
    bg=T['teal_deep'] if on else '#D6CEC2'
    return f'<div style="width:51px;height:31px;border-radius:999px;background:{bg};position:relative;flex:none"><div style="position:absolute;top:2px;{"right" if on else "left"}:2px;width:27px;height:27px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.15)"></div></div>'
def sec_head(t, aside=''):
    return f'<div class="row" style="justify-content:space-between;padding:0 4px;margin-top:10px"><div class="eyebrow" style="color:{T["sec"]}">{t}</div><div class="caption" style="color:{T["sec"]}">{aside}</div></div>'
def lrow(icon, title, value='', sub='', right='caret', last=False, color=None, tile=None):
    tb = tile or T['acc_soft']; col = color or T['ink']
    rt = ic('caret-right',T['ter'],18) if right=='caret' else (right or '')
    subh = f'<div class="caption" style="color:{T["sec"]}">{sub}</div>' if sub else ''
    val = f'<span class="sm-strong" style="color:{T["sec"]};text-align:right;max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{value}</span>' if value else ''
    return f'''<div class="row" style="min-height:56px;padding:8px 14px;gap:12px;{'' if last else 'border-bottom:1px solid '+T['border']}">
      <div style="width:36px;height:36px;border-radius:12px;background:{tb};display:flex;align-items:center;justify-content:center;flex:none">{ic(icon,T['acc_text'] if not color else color,20)}</div>
      <div class="col" style="flex:1;min-width:0"><div class="sm-strong" style="font-size:15px;line-height:20px;font-weight:700;color:{col}">{title}</div>{subh}</div>{val}{rt}</div>'''
def group(*rows): return f'<div class="card" style="overflow:hidden;border-radius:20px">{"".join(rows)}</div>'

# ---------- ROTAM
def ms_track():
    pts=[(1,'22 Eki',True),(7,'28 Eki',True),(14,'2 gün',False),(30,'18 gün',False)]
    xs=[24,110,196,282]
    s=f'<div style="position:relative;height:86px">'
    s+=f'<div class="abs" style="left:46px;top:21px;width:258px;height:4px;border-radius:2px;background:{T["sunken"]}"></div>'
    s+=f'<div class="abs" style="left:46px;top:21px;width:{86+86*5/7:.0f}px;height:4px;border-radius:2px;background:{T["gold"]}"></div>'
    s+=f'<div class="abs" style="left:{132+86*5/7-6:.0f}px;top:17px;width:12px;height:12px;border-radius:50%;background:{T["primary"]};border:2px solid #fff"></div>'
    for (d,sub,r),x in zip(pts,xs):
        if r: circ=f'<div style="width:44px;height:44px;border-radius:50%;background:{T["gold_soft"]};border:2px solid {T["gold"]};display:flex;align-items:center;justify-content:center">{ic("flag",T["gold_deep"],20,"fill")}</div>'
        else: circ=f'<div style="width:44px;height:44px;border-radius:50%;background:{T["card"]};border:2px dashed {T["tc300"]};display:flex;align-items:center;justify-content:center">{ic("flag-banner","#8A8F88",20)}</div>'
        s+=f'<div class="abs col" style="left:{x}px;top:0;width:44px;align-items:center;gap:4px">{circ}<span class="caption" style="font-weight:800;white-space:nowrap;color:{T["ink"] if r else T["sec"]}">Gün {d}</span><span class="caption" style="white-space:nowrap;color:{T["sec"]};margin-top:-4px">{sub}</span></div>'
    return s+'</div>'
def week():
    days=['Sa','Ça','Pe','Cu','Ct','Pz','Pt']; n=[0,1,1,0,1,1,1]
    cols=''
    for i,(d,k) in enumerate(zip(days,n)):
        today=i==6
        cell = light_token(30) if k else f'<div style="width:30px;height:30px;border-radius:50%;border:2px dashed {T["border"]}"></div>'
        cols+=f'<div class="col" style="align-items:center;gap:6px;width:36px">{cell}<span class="caption" style="color:{T["ink"] if today else T["sec"]};{"font-weight:800" if today else ""}">{"Bugün" if today else d}</span></div>'
    return f'<div class="row" style="justify-content:space-between">{cols}</div>'
def rotam_top(name):
    start(name)
    b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + scene(260, horizon_y=190, sparkles=(190,40,190,.45)) + status()
    b += f'<div class="abs row" style="left:20px;right:20px;top:54px;justify-content:space-between"><div class="title-lg">Rotam</div>{light_chip(7)}</div>'
    b += f'''<div class="abs col" style="left:20px;top:104px"><div class="eyebrow" style="color:{T['acc_text']}">Senin yolculuğun</div>
      <div class="display-xl">12 <span class="title-lg">gün</span></div><div class="sm-strong" style="color:{T['ink']}">21 Ekim 2026’dan beri</div></div>'''
    b += img('fox_calm',236,92,130)
    b += f'''<div class="abs col" style="left:0;right:0;top:228px;bottom:0;background:{T['canvas']};border-radius:32px 32px 0 0;padding:20px 20px 0;gap:10px">
      <div class="card col" style="padding:14px 14px 10px;gap:10px"><div class="row" style="justify-content:space-between"><div class="title-sm" style="font-weight:800">Kilometre taşları</div><div class="caption" style="color:{T['sec']}">2 / 4</div></div>{ms_track()}</div>
      <div class="card col" style="padding:14px;gap:12px"><div class="row" style="justify-content:space-between"><div class="title-sm" style="font-weight:800">Son 7 gün</div><div class="row caption" style="gap:4px;color:{T['sec']}">5 ışık</div></div>{week()}</div>
      <div class="row" style="gap:10px">
        <div class="card col" style="flex:1;padding:12px 14px;gap:2px;border-radius:20px"><div class="row" style="gap:8px">{ic('prohibit',T['acc_text'],18)}<span class="eyebrow" style="color:{T['sec']}">İçilmeyen tahmini</span></div><div class="title-md">168</div><div class="caption" style="color:{T['sec']}">adet · yaklaşık</div></div>
        <div class="card col" style="flex:1;padding:12px 14px;gap:2px;border-radius:20px"><div class="row" style="gap:8px">{ic('coins',T['acc_text'],18)}<span class="eyebrow" style="color:{T['sec']}">Tahmini tasarruf</span></div><div class="title-md">₺840</div><div class="caption" style="color:{T['sec']}">girdiğin paket fiyatıyla</div></div></div>
      <div class="row" style="justify-content:center;gap:6px;height:36px">{ic('info',T['acc_text'],18)}<span class="sm-strong" style="color:{T['acc_text']};font-weight:800">Hesap nasıl yapılıyor?</span></div>
    </div>'''
    b += tabbar('Rotam')
    return b
b = rotam_top('rev4-rotam'); page('rev4-rotam', b)

# Rotam scrolled: records
start('rev4-rotam-kayitlar')
b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + status()
b += f'<div class="abs row" style="left:0;right:0;top:47px;height:52px;padding:0 20px;justify-content:space-between;background:{T["canvas"]};border-bottom:1px solid {T["border"]}"><div class="title-sm" style="font-weight:800">Rotam</div><div class="caption" style="color:{T["sec"]}">12. gün · 7 ışık</div></div>'
EV=[('sparkle','Check-in: İyi','Bugün 09:12',True),('wind','Bir baş etme adımı denedin','Dün 21:40',True),('chat-circle','İstek sonrası: Azaldı','Dün 21:44',False),('waves','İstek anı için destek açtın','Dün 21:37',False),('arrow-counter-clockwise','Bir sigara içtiğini kaydettin','30 Eki 18:05',False),('sparkle','Check-in: Karışık','30 Eki 08:50',True)]
import os
def evrow(i,t,when,light,last=False):
    iconname = i if os.path.exists(f'{PH}/regular/{i}.svg') else 'chat-circle-dots'
    tile = T['gold_soft'] if light else T['sunken']
    col = T['gold_deep'] if light else T['sec']
    extra = f'<span class="row caption" style="gap:3px;color:{T["sec"]};font-weight:800">+1 {light_token(16,False)}</span>' if light else ''
    return f'''<div class="row" style="min-height:60px;padding:8px 6px 8px 14px;gap:12px;{'' if last else 'border-bottom:1px solid '+T['border']}">
      <div style="width:36px;height:36px;border-radius:12px;background:{tile};display:flex;align-items:center;justify-content:center;flex:none">{ic(iconname,col,20,'fill' if i=='sparkle' else 'regular')}</div>
      <div class="col" style="flex:1;min-width:0"><div class="sm-strong" style="font-size:14px;line-height:20px;font-weight:700">{t}</div><div class="caption" style="color:{T['sec']}">{when}</div></div>{extra}
      <div style="width:44px;height:44px;display:flex;align-items:center;justify-content:center">{ic('dots-three',T['sec'],22)}</div></div>'''
rows=''.join(evrow(*e, last=(k==len(EV)-1)) for k,e in enumerate(EV))
b += f'''<div class="abs col" style="left:20px;right:20px;top:112px;gap:10px">
  <div class="row" style="justify-content:space-between;padding:0 4px"><div class="title-sm" style="font-weight:800">Son kayıtların</div><div class="caption" style="color:{T['sec']}">24 kayıt</div></div>
  <div class="card" style="border-radius:20px;overflow:hidden">{rows}<div class="textbtn" style="border-top:1px solid {T['border']}">Tümünü gör</div></div>
  <div class="row" style="gap:10px;margin-top:4px"><div class="btn2" style="flex:1">{ic('calendar-check',T['ink'],20)}Check-in</div><div class="btn2" style="flex:1;background:transparent;border:1.5px solid {T['border']}">{ic('arrow-counter-clockwise',T['ink'],20)}Kayma kaydet</div></div>
  <div class="caption" style="color:{T['sec']};text-align:center;padding:0 12px">Kayma kaydı önceki emeğini silmez; yolun ve ışıkların yerinde kalır.</div>
  <div class="row" style="gap:10px;padding:12px 14px;border-radius:16px;background:{T['sunken']};align-items:flex-start">{ic('info',T['sec'],18)}<div class="caption" style="color:{T['sec']}">Bu göstergeler yaklaşık kişisel takip değerleridir; sağlık sonucunu ölçmez veya garanti etmez.</div></div>
</div>'''
b += tabbar('Rotam')
page('rev4-rotam-kayitlar', b)

# Rotam: how-calculated sheet
start('rev4-rotam-hesap')
b = rotam_top('rev4-rotam-hesap')
b += f'<div class="abs" style="inset:0;background:rgba(20,23,27,.45)"></div>'
b += f'''<div class="abs col" style="left:0;right:0;bottom:0;background:{T['canvas']};border-radius:32px 32px 0 0;padding:10px 20px 34px;gap:12px">
  <div style="align-self:center;width:40px;height:5px;border-radius:3px;background:{T['border']}"></div>
  <div class="title-md">Hesap nasıl yapılıyor?</div>
  <div class="body-md" style="color:{T['sec']}">İçilmeyen tahmini adet, seçtiğin bırakma tarihi ve günlük ortalamanla hesaplanır; kaydettiğin sigaralar tahminden düşülür. Tasarruf tahmini, içilmeyen adet × paket fiyatı ÷ paketteki adet formülünü kullanır. Gerçek miktar kişisel tüketimine göre değişebilir.</div>
  <div class="card col" style="padding:4px 14px;border-radius:20px">
    <div class="row" style="justify-content:space-between;height:44px;border-bottom:1px solid {T['border']}"><span class="body-md" style="color:{T['sec']}">Günlük ortalama</span><span class="sm-strong" style="font-weight:800">14 sigara</span></div>
    <div class="row" style="justify-content:space-between;height:44px"><span class="body-md" style="color:{T['sec']}">Paket</span><span class="sm-strong" style="font-weight:800">₺100 / 20 adet</span></div></div>
  <div class="btn2">{ic('pencil-simple',T['ink'],20)}Plan bilgilerini düzenle</div>
</div>'''
page('rev4-rotam-hesap', b)

# ---------- BEN
def ben_head():
    b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + scene(220, horizon_y=150, sparkles=(200,30,170,.45), fade=True) + status()
    b += f'<div class="abs title-lg" style="left:20px;top:54px">Ben</div>'
    b += f'<div class="abs row" style="left:20px;top:98px;gap:8px">{day_chip(12)}{light_chip(7)}</div>'
    b += img('fox_wave',250,44,120)
    return b
start('rev4-ben')
b = ben_head()
b += f'''<div class="abs col" style="left:20px;right:20px;top:160px;gap:8px">
  {sec_head('Planın')}
  {group(lrow('cigarette' if False else 'chart-line','Günlük ortalama','14 sigara',right=''),
         lrow('coins','Paket','₺100 / 20 adet',right=''),
         lrow('calendar-check','Bırakma günü','21 Ekim 2026',right=''),
         lrow('heart','Kendine notun','“Daha özgür hissetmek…”',right=''),
         f'<div class="textbtn" style="gap:8px">{ic("pencil-simple",T["acc_text"],18)}Plan bilgilerini düzenle</div>')}
  {sec_head('Hatırlatmalar','İsteğe bağlı')}
  {group(lrow('bell','Günlük kısa check-in','',sub='Her gün 19:00 için açık.',right=toggle(True)),
         lrow('clock','Saat','19:00',last=True))}
  {sec_head('Deneyim')}
  {group(appearance_row(T, ic, 'Sistem'), lrow('vibrate','Titreşimli geri bildirim','',sub='Işık kazandığında ve nefes ritminde hafif titreşim.',right=toggle(True),last=True,color=T['teal_deep'],tile=T['teal_soft']))}
</div>'''
b += tabbar('Ben')
page('rev4-ben', b)

start('rev4-ben-2')
b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + status()
b += f'<div class="abs row" style="left:0;right:0;top:47px;height:52px;padding:0 20px;justify-content:space-between;background:{T["canvas"]};border-bottom:1px solid {T["border"]}"><div class="title-sm" style="font-weight:800">Ben</div></div>'
b += f'''<div class="abs col" style="left:20px;right:20px;top:104px;gap:8px">
  {sec_head('Veri ve eşitleme','Önce gizlilik')}
  {group(lrow('device-mobile','Bu cihazda saklanıyor','',sub='Hesap açmadan kullanabilirsin.',right='',tile=T['teal_soft'],color=T['teal_deep']),
         lrow('cloud','Bulut eşitlemesi','Kapalı'),
         lrow('download-simple','Verilerimi dışa aktar'),
         lrow('trash','Bu cihazdaki kayıtları sil',last=True,color=T['acc_text']))}
  {sec_head('Destek ve bilgi')}
  <div class="card col" style="padding:16px;gap:10px;border-radius:20px">
    <div class="row" style="gap:12px"><div style="width:44px;height:44px;border-radius:14px;background:{T['hero']};display:flex;align-items:center;justify-content:center">{ic('lifebuoy',T['acc_text'],24)}</div><div class="title-sm" style="font-weight:800">Profesyonel destek</div></div>
    <div class="body-md" style="color:{T['sec']}">ALO 171, Sağlık Bakanlığının sigara bırakma danışma hattıdır ve 7 gün 24 saat hizmet verir.</div>
    <div class="btn2" style="height:48px">{ic('phone',T['ink'],20)}171’i ara</div>
    <div class="textbtn" style="gap:6px">Resmî destek bilgilerini aç {ic('arrow-up-right',T['acc_text'],16)}</div>
    <div class="caption" style="color:{T['sec']}">Bu uygulama tıbbi tavsiye, tanı veya tedavi sunmaz. Acil durumda yerel acil yardım hizmetlerine başvur.</div>
  </div>
  <div class="caption" style="color:{T['sec']};text-align:center;margin-top:6px">Çalışma adı · MVP önizlemesi · Verilerin bu cihazda kalır<br>Hesap eşitlemesi açıldığında Supabase kullanılır.</div>
</div>'''
b += tabbar('Ben')
page('rev4-ben-2', b)

start('rev4-ben-bulut')
b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + status()
b += f'<div class="abs" style="inset:0;background:rgba(20,23,27,.45)"></div>'
b += f'''<div class="abs col" style="left:0;right:0;top:120px;bottom:0;background:{T['canvas']};border-radius:32px 32px 0 0;padding:10px 20px 34px;gap:12px">
  <div style="align-self:center;width:40px;height:5px;border-radius:3px;background:{T['border']}"></div>
  <div class="row" style="justify-content:space-between"><div class="title-md">Bulut eşitlemesi</div>{closebtn(False)}</div>
  <div class="body-md" style="color:{T['sec']}">Uygulamayı hesap açmadan kullanabilirsin. Supabase bulut eşitlemesi için hesabınla giriş yap; e-posta doğrulaması ayarına bağlı olabilir.</div>
  <div class="row" style="gap:10px;padding:12px 14px;border-radius:16px;background:{T['gold_soft']}">{ic('cloud-check',T['gold_deep'],20)}<div class="caption">Eşitlenenler: planın, kayıtların ve gördüğün kilometre taşları.</div></div>
  <div class="input" style="height:56px">{ic('envelope',T['sec'],20)}<span class="body-lg" style="color:{T['sec']}">E-posta</span></div>
  <div class="input" style="height:56px">{ic('lock-simple',T['sec'],20)}<span class="body-lg" style="color:{T['sec']}">Parola (en az 8 karakter)</span></div>
  <div class="btn" style="margin-top:6px">Hesap oluştur ve eşitle</div>
  <div class="textbtn">Zaten hesabın var mı? Giriş yap</div>
</div>'''
page('rev4-ben-bulut', b)
json.dump(LAYERS, open('layers_tabs.json','w'))
