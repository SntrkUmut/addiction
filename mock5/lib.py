import re, json, math
PH='/workspace/phosphor/package/assets'
USED_ICONS={}
def ic(name, color, size=24, weight='regular', where=None):
    f = f'{PH}/{weight}/{name}.svg' if weight=='regular' else f'{PH}/{weight}/{name}-{weight}.svg'
    s=open(f).read(); inner=re.search(r'<svg[^>]*>(.*)</svg>',s,re.S).group(1)
    return f'<svg width="{size}" height="{size}" viewBox="0 0 256 256" fill="{color}" style="flex:none">{inner}</svg>'
from tokens import DARK as _D, DUSK, LIGHT
T=dict(_D)
CSS=f"""
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:390px;height:844px;overflow:hidden;font-family:Nunito,sans-serif;color:{T['ink']};-webkit-font-smoothing:antialiased}}
.screen{{position:relative;width:390px;height:844px;overflow:hidden}}
.abs{{position:absolute}} .row{{display:flex;align-items:center}} .col{{display:flex;flex-direction:column}}
.eyebrow{{font-weight:800;font-size:11px;line-height:14px;letter-spacing:.08em;text-transform:uppercase}}
.display-xl{{font-weight:900;font-size:48px;line-height:52px;letter-spacing:-.02em}}
.display-lg{{font-weight:800;font-size:32px;line-height:38px;letter-spacing:-.015em}}
.title-lg{{font-weight:800;font-size:26px;line-height:32px;letter-spacing:-.01em}}
.title-md{{font-weight:800;font-size:22px;line-height:28px;letter-spacing:-.005em}}
.title-sm{{font-weight:700;font-size:17px;line-height:22px}}
.body-lg{{font-size:16px;line-height:24px}} .body-md{{font-size:14px;line-height:20px}}
.sm-strong{{font-weight:600;font-size:13px;line-height:18px}} .caption{{font-weight:600;font-size:12px;line-height:16px}}
.timer{{font-weight:900;font-size:56px;line-height:60px;letter-spacing:-.02em;font-variant-numeric:tabular-nums}}
.btn{{font-weight:800;font-size:16px;line-height:20px;color:#fff;background:{T['primary']};border-radius:999px;box-shadow:0 4px 0 {T['shadow']};display:flex;align-items:center;justify-content:center;gap:10px;height:56px}}
.btn2{{font-weight:800;font-size:16px;line-height:20px;color:{T['ink']};background:{T['sunken']};border-radius:999px;display:flex;align-items:center;justify-content:center;gap:10px;height:52px}}
.btn-dark{{font-weight:800;font-size:16px;line-height:20px;color:{T['on_dark']};background:rgba(255,254,252,.10);border:1.5px solid rgba(255,254,252,.22);border-radius:999px;display:flex;align-items:center;justify-content:center;height:52px}}
.textbtn{{font-weight:800;font-size:15px;line-height:20px;color:{T['acc_text']};height:44px;display:flex;align-items:center;justify-content:center}}
.chip{{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:6px 12px 6px 6px;font-weight:800;font-size:13px;line-height:18px;height:36px}}
.card{{background:{T['card']};border:1px solid {T['border']};border-radius:24px}}
.tabbar{{position:absolute;left:0;right:0;bottom:0;height:84px;background:{T['card']};border-top:1px solid {T['border']};display:flex;justify-content:space-around;padding-top:10px}}
.tab{{display:flex;flex-direction:column;align-items:center;gap:3px;font-weight:700;font-size:11px;line-height:14px;color:{T['sec']};width:72px}}
.tab .pill{{width:56px;height:30px;border-radius:999px;display:flex;align-items:center;justify-content:center}}
.tab.on{{color:{T['acc_text']}}} .tab.on .pill{{background:{T['hero']}}}
.status{{position:absolute;left:0;right:0;top:0;height:47px;display:flex;justify-content:space-between;align-items:flex-end;padding:0 30px 8px 36px;font-weight:700;font-size:16px}}
.input{{height:64px;border-radius:16px;background:{T['sunken']};display:flex;align-items:center;padding:0 16px;gap:8px}}
"""
def status(dark=False):
    c = '#FFFEFC' if dark else T['ink']
    return f'<div class="status" style="color:{c}"><span>9:41</span><span style="display:flex;gap:6px;align-items:center"><span style="width:18px;height:11px;border-radius:2px;border:1.5px solid {c};opacity:.9"></span></span></div>'
def light_token(size=28, ring=True):
    # THE shared light (ışık) symbol: gold-soft disc + Sparkle fill gold-deep
    return f'<div style="width:{size}px;height:{size}px;border-radius:50%;background:{T["gold_soft"]};{"box-shadow:0 0 0 1.5px "+T["gold"]+";" if ring else ""}display:flex;align-items:center;justify-content:center;flex:none">{ic("sparkle",T["gold_deep"],int(size*0.62),"fill")}</div>'
def light_chip(n, dark=False):
    bg = 'rgba(255,255,255,.10)' if dark else 'rgba(30,34,40,.88);box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)'
    col = T['on_dark'] if dark else T['ink']
    return f'<div class="chip" style="background:{bg};color:{col}">{light_token(24)}{n} ışık</div>'
def day_chip(n, dark=False):
    bg = 'rgba(255,255,255,.10)' if dark else 'rgba(30,34,40,.88);box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)'
    col = T['on_dark'] if dark else T['ink']
    return f'<div class="chip" style="background:{bg};color:{col};padding-left:10px">{ic("path",T["on_dark"] if dark else T["acc_text"],18)}{n}. gün</div>'
def ring(size, stroke, frac, color, track, inner=''):
    r=(size-stroke)/2; C=2*math.pi*r
    return f'''<div style="position:relative;width:{size}px;height:{size}px;flex:none"><svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" style="position:absolute;left:0;top:0"><circle cx="{size/2}" cy="{size/2}" r="{r}" stroke="{track}" stroke-width="{stroke}" fill="none"/>{f'<circle cx="{size/2}" cy="{size/2}" r="{r}" stroke="{color}" stroke-width="{stroke}" fill="none" stroke-linecap="round" stroke-dasharray="{C*frac:.1f} {C:.1f}" transform="rotate(-90 {size/2} {size/2})"/>' if frac>0 else ''}</svg><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column">{inner}</div></div>'''
def scene(h, night=False, horizon_y=None, sparkles=None, fade=False):
    """Shared 'world' backdrop: same gradient sky + horizon hill on every screen. Day = cream/peach, night = obsidian."""
    hy = horizon_y if horizon_y is not None else h-120
    if night:
        sky=f'linear-gradient(180deg,{T["o950"]} 0%,{T["o900"]} 55%,{T["o800"]} 100%)'; hill=T['o700']; hill2=T['o600']
    else:
        sky=f'linear-gradient(180deg,{DUSK["top"]} 0%,{DUSK["mid"]} 55%,{DUSK["low"]} 100%)'; hill=DUSK['hill']; hill2=DUSK['hill2']
    out=f'<div class="abs" style="left:0;top:0;width:390px;height:{h}px;background:{sky};overflow:hidden;{"-webkit-mask-image:linear-gradient(180deg,#000 70%,transparent 100%);" if fade else ""}">'
    if not night: out+=f'<div class="abs" style="left:-40px;top:{hy-70}px;width:470px;height:150px;border-radius:50%;background:radial-gradient(ellipse,{DUSK["glow"]},rgba(200,79,46,0) 70%)"></div>'
    out+=f'<div class="abs" style="left:-80px;top:{hy}px;width:550px;height:260px;border-radius:50%;background:{hill}"></div>'
    out+=f'<div class="abs" style="left:50px;top:{hy+22}px;width:290px;height:54px;border-radius:50%;background:{hill2};opacity:.75"></div>'
    if sparkles: out+=f'<img class="abs" src="assets/fx_sparkles@2x.png" style="left:{sparkles[0]}px;top:{sparkles[1]}px;width:{sparkles[2]}px;opacity:{sparkles[3]*FX_MULT["fx_sparkles"]:.2f}">'
    return out+'</div>'
LAYERS={}
_cur=[None]
FX_MULT={'fx_sparkles':0.6,'fx_shield':0.75,'fx_crystals':0.75,'fx_bubbles':0.8,'fx_breath_ring':0.85}  # fx_smoke: never used (no smoke imagery)
def img(src,x,y,w,op=1,extra=''):
    op=round(op*FX_MULT.get(src,1),2)
    LAYERS.setdefault(_cur[0],[]).append(dict(src=src,x=x,y=y,w=w,op=op))
    pre=''
    if src.startswith('fox_'):
        g=w*1.15; pre=f'<div class="abs" style="left:{x+w/2-g/2:.0f}px;top:{y+w*0.42-g/2:.0f}px;width:{g:.0f}px;height:{g:.0f}px;border-radius:50%;background:radial-gradient(circle,rgba(217,172,88,.13),rgba(217,172,88,0) 65%)"></div>'
        extra+='filter:brightness(.96) saturate(.96);'
    return pre+f'<img class="abs" src="assets/{src}@2x.png" style="left:{x}px;top:{y}px;width:{w}px;opacity:{op};{extra}">'
def tabbar(active):
    items=[('house','Yuva'),('tent','Sığınak'),('path','Rotam'),('user-circle','Ben')]
    h='<div class="tabbar">'
    for n,l in items:
        on=l==active; col=T['acc_text'] if on else T['sec']
        h+=f'<div class="tab {"on" if on else ""}"><div class="pill">{ic(n,col,24,"fill" if on else "regular")}</div>{l}</div>'
    return h+'</div>'
def closebtn(dark=True):
    return f'<div style="width:44px;height:44px;border-radius:50%;background:{T["o700"] if dark else T["sunken"]};display:flex;align-items:center;justify-content:center">{ic("x",T["on_dark"] if dark else T["ink"],22)}</div>'
PAGES=[]
SUBS=[('rgba(248,246,241,0)','rgba(20,23,27,0)'),('rgba(232,226,216,.7)','rgba(53,60,70,.7)'),('#D6CEC2','#0F1215'),
 ('#8A8F88','#8C8F87'),('#A9ADA6','#7E8279'),('rgba(92,56,36,.10)','rgba(0,0,0,.32)'),('rgba(92,56,36,.08)','rgba(0,0,0,.28)'),
 ('border-color:#EFE2BE','border-color:#4A3E26'),('border:2px solid #fff','border:2px solid #1E2228'),('rgba(20,23,27,.45)','rgba(0,0,0,.62)'),
 ('<span class="caption" style="color:#fff">','<span class="caption" style="color:#14171B">'),('rgba(217,172,88,.38)','rgba(217,172,88,.26)'),('rgba(217,172,88,.32)','rgba(217,172,88,.22)'),('rgba(217,172,88,.8)','rgba(217,172,88,.55)')]
def _dark(body):
    for a,b in SUBS: body=body.replace(a,b)
    body=re.sub(r'rgba\(255,254,252,(\.\d+)\)', r'rgba(30,34,40,\1)', body)
    # inverted surfaces (ink background) need dark text in dark mode
    prev=None
    while prev!=body:
        prev=body; body=re.sub(r'(background:#F3EFE8(?:(?!</div>).)*?)color:#fff\b', r'\1color:#14171B', body, flags=re.S)
    return body
NAME=lambda n: re.sub(r'^rev[34]-','rev5-',n)
def page(name, body, title=''):
    name=NAME(name); body=_dark(body)
    PAGES.append((name,title))
    html=f'<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="screen">{body}</div></body></html>'
    open(f'/workspace/addiction-figma/mock5/{name}.html','w').write(html)
def start(name): _cur[0]=NAME(name)
