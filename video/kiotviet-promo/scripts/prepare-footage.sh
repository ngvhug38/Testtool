#!/usr/bin/env bash
# Rebuilds the reel-derived media (not committed: KiotViet's own footage).
# Usage: scripts/prepare-footage.sh /path/to/1364674518328699.mp4   (download: yt-dlp https://www.facebook.com/reel/1364674518328699)
set -euo pipefail
V="$1"; cd "$(dirname "$0")/.."; mkdir -p public/footage public/img
enc=(-an -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -vf scale=1920:1080 -r 30)
ffmpeg -v error -y -ss 25.4  -to 28.9 -i "$V" "${enc[@]}" public/footage/qr.mp4
ffmpeg -v error -y -ss 53.25 -to 56.0 -i "$V" "${enc[@]}" public/footage/qrlock.mp4
ffmpeg -v error -y -ss 43.0  -to 46.0 -i "$V" "${enc[@]}" public/footage/tablet.mp4
ffmpeg -v error -y -ss 44.0 -i "$V" -frames:v 1 -vf "crop=1560:878:360:202,scale=1920:1080" -q:v 3 public/img/still-counter.jpg
ffmpeg -v error -y -ss 1.0 -i public/footage/qrlock.mp4 -frames:v 1 -vf "crop=600:600:780:160,scale=480:480" public/img/qr-card.jpg
# motion-interpolated slow clips (review: avoid playbackRate judder)
mi="minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1"
x=(-an -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p)
ffmpeg -v error -y -ss 53.25 -t 1.35 -i "$V" -vf "scale=1920:1080,setpts=3.2*PTS,$mi" "${x[@]}" public/footage/qrlock-slow.mp4
ffmpeg -v error -y -ss 43.0  -t 3.0  -i "$V" -vf "scale=1920:1080,setpts=2*PTS,$mi"   "${x[@]}" public/footage/tablet-slow.mp4
ffmpeg -v error -y -ss 25.4  -t 1.65 -i "$V" -vf "scale=1920:1080,setpts=3.55*PTS,$mi" "${x[@]}" public/footage/qr-slow.mp4
