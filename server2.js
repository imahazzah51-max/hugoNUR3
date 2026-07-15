/**
 * ╔══════════════════════════════════════════════╗
 * ║   INDRAMAYU CLUB — SERVER GCP PUSAT         ║
 * ║   PiramidaGuard v3.2 · NUR Digital Guardian ║
 * ║   Port: 8889                                 ║
 * ║   Admin: Jamhari Dulkohar (IMC-001)          ║
 * ║   WA: 0821-4757-3665                         ║
 * ╚══════════════════════════════════════════════╝
 */

const http     = require('http');
const https    = require('https');
const url      = require('url');
const fs       = require('fs');
const path     = require('path');

const CONFIG = {
  PORT:          8889,
  PEMENANG_FILE: path.join(__dirname, 'pemenang.txt'),
  LOG_FILE:      path.join(__dirname, 'server.log'),
  ADMIN_TOKEN:   'PIRAMIDAGUARD2026',
  ADMIN_WA:       '6282147573665',
  FONNTE_TOKEN:  'uf83HJD_sjak9283JS_Kajs', // <-- Ganti dengan token Fonnte Bapak
  MAX_PEMENANG:  4
};

let daftarPemenang = [];
let infoUndian = {
  minggu: 1,
  tanggal: new Date().toISOString().split('T')[0],
  diupdate_oleh: 'sistem',
  diupdate_at: new Date().toISOString()
};

function loadPemenang() {
  try {
    if (fs.existsSync(CONFIG.PEMENANG_FILE)) {
      const isi  = fs.readFileSync(CONFIG.PEMENANG_FILE, 'utf8');
      const data = JSON.parse(isi);
      daftarPemenang = data.pemenang || [];
      infoUndian     = data.info    || infoUndian;
      log('SISTEM', `Pemenang dimuat: ${daftarPemenang.join(', ')}`);
    }
  } catch(e) { log('ERROR', 'Gagal load pemenang.txt: ' + e.message); }
}

function simpanPemenang() {
  try {
    const data = JSON.stringify({ pemenang: daftarPemenang, info: infoUndian }, null, 2);
    fs.writeFileSync(CONFIG.PEMENANG_FILE, data, 'utf8');
    log('SISTEM', 'Pemenang disimpan ke file');
  } catch(e) { log('ERROR', 'Gagal simpan pemenang.txt: ' + e.message); }
}

function log(tipe, pesan) {
  const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  const baris = `[${waktu}] [${tipe}] ${pesan}`;
  console.log(baris);
  try { fs.appendFileSync(CONFIG.LOG_FILE, baris + '\n'); } catch(e) {}
}

// ══ FUNCTION KIRIM WA VIA FONNTE (YANG SUDAH DIPERBARUI LOG-NYA) ══
function kirimWA(nomor, pesan) {
  const postData = JSON.stringify({
    target: nomor,
    message: pesan,
    countryCode: '62'
  });

  const options = {
    hostname: 'api.fonnte.com',
    path:     '/send',
    method:   'POST',
    headers:  {
      'Authorization': CONFIG.FONNTE_TOKEN,
      'Content-Type':  'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      // Log detail balasan dari server fonnte masuk ke server.log
      log('WA_KIRIM', `→ Ke Nomor: ${nomor} | Status Kirim: ${body}`);
    });
  });

  req.on('error', (e) => {
    log('ERROR', 'Gagal kirim WA: ' + e.message);
  });

  req.write(postData);
  req.end();
}

function prosesPerintahWA(nomor, pesan) {
  const p = pesan.trim().toUpperCase();
  log('WA_MASUK', `Dari ${nomor}: ${pesan}`);

  if (nomor !== CONFIG.ADMIN_WA) {
    kirimWA(nomor, `❌ Akses Ditolak. Hubungi: ${CONFIG.ADMIN_WA}`);
    return;
  }

  if (p.startsWith('PEMENANG ')) {
    const ids = p.replace('PEMENANG ', '').trim().split(/\s+/).filter(x => x.startsWith('M'));
    if (ids.length === 0 || ids.length > CONFIG.MAX_PEMENANG) {
      kirimWA(nomor, `❌ Format salah atau melebihi batas ${CONFIG.MAX_PEMENANG} ID!`);
      return;
    }
    daftarPemenang = ids;
    infoUndian = { minggu: infoUndian.mngku || 1, tanggal: new Date().toISOString().split('T')[0] };
    simpanPemenang();
    kirimWA(nomor, `✅ PANGGUNG UPDATE!\n${daftarPemenang.map((id, i) => `${i+1}. ${id} ✅`).join('\n')}`);
    return;
  }

  if (p === 'CEK PEMENANG') {
    kirimWA(nomor, `🎭 PEMENANG AKTIF:\n${daftarPemenang.map((id, i) => `${i+1}. ${id}`).join('\n')}`);
    return;
  }
  
  if (p === 'RESET PEMENANG') {
    daftarPemenang = []; simpanPemenang();
    kirimWA(nomor, '🔄 Panggung berhasil dikosongkan!');
    return;
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const parsed = url.parse(req.url, true);
  const path_  = parsed.pathname;
  const query  = parsed.query;

  if (path_ === '/cek-izin-streaming' && req.method === 'GET') {
    const id = (query.id || '').toUpperCase();
    const boleh = daftarPemenang.includes(id);
    res.writeHead(200);
    res.end(JSON.stringify({ id, bolehStreaming: boleh }));
    return;
  }

  if (path_ === '/webhook-wa' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const nomor = (data.from || data.sender || '').replace(/\D/g, '');
        const pesan = data.message || data.text || '';
        if (nomor && pesan) prosesPerintahWA(nomor, pesan);
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
      } catch(e) { res.writeHead(400); res.end(); }
    });
    return;
  }
});

loadPemenang();
server.listen(CONFIG.PORT, '0.0.0.0', () => {
  log('SISTEM', `PiramidaGuard Aktif Mengudara di Port ${CONFIG.PORT}`);
});

