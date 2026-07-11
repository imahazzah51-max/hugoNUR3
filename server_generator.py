from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import subprocess
import os

# 1. Tentukan BASE_DIR dulu
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASET_DIR = os.path.join(BASE_DIR, '03_ADM_KEUANGAN')

# 2. INISIALISASI 'app' DI SINI (Ini yang hilang/terbalik di kode Anda)
app = Flask(__name__, template_folder='.')
CORS(app)


@app.route('/generate')
def generate():
    try:
        script_path = os.path.join(BASE_DIR, '03_ADM_KEUANGAN', 'Video_generator.py')
        if not os.path.isfile(script_path):
            return jsonify({"status": "error", "message": f"File tidak ditemukan: {script_path}"}), 404

        hasil = subprocess.run(
            ['/data/data/com.termux/files/usr/bin/python3', script_path],
            check=True,
            capture_output=True,
            text=True
        )
        print(hasil.stdout)
        return jsonify({"status": "sukses", "message": "Video berhasil dibuat!"})
    except subprocess.CalledProcessError as e:
        # Menangani error jika Video_generator.py gagal
        return jsonify({"status": "error", "message": e.stderr or str(e)}), 500
    except Exception as e:
        # Menangani error umum lainnya
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=8080)
    except OSError as e:
        print(f"[ERROR] Gagal bind ke port 8080: {e}")

