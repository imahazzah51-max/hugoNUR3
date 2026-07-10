import base64, time
from flask import Flask, jsonify, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

FRAME_STORE  = {}   
FRAME_TS     = {}   

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

@app.route('/frame/<member_id>')
def get_frame(member_id):
    mid = member_id.strip().upper()
    if mid in FRAME_STORE:
        return Response(FRAME_STORE[mid], mimetype='image/jpeg')
    return jsonify({"status":"error","pesan":"Frame kosong"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8891, debug=True)
