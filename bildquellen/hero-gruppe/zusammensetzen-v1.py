from PIL import Image, ImageEnhance
import numpy as np
from scipy import ndimage
R='roh/'
def sauber(p):
    im=Image.open(p).convert('RGBA'); a=np.asarray(im).copy()
    al=a[...,3].astype(int)
    lab,n=ndimage.label(al>40)
    if n>1:
        groes=ndimage.sum(np.ones_like(al),lab,range(1,n+1)); keep=1+int(np.argmax(groes))
        maske=ndimage.binary_dilation(lab==keep,iterations=3)
        al=np.where(maske,al,0)
    al=np.where(al>=240,255,al); al=np.where(al<20,0,al)
    a[...,3]=al.astype(np.uint8)
    out=Image.fromarray(a,'RGBA'); return out.crop(out.getbbox())
dom=Image.open('/mnt/user-data/attachments/7e399be2-5ad4-585c-8461-2d70cbc2ce37/037f7fc9-image.png').convert('RGBA')
dom=dom.crop(dom.getbbox())
leute={n:sauber(R+n+'.png') for n in ('sanitaer','heizung','inhaberin','klima-solar')}
for n,i in leute.items(): print(n,i.size)
W,H=2000,1400
can=Image.new('RGBA',(W,H),(0,0,0,0))
def setze(img,hoehe,cx,hell=1.0):
    s=hoehe/img.height; im=img.resize((round(img.width*s),hoehe),Image.LANCZOS)
    if hell!=1.0:
        rgb=ImageEnhance.Brightness(im.convert('RGB')).enhance(hell); rgb.putalpha(im.getchannel('A')); im=rgb
    can.alpha_composite(im,(round(cx-im.width/2),H-im.height))
# hinten außen (kleiner), dann innen, dann Domenico vorn
setze(leute['klima-solar'],960,400,0.95)
setze(leute['inhaberin'],960,1540,0.95)
setze(leute['sanitaer'],1090,645,0.98)
setze(leute['heizung'],1090,1300,0.98)
setze(dom,1340,950)
can=can.crop(can.getbbox())
print('gesamt',can.size)
can.save('gruppe-voll.png')
