from PIL import Image, ImageDraw, ImageFont
import os; os.chdir('/workspace/addiction-figma')
F='/usr/share/fonts/truetype/sand-box/google/Nunito/Nunito-VariableFont_wght.ttf'
def font(sz,w=b'ExtraBold'):
    f=ImageFont.truetype(F,sz)
    try: f.set_variation_by_name(w)
    except Exception: pass
    return f
rows=[('Karanlık mod · ana sekmeler',[('rev5-yuva','Yuva · alacakaranlık'),('rev5-siginak','Sığınak · yol + sis'),('rev5-rotam','Rotam'),('rev5-ben','Ben'),('rev5-koleksiyon','Koleksiyon')]),
('Karanlık mod · onboarding + zaten koyu ekranlar',[('rev5-onb-2-paket','Onboarding · adım 2'),('rev5-istek','İstek · gece sahnesi'),('rev5-gun7','Gün 7 · tam gece')])]
tw,th=215,465; gap=28; m=56; cols=5
W=m*2+cols*tw+(cols-1)*gap; H=150+len(rows)*(60+th+50)+20
im=Image.new('RGB',(W,H),'#14171B'); d=ImageDraw.Draw(im)
d.text((m,40),'Sigarayı bırakma uygulaması · rev 5 — karanlık mod',font=font(40),fill='#F3EFE8')
d.text((m,92),'390×844 @2x · canvas #14171B · card #1E2228 · ink #F3EFE8 · accent text #F2906F · action #C84F2E · 2 Kasım 2026',font=font(22,b'SemiBold'),fill='#B5AFA5')
y=150
for title,items in rows:
    d.text((m,y+14),title.upper(),font=font(20),fill='#F2906F'); y+=60
    for i,(n,l) in enumerate(items):
        x=m+i*(tw+gap)
        t=Image.open(n+'.png').convert('RGB').resize((tw,th),Image.LANCZOS)
        mask=Image.new('L',(tw,th),0); ImageDraw.Draw(mask).rounded_rectangle((0,0,tw-1,th-1),22,fill=255)
        d.rounded_rectangle((x-1,y-1,x+tw,y+th),23,outline='#353C46',width=2)
        im.paste(t,(x,y),mask); d.text((x+4,y+th+12),l,font=font(17,b'Bold'),fill='#F3EFE8')
    y+=th+50
im.save('rev5-overview.png'); print(im.size)
