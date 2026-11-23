import json,numpy as np,librosa
from scipy.signal import butter,sosfilt
y,sr=librosa.load("analysis/bgm.mp3",sr=None,mono=True)
yp=librosa.effects.percussive(y)
tempo,beats=librosa.beat.beat_track(y=yp,sr=sr,tightness=400,units="time")
def fit(b):
    i=np.arange(len(b));(T,t0),*_=np.linalg.lstsq(np.vstack([i,np.ones_like(i)]).T,b,rcond=None);return T,t0
T,t0=fit(beats)
# shift t0 to earliest beat >=0
t0=t0-np.floor(t0/T)*T
onset=librosa.onset.onset_detect(y=yp,sr=sr,units="time",backtrack=False)
def score(T,t0):
    g=t0+np.arange(int((len(y)/sr-t0)/T))*T
    d=np.array([np.min(np.abs(onset-x)) for x in g])
    return (d<0.035).mean(), np.mean(d[d<0.035])*1000 if (d<0.035).any() else 999
cands={}
for name,TT in [("0.5x",T*2),("1x",T),("2x",T/2)]:
    m,e=score(TT,t0); cands[name]={"bpm":60/TT,"match":m,"mean_abs_ms":e}
print(json.dumps(cands,indent=1))
def env(lo,hi):
    sos=butter(4,[lo,hi],btype="band",fs=sr,output="sos"); e=librosa.onset.onset_strength(y=sosfilt(sos,yp),sr=sr); return e,librosa.times_like(e,sr=sr)
ke,kt=env(40,160); se,st=env(150,3000)
rms=librosa.feature.rms(y=y)[0]; rt=librosa.times_like(rms,sr=sr)
nb=int((len(y)/sr-t0)/T)
rows=[]
for n in range(nb):
    t=t0+n*T
    rows.append((n,t,ke[np.argmin(abs(kt-t))],se[np.argmin(abs(st-t))],rms[(rt>=t)&(rt<t+T)].mean()))
# bar-level energy (4 beats)
print(f"BPM={60/T:.3f} T={T:.5f} t0={t0:.4f} beats={nb}")
for b in range(0,nb,8):
    seg=rows[b:b+8]
    print(f"b{b:3d} t={seg[0][1]:6.2f}s rms={np.mean([r[4] for r in seg]):.3f} kick={np.mean([r[2] for r in seg]):.2f} snare={np.mean([r[3] for r in seg]):.2f}")
top=sorted(rows,key=lambda r:-r[2])[:12]
print("top kick beats:",sorted([(r[0],round(r[1],2)) for r in top]))
json.dump({"bpm":60/T,"T":T,"t0":t0,"beats":[t0+n*T for n in range(nb)],"rms_beats":[float(r[4]) for r in rows],"kick":[float(r[2]) for r in rows],"cands":cands},open("analysis/beat_data.json","w"))
