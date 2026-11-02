from PIL import Image, ImageDraw, ImageFont
import os; os.chdir('/workspace/addiction-figma')
from tokens import LIGHT, DARK, DUSK, PAIRS, cr
F='/usr/share/fonts/truetype/sand-box/google/Nunito/Nunito-VariableFont_wght.ttf'
def font(sz,w=b'ExtraBold'):
    f=ImageFont.truetype(F,sz)
    try: f.set_variation_by_name(w)
    except Exception: pass
    return f
BG='#14171B'; INK='#F3EFE8'; SEC='#B5AFA5'; ACC='#F2906F'; LINE='#353C46'
# ---------- tokens sheet
rows=[('canvas','zemin'),('card','kart'),('sunken','gömük / btn2'),('border','çizgi'),('ink','metin'),('sec','ikincil metin'),('ter','üçüncül'),
 ('primary','eylem'),('shadow','eylem gölgesi'),('acc_text','vurgu metni'),('acc_soft','vurgu karo'),('hero','hero / aktif sekme'),('urge','istek yüzeyi'),('tc300','yol çizgisi'),
 ('gold','altın (yalnız süs/ikon)'),('gold_text','altın metin (5.1)'),('gold_deep','altın ikon'),('gold_soft','altın karo'),('gold_edge','altın kenar'),('teal_deep','teal metin/ikon'),('teal_soft','teal karo')]
W=1600; rh=46; H=170+len(rows)*rh+60+ (len(PAIRS)+1)*34+80
im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
d.text((56,40),'rev 5.1 · Tokenlar (semantik: açık ve koyu değer)',font=font(38),fill=INK)
d.text((56,92),'Aynı token adı, iki değer. Bileşenler token adıyla çalışır; tema: Ben > Görünüm (Sistem / Açık / Koyu).',font=font(20,b'SemiBold'),fill=SEC)
y=150
for x,t in ((56,'TOKEN'),(330,'AÇIK'),(620,'KOYU'),(910,'KULLANIM')): d.text((x,y),t,font=font(16),fill=ACC)
y+=30
for k,u in rows:
    d.text((56,y+10),k,font=font(20,b'Bold'),fill=INK)
    for x,T in ((330,LIGHT),(620,DARK)):
        d.rounded_rectangle((x,y+4,x+60,y+40),10,fill=T[k],outline=LINE); d.text((x+74,y+10),T[k],font=font(19,b'SemiBold'),fill=SEC)
    d.text((910,y+10),u,font=font(19,b'SemiBold'),fill=SEC); y+=rh
y+=30; d.text((56,y),'KONTRAST (WCAG 2.x, kutuda hesaplandı)',font=font(16),fill=ACC); y+=34
for a,b,need,what in PAIRS:
    ca=DARK.get(a,a); cb=DARK.get(b,b); r=cr(ca,cb); rl=cr(LIGHT.get(a,a),LIGHT.get(b,b))
    d.rounded_rectangle((56,y,176,y+28),8,fill=cb); d.text((66,y+3),'Aa',font=font(18),fill=ca)
    d.text((196,y+3),f'{a} / {b}',font=font(18,b'Bold'),fill=INK)
    d.text((560,y+3),f'koyu {r:5.2f}:1',font=font(18,b'Bold'),fill='#6FDCD4' if r>=need else '#F2906F')
    d.text((760,y+3),f'açık {rl:5.2f}:1',font=font(18,b'SemiBold'),fill=SEC)
    d.text((940,y+3),f'hedef ≥{need} · {what}',font=font(17,b'SemiBold'),fill=SEC); y+=34
im=im.crop((0,0,W,y+40)); im.save('rev5-tokens.png'); print('tokens',im.size)
# ---------- adaptation sheet
pairs=[('rev3-yuva','rev5-yuva','Gündüz sahnesi alacakaranlığa döner','Gökyüzü #171A26 · #272230 · #3A2A2E, tepe #4A3431, ufukta sıcak ışık (primary %20). Parıltı ×0.6, tilkiye hafif altın arka ışık.'),
       ('rev3-istek','rev5-istek','Zaten koyu ekran: gece sahnesi aynı','Gece sahnesi değişmez; yalnız açık alt sayfa koyu yüzeye geçer. Kalkan/kristal efektleri ×0.75.'),
       ('rev3-gun7','rev5-gun7','Tam gece ekranı','Renkler aynı (o950–o800). Altın hale .38 yerine .26, parıltı ×0.6, ışık jetonu parlaması .8 yerine .55; karanlık odada göz almaz.')]
tw,th=300,649; gap=24; m=56
W=m*2+6*tw+5*gap+2*40; H=170+th+190
im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
d.text((m,40),'rev 5 · Karanlık modda maskot ve efekt katmanları',font=font(38),fill=INK)
d.text((m,92),'Her çift: solda açık mod (rev 3), sağda karanlık mod (rev 5). Maskot çizimi değişmez; yalnız ışık, opaklık ve sahne değişir.',font=font(20,b'SemiBold'),fill=SEC)
x=m; y=160
def wrap(t,n=56):
    out=[];line=''
    for w in t.split():
        if len(line)+len(w)+1>n: out.append(line); line=w
        else: line=(line+' '+w).strip()
    return out+[line]
for a,b,title,note in pairs:
    for j,n in enumerate((a,b)):
        t=Image.open(n+'.png').convert('RGB').resize((tw,th),Image.LANCZOS)
        mask=Image.new('L',(tw,th),0); ImageDraw.Draw(mask).rounded_rectangle((0,0,tw-1,th-1),22,fill=255)
        xx=x+j*(tw+gap); d.rounded_rectangle((xx-1,y-1,xx+tw,y+th),23,outline=LINE,width=2); im.paste(t,(xx,y),mask)
        d.text((xx+4,y+th+10),'AÇIK' if j==0 else 'KOYU',font=font(15),fill=ACC)
    d.text((x,y+th+36),title,font=font(20),fill=INK)
    for i,l in enumerate(wrap(note)): d.text((x,y+th+66+i*24),l,font=font(17,b'SemiBold'),fill=SEC)
    x+=2*tw+gap+40+gap
im.save('rev5-maskot-efekt.png'); print('fx',im.size)
