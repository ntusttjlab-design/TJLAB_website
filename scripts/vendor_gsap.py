"""固定版本並驗證雜湊，僅擷取網站使用的官方動畫檔案。"""
from pathlib import Path
from urllib.request import urlopen
import hashlib
import base64
import io
import json
import tarfile

version = '3.13.0'
root = Path(__file__).resolve().parents[1]
with urlopen(f'https://registry.npmjs.org/gsap/{version}', timeout=30) as response:
    metadata = json.load(response)
with urlopen(metadata['dist']['tarball'], timeout=30) as response:
    archive = response.read()
algorithm, expected = metadata['dist']['integrity'].split('-', 1)
assert algorithm == 'sha512'
assert base64.b64encode(hashlib.sha512(archive).digest()).decode() == expected
destination = root / 'assets/vendor/gsap'
destination.mkdir(parents=True, exist_ok=True)
with tarfile.open(fileobj=io.BytesIO(archive), mode='r:gz') as package:
    for name in ['dist/gsap.min.js', 'dist/ScrollTrigger.min.js']:
        member = package.getmember('package/' + name)
        assert member.isfile()
        content = package.extractfile(member).read()
        (destination / Path(name).name).write_bytes(content)
(destination / 'source.json').write_text(json.dumps({'name':'gsap','version':version,'source':metadata['dist']['tarball'],'integrity':metadata['dist']['integrity'],'license':metadata.get('license'),'licenseUrl':'https://gsap.com/standard-license/'}, indent=2) + '\n', encoding='utf-8')
(destination / 'NOTICE.md').write_text('# GSAP 3.13.0\n\nCopyright GreenSock. Official npm distribution; original license banners preserved.\n\nLicense: https://gsap.com/standard-license/\nSource: https://registry.npmjs.org/gsap/-/gsap-3.13.0.tgz\n\nThis npm archive does not contain a separate LICENSE file. See source.json for the verified package integrity and license metadata.\n', encoding='utf-8')
print('已擷取並驗證 GSAP 3.13.0 與 ScrollTrigger，保留原授權標頭與官方授權連結。')
