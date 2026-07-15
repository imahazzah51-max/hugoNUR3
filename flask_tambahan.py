import base64
import time
from flask import Flask, Response, request, jsonify

app = Flask(__name__)

FRAME_STORE  = {}   # { 'M001': bytes_jpeg, ... }
FRAME_TS     = {}   # { 'M001': timestamp, ... }

# ── Terima frame dari HP member ──
@app.route('/upload-frame', methods=['POST'])
def upload_frame():
    data = request.get_json(silent=True) or {}
    # Perbaikan: Memisahkan deklarasi member_id agar tidak menyatu di ujung baris
    member_id = data.get('id', '').strip().upper()
    frame_b64 = data.get('frame', '')
    
    if not member_id or not frame_b64:
        return jsonify({"status": "error", "pesan": "Data tidak lengkap"}), 400
        
    try:
        FRAME_STORE[member_id] = base64.b64decode(frame_b64)
        FRAME_TS[member_id]    = time.time()
        return jsonify({"status": "ok", "id": member_id})
    except Exception as e:
        return jsonify({"status": "error", "pesan": str(e)}), 500

# ── Ambil frame spesifik per member ──
@app.route('/frame/<member_id>')
def get_frame(member_id):
    mid = member_id.strip().upper()
    
    if mid not in FRAME_STORE:
        return Response(status=204)
        
    # Jika frame sudah lebih dari 10 detik, anggap offline dan hapus dari memori
    if time.time() - FRAME_TS.get(mid, 0) > 10:
        FRAME_STORE.pop(mid, None)
        FRAME_TS.pop(mid, None)
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

# ── Cek Status Semua Member yang Sedang Live ──
@app.route('/live-status')
def live_status():
    now = time.time()
    # Hanya ambil member yang mengirim frame dalam 10 detik terakhir
    aktif = {mid: True for mid, ts in FRAME_TS.items() if now - ts < 10}
    return jsonify({
        "live": aktif, 
        "total": len(aktif)
    })

