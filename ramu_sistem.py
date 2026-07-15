import os
import hashlib
import subprocess

def bersihkan_dan_rapikan():
    print("⚡ [Sirkuit Indramayu Club] Memulai proses penyaringan otomatis...")
    
    # 1. Deteksi file duplikat berdasarkan sidik jari digital (Hash)
    daftar_hash = {}
    file_terhapus = 0
    
    # Berkas penting yang mutlak tidak boleh dihapus meskipun ada kemiripan
    berkas_keramat = ['index.html', 'README.md', 'env.json']
    
    for root, dirs, files in os.walk("."):
        # Abaikan folder internal Git
        if ".git" in root:
            continue
            
        for file in files:
            # Lewati skrip ini sendiri
            if file == "ramu_sistem.py":
                continue
                
            jalur_berkas = os.path.join(root, file)
            
            try:
                with open(jalur_berkas, "rb") as f:
                    isi_hash = hashlib.md5(f.read()).hexdigest()
                
                if isi_hash in daftar_hash:
                    nama_file_kembar = daftar_hash[isi_hash]
                    # Pastikan berkas keramat aman
                    if file not in berkas_keramat:
                        print(f"🗑️  Menghapus duplikat: {jalur_berkas} (Isi sama dengan {nama_file_kembar})")
                        os.remove(jalur_berkas)
                        file_terhapus += 1
                else:
                    daftar_hash[isi_hash] = file
            except Exception as e:
                print(f"⚠️  Gagal memeriksa {file}: {e}")

    print(f"🟢 Pembersihan selesai. Total file sampah/duplikat dihapus: {file_terhapus}")

    # 2. Amankan .gitignore agar log dan cache tidak mengotori Git
    fitur_abaikan = ["*.log", "__pycache__/", ".env", "ramu_sistem.py"]
    with open(".gitignore", "a+") as gitignore:
        gitignore.seek(0)
        konten = gitignore.read()
        for item in fitur_abaikan:
            if item not in konten:
                gitignore.write(f"{item}\n")
                print(f"🔒 Menambahkan {item} ke dalam sirkuit proteksi .gitignore")

if __name__ == "__main__":
    bersihkan_dan_rapikan()

