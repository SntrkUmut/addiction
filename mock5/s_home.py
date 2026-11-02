from lib import *
def quest(done, icon_html, title, sub, tile_bg):
    bg = f'background:{T["gold_soft"]}' if done else f'border:1.5px solid {T["border"]}'
    tok = light_token(26) if done else f'<div style="opacity:.45">{light_token(26)}</div>'
    return f'''<div class="row" style="gap:12px;padding:12px 14px;border-radius:20px;{bg};height:68px">
    <div style="width:44px;height:44px;border-radius:14px;background:{tile_bg};display:flex;align-items:center;justify-content:center;flex:none">{icon_html}</div>
    <div class="col" style="flex:1"><div class="title-sm">{title}</div><div class="caption" style="color:{T['sec']}">{sub}</div></div>
    <div class="row" style="gap:4px"><span class="caption" style="color:{T['sec']};font-weight:800">+1</span>{tok}</div></div>'''
def stat(icon, val, cap, muted=False):
    return f'''<div class="card row" style="flex:1;min-width:0;padding:12px 14px;gap:10px;border-radius:20px;height:64px">
    <div style="width:36px;height:36px;border-radius:12px;background:{T['acc_soft']};display:flex;align-items:center;justify-content:center">{ic(icon,T['acc_text'],20)}</div>
    <div class="col" style="flex:1;min-width:0"><div class="title-sm" style="color:{T['sec'] if muted else T['ink']}">{val}</div><div class="caption" style="color:{T['sec']};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{cap}</div></div></div>'''
def yuva(name, pack=True):
    start(name)
    b = scene(380, horizon_y=268, sparkles=(55,96,280,.5))
    b += status()
    b += f'<div class="abs row" style="left:20px;right:20px;top:54px;justify-content:space-between">{day_chip(12)}{light_chip(7)}</div>'
    b += f'<div class="abs" style="left:22px;top:104px;width:190px;background:{T["card"]};border-radius:20px 20px 20px 6px;padding:11px 14px;box-shadow:0 6px 18px rgba(92,56,36,.10)"><div class="sm-strong">Bugün nasıl gidiyor? Kısa bir check-in yeter.</div></div>'
    b += img('fox_idle',100,118,200)
    b += f'''<div class="abs col" style="left:0;right:0;top:340px;bottom:0;background:{T['canvas']};border-radius:32px 32px 0 0;padding:20px 20px 0;gap:8px">
      <div class="row" style="justify-content:space-between;height:48px">
        <div class="col"><div class="eyebrow" style="color:{T['acc_text']}">Bugün</div><div class="title-md">Küçük adımların</div></div>
        {ring(48,6,.5,T['gold'],T['border'],f'<span class="caption" style="font-weight:800">1/2</span>')}
      </div>
      <div style="height:4px"></div>
      {quest(True, ic('check-circle',T['gold_deep'],26,'fill'), 'Günlük check-in', 'Bugünün ışığı yandı', T['card'])}
      {quest(False, ic('wind',T['teal_deep'],24), 'Bir destek oturumu', 'Her oturum 1 ışık', T['teal_soft'])}
      <div class="row" style="gap:10px;margin-top:4px">{stat('prohibit','168','içilmeyen')}{stat('coins','₺840','cebinde kalan') if pack else stat('coins','—','Paketi ekle', True)}</div>
      <div class="btn" style="margin-top:6px">{ic('waves','#FFFFFF',22)}Şu an bir istek var</div>
    </div>'''
    b += tabbar('Yuva')
    page(name, b)
yuva('rev3-yuva'); yuva('rev3-yuva-paket-yok', pack=False)

# ---- Sığınak (path) ----
start('rev3-siginak')
def node(cx,y,icon,state,size=68):
    x=cx-size//2
    if state=='done':
        return f'<div class="abs" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;border-radius:50%;background:{T["primary"]};box-shadow:0 6px 0 {T["shadow"]};display:flex;align-items:center;justify-content:center">{ic(icon,"#FFFFFF",30)}</div>'
    if state=='next':
        return f'''<div class="abs" style="left:{x-10}px;top:{y-10}px;width:{size+20}px;height:{size+20}px">{ring(size+20,5,7/8,T['gold'],T['border'])}</div>
        <div class="abs" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;border-radius:50%;background:{T["gold_soft"]};border:3px solid {T["gold"]};box-shadow:0 6px 0 {T["gold_edge"]};display:flex;align-items:center;justify-content:center">{ic(icon,T["gold_deep"],30)}</div>'''
    return f'<div class="abs" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;border-radius:50%;background:{T["border"]};box-shadow:0 6px 0 #D6CEC2;display:flex;align-items:center;justify-content:center">{ic("lock-simple","#8A8F88",26)}</div>'
pts=[(204,246,'house-simple','done'),(130,334,'lamp','done'),(104,422,'armchair','done'),(186,512,'grid-four','next'),(272,612,'plant','lock')]
dash=' '.join(f'{"M" if i==0 else "L"}{p[0]} {p[1]+34}' for i,p in enumerate(pts))
b = f'<div class="abs" style="inset:0;background:{T["canvas"]}"></div>' + scene(250, horizon_y=176, sparkles=(70,10,260,.45), fade=True) + status()
b += f'<div class="abs row" style="left:20px;right:20px;top:54px;justify-content:space-between"><div class="title-lg">Sığınağın</div>{light_chip(7)}</div>'
b += f'<div class="abs caption" style="left:20px;top:92px;color:{T["ink"]}">Her 2 ışık yolda yeni bir durak açar.</div>'
b += f'''<div class="abs card col" style="left:20px;right:20px;top:120px;padding:14px 16px;gap:8px;box-shadow:0 6px 18px rgba(92,56,36,.08)">
  <div class="row" style="justify-content:space-between"><div class="col"><div class="eyebrow" style="color:{T['acc_text']}">Bölüm 1 · Temel</div><div class="title-sm">Sığınağın ilk odası</div></div><div class="caption" style="color:{T['sec']}">3 / 6 parça</div></div>
  <div style="height:10px;border-radius:999px;background:{T['sunken']}"><div style="width:50%;height:10px;border-radius:999px;background:{T['gold']}"></div></div></div>'''
b += f'<svg class="abs" style="left:0;top:0" width="390" height="844"><path d="{dash}" stroke="{T["tc300"]}" stroke-width="6" stroke-dasharray="2 12" stroke-linecap="round" fill="none"/></svg>'
b += ''.join(node(*p) for p in pts)
labels=[(250,268,'Sığınak temeli',T['sec']),(0,360,'Sıcak ışıklar',T['sec']),(150,446,'Dinlenme köşesi',T['sec']),(310,640,'Yeşil köşe',T['ter'])]
b += ''.join(f'<div class="abs caption" style="left:{x}px;top:{y}px;color:{c}">{t}</div>' if x else f'<div class="abs caption" style="left:0;width:88px;text-align:right;top:{y}px;color:{c}">{t}</div>' for x,y,t,c in labels)
b += f'<div class="abs row" style="left:140px;top:472px;gap:6px;background:{T["ink"]};color:#fff;border-radius:12px;padding:5px 10px 5px 5px">{light_token(20,False)}<span class="caption" style="color:#fff">Pencere · 1 ışık kaldı</span></div>'
b += img('fox_happy',252,494,116)
b += f'<div class="abs row" style="left:20px;right:20px;top:696px;gap:10px;padding:10px 14px;border-radius:16px;background:{T["sunken"]}">{ic("heart",T["acc_text"],18)}<div class="caption" style="color:{T["sec"]}">Kayma yolu geri sarmaz; açtığın duraklar hep yerinde kalır.</div></div>'
b += tabbar('Sığınak')
page('rev3-siginak', b)
json.dump(LAYERS, open('layers_home.json','w'))
