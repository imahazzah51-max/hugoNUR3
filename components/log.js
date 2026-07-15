// Tambahkan fungsi ini ke log.js
async function cekStatusServer() {
  try {
    // Mencoba ping ke server (sesuaikan jika ada endpoint /status atau cukup ping saja)
    const response = await fetch('http://localhost:8890/generate', { method: 'HEAD' });
    return "Aktif";
  } catch (e) {
    return "Belum Dibuat";
  }
}

// Modifikasi fungsi kirimPesanKeAlwi atau prosesKatalkunci
// Contoh jika user bertanya tentang server:
if (teks.includes('server')) {
  cekStatusServer().then(status => {
    tambahPesanAlwi(`Status Server Generator: ${status}`);
  });
}

