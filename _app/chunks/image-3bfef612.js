var K=Object.defineProperty,V=Object.defineProperties;var D=Object.getOwnPropertyDescriptors;var c=Object.getOwnPropertySymbols;var G=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var M=(o,n,e)=>n in o?K(o,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[n]=e,x=(o,n)=>{for(var e in n||(n={}))G.call(n,e)&&M(o,e,n[e]);if(c)for(var e of c(n))P.call(n,e)&&M(o,e,n[e]);return o},u=(o,n)=>V(o,D(n));const H=Object.freeze([0,11,15,19,23,27,31,16,18,20,22,24,26,28,20,22,24,24,26,28,28,22,24,24,26,26,28,28,24,24,26,26,26,28,28,24,26,26,26,28,28]),U=Object.freeze([1,0,19,7,1,0,16,10,1,0,13,13,1,0,9,17,1,0,34,10,1,0,28,16,1,0,22,22,1,0,16,28,1,0,55,15,1,0,44,26,2,0,17,18,2,0,13,22,1,0,80,20,2,0,32,18,2,0,24,26,4,0,9,16,1,0,108,26,2,0,43,24,2,2,15,18,2,2,11,22,2,0,68,18,4,0,27,16,4,0,19,24,4,0,15,28,2,0,78,20,4,0,31,18,2,4,14,18,4,1,13,26,2,0,97,24,2,2,38,22,4,2,18,22,4,2,14,26,2,0,116,30,3,2,36,22,4,4,16,20,4,4,12,24,2,2,68,18,4,1,43,26,6,2,19,24,6,2,15,28,4,0,81,20,1,4,50,30,4,4,22,28,3,8,12,24,2,2,92,24,6,2,36,22,4,6,20,26,7,4,14,28,4,0,107,26,8,1,37,22,8,4,20,24,12,4,11,22,3,1,115,30,4,5,40,24,11,5,16,20,11,5,12,24,5,1,87,22,5,5,41,24,5,7,24,30,11,7,12,24,5,1,98,24,7,3,45,28,15,2,19,24,3,13,15,30,1,5,107,28,10,1,46,28,1,15,22,28,2,17,14,28,5,1,120,30,9,4,43,26,17,1,22,28,2,19,14,28,3,4,113,28,3,11,44,26,17,4,21,26,9,16,13,26,3,5,107,28,3,13,41,26,15,5,24,30,15,10,15,28,4,4,116,28,17,0,42,26,17,6,22,28,19,6,16,30,2,7,111,28,17,0,46,28,7,16,24,30,34,0,13,24,4,5,121,30,4,14,47,28,11,14,24,30,16,14,15,30,6,4,117,30,6,14,45,28,11,16,24,30,30,2,16,30,8,4,106,26,8,13,47,28,7,22,24,30,22,13,15,30,10,2,114,28,19,4,46,28,28,6,22,28,33,4,16,30,8,4,122,30,22,3,45,28,8,26,23,30,12,28,15,30,3,10,117,30,3,23,45,28,4,31,24,30,11,31,15,30,7,7,116,30,21,7,45,28,1,37,23,30,19,26,15,30,5,10,115,30,19,10,47,28,15,25,24,30,23,25,15,30,13,3,115,30,2,29,46,28,42,1,24,30,23,28,15,30,17,0,115,30,10,23,46,28,10,35,24,30,19,35,15,30,17,1,115,30,14,21,46,28,29,19,24,30,11,46,15,30,13,6,115,30,14,23,46,28,44,7,24,30,59,1,16,30,12,7,121,30,12,26,47,28,39,14,24,30,22,41,15,30,6,14,121,30,6,34,47,28,46,10,24,30,2,64,15,30,17,4,122,30,29,14,46,28,49,10,24,30,24,46,15,30,4,18,122,30,13,32,46,28,48,14,24,30,42,32,15,30,20,4,117,30,40,7,47,28,43,22,24,30,10,67,15,30,19,6,118,30,18,31,47,28,34,34,24,30,20,61,15,30]),Q=Object.freeze([30660,29427,32170,30877,26159,25368,27713,26998,21522,20773,24188,23371,17913,16590,20375,19104,13663,12392,16177,14854,9396,8579,11994,11245,5769,5054,7399,6608,1890,597,3340,2107]),X=Object.freeze({L:1,M:2,Q:3,H:4}),y=Object.freeze([1,2,4,8,16,32,64,128,29,58,116,232,205,135,19,38,76,152,45,90,180,117,234,201,143,3,6,12,24,48,96,192,157,39,78,156,37,74,148,53,106,212,181,119,238,193,159,35,70,140,5,10,20,40,80,160,93,186,105,210,185,111,222,161,95,190,97,194,153,47,94,188,101,202,137,15,30,60,120,240,253,231,211,187,107,214,177,127,254,225,223,163,91,182,113,226,217,175,67,134,17,34,68,136,13,26,52,104,208,189,103,206,129,31,62,124,248,237,199,147,59,118,236,197,151,51,102,204,133,23,46,92,184,109,218,169,79,158,33,66,132,21,42,84,168,77,154,41,82,164,85,170,73,146,57,114,228,213,183,115,230,209,191,99,198,145,63,126,252,229,215,179,123,246,241,255,227,219,171,75,150,49,98,196,149,55,110,220,165,87,174,65,130,25,50,100,200,141,7,14,28,56,112,224,221,167,83,166,81,162,89,178,121,242,249,239,195,155,43,86,172,69,138,9,18,36,72,144,61,122,244,245,247,243,251,235,203,139,11,22,44,88,176,125,250,233,207,131,27,54,108,216,173,71,142,0]),v=Object.freeze([255,0,1,25,2,50,26,198,3,223,51,238,27,104,199,75,4,100,224,14,52,141,239,129,28,193,105,248,200,8,76,113,5,138,101,47,225,36,15,33,53,147,142,218,240,18,130,69,29,181,194,125,106,39,249,185,201,154,9,120,77,228,114,166,6,191,139,98,102,221,48,253,226,152,37,179,16,145,34,136,54,208,148,206,143,150,219,189,241,210,19,92,131,56,70,64,30,66,182,163,195,72,126,110,107,58,40,84,250,133,186,61,202,94,155,159,10,21,121,43,78,212,229,172,115,243,167,87,7,112,192,247,140,128,99,13,103,74,222,237,49,197,254,24,227,165,153,119,38,184,180,124,17,68,146,217,35,32,137,46,55,63,209,91,149,188,207,205,144,135,151,178,220,252,190,97,242,86,211,171,20,42,93,158,132,60,57,83,71,109,65,162,31,45,67,216,183,123,164,118,196,23,73,236,127,12,111,246,108,161,59,82,41,157,85,170,251,96,134,177,187,204,62,90,203,89,95,176,156,169,160,81,11,245,22,235,122,117,44,215,79,174,213,233,230,231,173,232,116,214,244,234,168,80,88,175]),_=Object.freeze([3220,1468,2713,1235,3062,1890,2119,1549,2344,2936,1117,2583,1330,2470,1667,2249,2028,3780,481,4011,142,3098,831,3445,592,2517,1776,2234,1951,2827,1070,2660,1345,3177]),T=Object.freeze({level:"L"}),$=3,q=3,J=40,W=10;function C(o,n){if(o>n)return C(n,o);let e=n;return e+=n*n,e>>=1,e+=o,e}function I(o,n){let e=0;for(let l=0;l<=o;l++)n[l]>=5&&(e+=$+n[l]-5);for(let l=3;l<o-1;l+=2)n[l-2]===n[l+2]&&n[l+2]===n[l-1]&&n[l-1]===n[l+1]&&n[l-1]*3===n[l]&&(n[l-3]===0||l+3>o||n[l-3]*3>=n[l]*4||n[l+3]*3>=n[l]*4)&&(e+=J);return e}function O(o,n,e){e[C(o,n)]=1}function Y(o,n,e){e[C(o%n,~~(o/n))]=1}function Z(o,n,e){for(let l=0;l<e.length;l++)e[l]&1&&Y(l,o,n)}function p(o,n,e){const l=C(o,n);return e[l]&1}function m(o,n,e){const l=C(o%n,~~(o/n));return e[l]&1}function k(o,n){for(let e=0;e<=40;e++){const l=(n-1)*4+(e-1)*16,r=U[l],t=U[l+1],f=U[l+2],i=U[l+3];if(o<=f*(r+t)+t-3+ +(e<=9)||e==40)return{version:e,neccBlock1:r,neccBlock2:t,dataBlock:f,eccBlock:i}}throw Error("Unreachable!")}function N(o,n,e,l,r){e[o+r*n]=1;for(let t=-2;t<2;t++)e[o+t+r*(n-2)]=1,e[o-2+r*(n+t+1)]=1,e[o+2+r*(n+t)]=1,e[o+t+1+r*(n+2)]=1;for(let t=0;t<2;t++)O(o-1,n+t,l),O(o+1,n-t,l),O(o-t,n-1,l),O(o+t,n+1,l)}function R(o,n,e,l,r,t){let f;for(let i=0;i<l;i++)t[e+i]=0;for(let i=0;i<n;i++){if(f=v[t[o+i]^t[e]],f!==255)for(let a=1;a<l;a++)t[e+a-1]=t[e+a]^y[(f+r[l-a])%255];else for(let a=e;a<e+l;a++)t[a]=t[a+1];t[e+l-1]=f===255?0:y[(f+r[0])%255]}}function E(o,n,e){return o*(n+e)+e}function b(o,n,e,l,r,t){let f=0,i=E(o,n,e);for(let a=0;a<n;a++)R(f,o,i,l,r,t),f+=o,i+=l;for(let a=0;a<e;a++)R(f,o+1,i,l,r,t),f+=o+1,i+=l}function S(o,n,e,l){switch(e){case 0:for(let r=0;r<o*o;r++)!(r%2)&&m(r,o,l)^1&&(n[r]^=1);break;case 1:for(let r=0;r<o;r++)if(r%2)for(let t=0;t<o;t++)p(t,r,l)^1&&(n[t+r*o]^=1);break;case 2:for(let r=0;r<o;r++)if(!(r%3))for(let t=0;t<o;t++)p(r,t,l)^1&&(n[r+t*o]^=1);break;case 3:for(let r=0,t=0;t<o;t++,r++){r===3&&(r=0);for(let f=r,i=0;i<o;i++,f++)f===3&&(f=0),!f&&p(i,t,l)^1&&(n[i+t*o]^=1)}break;case 4:for(let r=0;r<o;r++)for(let t=0,f=r>>1&1,i=0;i<o;i++,t++)t===3&&(t=0,f=+!f),!f&&p(i,r,l)^1&&(n[i+r*o]^=1);break;case 5:for(let r=0,t=0;t<o;t++,r++){r===3&&(r=0);for(let f=0,i=0;i<o;i++,f++)f===3&&(f=0),!((i&t&1)+(f^1|r^1)^1)&&p(i,t,l)^1&&(n[i+t*o]^=1)}break;case 6:for(let r=0,t=0;t<o;t++,r++){r===3&&(r=0);for(let f=0,i=0;i<o;i++,f++)f===3&&(f=0),(i&t&1)+ +(f&&f===r)&1^1&&p(i,t,l)^1&&(n[i+t*o]^=1)}break;case 7:for(let r=0,t=0;t<o;t++,r++){r===3&&(r=0);for(let f=0,i=0;i<o;i++,f++)f===3&&(f=0),+(f&&f===r)+(i+t&1)&1^1&&p(i,t,l)^1&&(n[i+t*o]^=1)}break}}function B(o){const n=new Uint8Array(o).fill(1);for(let e=1;e<o;e++){for(let l=e;l>0;l--)n[l]=n[l]?n[l-1]^y[(v[n[l]]+e)%255]:n[l-1];n[0]=y[(v[n[0]]+e)%255]}for(let e=0;e<=o;e++)n[e]=v[n[e]];return n}function h(o,n){const e=new Uint8Array(n);let l=0;for(let a=0;a<n-1;a++)for(let s=0;s<n-1;s++)o[s+n*a]&o[s+1+n*a]&o[s+n*(a+1)]&o[s+1+n*(a+1)]|(o[s+n*a]|o[s+1+n*a]|o[s+n*(a+1)]|o[s+1+n*(a+1)])^1&&(l+=q);let r,t=0;for(let a=0;a<n;a++){let s=0;e[0]=0;for(let j=0,A=0;A<n;A++)r=o[A+n*a],j===r?e[s]++:e[++s]=1,j=r,t+=j?1:-1;l+=I(s,e)}t<0&&(t=-t);let f=0,i=t;for(i+=i<<2,i<<=1;i>n*n;)i-=n*n,f++;l+=f*W;for(let a=0;a<n;a++){let s=0;e[0]=0;for(let j=0,A=0;A<n;A++)r=o[a+n*A],j===r?e[s]++:e[++s]=1,j=r;l+=I(s,e)}return l}function w(o,n,e,l,r,t){let f,i=n.length;for(let j=0;j<i;j++)e[j]=n.charCodeAt(j);const a=E(l,r,t);i>=a-2&&(i=a-2,o>9&&i--);let s=i;if(o>9){for(e[s+2]=0,e[s+3]=0;s--;)f=e[s],e[s+3]|=255&f<<4,e[s+2]=f>>4;e[2]|=255&i<<4,e[1]=i>>4,e[0]=64|i>>12}else{for(e[s+1]=0,e[s+2]=0;s--;)f=e[s],e[s+2]|=255&f<<4,e[s+1]=f>>4;e[1]|=255&i<<4,e[0]=64|i>>4}for(s=i+3-+(o<10);s<a;)e[s++]=236,e[s++]=17;return e}function d(o,n,e,l){const r=new Uint8Array(n);let t,f=0,i=3e4;for(t=0;t<8;t++){S(e,n,t,l);const a=h(n,e);if(a<i&&(i=a,f=t),f===7)break;n=new Uint8Array(r)}for(f!==t&&S(e,n,f,l),i=Q[f+(o-1<<3)],t=0;t<8;t++,i>>=1)i&1&&(n[e-1-t+e*8]=1,t<6?n[8+e*t]=1:n[8+e*(t+1)]=1);for(t=0;t<7;t++,i>>=1)i&1&&(n[8+e*(e-7+t)]=1,t?n[6-t+e*8]=1:n[7+e*8]=1);return n}function e1(o,n,e,l,r,t){let f,i=0;const a=E(e,l,r);for(f=0;f<e;f++){for(let s=0;s<l;s++)o[i++]=t[f+s*e];for(let s=0;s<r;s++)o[i++]=t[l*e+f+s*(e+1)]}for(let s=0;s<r;s++)o[i++]=t[l*e+f+s*(e+1)];for(f=0;f<n;f++)for(let s=0;s<l+r;s++)o[i++]=t[a+f+s*n];return o}function n1(o,n,e,l){if(o>1){const r=H[o];let t=n-7;for(;;){let f=n-7;for(;f>r-3&&(N(f,t,e,l,n),!(f<r));)f-=r;if(t<=r+9)break;t-=r,N(6,t,e,l,n),N(t,6,e,l,n)}}}function o1(o,n,e,l=0,r=0){n[r+3+e*(l+3)]=1;for(let t=0;t<6;t++)n[r+t+e*l]=1,n[r+e*(l+t+1)]=1,n[r+6+e*(l+t)]=1,n[r+t+1+e*(l+6)]=1;for(let t=1;t<5;t++)O(r+t,l+1,o),O(r+1,l+t+1,o),O(r+5,l+t,o),O(r+t+1,l+5,o);for(let t=2;t<4;t++)n[r+t+e*(l+2)]=1,n[r+2+e*(l+t+1)]=1,n[r+4+e*(l+t)]=1,n[r+t+1+e*(l+4)]=1}function t1(o,n,e){for(let l=0;l<3;l++)o1(o,n,e,l===1?e-7:0,l===2?e-7:0)}function l1(o,n){for(let e=0;e<7;e++)O(7,e,n),O(o-8,e,n),O(7,e+o-7,n);for(let e=0;e<8;e++)O(e,7,n),O(e+o-8,7,n),O(e,o-8,n)}function r1(o,n,e){for(let l=0;l<e-14;l++)l&1?(O(8+l,6,n),O(6,8+l,n)):(o[8+l+e*6]=1,o[6+e*(8+l)]=1)}function i1(o,n,e,l){if(e<=6)return;const r=_[e-7];let t=17;for(let f=0;f<6;f++)for(let i=0;i<3;i++,t--)1&(t>11?e>>t-12:r>>t)?(o[5-f+n*(2-i+n-11)]=1,o[2-i+n-11+n*(5-f)]=1):(O(5-f,2-i+n-11,l),O(2-i+n-11,5-f,l))}function f1(o,n,e,l,r,t,f,i){let a,s=1,j=1,A=o-1,g=o-1;const L=(n+e)*(l+r)+r;for(let z=0;z<L;z++){a=i[z];for(let F=0;F<8;F++,a<<=1){128&a&&(f[A+o*g]=1);do j?A--:(A++,s?g!==0?g--:(A-=2,s^=1,A===6&&(A--,g=9)):g!==o-1?g++:(A-=2,s^=1,A===6&&(A--,g-=8))),j^=1;while(p(A,g,t))}}}function s1(o,n){for(let e=0;e<9;e++)O(e,8,o);for(let e=0;e<8;e++)O(e+n-8,8,o),O(8,e,o);for(let e=0;e<7;e++)O(8,e+n-7,o)}function a1(o){const n=x(x({},T),o),e=X[n.level],l=o.value,{version:r,neccBlock1:t,neccBlock2:f,dataBlock:i,eccBlock:a}=k(o.value.length,e),s=17+4*r;let j=new Uint8Array(s*s);const A=new Uint8Array(i+(i+a)*(t+f)+f),g=new Uint8Array(s*(s+1)+1>>1);t1(g,j,s),n1(r,s,j,g),j[8+s*(s-8)]=1,l1(s,g),s1(g,s),r1(j,g,s),i1(j,s,r,g),Z(s,g,j);const L=w(r,l,A,i,t,f),z=B(a);b(i,t,f,a,z,L);const F=e1(A,a,i,t,f,L.slice());return f1(s,i,a,t,f,g,j,F),j=d(e,j,s,g),{width:s,buffer:j,version:r}}const j1=(o,n)=>{let e="";for(let l=0;l<n.width;l++){for(let r=0;r<n.width;r++)n.buffer[r*n.width+l]?e+=o.foregroundChar:e+=o.backgroundChar;l!==n.width-1&&(e+=`
`)}return e},A1=o=>{const n=x(u(x({},T),{foregroundChar:"#",backgroundChar:" "}),typeof o=="string"?{value:o}:o),e=a1(n);return j1(n,e)},g1=Object.freeze(x({backgroundColor:"white",backgroundAlpha:1,foregroundColor:"black",foregroundAlpha:1,width:100,height:100},T));export{T as a,g1 as d,a1 as g,A1 as r};