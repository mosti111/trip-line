from pathlib import Path
import json, urllib.request
import pypdfium2 as pdfium

root=Path(__file__).resolve().parent
assets=root/'assets'; assets.mkdir(exist_ok=True)
# Render a bounded region of the original PDF rather than generating a new logo.
doc=pdfium.PdfDocument(r'C:\Users\mosta\Downloads\بروفايل-1.pdf')
page=doc[0]; w,h=page.get_size()
left,top,right,bottom=.385*w,.089*h,.620*w,.213*h
bitmap=page.render(scale=3,crop=(left,h-bottom,w-right,top))
bitmap.to_pil().save(assets/'profile-logo.png')
url='https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
data=json.load(urllib.request.urlopen(url,timeout=30))
paths=[]
for f in data['features']:
    g=f['geometry']; polys=[g['coordinates']] if g['type']=='Polygon' else g['coordinates']
    for poly in polys:
        ring=poly[0]
        if not any(-20<=p[0]<=145 and -15<=p[1]<=65 for p in ring): continue
        points=[((p[0]+20)*5,(65-p[1])*5) for p in ring]
        paths.append('M'+'L'.join(f'{x:.1f},{y:.1f}' for x,y in points)+'Z')
(assets/'map-paths.json').write_text(json.dumps(paths),encoding='utf-8')
print('Prepared original PDF logo region and Natural Earth vector paths:',len(paths))
