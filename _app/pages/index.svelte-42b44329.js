import{S as q,i as A,s as Q,e as p,t as k,c as v,a as x,h as E,d as f,b as u,g as j,J as i,n as w,k as H,m as R,K as $}from"../chunks/index-3ad129c8.js";function S(h,e,n){const c=h.slice();return c[1]=e[n],c}function G(h){let e,n=h[1].name+"",c,_;return{c(){e=p("a"),c=k(n),this.h()},l(s){e=v(s,"A",{href:!0,class:!0});var o=x(e);c=E(o,n),o.forEach(f),this.h()},h(){u(e,"href",_=h[1].href),u(e,"class","drop-shadow-md text-xl underline mx-4 hover:gray-100")},m(s,o){j(s,e,o),i(e,c)},p:w,d(s){s&&f(e)}}}function C(h){let e,n,c,_,s,o,b,d,m=h[0],l=[];for(let a=0;a<m.length;a+=1)l[a]=G(S(h,m,a));return{c(){e=p("header"),n=p("h1"),c=k("Scannable"),_=H(),s=p("h2"),o=k("Generate QR codes and other things (maybe)"),b=H(),d=p("div");for(let a=0;a<l.length;a+=1)l[a].c();this.h()},l(a){e=v(a,"HEADER",{class:!0});var r=x(e);n=v(r,"H1",{class:!0});var t=x(n);c=E(t,"Scannable"),t.forEach(f),_=R(r),s=v(r,"H2",{class:!0});var g=x(s);o=E(g,"Generate QR codes and other things (maybe)"),g.forEach(f),b=R(r),d=v(r,"DIV",{class:!0});var D=x(d);for(let y=0;y<l.length;y+=1)l[y].l(D);D.forEach(f),r.forEach(f),this.h()},h(){u(n,"class","text-6xl mb-4 drop-shadow-xl"),u(s,"class","text-3xl mb-4 drop-shadow-lg"),u(d,"class","flex flex-row"),u(e,"class","text-center p-8 w-full h-screen text-white flex flex-col justify-center items-center bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-500 background-animate svelte-1n7kv7d")},m(a,r){j(a,e,r),i(e,n),i(n,c),i(e,_),i(e,s),i(s,o),i(e,b),i(e,d);for(let t=0;t<l.length;t+=1)l[t].m(d,null)},p(a,[r]){if(r&1){m=a[0];let t;for(t=0;t<m.length;t+=1){const g=S(a,m,t);l[t]?l[t].p(g,r):(l[t]=G(g),l[t].c(),l[t].m(d,null))}for(;t<l.length;t+=1)l[t].d(1);l.length=m.length}},i:w,o:w,d(a){a&&f(e),$(l,a)}}}function I(h){return[[{href:"/scannable/qr",name:"Demo"},{href:"https://github.com/LeoDog896/scannable",name:"GitHub"},{href:"https://npmjs.com/package/scannable",name:"NPM"}]]}class K extends q{constructor(e){super(),A(this,e,I,C,Q,{})}}export{K as default};