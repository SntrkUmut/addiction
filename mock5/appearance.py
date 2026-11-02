# rev 5.1: Ben > Deneyim > Görünüm (Sistem / Açık / Koyu) segmented control. Shared by mock5 (dark) and mock4 (light).
def appearance_row(T, ic, sel='Sistem', last=False):
    segs = ''
    for name, icon in (('Sistem', 'circle-half'), ('Açık', 'sun'), ('Koyu', 'moon')):
        on = name == sel
        style = (f'background:{T["card"]};color:{T["ink"]};box-shadow:0 1px 3px rgba(0,0,0,.18);font-weight:800' if on
                 else f'background:transparent;color:{T["sec"]};font-weight:700')
        segs += (f'<div role="radio" aria-checked="{str(on).lower()}" style="flex:1;height:32px;border-radius:9px;display:flex;align-items:center;'
                 f'justify-content:center;gap:6px;font-size:13px;{style}">{ic(icon, T["ink"] if on else T["sec"], 15)}{name}</div>')
    return f'''<div class="col" style="padding:10px 14px 12px;gap:10px;{'' if last else 'border-bottom:1px solid '+T['border']}">
      <div class="row" style="gap:12px">
        <div style="width:36px;height:36px;border-radius:12px;background:{T['acc_soft']};display:flex;align-items:center;justify-content:center;flex:none">{ic('circle-half',T['acc_text'],20)}</div>
        <div class="col" style="flex:1;min-width:0"><div class="sm-strong" style="font-size:15px;line-height:20px;font-weight:700;color:{T['ink']}">Görünüm</div>
        <div class="caption" style="color:{T['sec']}">Sistem, telefonunun ayarını izler.</div></div></div>
      <div role="radiogroup" aria-label="Görünüm" style="display:flex;gap:2px;padding:3px;border-radius:12px;background:{T['sunken']}">{segs}</div>
    </div>'''
