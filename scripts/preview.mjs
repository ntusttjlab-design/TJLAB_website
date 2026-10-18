// 僅提供網頁與靜態資源，不公開來源備份與維護資料。
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = '127.0.0.1';
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png'};
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    // 僅供本機部署核對，固定兩個 GAS 來源檔以純文字顯示。
    const reviewFiles={'/__review/Code.gs':'backend/google-apps-script/Code.gs','/__review/Arcade.html':'backend/google-apps-script/Arcade.html'};
    if(Object.hasOwn(reviewFiles,pathname)){
      const data=await fs.readFile(path.join(root,reviewFiles[pathname]));
      response.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});response.end(data);return;
    }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = path.resolve(root, relative);
    if (!((relative === 'index.html' || relative === 'members.html') || relative.startsWith('assets/')) || !file.startsWith(root + path.sep)) { response.writeHead(404); response.end(); return; }
    const data = await fs.readFile(file);
    response.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    response.end(data);
  } catch { response.writeHead(404); response.end(); }
});
server.listen(4173, host, () => console.log(`Local preview: http://${host}:4173`));
