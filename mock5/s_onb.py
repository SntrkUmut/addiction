from lib import *
def header(step, total=5):
    pct = step/total*100
    return f'''<div class="abs row" style="left:12px;right:20px;top:50px;justify-content:space-between;height:44px">
      <div class="row" style="gap:2px;padding:0 8px;height:44px">{ic('caret-left',T['ink'],20)}<span class="sm-strong" style="font-weight:800">Geri</span></div>
      <div class="eyebrow" style="color:{T['ink']}">Adım {step} / {total}</div></div>
      <div class="abs" style="left:20px;right:20px;top:98px;height:8px;border-radius:999px;background:rgba(255,254,252,.7)"><div style="width:{pct}%;height:8px;border-radius:999px;background:{T['gold']}"></div></div>'''
def footer(primary, skip=None, hint='İlerleme kaydedilir · Dilediğinde geri dönebilirsin'):
    s = f'<div class="abs col" style="left:20px;right:20px;bottom:30px;gap:4px">'
    s += f'<div class="btn">{primary}</div>'
    s += f'<div class="textbtn">{skip}</div>' if skip else '<div style="height:8px"></div>'
    s += f'<div class="caption" style="color:{T["sec"]};text-align:center">{hint}</div></div>'
    return s
def sheet(top, inner):
    return f'<div class="abs col" style="left:0;right:0;top:{top}px;bottom:0;background:{T["canvas"]};border-radius:32px 32px 0 0;padding:24px 20px 0;gap:8px">{inner}</div>'
def heading(eyebrow, title, sub):
    return f'<div class="eyebrow" style="color:{T["acc_text"]}">{eyebrow}</div><div class="title-lg">{title}</div><div class="body-md" style="color:{T["sec"]};margin-bottom:8px">{sub}</div>'
def field(label, val, unit='', prefix='', placeholder=False):
    pre = f'<span class="title-md" style="color:{T["sec"]}">{prefix}</span>' if prefix else ''
    vcol = T['ter'] if placeholder else T['ink']
    return f'''<div class="col" style="gap:6px"><div class="eyebrow" style="color:{T['sec']}">{label}</div>
      <div class="input">{pre}<span class="title-md" style="color:{vcol};flex:1">{val}</span><span class="sm-strong" style="color:{T['sec']}">{unit}</span></div></div>'''

# 0 welcome
start('rev3-onb-0-hosgeldin')
b = scene(400, horizon_y=300, sparkles=(60,70,270,.5)) + status()
b += f'<div class="abs eyebrow" style="left:0;right:0;top:62px;text-align:center;color:{T["acc_text"]}">Yeni bir başlangıç</div>'
b += img('fox_wave',95,96,200)
def feat(icon,t,d):
    return f'<div class="row" style="gap:12px;height:56px"><div style="width:44px;height:44px;border-radius:14px;background:{T["hero"]};display:flex;align-items:center;justify-content:center">{ic(icon,T["acc_text"],22)}</div><div class="col"><div class="title-sm">{t}</div><div class="caption" style="color:{T["sec"]}">{d}</div></div></div>'
b += sheet(330, f'''<div class="display-lg">Bırakma yolun<br>sana ait.</div>
  <div class="body-md" style="color:{T['sec']};margin-bottom:6px">Her şeyi bugün çözmek zorunda değilsin. Sana iyi gelecek bir sonraki küçük adımı bulmana yardım edeceğiz.</div>
  {feat('lifebuoy','İstek geldiğinde yanında','Kısa, uygulanabilir baş etme araçları.')}
  {feat('tent','Kendi sığınağını kur','Küçük adımlarınla yaşayan bir alan.')}
  {feat('path','Yolun kesilmez','Bir kayma önceki emeğini silmez.')}''')
b += footer('Küçük adımlarla başla', None, 'Hesap açman gerekmez. Planın önce bu cihazda saklanır.')
page('rev3-onb-0-hosgeldin', b)

# 1 smoking
start('rev3-onb-1-sigara')
b = scene(270, horizon_y=190, sparkles=(110,100,170,.45)) + status() + header(1)
b += img('fox_idle',135,112,120)
b += sheet(236, heading('Adım 1 · Başlangıç noktan','Günde yaklaşık kaç sigara içiyorsun?','Yaklaşık bir sayı yeterli. Bu bilgi, kişisel ilerleme tahminini oluşturur.')
  + f'<div class="card col" style="padding:16px;gap:8px">{field("Günlük ortalama","14","sigara / gün")}<div class="caption" style="color:{T["sec"]}">Yaklaşık değer yeterli; bu alanı daha sonra da doldurabilirsin.</div></div>')
b += footer('Devam et', 'Bu alanı daha sonra doldur')
page('rev3-onb-1-sigara', b)

# 2 spending (pack price)
start('rev3-onb-2-paket')
b = scene(270, horizon_y=190, sparkles=(110,100,170,.45)) + status() + header(2)
b += img('fox_happy',135,108,124)
b += sheet(236, heading('Adım 2 · İsteğe bağlı','Tasarrufunu da takip edelim mi?','Paket fiyatını bilirsen yaklaşık tasarrufunu gösterebiliriz. Emin değilsen bu adımı geçebilirsin.')
  + f'''<div class="card col" style="padding:16px;gap:12px">{field("Paket fiyatı","100","","₺")}
     <div class="row" style="gap:12px">{field("Pakette kaç sigara var?","20","adet")}</div>
     <div class="row" style="gap:8px;padding:10px 12px;border-radius:14px;background:{T['gold_soft']}">{ic('coins',T['gold_deep'],18)}<span class="caption" style="color:{T['ink']}">Örnek: günde 14 sigarayla haftada yaklaşık ₺490</span></div></div>''')
b += footer('Devam et', 'Bu adımı atla')
page('rev3-onb-2-paket', b)

# 3 quit date
start('rev3-onb-3-tarih')
b = scene(270, horizon_y=190, sparkles=(110,100,170,.45)) + status() + header(3)
b += img('fox_calm',135,110,120)
b += sheet(236, heading('Adım 3 · Kendi zamanın','Bırakma gününü seç.','Bugün başlayabilir ya da hazırlanmak için kendine bir tarih belirleyebilirsin. Bu kararı daha sonra değiştirebilirsin.')
  + f'''<div class="card col" style="padding:16px;gap:10px"><div class="eyebrow" style="color:{T['sec']}">Başlangıç tarihi</div>
     <div class="input" style="justify-content:space-between"><span class="title-sm">2 Kasım 2026</span>{ic('calendar-check',T['acc_text'],22)}</div></div>
     <div class="row" style="gap:8px;height:44px;padding:0 16px;border-radius:999px;border:1.5px solid {T['tc300']};background:{T['card']};align-self:flex-start">{ic('check',T['acc_text'],18)}<span class="sm-strong" style="color:{T['acc_text']};font-weight:800">Bugün başlamak istiyorum</span></div>''')
b += footer('Devam et')
page('rev3-onb-3-tarih', b)

# 4 reason
start('rev3-onb-4-neden')
b = scene(270, horizon_y=190, sparkles=(110,100,170,.45)) + status() + header(4)
b += img('fox_wave',135,108,124)
b += sheet(236, heading('Adım 4 · Kendi nedenin','Bırakma kararın sana ne ifade ediyor?','İstersen kısa bir not ekle. Zorlandığın bir anda sana kendi nedenini hatırlatabiliriz.')
  + f'''<div class="card col" style="padding:16px;gap:8px"><div class="eyebrow" style="color:{T['sec']}">Kendine notun</div>
     <div style="height:104px;border-radius:16px;background:{T['sunken']};padding:14px 16px" class="body-lg">Daha özgür hissetmek ve kendi ritmimi bulmak.</div>
     <div class="caption" style="color:{T['sec']}">İsteğe bağlı · en fazla 240 karakter</div></div>''')
b += footer('Devam et', 'Bu adımı atla')
page('rev3-onb-4-neden', b)

# 5 summary
start('rev3-onb-5-ozet')
b = scene(270, horizon_y=190, sparkles=(70,40,250,.6)) + status() + header(5)
b += img('fox_cheer',130,104,130)
def srow(l,v,last=False):
    return f'<div class="row" style="justify-content:space-between;height:44px;{"" if last else "border-bottom:1px solid "+T["border"]}"><span class="body-md" style="color:{T["sec"]}">{l}</span><span class="sm-strong" style="font-weight:800">{v}</span></div>'
b += sheet(236, heading('Adım 5 / 5 · Hazır','İlk adımın hazır.','İstediğin zaman plan bilgilerini ayarlardan düzenleyebilirsin.')
  + f'''<div class="card col" style="padding:4px 16px 12px">{srow('Günlük ortalama','14 sigara')}{srow('Bırakma günü','2 Kasım 2026')}{srow('Tasarruf hesabı','₺100 / 20 adet')}</div>
     <div class="caption" style="color:{T['sec']};margin-top:4px">Uygulama öz yönetim desteği sunar; sağlık profesyonelinin önerilerinin veya tedavinin yerine geçmez.</div>''')
b += footer('Planımı oluştur', None, 'Planın bu cihazda saklanır. Hesap ve bulut eşitlemesi isteğe bağlıdır.')
page('rev3-onb-5-ozet', b)
json.dump(LAYERS, open('layers_onb.json','w'))
