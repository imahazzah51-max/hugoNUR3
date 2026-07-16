#!/bin/bash
# NAMA: ALWI.sh - Sang Pengendali Cache
# FUNGSI: Automasi Kerajaan Indramayu Club 10 Akun

echo "👑 ALWI GRADLEW SIAPP BOSSS 🔥"
echo "Status: Ekosistem Online..."

# Arahkan langsung ke folder pusat otomatisasi
TARGET_DIR="$HOME/proyek_makrifat/06_AUTOMATION_SCRIPTS"

# 1. Pastikan folder log ada
mkdir -p "$TARGET_DIR/dokumen_log_chve_alwi"

TANGGAL=$(date +%Y-%m-%d)
LOGFILE="$TARGET_DIR/dokumen_log_chve_alwi/log_$TANGGAL.md"

if [ ! -f "$LOGFILE" ]; then
  echo "# CHVE ALWI - $TANGGAL" > "$LOGFILE"
  echo "Status: Bot Bangun | Mood: Siappp Termantau Otomatis" >> "$LOGFILE"
  echo "✅ File log anyar wis digawe: $LOGFILE"
else
  echo "✅ Log dina iki wis ana. Ora usah gawe maning."
fi

# 2. Masuk ke folder Aktor dan Cek File Inti
if [ -d "$TARGET_DIR/AKTORalwi" ]; then
  cd "$TARGET_DIR/AKTORalwi"
  ls -1 Alwi.html cetak_biru_alwi.md kamus_src.md 2>/dev/null
  echo "📂 File Inti: Aman | Folder CHVE: Aman"
fi

echo "Selesai. ALWI Standby neng Gerbang..."
