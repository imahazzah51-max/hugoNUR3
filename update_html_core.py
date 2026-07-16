import os
import zipfile
from pathlib import Path
import re

IGNORE = {'.git', 'node_modules', '__pycache__', '.krabby', 'Nur8'}
ROOT = Path(".")
ZIP_NAME = "hugoNUR3_no_comment.zip"

# TAMBAHAN FILTER BENTENG
BLACKLIST_FILE = {'.env', '.gitignore', 'package.json', 'package-lock.json', ZIP_NAME, "update_html_core.py"}
BLACKLIST_EXT = {'.xlsx', '.py', '.js', '.json', '.log', '.mp4', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.y', '.jsy', '.htmly'}

def get_all_html():
    files = []
    for p in ROOT.rglob("*.html"):
        if any(x in p.parts for x in IGNORE):
            continue
        # skip file typo htmly
        if p.suffix not in ['.html']:
            continue
        files.append(p)
    return files

def bersihkan_dan_suntik_radar(html_file, core_path):
    try:
        text = html_file.read_text(encoding='utf-8', errors='ignore')
        updated = False

        # --- SEKTOR 1: HANCURKAN KOMENTAR ---
        if 'bukaPopup()' in text or 'btn-komentar' in text or 'popup-komen' in text:
            text = re.sub(r'<button[^>]*btn-komentar.*?</button>', '', text, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'<div[^>]*popup-komen.*?</div>\s*</div>', '', text, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'<div[^>]*id="popupKomentar".*?</div>\s*</div>', '', text, flags=re.DOTALL | re.IGNORECASE)
            updated = True

        # --- SEKTOR 2: RADAR NUR ---
        if 'radar.js' not in text:
            level = len(html_file.relative_to(ROOT).parts) - 1
            prefix = "../" * level if level > 0 else "./"
            radar_script = f'\n  <script src="{prefix}03_ADM_KEUANGAN/radar.js"></script>\n</head>'
            if '</head>' in text:
                text = text.replace('</head>', radar_script)
                updated = True

        if updated:
            html_file.write_text(text, encoding='utf-8')
            print(f"🛰️ [SINKRONISASI RADAR & CLEAN COMPLETED]: {html_file}")

    except Exception as e:
        print(f"❌ Gagal memproses {html_file}: {e}")

def update_core():
    core_path = ROOT / "index.html"
    if not core_path.exists():
        print("🚨 index.html utama di root tidak ditemukan!")
        return
    print(f"🎬 [NUR_ENGINE] Memulai pemindaian dan penyelarasan sektor HTML...")
    for html_file in get_all_html():
        bersihkan_dan_suntik_radar(html_file, core_path)

def zip_project():
    print(f"\n📦 [PENGEMASAN BENTENG STERIL] Menyusun {ZIP_NAME}...")
    html_files = get_all_html()
    
    with zipfile.ZipFile(ZIP_NAME, 'w', zipfile.ZIP_DEFLATED) as z:
        # 1. Masukkan semua HTML bersih
        for html_file in html_files:
            # Pastikan nama file tidak masuk blacklist eksplisit
            if html_file.name in BLACKLIST_FILE:
                continue
            z.write(html_file)

        # 2. Masukkan aset wajib radar biar gak error 404
        radar = ROOT / "03_ADM_KEUANGAN" / "radar.js"
        if radar.exists():
            z.write(radar)
            
    print(f"🏁 [STATUS SYSTEM: CONNECTED]: {ZIP_NAME} STERIL berhasil diluncurkan tanpa sistem komentar!")
    print(f"   -> Isi: {len(html_files)} file HTML + radar.js (tanpa .env/.xlsx/.py)")

if __name__ == "__main__":
    update_core()
    zip_project()
