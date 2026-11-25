import numpy as np, librosa, json
from scipy.signal import butter, sosfilt
y, sr = librosa.load("public/audio/bgm.mp3", sr=None, mono=True, offset=0, duration=75)
yp=librosa.effects.percussive(y)
sos=butter(4,[40,160],btype="band",fs=sr,output="sos")
env=librosa.onset.onset_strength(y=sosfilt(sos,yp),sr=sr); et=librosa.times_like(env,sr=sr)
on=librosa.onset.onset_detect(onset_envelope=env,sr=sr,units="time",backtrack=False)
on=on[(on>7)&(on<70)]
# grid search T,t0 maximizing match within 7..70s
best=None
for bpm in np.arange(123.5,124.5,0.005):
    T=60/bpm
    for ph in np.arange(0,T,0.002):
        g=np.arange(ph+np.ceil((7-ph)/T)*T,70,T)
        d=np.array([np.min(np.abs(on-x)) for x in g])
        sc=(d<0.03).mean()-d[d<0.03].mean()
        if best is None or sc>best[0]: best=(sc,bpm,ph,(d<0.03).mean(),d[d<0.03].mean()*1000)
print("best bpm %.3f phase %.4f match %.3f mean %.1fms"%best[1:])
bpm,ph=best[1],best[2]; T=60/bpm
json.dump(dict(bpm=bpm,T=T,t0=ph,window=[7,70],match=best[3],mean_abs_ms=best[4],
  note="grid fit on kick onsets (40-160Hz, percussive) within 7-70s; excerpt starts at source bar 4 (beat 16); drop at source bar 8 (beat 32)"),open("analysis/grid.json","w"),indent=1)
