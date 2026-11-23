import numpy as np, librosa, json
from scipy.signal import correlate
sr=22050
src,_=librosa.load("public/audio/bgm.mp3",sr=sr,mono=True)
ren,_=librosa.load("out/bavi_final.mp4",sr=sr,mono=True)
T=0.46155;t0=0.2464
# offset of rendered BGM (part1) vs source: correlate onset envelopes over 15-60s
def env(y): return librosa.onset.onset_strength(y=y,sr=sr,hop_length=64)
a=env(src[int(15*sr):int(60*sr)]); b=env(ren[int(15*sr):int(60*sr)])
c=correlate(b-b.mean(),a-a.mean(),mode='full'); lag=(np.argmax(c)-(len(a)-1))*64/sr
print(f"part1 output offset: {lag*1000:.1f} ms")
# part2: output t (>= splice) maps to source t + 24T
sp=round((t0+208*T)*30)/30
a2=env(src[int((sp+24*T+1)*sr):int((sp+24*T+9)*sr)]); b2=env(ren[int((sp+1)*sr):int((sp+9)*sr)])
c2=correlate(b2-b2.mean(),a2-a2.mean(),mode='full'); lag2=(np.argmax(c2)-(len(a2)-1))*64/sr
print(f"part2 offset after splice: {lag2*1000:.1f} ms")
# cut points: design frames vs nearest detected beat in rendered audio
yp=librosa.effects.percussive(ren)
on=librosa.onset.onset_detect(y=yp,sr=sr,units='time')
cuts=[8,26,32,40,44,50,54,58,64,76,82,90,98,110,114,116,118,120,123,124,128,140,156,160,167,176,184]
bf=lambda n: round((t0+n*T)*30)
errs=[]
for n in cuts:
    t=bf(n)/30; d=on[np.argmin(abs(on-t))]-t; errs.append(d*30)
errs=np.array(errs)
print("cut errors (frames):", " ".join(f"b{n}:{e:+.1f}" for n,e in zip(cuts,errs)))
print(f"|err| mean {np.abs(errs).mean():.2f}f  max {np.abs(errs).max():.2f}f  >3f: {[cuts[i] for i in np.where(np.abs(errs)>3)[0]]}")
