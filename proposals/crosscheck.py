U=['','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];Te=['','on','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan']
def spell(n):
    w=[]
    if n>=1000: th=n//1000; w+=([] if th==1 else spell(th).split())+['bin']; n%=1000
    if n>=100: h=n//100; w+=([] if h==1 else [U[h]])+['yüz']; n%=100
    if n>=10: w.append(Te[n//10]); n%=10
    if n: w.append(U[n])
    return ' '.join(w)
def abl(word):
    v=[c for c in word if c in 'aıoueiöü'][-1]; e='a' if v in 'aıou' else 'e'
    d='t' if word[-1] in 'fstkçşhp' else 'd'
    return d+e+'n'
import json
res={y:abl(spell(y).split()[-1]) for y in range(1,3000)}
json.dump(res,open('/tmp/py_abl.json','w'))
print(spell(2026),res[2026],spell(2100),res[2100])
