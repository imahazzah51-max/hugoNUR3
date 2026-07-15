import socket
import subprocess
import time
import os

PORT = 8890
SERVER_SCRIPT = "server_generator.py" # File utama Flask Anda

def cek_server():
    """Memeriksa apakah port 8890 sudah terbuka."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', PORT)) == 0

def jalankan_server():
    """Mencoba menjalankan kembali server jika mati."""
    print(f"⚠️ [ALWI LOG] Server terdeteksi mati. Mencoba menghidupkan kembali...")
    try:
        # Menjalankan server di background
        subprocess.Popen(['python3', SERVER_SCRIPT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except Exception as e:
        print(f"❌ [ALWI LOG] Gagal menghidupkan server: {e}")
        return False

def monitor():
    print("🤖 [ALWI LOG] Penjaga Server Aktif. Memantau port 8890...")
    while True:
        if not cek_server():
            jalankan_server()
        time.sleep(5) # Cek setiap 5 detik

if __name__ == "__main__":
    monitor()

