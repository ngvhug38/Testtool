#!/bin/bash
# chunked render with retries; usage: render_chunks.sh <outname> [propsfile]
cd "$(dirname "$0")"
OUT=$1; PROPS=${2:+--props=$2}
TOTAL=$(node -e "const T=0.46155,t0=0.2464;console.log(Math.round((t0+228*T)*30)+6)")
mkdir -p out/chunks_$OUT; : > out/chunks_$OUT/list.txt
for s in $(seq 0 600 $((TOTAL-1))); do e=$((s+599)); [ $e -ge $TOTAL ] && e=$((TOTAL-1))
  f=out/chunks_$OUT/$s.mp4
  for try in 1 2 3; do
    [ -f $f ] && break
    npx remotion render src/index.ts BaVi $f --frames=$s-$e --muted --crf=17 --concurrency=3 --timeout=120000 $PROPS --log=verbose > out/chunks_$OUT/$s.try$try.log 2>&1 || { echo "chunk $s try $try failed"; rm -f $f; }
  done
  [ -f $f ] || { echo "CHUNK $s FAILED"; exit 1; }
  echo "file '$s.mp4'" >> out/chunks_$OUT/list.txt; echo "chunk $s ok"
done
ffmpeg -v error -y -f concat -safe 0 -i out/chunks_$OUT/list.txt -c copy out/chunks_$OUT/video.mp4 || exit 1
npx remotion render src/index.ts BaVi out/chunks_$OUT/audio.wav --codec=wav $PROPS --log=error > out/chunks_$OUT/audio.log 2>&1 || { echo AUDIO FAILED; exit 1; }
ffmpeg -v error -y -i out/chunks_$OUT/video.mp4 -i out/chunks_$OUT/audio.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart out/$OUT.mp4 && echo "DONE out/$OUT.mp4"
