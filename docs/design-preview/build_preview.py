from pathlib import Path
import json, shutil
root=Path(__file__).resolve().parent
workspace=root.parents[1]
for original,name in [('istanbul-placeholder.png','istanbul.png'),('tours-placeholder.png','landscape.png'),('coast.png','coast.png')]:
    shutil.copyfile(workspace/'frontend-v2'/'public'/'images'/original,root/'assets'/name)
paths=json.loads((root/'assets'/'map-paths.json').read_text())
(root/'assets'/'map.js').write_text('window.MAP_PATHS='+json.dumps(paths)+';',encoding='utf-8')
css=(root/'product.css').read_text(encoding='utf-8')
js=(root/'design.js').read_text(encoding='utf-8')
source=(root/'index.html').read_text(encoding='utf-8')
source=source.replace('<script src="assets/map.js"></script>','<script>'+('window.MAP_PATHS='+json.dumps(paths)+';')+'</script>')
source=source.replace('<script src="design.js"></script>','<script>window.PRODUCT_CSS='+json.dumps(css)+';</script><script>'+js+'</script>')
(root/'tripline-design-review.html').write_text(source,encoding='utf-8')
print('Built complete offline layout review with '+str(len(paths))+' geographic paths.')
