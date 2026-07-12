// ═══════════════════════════════════════════════════════════════════
// AGEN ALWI - FINALISED RESPONSIVE ICON MATRIX PRODUCTION BUILD
// ═══════════════════════════════════════════════════════════════════

const AGEN_ALWI_CONFIG = {
  nama: 'Agen Alwi',
  emoji: '⛑️',
  warnaUtama: '#06140b',
  warnaBorder: '#c9a84c',
  suara_enabled: true,
  personality: 'ramah-profesional'
};

const MENU_LAYANAN = {
  'nur1': {
    label: '🏠 Nur 1 - INDRAMAYU_CLUB',
    desc: 'Portal Utama & Beranda Makrifat',
    pages: [
      { key: 'live', icon: '📺', label: 'Media Utama', url: 'nur1_media.html' }
    ]
  },
  'nur2': {
    label: '💬 Nur 2 - DASHBOARD SULTAN',
    desc: 'Login, Server Raja & Admin Video',
    pages: [
      { key: 'login', icon: '🔐', label: 'Login Sultan', url: 'nur2_login.html' },
      { key: 'raja', icon: '👑', label: 'Raja Server', url: 'nur2_raja_server.html' },
      { key: 'admin', icon: '📹', label: 'Admin Vidio', url: 'nur2.adminVIDIO.html' }
    ]
  },
  'nur3': {
    label: '📊 Nur 3 - ADMINISTRASI',
    desc: 'Keuangan Pagi (Kas 5% & Voucher)',
    pages: [
      { key: 'keuangan', icon: '💰', label: 'Keuangan Pagi', url: 'nur3_keuangan_pagi.html' }
    ]
  },
  'nur4': {
    label: '🎨 Nur 4 - KREATOR_DIGITAL',
    desc: 'Manajemen Aset Digital',
    pages: [
      { key: 'aset', icon: '💎', label: 'Aset Digital', url: 'nur4_aset_digital.html' }
    ]
  },
  'nur5': {
    label: '🎯 Nur 5 - GAME_ARISAN',
    desc: 'Menu Utama Modul Arisan',
    pages: [
      { key: 'menu', icon: '🎲', label: 'Menu Utama', url: 'nur5_menu_utama.html' }
    ]
  },
  'nur6': {
    label: '💰 Nur 6 - BANK_GAME',
    desc: 'Vault Kas & Admin Keuangan',
    pages: [
      { key: 'adm', icon: '🏦', label: 'Admin Keuangan', url: '03_ADM_KEUANGAN/' }
    ]
  },
  'nur7': {
    label: '🔊 Nur 7 - STREAMING & LIVE',
    desc: 'Live Member, Streaming & Status Panggung',
    pages: [
      { key: 'live', icon: '👥', label: 'Live Member', url: 'nur7b_live_member.html' },
      { key: 'streaming', icon: '📹', label: 'Streaming', url: 'nur7a_streaming.html' },
      { key: 'panggung', icon: '🔥', label: 'Status Panggung', url: 'nur7_panggung_status.html' }
    ]
  },
  'nur8': {
    label: '🌙 Nur 8 - SISTEM & EMULATOR',
    desc: 'Emulator & Pemeliharaan',
    pages: [
      { key: 'emulator', icon: '🕹️', label: 'Emulator', url: 'nur8_emulator.html' }
    ]
  },
  'nur9': {
    label: '🎮 Nur 9 - BACKUP_INDRAMAYU',
    desc: 'cari & Sinkronisasi Sistem',
    pages: [
      { key: 'index', icon: '🔁', label: 'Backup & Sinkron', url: 'nur9/index.html' }
    ]
  },
  'nur10': {
    label: '👑 Nur 10 - PEWARIS_CAHAYA',
    desc: 'Kamus Alwi / Panggung Sultan VVIP',
    pages: [
      { key: 'kamus', icon: '🌟', label: 'Kamus Alwi', url: 'nur10_kamus_alwi.html' }
    ]
  }
};

const JADWAL_AZAN = {
  subuh: { waktu: '04:30', nama: 'Subuh' },
  dzuhur: { waktu: '12:05', nama: 'Dzuhur' },
  ashar: { waktu: '15:35', nama: 'Ashar' },
  maghrib: { waktu: '18:15', nama: 'Maghrib' },
  isya: { waktu: '19:45', nama: 'Isya' }
};

let audioContext = null;
function getAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function playAzanSound() {
  if (!AGEN_ALWI_CONFIG.suara_enabled) return;
  try {
    const ctx = getAudioContext();
    const melodi = [
      { freq: 220, durasi: 0.5 }, { freq: 247, durasi: 0.5 },
      { freq: 294, durasi: 0.5 }, { freq: 330, durasi: 0.5 }, { freq: 392, durasi: 0.8 }
    ];
    let currentTime = ctx.currentTime;
    melodi.forEach(nada => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(nada.freq, currentTime);
      gain.gain.setValueAtTime(0.3, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, currentTime + nada.durasi);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(currentTime); osc.stop(currentTime + nada.durasi);
      currentTime += nada.durasi + 0.1;
    });
  } catch (e) { console.log('Suara azan diblokir browser'); }
}

const GTTS_CONFIG = { lang: 'id', enabled: (localStorage.getItem('ic_alwi_suara') !== 'off'), chunkSize: 180 };
let antrianSuaraGTTS = [];
let sedangBicaraGTTS = false;

function pecahTeksUntukGTTS(teks, maxLen) {
  const bersih = teks.replace(/\n+/g, '. ').replace(/[⛑️🤖🌙✨💰🕌👤🏠📊📖🧮👥👑💬🔐🎯✅🔊🙏😊🌿🎨📹📺🕹️🔍🌟🎲🏦🔥🔁]/g, '');
  const kalimat = bersih.split(/(?<=[.!?])\s+/).filter(k => k.trim().length > 0);
  const potongan = []; let buffer = '';
  kalimat.forEach(k => {
    if ((buffer + ' ' + k).trim().length > maxLen) {
      if (buffer) potongan.push(buffer.trim());
      buffer = k.length > maxLen ? k.slice(0, maxLen) : k;
    } else { buffer = (buffer + ' ' + k).trim(); }
  });
  if (buffer) potongan.push(buffer.trim());
  return potongan;
}

function fallbackSpeechSynthesis(teks, lang) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = lang === 'id' ? 'id-ID' : 'en-US';
    window.speechSynthesis.speak(u);
  }
}

function mainkanAntrianGTTS() {
  if (sedangBicaraGTTS || antrianSuaraGTTS.length === 0) return;
  sedangBicaraGTTS = true;
  const item = antrianSuaraGTTS.shift();
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(item.teks)}&tl=${item.lang}&client=tw-ob`;
  const audio = new Audio(url);
  const lanjut = () => { sedangBicaraGTTS = false; mainkanAntrianGTTS(); };
  audio.onended = lanjut;
  audio.onerror = () => { fallbackSpeechSynthesis(item.teks, item.lang); lanjut(); };
  audio.play().catch(() => { fallbackSpeechSynthesis(item.teks, item.lang); lanjut(); });
}

function bicaraGoogleTTS(teks, lang) {
  if (!GTTS_CONFIG.enabled) return;
  lang = lang || GTTS_CONFIG.lang;
  const potongan = pecahTeksUntukGTTS(teks, GTTS_CONFIG.chunkSize);
  antrianSuaraGTTS = antrianSuaraGTTS.concat(potongan.map(p => ({ teks: p, lang })));
  mainkanAntrianGTTS();
}

function toggleSuaraAlwi() {
  GTTS_CONFIG.enabled = !GTTS_CONFIG.enabled;
  localStorage.setItem('ic_alwi_suara', GTTS_CONFIG.enabled ? 'on' : 'off');
  const btn = document.getElementById('agenAlwiSuaraToggle');
  if (btn) btn.textContent = GTTS_CONFIG.enabled ? '🔊' : '🔇';
  if (!GTTS_CONFIG.enabled) {
    antrianSuaraGTTS = [];
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } else { bicaraGoogleTTS('Suara Agen Alwi aktif.', 'id'); }
}

function renderAgenAlwiBot() {
  if (document.getElementById('agenAlwiContainer')) return;
  const containerHTML = `
    <div id="agenAlwiContainer" style="position: fixed; bottom: 20px; right: 20px; z-index: 9998; font-family: 'Inter', sans-serif;">
      <button id="agenAlwiToggle" onclick="toggleAgenAlwi()" style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #06140b, #0a2e1c); border: 3px solid #c9a84c; color: #ffd700; font-size: 28px; cursor: pointer; box-shadow: 0 4px 20px rgba(201, 168, 76, 0.4); display: flex; align-items: center; justify-content: center;">⛑️</button>
      <div id="agenAlwiWindow" style="display: none; position: absolute; bottom: 90px; right: 0; width: 360px; height: 480px; background: linear-gradient(180deg, #06140b 0%, #0a2e1c 100%); border: 2px solid #c9a84c; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.7); flex-direction: column; z-index: 9999; animation: slideUp 0.4s ease;">
        <div style="background: linear-gradient(135deg, #06140b, #0a2e1c); border-bottom: 2px solid #c9a84c; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 14px 14px 0 0;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">⛑️</span>
            <div>
              <div style="font-size: 14px; font-weight: 900; color: #ffd700;">AGEN ALWI</div>
              <div style="font-size: 10px; color: #c9a84c;">Navigasi Visual Makrifat</div>
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button id="agenAlwiSuaraToggle" onclick="toggleSuaraAlwi()" style="background: transparent; border: 1px solid #c9a84c; color: #ffd700; width: 28px; height: 28px; border-radius: 6px; cursor: pointer;">${GTTS_CONFIG.enabled ? '🔊' : '🔇'}</button>
            <button onclick="toggleAgenAlwi()" style="background: transparent; border: 1px solid #c9a84c; color: #ffd700; width: 28px; height: 28px; border-radius: 6px; cursor: pointer;">✕</button>
          </div>
        </div>
        <div id="agenAlwiChat" style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;" class="alwi-chat-scroll"></div>
        <div style="border-top: 1px solid #c9a84c; padding: 10px; display: flex; gap: 8px;">
          <input type="text" id="agenAlwiInput" placeholder="Ketik (ex: nur7, nur9, menu)..." onkeypress="if(event.key==='Enter') kirimPesanKeAlwi()" style="flex: 1; background: #06140b; border: 1px solid #c9a84c; border-radius: 8px; padding: 10px 12px; color: #ffd700; font-size: 12px; outline: none;" />
          <button onclick="kirimPesanKeAlwi()" style="background: linear-gradient(135deg, #c9a84c, #ffd700); border: none; border-radius: 8px; width: 40px; height: 40px; color: #06140b; cursor: pointer; font-weight: 900;">➔</button>
        </div>
      </div>
    </div>
    <style>
      @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      #agenAlwiWindow.aktif { display: flex !important; }
      .alwi-chat-scroll::-webkit-scrollbar { width: 4px; }
      .alwi-chat-scroll::-webkit-scrollbar-thumb { background: #c9a84c; border-radius: 2px; }
      .alwi-message { display: flex; gap: 8px; margin-bottom: 4px; }
      .msg-user { justify-content: flex-end; }
      .msg-bubble { max-width: 85%; padding: 10px 12px; border-radius: 10px; font-size: 13px; line-height: 1.4; word-wrap: break-word; }
      .msg-alwi .msg-bubble { background: #0a2e1c; border: 1px solid #c9a84c; color: #ffd700; }
      .msg-user .msg-bubble { background: #c9a84c; color: #06140b; font-weight: 600; }
      .alwi-grid-btn { display: flex; gap: 10px; margin-top: 8px; justify-content: flex-start; width: 100%; flex-wrap: wrap; }
      .alwi-icon-btn { flex: 1; min-width: 60px; background: #06140b; border: 1px solid #c9a84c; border-radius: 8px; color: #ffd700; padding: 10px; font-size: 18px; text-align: center; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
      .alwi-icon-btn:hover { background: #c9a84c; color: #06140b; }
      .alwi-icon-btn span { font-size: 9px; font-weight: bold; text-transform: uppercase; }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', containerHTML);
  setTimeout(() => {
    tambahPesanAlwiRaw('Assalamu\'alaikum! Saya Agen Alwi.\n\nSistem navigasi diperbarui ke Mode Ikon Visual yang bersahabat untuk layar HP / Termux sempit. Ketik "menu" atau langsung panggil kode Nur.');
  }, 500);
}

function toggleAgenAlwi() {
  const window_chat = document.getElementById('agenAlwiWindow');
  if (!window_chat) return;
  window_chat.classList.toggle('aktif');
  if (window_chat.classList.contains('aktif')) document.getElementById('agenAlwiInput').focus();
}

function tambahPesanAlwiRaw(teks) {
  const chatDiv = document.getElementById('agenAlwiChat');
  if (!chatDiv) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'alwi-message msg-alwi';
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'msg-bubble';
  bubbleDiv.style.whiteSpace = 'pre-line';
  bubbleDiv.textContent = teks;
  msgDiv.appendChild(bubbleDiv);
  chatDiv.appendChild(msgDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
  bicaraGoogleTTS(teks, 'id');
}

function tambahPesanAlwiDenganIkon(judul, deskripsi, dataPages, keyNur) {
  const chatDiv = document.getElementById('agenAlwiChat');
  if (!chatDiv) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = 'alwi-message msg-alwi';
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'msg-bubble';
  
  let headerHTML = `<div style="font-weight:bold; color:#ffd700; border-bottom:1px solid #c9a84c; padding-bottom:4px; margin-bottom:4px;">${judul}</div>`;
  headerHTML += `<div style="font-size:11px; color:#c9a84c; margin-bottom:8px;">${deskripsi}</div>`;
  
  let gridHTML = '<div class="alwi-grid-btn">';
  dataPages.forEach(p => {
    gridHTML += `
      <div class="alwi-icon-btn" onclick="window.location.href='${p.url}'" title="${p.label}">
        ${p.icon}
        <span>${p.key}</span>
      </div>
    `;
  });
  gridHTML += '</div>';
  
  bubbleDiv.innerHTML = headerHTML + gridHTML;
  msgDiv.appendChild(bubbleDiv);
  chatDiv.appendChild(msgDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
  
  bicaraGoogleTTS(`${judul}. ${deskripsi}. Silakan ketuk ikon menu di layar.`, 'id');
}

function tambahPesanUser(teks) {
  const chatDiv = document.getElementById('agenAlwiChat');
  if (!chatDiv) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'alwi-message msg-user';
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'msg-bubble';
  bubbleDiv.textContent = teks;
  msgDiv.appendChild(bubbleDiv);
  chatDiv.appendChild(msgDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function kirimPesanKeAlwi() {
  const input = document.getElementById('agenAlwiInput');
  const teks = input.value.trim();
  if (!teks) return;
  tambahPesanUser(teks);
  input.value = '';
  setTimeout(() => {
    prosesKatalKunciKomplit(teks.toLowerCase());
  }, 500);
}

function prosesKatalKunciKomplit(teks) {
  if (teks === 'menu' || teks === 'layanan') {
    tambahPesanAlwiRaw('Daftar Ruangan Nur:\n\n' + Object.values(MENU_LAYANAN).map(m => m.label).join('\n') + '\n\nKetik kode Nur untuk membuka panel ikon cepat.');
    return;
  }

  const sortedKeys = Object.keys(MENU_LAYANAN).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (teks === key) {
      const menu = MENU_LAYANAN[key];
      if (menu.pages.length === 1) {
        tambahPesanAlwiRaw(`Mengarahkan otomatis ke ${menu.label}...`);
        setTimeout(() => { window.location.href = menu.pages[0].url; }, 1000);
      } else {
        tambahPesanAlwiDenganIkon(menu.label, menu.desc, menu.pages, key);
      }
      return;
    }

    const menu = MENU_LAYANAN[key];
    const kataKunciSub = menu.pages.find(p => teks === `${key} ${p.key}` || teks === p.key);
    if (kataKunciSub) {
      tambahPesanAlwiRaw(`Mengarahkan ke ${menu.label} - ${kataKunciSub.label}...`);
      setTimeout(() => { window.location.href = kataKunciSub.url; }, 1000);
      return;
    }
  }

  tambahPesanAlwiRaw('Perintah tidak dikenali. Ketik kode lengkap seperti "nur9" atau "menu".');
}

function setupSystemAzan() {
  setInterval(() => {
    const now = new Date();
    const jamSekarang = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    for (const [key, shalat] of Object.entries(JADWAL_AZAN)) {
      if (jamSekarang === shalat.waktu) {
        playAzanSound();
        tambahPesanAlwiRaw(`Waktu shalat ${shalat.nama} untuk wilayah Indramayu tiba. Mari rehat sejenak.`);
        break;
      }
    }
  }, 60000);
}

function inisialisasiAlwiBot() { renderAgenAlwiBot(); setupSystemAzan(); }
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', inisialisasiAlwiBot); } else { inisialisasiAlwiBot(); }
