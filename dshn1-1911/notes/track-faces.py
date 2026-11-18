import cv2, json, sys, numpy as np
root=sys.argv[1]; out=sys.argv[2]; dbg=sys.argv[3]
T=[ # key, clip, t0, t1, seed x,y, label
 ('m1','c2',2.5,3.7,272,240,'Cười banh nóc'),
 ('m5','c6',21.4,22.6,900,760,'Cảm động muốn khóc'),
 ('m6','c4',0.6,1.5,220,840,'Gần lắm rồi!'),
 ('m7a','c7',14.2,15.4,580,440,'Nín cười không nổi'),
 ('m7b','c7',23.6,24.8,720,840,'Cười trộm'),
]
cd=cv2.data.haarcascades
front=cv2.CascadeClassifier(cd+'haarcascade_frontalface_default.xml')
prof=cv2.CascadeClassifier(cd+'haarcascade_profileface.xml')
res=[]
for key,clip,t0,t1,sx,sy,label in T:
    cap=cv2.VideoCapture(f'{root}/public/clips/{clip}.mp4')
    cap.set(cv2.CAP_PROP_POS_MSEC,t0*1000)
    n=int(round((t1-t0)*30)); cx,cy,r=sx,sy,95; pts=[]; hits=0; frames=[]
    for i in range(n):
        ok,fr=cap.read()
        if not ok: break
        g=cv2.equalizeHist(cv2.cvtColor(fr,cv2.COLOR_BGR2GRAY))
        dets=list(front.detectMultiScale(g,1.1,5,minSize=(80,80)))
        dets+=list(prof.detectMultiScale(g,1.1,5,minSize=(80,80)))
        fl=cv2.flip(g,1)
        for (x,y,w,h) in prof.detectMultiScale(fl,1.1,5,minSize=(80,80)): dets.append((1080-x-w,y,w,h))
        best=None
        for (x,y,w,h) in dets:
            c=(x+w/2,y+h/2); d=np.hypot(c[0]-cx,c[1]-cy)
            if d<170 and (best is None or d<best[0]): best=(d,c,w)
        if best: cx,cy=best[1]; r=0.8*r+0.2*best[2]*0.75; hits+=1
        pts.append([cx,cy,r]); frames.append(fr)
    p=np.array(pts)
    # smooth (centered moving average, 7 frames)
    k=7; pad=np.pad(p,((k//2,k//2),(0,0)),mode='edge'); sm=np.array([pad[i:i+k].mean(0) for i in range(len(p))])
    res.append(dict(key=key,clip=clip,t0=t0,t1=t1,label=label,hits=hits,n=len(p),track=[[round(a,1),round(b,1),round(c,1)] for a,b,c in sm]))
    for j in (0,len(sm)//2,len(sm)-1):
        f=frames[j].copy(); x,y,rr=sm[j]; cv2.ellipse(f,(int(x),int(y)),(int(rr*1.25),int(rr*1.5)),0,0,360,(0,200,255),8)
        cv2.imwrite(f'{dbg}/{key}_{j:02d}.jpg',cv2.resize(f,(270,480)))
    print(key,'hits',hits,'/',len(p),'start',np.round(sm[0]),'end',np.round(sm[-1]))
json.dump(res,open(out,'w'),ensure_ascii=False,indent=1)
