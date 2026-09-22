import concurrent.futures, csv, hashlib, json, re, time, urllib.request, urllib.parse, xml.etree.ElementTree as ET, subprocess
from pathlib import Path
from html.parser import HTMLParser

BASE='https://irworldview.jhyip.com'
OUT=Path('/private/tmp/ir-final-audit-20260919/evidence/http')
OUT.mkdir(exist_ok=True)
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.text=[]; self.ignore=0; self.inmain=False; self.h1=[]; self.title=[]; self.tag=''
    def handle_starttag(self,tag,attrs):
        d=dict(attrs); self.tag=tag
        if tag in ['script','style']: self.ignore+=1
        if tag=='a' and d.get('href'): self.links.append(d['href'])
    def handle_endtag(self,tag):
        if tag in ['script','style']: self.ignore=max(0,self.ignore-1)
        self.tag=''
    def handle_data(self,s):
        s=s.strip()
        if s and not self.ignore:
            self.text.append(s)
            if self.tag=='title': self.title.append(s)
            if self.tag=='h1': self.h1.append(s)
def run(path):
    start=time.monotonic(); url=BASE+path; row={'path':path}
    try:
        result=subprocess.run(['curl','-sS','-L','--max-time','22','-w','\n%{http_code}\n%{url_effective}',url],capture_output=True,timeout=25)
        if result.returncode: raise RuntimeError(result.stderr.decode('utf8','replace'))
        raw,status,final_url=result.stdout.rsplit(b'\n',2)
        html=raw.decode('utf8','replace'); parser=Page(); parser.feed(html)
        key=hashlib.sha256(path.encode()).hexdigest()[:16]
        (OUT/(key+'.html')).write_text(html); (OUT/(key+'.txt')).write_text('\n'.join(parser.text))
        row.update(status=int(status),final_url=final_url.decode(),bytes=len(raw),seconds=round(time.monotonic()-start,2),title=' '.join(parser.title),h1=' | '.join(parser.h1),words=len(' '.join(parser.text).split()),artifact=key,links=parser.links,cache_control=None,referrer_policy=None)
    except Exception as e: row.update(status='error',error=str(e),seconds=round(time.monotonic()-start,2),links=[])
    return row
root=ET.parse('/private/tmp/ir-final-audit-20260919/evidence/live-sitemap.xml').getroot()
paths={urllib.parse.urlparse(x.text).path for x in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')}
paths.update(['/learn','/beta','/quiz/review','/ai/quiz','/ai/review','/compare','/results/invalid-audit','/profile/share/invalid-audit','/ai/results/invalid-audit','/modules/security/results/invalid-audit','/perspectives/invalid-audit/result/invalid-audit','/audit-page-does-not-exist','/zh/ai','/zh/decisions','/zh/futures'])
done={}
for wave in range(4):
    todo=sorted(paths-set(done))
    if not todo:break
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for row in pool.map(run,todo):
            done[row['path']]=row
            for href in row['links']:
                u=urllib.parse.urlparse(urllib.parse.urljoin(BASE+row['path'],href))
                if u.netloc=='irworldview.jhyip.com' and not u.path.startswith(('/api/','/_next/')) and not re.search(r'\.(?:pdf|png|jpg|svg|webp|json|xml|css|js|woff2?)$',u.path) and len(u.path)<250:
                    paths.add(u.path or '/')
            (OUT/'routes.json').write_text(json.dumps(list(done.values()),ensure_ascii=False,indent=2))
    print(json.dumps({'wave':wave,'visited':len(done),'pending':len(paths-set(done))}),flush=True)
    if len(paths)>260:break
fields=['path','status','title','h1','words','bytes','seconds','artifact','final_url','cache_control','referrer_policy','error']
with (OUT/'routes.csv').open('w') as f:
    w=csv.DictWriter(f,fields,extrasaction='ignore');w.writeheader();w.writerows(sorted(done.values(),key=lambda r:r['path']))
print(json.dumps({'routes':len(done),'status_counts':{str(k):sum(r['status']==k for r in done.values()) for k in set(r['status'] for r in done.values())}},sort_keys=True))
