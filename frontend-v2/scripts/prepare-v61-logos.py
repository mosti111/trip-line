"""Mechanical optical crops of the client's existing raster marks; no redraw/recolor."""
from pathlib import Path
from collections import deque
import hashlib,json
from PIL import Image,ImageChops
root=Path(__file__).resolve().parents[1]
inventory=root/'public/brand/network/inventory.json'
records=json.loads(inventory.read_text(encoding='utf-8'))['records']
out=root/'public/brand/network/optical'
out.mkdir(exist_ok=True)
proof=[]
for record in records:
    source=root/'public'/record['localAsset'].lstrip('/')
    image=Image.open(source).convert('RGBA')
    # Only the connected outside white matte becomes transparent. Interior white
    # symbol details and every retained RGB pixel remain exactly source-authentic.
    pixels=image.load();w,h=image.size
    pending=deque([(x,0) for x in range(w)]+[(x,h-1) for x in range(w)]+[(0,y) for y in range(h)]+[(w-1,y) for y in range(h)])
    seen=set()
    while pending:
        x,y=pending.popleft()
        if (x,y) in seen:continue
        seen.add((x,y))
        r,g,b,a=pixels[x,y]
        if min(r,g,b)<242 or max(r,g,b)-min(r,g,b)>10:continue
        pixels[x,y]=(r,g,b,0)
        if x:pending.append((x-1,y))
        if x<w-1:pending.append((x+1,y))
        if y:pending.append((x,y-1))
        if y<h-1:pending.append((x,y+1))
    box=image.getchannel('A').getbbox()
    if not box:raise ValueError(record['id'])
    image=image.crop(box)
    target=out/(record['id']+'.png');image.save(target)
    proof.append({'id':record['id'],'original':record['localAsset'],'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'crop':box,'output':'/brand/network/optical/'+target.name,'size':image.size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'operation':'Connected outer white matte removed; optical crop; retained RGB unchanged'})
(out/'provenance.json').write_text(json.dumps({'originalInventorySha256':hashlib.sha256(inventory.read_bytes()).hexdigest(),'records':proof},indent=2)+'\n',encoding='utf-8')
print('Prepared',len(proof),'source-faithful optical crops')
