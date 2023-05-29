"use strict";(self["webpackChunkstarter_ionic"]=self["webpackChunkstarter_ionic"]||[]).push([[990],{8990:(t,e,r)=>{r.r(e),r.d(e,{createSwipeBackGesture:()=>a});var n=r(6587),i=r(545),s=r(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const a=(t,e,r,a,c)=>{const o=t.ownerDocument.defaultView,u=(0,i.i)(t),h=t=>{const e=50,{startX:r}=t;return u?r>=o.innerWidth-e:r<=e},l=t=>u?-t.deltaX:t.deltaX,d=t=>u?-t.velocityX:t.velocityX,k=t=>h(t)&&e(),w=t=>{const e=l(t),r=e/o.innerWidth;a(r)},p=t=>{const e=l(t),r=o.innerWidth,i=e/r,s=d(t),a=r/2,u=s>=0&&(s>.2||e>a),h=u?1-i:i,k=h*r;let w=0;if(k>5){const t=k/Math.abs(s);w=Math.min(t,540)}c(u,i<=0?.01:(0,n.h)(0,i,.9999),w)};return(0,s.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:k,onStart:r,onMove:w,onEnd:p})}}}]);
//# sourceMappingURL=990.11ed8b86.js.map