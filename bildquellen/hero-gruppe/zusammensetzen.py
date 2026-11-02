# Hero-Gruppe zusammensetzen (Version 2, 2.11.2026, Feedback Antonia):
# Größen nicht mehr über die Bildhöhe, sondern über die gemessene Kopfbreite,
# damit alle Personen derselben Reihe gleich groß wirken. Platzierung über die Kopfoberkante;
# längere Körper laufen unten aus dem Bild (die Website blendet den unteren Rand ohnehin aus).
# Außen stehende Personen etwas weiter außen und höher, damit keine Schulter ein Gesicht verdeckt.
from PIL import Image, ImageEnhance
import numpy as np
from scipy import ndimage

def sauber(p):
    im=Image.open(p).convert('RGBA'); a=np.asarray(im).copy()
    al=a[...,3].astype(int)
    lab,n=ndimage.label(al>40)
    if n>1:
        groes=ndimage.sum(np.ones_like(al),lab,range(1,n+1)); keep=1+int(np.argmax(groes))
        al=np.where(ndimage.binary_dilation(lab==keep,iterations=3),al,0)
    al=np.where(al>=240,255,al); al=np.where(al<20,0,al)
    a[...,3]=al.astype(np.uint8)
    out=Image.fromarray(a,'RGBA'); return out.crop(out.getbbox())

def kopf(im):
    """Kopfoberkante und größte Kopfbreite im oberen Viertel der Silhouette."""
    a=np.asarray(im)[...,3]>128
    top=int(np.argmax(a.any(axis=1)))
    best=0
    for y in range(top,top+int(im.height*0.25)):
        xs=np.where(a[y])[0]
        if len(xs): best=max(best,xs[-1]-xs[0])
    return top,best

leute={n:sauber(n+'.png') for n in ('klima-solar','sanitaer','domenico-freigestellt','heizung','inhaberin')}
W,H=2100,1340
OX=60  # Rand links, damit niemand am Bildrand abgeschnitten wird
unterkanten=[]
can=Image.new('RGBA',(W,H),(0,0,0,0))

# (Name, Ziel-Kopfbreite in px, Kopfmitte x, Kopfoberkante y, Helligkeit)
# Die Inhaberin hat offenes Haar, ihre gemessene Kopfbreite ist dadurch ~10 % größer.
plan=[
    ('klima-solar', 236, 345, 330, 0.95),
    ('inhaberin',   258, 1615, 330, 0.95),
    ('sanitaer',    282, 615, 250, 0.98),
    ('heizung',     282, 1300, 250, 0.98),
    ('domenico-freigestellt', 311, 955, 8, 1.0),
]
for name,kb,cx,ky,hell in plan:
    img=leute[name]; top,breite=kopf(img)
    s=kb/breite; im=img.resize((round(img.width*s),round(img.height*s)),Image.LANCZOS)
    if hell!=1.0:
        rgb=ImageEnhance.Brightness(im.convert('RGB')).enhance(hell); rgb.putalpha(im.getchannel('A')); im=rgb
    # horizontale Kopfmitte in der Figur
    a=np.asarray(im)[...,3]>128; t2,_=kopf(im)
    zeile=np.where(a[t2+int(kb*0.45)])[0]; kopfmitte=(zeile[0]+zeile[-1])/2 if len(zeile) else im.width/2
    x=round(cx-kopfmitte)+OX; y=round(ky-t2)
    unten=y+im.height; unterkanten.append(unten)
    print(f'{name:22s} skala={s:.3f} unterkante={unten} (Bild {H})')
    can.alpha_composite(im,(x,y))
# unten an der kürzesten Figur abschneiden, damit keine Körperkante sichtbar wird
bb=can.getbbox(); can=can.crop((bb[0],bb[1],bb[2],min(min(unterkanten),H)))
print('gesamt',can.size, 'Seitenverhältnis', round(can.width/can.height,3))
can.save('gruppe-komplett.png')
