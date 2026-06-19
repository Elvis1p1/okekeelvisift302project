const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const port = process.env.PORT || 8000;

const mime = {
  '.html':'text/html',
  '.js':'application/javascript',
  '.css':'text/css',
  '.json':'application/json',
  '.pdf':'application/pdf',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.svg':'image/svg+xml'
};

const server = http.createServer((req,res)=>{
  const reqUrl = decodeURI(req.url.split('?')[0]);
  let filePath = path.join(root, reqUrl === '/' ? 'index.html' : reqUrl);
  if(!filePath.startsWith(root)){
    res.statusCode = 403; res.end('Forbidden'); return;
  }
  fs.stat(filePath,(err,stats)=>{
    if(err){ res.statusCode = 404; res.end('Not Found'); return; }
    if(stats.isDirectory()) filePath = path.join(filePath,'index.html');
    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    const stream = fs.createReadStream(filePath);
    stream.on('error',()=>{ res.statusCode=500; res.end('Server Error'); });
    stream.pipe(res);
  });
});

server.listen(port,()=>console.log(`Static server running on http://localhost:${port}`));