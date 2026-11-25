import numpy as np, librosa, json
from scipy.signal import butter, sosfilt
y, sr = librosa.load("public/audio/bgm.mp3", sr=None, mono=True)
yp = librosa.effects.percussive(y)
tempo, beats = librosa.beat.beat_track(y=yp, sr=sr, tightness=400, units="time")
def fit(b):
    i=np.arange(len(b)); A=np.vstack([i,np.ones_like(i)]).T
    (T,t0),*_=np.linalg.lstsq(A,b,rcond=None); return T,t0,b-(t0+i*T)
T,t0,res=fit(beats)
# robust: refit after removing outliers
m=np.abs(res)<0.03; T,t0,res2=fit(beats[m]) if False else (T,t0,res)
print("raw bpm %.3f T %.5f t0 %.4f maxres %.1fms medres %.1fms"%(60/T,T,t0,np.abs(res).max()*1000,np.median(np.abs(res))*1000))
def band_env(lo,hi):
    sos=butter(4,[lo,hi],btype="band",fs=sr,output="sos")
    env=librosa.onset.onset_strength(y=sosfilt(sos,yp),sr=sr); return env,librosa.times_like(env,sr=sr)
kick,kt=band_env(40,160)
onsets=librosa.onset.onset_detect(onset_envelope=kick,sr=sr,units="time")
res_out={}
for name,Tc in [("1x",T),("2x",T/2),("0.5x",T*2)]:
    n=int((len(y)/sr-t0)/Tc); g=t0+np.arange(n)*Tc
    d=np.array([np.min(np.abs(onsets-x)) for x in g])
    hit=d<0.035
    res_out[name]=dict(match=float(hit.mean()),mean_abs_ms=float(d[hit].mean()*1000) if hit.any() else None)
print(res_out)
# phase: start beat t0 may be -k*T earlier; find first beat index aligned near start
k0=int(np.floor(t0/T)); t0n=t0-k0*T
print("t0 normalized",t0n,"k0",k0)
rms=librosa.feature.rms(y=y)[0]; rt=librosa.times_like(rms,sr=sr)
bar=4*T
nb=int((len(y)/sr-t0n)/bar)
barE=[float(np.mean(rms[(rt>=t0n+b*bar)&(rt<t0n+(b+1)*bar)])) for b in range(nb)]
print("bar energies:"," ".join("%d:%.2f"%(i,e) for i,e in enumerate(barE)))
# kick strength per beat
kb=[]
for n in range(int((len(y)/sr-t0n)/T)):
    t=t0n+n*T; kb.append((n,float(kick[np.argmin(np.abs(kt-t))])))
json.dump(dict(bpm=60/T,T=T,t0=t0n,beats=list(t0n+np.arange(len(kb))*T),barEnergy=barE,kickPerBeat=kb,grids=res_out),open("analysis/beat_data.json","w"))
