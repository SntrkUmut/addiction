from lib import *
def fog(top, h=150):
    blobs=''.join(f'<div class="abs" style="left:{x}px;top:{y}px;width:{w}px;height:{hh}px;border-radius:50%;background:rgba(44,50,58,{o});filter:blur(16px)"></div>' for x,y,w,hh,o in [(-40,10,220,70,.9),(120,0,240,80,.85),(250,20,200,70,.9),(-20,60,260,90,.95),(170,70,260,90,.95)])
    return f'''<div class="abs" style="left:0;right:0;top:{top}px;height:{h}px;overflow:visible">
      <div class="abs" style="inset:0;background:linear-gradient(to bottom, rgba(248,246,241,0), {T['canvas']} 55%)"></div>{blobs}</div>'''
def teaser(top, eyebrow, title, sub, icon, cx=None):
    return f'''<div class="abs col" style="left:20px;right:20px;top:{top}px;align-items:center;gap:4px;text-align:center">
      <div style="width:52px;height:52px;border-radius:50%;background:rgba(232,226,216,.7);border:2px dashed {T['tc300']};display:flex;align-items:center;justify-content:center;opacity:.9">{ic(icon,'#8A8F88',24)}</div>
      <div class="row" style="gap:6px;margin-top:4px">{ic('cloud-fog',T['sec'],16)}<span class="eyebrow" style="color:{T['sec']}">{eyebrow}</span></div>
      <div class="sm-strong" style="font-weight:800;color:{T['ink']}">{title}</div>
      <div class="caption" style="color:{T['sec']}">{sub}</div></div>'''
def iconbtn(icon):
    return f'<div style="width:40px;height:40px;border-radius:50%;background:rgba(255,254,252,.9);border:1px solid {T["border"]};display:flex;align-items:center;justify-content:center">{ic(icon,T["acc_text"],20)}</div>'
