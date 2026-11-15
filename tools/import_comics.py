import json
from pathlib import Path
import shutil
import sys
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tmp/pdf-render'))
import fitz
from PIL import Image, ImageDraw
SOURCE = Path('C:/Users/fathu/Downloads/NASA_Space_Apps_All_Missions')
DEST = ROOT / 'dist/assets/comics'
DEST.mkdir(parents=True, exist_ok=True)
entries = [
 ('ALSEP', 'alsep', 'ALSEP', 'Moon'),
 ('Apollo_Lunar_Module', 'apollo-lunar-module', 'Apollo Lunar Module', 'Moon'),
 ('Dawn', 'dawn', 'Dawn', 'Asteroid belt'),
 ('Ingenuity', 'ingenuity', 'Ingenuity', 'Mars'),
 ('Kepler', 'kepler', 'Kepler', 'Deep space'),
 ('Lunar_Roving_Vehicle', 'lunar-roving-vehicle', 'Lunar Roving Vehicle', 'Moon'),
 ('NEAR_Shoemaker', 'near-shoemaker', 'NEAR Shoemaker', 'Asteroid belt'),
 ('Phoenix_and_InSight', 'phoenix-insight', 'Phoenix & InSight', 'Mars'),
 ('Pioneer_10_and_11', 'pioneer-10-11', 'Pioneer 10 & 11', 'Deep space'),
 ('Sojourner_Mars_Pathfinder', 'sojourner-pathfinder', 'Sojourner / Mars Pathfinder', 'Mars'),
 ('Spirit_and_Opportunity', 'spirit-opportunity', 'Spirit & Opportunity', 'Mars'),
 ('Surveyor', 'surveyor', 'Surveyor', 'Moon'),
 ('Viking_1_and_2', 'viking-1-2', 'Viking 1 & 2', 'Mars'),
]
catalog=[]
for folder,slug,title,world in entries:
 item=dict(id=slug,title=title,missions=[slug],world=world)
 for mode in ['comic','story']:
  source=SOURCE/folder/f'{folder}_{mode}.pdf'
  with fitz.open(source) as doc:
   assert len(doc)>0
   doc[0].get_pixmap(matrix=fitz.Matrix(.8,.8),alpha=False).save(DEST/f'{slug}-{mode}.jpg')
   item['pages' if mode=='comic' else 'storyPages']=len(doc)
   print(f'{title} {mode}: {len(doc)} pages',flush=True)
  shutil.copy2(source,DEST/f'{slug}-{mode}.pdf')
  item['pdf' if mode=='comic' else 'storyPdf']=f'assets/comics/{slug}-{mode}.pdf'
  item['cover' if mode=='comic' else 'storyCover']=f'assets/comics/{slug}-{mode}.jpg'
 catalog.append(item)
(ROOT/'dist/js/comics-data.js').write_text('export const comics = '+json.dumps(catalog,indent=2)+';\n',encoding='utf-8')
sheet=Image.new('RGB',(1000,4*330),'white')
draw=ImageDraw.Draw(sheet)
for i,c in enumerate(catalog):
 image=Image.open(ROOT/'dist'/c['cover']); image.thumbnail((235,290))
 x,y=(i%4)*250,(i//4)*330
 sheet.paste(image,(x+(250-image.width)//2,y));draw.text((x+5,y+295),c['title'],fill='black')
sheet.save(ROOT/'tmp/new-comic-covers.jpg')
