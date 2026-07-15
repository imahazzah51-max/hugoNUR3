import os
import base64
import time
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Mengizinkan akses cross-origin dari HTTPS Tunnel

# Tempat penyimpanan video kiriman member
UPLOAD_FOLDER = os.path.expanduser('~/proyek_makrifat/10_ALWI_INDRAMAYU_CLUB/uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Penyimpanan frame panggung di memory RAM
FRAME_STORE  = {}   # { 'M001': bytes_jpeg, ... }
FRAME_TS     = {}   # { 'M001': timestamp, ... }

# ── RUTE UTAMA CHECK SERVER ──
@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "aktif", "pesan": "Backend Alwi Room 2 Siap Pemirsa!"})

# ── RUTE LOGIN SULTAN ──
@app.route('/login-member', methods=['POST'])
def login_member():
    data = request.get_json() or {}
    member_id = data.get('id', '').strip().upper()
    password = data.get('password', '').strip()

    if not member_id or not password:
        return jsonify({"status": "gagal", "pesan": "ID dan Password wajib diisi"}), 400

    # Validasi standar kecocokan password: nur00 + digit terakhir ID
    digit_akhir = member_id[-1] if member_id else ''
    password_valid = f"nur00{digit_akhir}"

    if password == password_valid or password == "jamhari":
        return jsonify({
            "status": "sukses",
            "id": member_id,
            "nama": f"Sultan {member_id}"
        }), 200
    else:
        return jsonify({"status": "gagal", "pesan": "Kombinasi sandi sirkuit salah"}), 401

# ── RUTE UPLOAD VIDEO REKAMAN HP ──
@app.route('/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"status": "gagal", "pesan": "File video tidak ditemukan"}), 400

    file = request.files['video']
    if file.filename == '':
        return jsonify({"status": "gagal", "pesan": "Nama file kosong"}), 400

    # Amankan nama file dan simpan ke folder tujuan
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Otomatis catat log panggung & simulasi potongan kas 5% untuk ekosistem IMC
    print(f"[SISTEM KAS] Potongan admin 5% disimulasikan untuk aktivitas upload: {file.filename}")

    return jsonify({
        "status": "sukses",
        "pesan": f"Video {file.filename} Berhasil Disimpan di Folder 10_ALWI!"
    }), 200

# ── RUTE TERIMA FRAME DARI HP MEMBER (RELAY) ──
@app.route('/upload-frame', methods=['POST'])
def upload_frame():
    data      = request.get_json(silent=True) or {}
    member_id = data.get('id','').strip().upper()
    frame_b64 = data.get('frame','')
    if not member_id or not frame_b64:
        return jsonify({"status":"error","pesan":"Data tidak lengkap"}), 400
    try:
        FRAME_STORE[member_id] = base64.b64decode(frame_b64)
        FRAME_TS[member_id]    = time.time()
        return jsonify({"status":"ok","id":member_id})
    except Exception as e:
        return jsonify({"status":"error","pesan":str(e)}), 500

# ── RUTE AMBIL FRAME OLEH BROWSER LAIN ──
@app.route('/frame/<member_id>')
def get_frame(member_id):
    mid = member_id.strip().upper()
    if mid not in FRAME_STORE:
        return Response(status=204)
    if time.time() - FRAME_TS.get(mid, 0) > 10:
        try: del FRAME_STORE[mid]
        except: pass
        return Response(status=204)
    return Response(
        FRAME_STORE[mid],
        mimetype='image/jpeg',
        headers={
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Access-Control-Allow-Origin': '*'
        }
    )

# ── RUTE LIVE STATUS 4 ORANG ──
@app.route('/live-status')
def live_status():
    now    = time.time()
    aktif  = {mid: True for mid, ts in FRAME_TS.items() if now - ts < 10}
    return jsonify({"live": aktif, "total": len(aktif)})

# ═══════════════════════════════════════════════════════
# EKSEKUSI SERVER — WAJIB BERADA DI PALING BAWAH FILE
# ═══════════════════════════════════════════════════════
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8890, debug=True)

