/* Procedural pixel sprites: original artwork for 养鱼高手思宇. */
(()=>{'use strict';
const SW=96,SH=68,cache=new Map(),thumbs=new Map();
function mix(a,b,t){const n=x=>parseInt(x,16);const A=[n(a.slice(1,3)),n(a.slice(3,5)),n(a.slice(5,7))],B=[n(b.slice(1,3)),n(b.slice(3,5)),n(b.slice(5,7))];return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function sprite(s,frame){const key=s.id+':'+frame;if(cache.has(key))return cache.get(key);const c=document.createElement('canvas');c.width=SW;c.height=SH;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
const main=s.color,dark=s.dark,accent=s.accent,light=mix(main,'#ffffff',.34),edge=mix(dark,'#182d42',.25),ivory='#fff8df';
const px=(x,y,col,w=1,h=1)=>{g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),w,h);};
const rect=(x,y,w,h,col)=>px(x,y,col,w,h);
function poly(points,col){let min=Math.floor(Math.min(...points.map(p=>p[1]))),max=Math.ceil(Math.max(...points.map(p=>p[1])));for(let y=min;y<=max;y++){const cuts=[];for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[j],b=points[i];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}cuts.sort((a,b)=>a-b);for(let i=0;i<cuts.length;i+=2)if(cuts[i+1]!==undefined)rect(Math.ceil(cuts[i]),y,Math.max(1,Math.floor(cuts[i+1])-Math.ceil(cuts[i])+1),1,col);}}
function ell(cx,cy,rx,ry,col){for(let y=-ry;y<=ry;y++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(cx-w,cy+y,w*2+1,1,col);}}
function line(x1,y1,x2,y2,col,width=1){let n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1));for(let i=0;i<=n;i++){const t=n?i/n:0;rect(Math.round(x1+(x2-x1)*t),Math.round(y1+(y2-y1)*t),width,width,col);}}
function star(x,y,col,r=4){rect(x-r,y,r*2+1,1,col);rect(x,y-r,1,r*2+1,col);rect(x-1,y-1,3,3,col);}
function fin(points,col=dark){poly(points,edge);const inner=points.map(([x,y])=>[x+(x<44?1:-1),y+(y<32?1:-1)]);poly(inner,col);}
const swing=frame-1;
function tail(kind='fork',x=24,y=33,scale=1){const p=(a,b)=>[Math.round(x+a*scale),Math.round(y+b*scale)];if(kind==='fan'){fin([p(1,0),p(-17,-19+swing),p(-24,-16+swing),p(-23,-7),p(-25,0),p(-23,7),p(-24,16+swing),p(-17,19+swing)],dark);for(let a=-14;a<=14;a+=7)line(x-3,y,x-19,y+a,light);}else if(kind==='veil'){fin([p(2,0),p(-15,-22+swing),p(-22,-21),p(-21,-10),p(-27,-4),p(-22,3),p(-26,12),p(-19,13),p(-21,24+swing),p(-12,19)],main);for(let a=-17;a<=17;a+=7)line(x-1,y,x-18,y+a,accent);}else if(kind==='crescent'){fin([p(2,0),p(-15,-21+swing),p(-10,-7),p(-8,0),p(-10,7),p(-15,21+swing)],dark);}else if(kind==='ribbon'){fin([p(1,-2),p(-9,-12),p(-23,-21+swing),p(-26,-18),p(-13,-4),p(-3,1),p(-15,8),p(-25,21+swing),p(-20,22),p(-7,10)],main);line(x-7,y-5,x-23,y-19,accent);line(x-7,y+5,x-22,y+19,accent);}else{fin([p(2,0),p(-14,-13+swing),p(-15,-9+swing),p(-10,0),p(-15,9+swing),p(-14,13+swing)],dark);line(x-3,y,x-12,y-7+swing,accent);line(x-3,y,x-12,y+7+swing,accent);}}
const mask=new Uint8Array(SW*SH);function mpx(x,y){x=Math.round(x);y=Math.round(y);if(x>=0&&x<SW&&y>=0&&y<SH)mask[y*SW+x]=1;}
function me(cx,cy,rx,ry){for(let y=-ry;y<=ry;y++){const w=Math.floor(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));for(let x=-w;x<=w;x++)mpx(cx+x,cy+y);}}
function mp(points){for(let y=Math.floor(Math.min(...points.map(p=>p[1])));y<=Math.ceil(Math.max(...points.map(p=>p[1])));y++){const cuts=[];for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[j],b=points[i];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))cuts.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}cuts.sort((a,b)=>a-b);for(let i=0;i<cuts.length;i+=2)for(let x=Math.ceil(cuts[i]);x<=Math.floor(cuts[i+1]);x++)mpx(x,y);}}
let eye=[64,29],mouth=[69,36],bodyMid=33,bodyTop=18,bodyBottom=48;
switch(s.shape){
case 'round':tail(s.feature==='doubletail'?'fan':'fork',30,34,.85);fin([[43,20],[36,10],[53,17]],dark);fin([[39,45],[48,53],[58,44]],dark);me(48,34,21,16);eye=[62,29];mouth=[68,36];break;
case 'carp':tail('fork',27,33);fin([[38,24],[39,13],[54,17],[60,26]],dark);fin([[38,43],[43,51],[53,44]],dark);me(47,33,25,13);eye=[64,29];mouth=[71,36];break;
case 'bighead':tail('fork',26,34);fin([[34,23],[42,13],[57,24]],dark);me(49,34,26,15);me(64,33,11,13);eye=[67,35];mouth=[75,38];break;
case 'slender':case 'neon':tail('fork',25,33,.8);fin([[41,26],[47,17],[54,27]],dark);fin([[45,39],[50,46],[59,39]],dark);me(48,33,28,9);eye=[68,30];mouth=[75,35];bodyTop=24;bodyBottom=42;break;
case 'trout':tail('fork',24,33);fin([[40,23],[43,15],[53,22]],dark);fin([[57,25],[61,19],[65,25]],dark);fin([[43,43],[49,50],[56,42]],dark);me(47,33,27,12);eye=[67,29];mouth=[73,36];break;
case 'guppy':tail('fan',39,33);fin([[44,28],[44,18],[55,26]],accent);fin([[44,39],[45,48],[56,40]],accent);me(56,33,18,10);eye=[68,30];mouth=[73,36];break;
case 'betta':tail('veil',31,33);fin([[33,26],[34,12],[46,7],[58,13],[66,24]],main);fin([[31,40],[36,54],[45,59],[56,54],[67,39]],main);for(let x=37;x<64;x+=6)line(x,42,x-1,52,accent);me(50,33,23,11);eye=[66,29];mouth=[72,36];break;
case 'angel':tail('fork',28,33,.85);fin([[39,28],[37,5],[54,16],[61,30]],dark);fin([[40,39],[39,61],[56,46],[62,36]],dark);mp([[27,33],[46,13],[68,30],[69,38],[45,52]]);eye=[61,29];mouth=[68,36];line(53,42,49,62,accent);line(57,43,58,59,accent);break;
case 'discus':tail('fork',32,33,.8);fin([[32,23],[37,8],[54,9],[65,21]],dark);fin([[34,45],[40,57],[57,56],[65,44]],dark);me(49,33,21,22);eye=[64,28];mouth=[70,36];bodyTop=11;bodyBottom=55;break;
case 'gourami':tail('fan',31,33,.7);fin([[36,25],[38,15],[56,17],[66,28]],dark);fin([[34,41],[42,51],[62,46]],dark);me(49,33,24,15);eye=[66,28];mouth=[73,35];break;
case 'catfish':tail('fork',21,35,.85);fin([[32,28],[40,15],[50,27]],dark);fin([[49,42],[53,53],[66,44]],dark);me(48,35,29,12);me(65,34,13,12);eye=[69,29];mouth=[77,38];bodyBottom=47;break;
case 'eel':for(let x=5;x<82;x++){const yy=32+Math.round(Math.sin((x/17)+frame*.15)*5);me(x,yy,2,Math.round(2+x/22));}fin([[9,30],[24,23],[45,23],[63,22],[79,26],[78,29],[55,28],[36,28],[17,32]],dark);eye=[78,27];mouth=[83,33];bodyTop=25;bodyBottom=43;break;
case 'sturgeon':tail('crescent',23,34,.8);fin([[38,27],[42,15],[51,27]],dark);fin([[53,40],[56,51],[62,41]],dark);mp([[17,34],[40,22],[61,24],[86,32],[65,38],[40,44]]);eye=[67,29];mouth=[74,36];break;
case 'arowana':tail('fan',24,34,.65);fin([[28,28],[30,19],[58,18],[70,25]],dark);fin([[28,41],[40,48],[66,44]],dark);me(47,33,29,12);mp([[65,24],[79,25],[76,35],[67,42]]);eye=[69,29];mouth=[77,34];break;
case 'clown':tail('fan',28,33,.55);fin([[33,25],[39,14],[59,15],[67,26]],dark);fin([[36,41],[43,49],[60,44]],dark);me(48,33,24,14);eye=[65,29];mouth=[72,36];break;
case 'tang':tail('fork',31,33,.75);fin([[32,24],[34,11],[58,13],[67,26]],s.feature==='sail'?accent:dark);fin([[34,43],[39,55],[61,51]],dark);me(49,33,23,20);eye=[65,29];mouth=[72,36];break;
case 'butterfly':tail('fork',30,33,.7);fin([[32,24],[43,7],[59,18],[65,29]],accent);fin([[32,42],[44,57],[61,45]],dark);me(48,33,23,20);mp([[63,30],[78,32],[65,38]]);eye=[65,29];mouth=[77,33];break;
case 'puffer':tail('fork',29,34,.65);me(49,34,22,22);fin([[45,32],[32,32],[38,39]],accent);eye=[64,29];mouth=[71,38];bodyTop=12;bodyBottom=56;break;
case 'flat':tail('fork',25,34,.7);fin([[26,24],[43,10],[62,15],[77,30]],dark);fin([[26,43],[43,57],[67,51],[77,39]],dark);me(49,34,28,s.feature==='roundbody'?21:18);eye=[65,27];mouth=[76,36];bodyTop=14;bodyBottom=56;break;
case 'grouper':tail('fan',23,34,.65);fin([[27,27],[34,14],[49,17],[64,24]],dark);fin([[39,42],[47,52],[65,44]],dark);me(46,34,29,16);mp([[63,23],[76,25],[78,32],[72,35],[79,39],[72,44],[61,45]]);eye=[68,28];mouth=[77,35];break;
case 'snapper':case 'perch':case 'cod':case 'wrasse':tail('fork',25,34,.9);fin([[29,25],[34,13],[38,19],[44,10],[49,17],[55,12],[62,25]],dark);fin([[37,44],[43,53],[54,43]],dark);me(48,34,26,s.shape==='wrasse'?18:14);if(s.shape==='wrasse')me(62,24,10,10);eye=[67,29];mouth=[74,36];break;
case 'tuna':tail('crescent',25,33,.9);fin([[43,23],[47,13],[55,25]],dark);fin([[46,40],[52,50],[57,40]],dark);mp([[22,33],[38,20],[54,20],[69,26],[78,34],[68,42],[52,46],[36,43]]);eye=[69,29];mouth=[77,36];break;
case 'shark':case 'whaleshark':case 'hammerhead':tail('crescent',22,34,.9);fin([[41,25],[44,8],[57,27]],dark);fin([[45,38],[39,56],[62,41]],dark);mp([[18,34],[39,23],[59,24],[79,31],[83,36],[65,43],[38,44]]);if(s.shape==='hammerhead'){mp([[70,19],[82,19],[85,24],[79,28],[81,42],[76,46],[68,44],[70,37]]);eye=[80,21];mouth=[78,37];}else{eye=[72,29];mouth=[80,37];}if(s.shape==='whaleshark'){me(65,33,15,14);eye=[73,28];mouth=[79,37];}break;
case 'ray':line(5,34,31,33,dark,2);fin([[49,9],[80,29],[83,34],[72,45],[47,58],[17,38],[16,30]],dark);mp([[48,15],[76,29],[78,35],[48,50],[22,36],[22,30]]);eye=[64,28];mouth=[72,36];bodyTop=15;bodyBottom=50;break;
case 'seahorse':fin([[40,26],[28,26],[32,37],[41,38]],accent);me(48,21,11,12);mp([[47,29],[54,31],[54,43],[46,51],[38,50],[33,43],[36,38],[41,38],[40,44],[44,46],[47,43]]);mp([[53,17],[71,19],[70,24],[54,25]]);fin([[41,14],[38,6],[46,9],[48,5],[53,11]],dark);eye=[54,17];mouth=[70,23];bodyTop=10;bodyBottom=51;break;
case 'swordfish':case 'sailfish':tail('crescent',23,34,.9);fin(s.shape==='sailfish'?[[28,27],[33,6],[48,7],[61,16],[64,28]]:[[42,26],[43,14],[53,27]],dark);fin([[43,40],[48,49],[55,40]],dark);me(47,34,27,10);mp([[67,29],[93,29],[71,33]]);eye=[67,29];mouth=[74,35];bodyTop=24;bodyBottom=44;break;
case 'flying':tail('fork',23,33,.85);fin([[39,31],[22,10],[40,16],[58,30]],accent);fin([[40,35],[27,58],[48,49],[61,35]],accent);for(let a=0;a<4;a++){line(42,33,29+a*5,53-a*3,light);line(42,30,29+a*5,16+a*2,light);}me(49,33,28,8);eye=[70,29];mouth=[77,34];break;
case 'ribbon':for(let x=8;x<83;x++){let y=31+Math.round(Math.sin(x/12+frame*.12)*4);for(let yy=-5;yy<=5;yy++)mpx(x,y+yy);}fin([[10,27],[25,22],[38,23],[50,20],[64,23],[79,22],[81,27],[62,27],[40,29]],dark);me(78,29,9,6);eye=[82,27];mouth=[88,32];bodyTop=23;bodyBottom=42;break;
case 'lionfish':for(let a=0;a<8;a++){let x=27+a*5;fin([[x,28],[x-6,3+(a%3)*4],[x+8,26]],a%2?accent:dark);fin([[x,39],[x-4,61-(a%3)*4],[x+10,42]],a%2?accent:dark);}tail('fan',24,34,.8);me(48,34,24,14);eye=[66,29];mouth=[73,36];break;
case 'lantern':case 'angler':tail('fork',26,35,.7);fin([[35,25],[39,15],[53,22]],dark);me(48,35,s.shape==='angler'?25:24,s.shape==='angler'?20:12);eye=[65,29];mouth=[72,39];bodyBottom=55;break;
case 'robot':tail('fork',26,34,.9);fin([[36,24],[38,12],[56,12],[62,25]],dark);fin([[37,42],[42,52],[57,43]],dark);mp([[25,25],[57,20],[72,25],[78,34],[71,44],[39,48],[24,40]]);eye=[66,28];mouth=[75,37];break;
case 'cloud':tail('veil',29,35,.7);me(47,34,24,15);me(36,25,12,11);me(50,20,13,13);me(63,27,12,12);me(40,42,13,11);me(57,44,12,10);eye=[65,28];mouth=[72,36];bodyTop=7;bodyBottom=55;break;
case 'ghost':mp([[20,36],[28,20],[41,15],[58,15],[72,24],[77,38],[70,45],[63,39],[57,49],[49,42],[40,51],[33,44],[22,47]]);eye=[62,28];mouth=[68,38];bodyTop=15;bodyBottom=51;break;
case 'phoenix':tail('ribbon',29,33,1);for(let n=0;n<3;n++){fin([[33+n*7,26],[27+n*6,7-n*2],[42+n*7,19]],n%2?accent:dark);fin([[32+n*7,39],[23+n*7,59],[46+n*7,43]],n%2?accent:dark);}me(51,33,25,11);eye=[69,29];mouth=[76,35];break;
case 'dragon':tail('ribbon',26,35,.8);fin([[33,26],[29,16],[42,23],[45,11],[53,24],[59,16],[67,28]],accent);me(49,33,28,12);mp([[65,22],[78,24],[82,31],[76,35],[80,39],[63,44]]);eye=[71,28];mouth=[80,36];break;
case 'emperor':tail('ribbon',28,34,1);fin([[34,24],[30,13],[42,17],[51,8],[65,24]],accent);fin([[34,42],[25,57],[45,48],[54,59],[66,40]],accent);me(50,33,26,12);mp([[65,24],[77,28],[81,34],[73,41],[63,44]]);eye=[70,28];mouth=[79,36];break;
default:tail();me(48,33,24,14);
}
// A one-pixel border and a shaded belly unify the many silhouettes.
for(let y=1;y<SH-1;y++)for(let x=1;x<SW-1;x++)if(mask[y*SW+x]){if(!mask[y*SW+x-1]||!mask[y*SW+x+1]||!mask[(y-1)*SW+x]||!mask[(y+1)*SW+x])px(x,y,edge);else{const depth=(y-bodyTop)/(bodyBottom-bodyTop);let col=depth<.22?light:depth>.72?mix(main,accent,.38):main;const h=((x*37+y*19+(s.id?.charCodeAt(5)||0)*11)%101);
switch(s.pattern){
case 'scales':if(y%5===0&&((x+(Math.floor(y/5)%2)*3)%7)<3)col=dark;break;
case 'gold':if((x+y)%9===0)col=accent;break;
case 'silver':if(y>bodyMid+2)col=mix(main,ivory,.55);if(y===bodyMid-4&&x%3!==0)col=light;break;
case 'spots':if(h<9&&x<eye[0]-4)col=dark;break;
case 'patches':if((Math.sin(x*.31)+Math.cos(y*.41))>1.1)col=dark;break;
case 'bars':if(Math.floor((x+y*.16)/8)%2===0)col=dark;break;
case 'stripes':if((y+Math.floor(x*.18))%7<3)col=dark;break;
case 'stripe':if(Math.abs(y-bodyMid)<2)col=dark;break;
case 'rainbow':if(Math.abs(y-bodyMid)<3)col=s.shape==='trout'?accent:['#f5a4ae','#f3d67b','#a5d6a3','#8fc9df','#c9ade4'][Math.min(4,Math.max(0,Math.floor((x-24)/9)))];break;
case 'neon':if(y>=bodyMid-4&&y<=bodyMid-2)col=accent;if(y>bodyMid&&x<51)col='#ef6a77';break;
case 'koi':if(Math.sin(x*.22)+Math.sin(y*.35)>1)col=dark;break;
case 'maze':if((Math.floor(Math.sin(y*.42)*3)+x)%8<2)col=accent;break;
case 'pearls':if(x%6===0&&y%5===0)col=accent;if(Math.abs(y-bodyMid)<1)col=dark;break;
case 'plates':if(x%9<3&&y<bodyMid)col=accent;break;
case 'clown':if((x>33&&x<39)||(x>52&&x<59))col=accent;else if(x===32||x===39||x===51||x===59)col=edge;break;
case 'tang':if((x>40&&x<58&&y<35)||(x<39&&y>30))col=dark;break;
case 'eyeband':if(Math.abs(x-eye[0]+Math.floor((y-30)*.15))<3)col=dark;break;
case 'diamonds':if((x+y)%13<2||(x-y+100)%13<2)col=dark;break;
case 'waves':if(y<bodyMid&&((x+Math.floor(Math.sin(y*.7)*3))%9)<3)col=dark;break;
case 'constellation':if((x%9===0&&y%8<2)||(x%9===4&&y%8===4))col=accent;break;
case 'glow':if(y>bodyMid&&x%7<2)col=accent;break;
case 'tabby':if(x<55&&Math.floor((x+y*.3)/7)%2===0)col=dark;if(x>56&&y>31)col=accent;break;
case 'dog':if((x-38)**2+(y-26)**2<45)col=dark;if(x>58&&y>29)col=accent;break;
case 'boba':if(y>35&&h<17)col=dark;if(y<25)col=accent;break;
case 'watermelon':if(y<29)col=((x+Math.floor(y*.3))%9<3)?dark:main;else col=accent;if(y>33&&h<6)col=dark;break;
case 'seeds':if(x%7===2&&y%6===2)col=accent;break;
case 'mooncake':if((x+y)%9<2)col=dark;break;
case 'cloud':if(y>43)col=dark;else if(y<25)col=accent;break;
case 'lightning':if(Math.abs(x-46-Math.sin(y*.35)*5)<3)col=accent;break;
case 'metal':if(x%13===0||y%12===0)col=dark;if(x%13===2&&y%12===2)col=accent;break;
case 'suit':if(y>37)col=accent;if(x<39)col=dark;break;
case 'lava':if((x+Math.floor(Math.sin(y*.5)*5))%15<3)col=accent;else if(y<27)col=dark;break;
case 'crystal':if((x+y)%15<2||(x-y+100)%17<2)col=accent;else if((x+y)%15<7)col=light;break;
case 'sakura':if(h<6)col=accent;break;
case 'ghost':if(y>40)col=dark;break;
case 'fortune':if((x+y)%10<2)col=accent;break;
case 'galaxy':if(h<5)col=accent;else if(Math.abs(y-33-Math.sin(x*.12)*7)<2)col=mix(main,accent,.45);break;
case 'flame':if((x+Math.round(Math.sin(y*.6)*4))%12<4)col=accent;break;
case 'royal':if(y>34)col=mix(main,'#dbe6e9',.65);if((x+y)%11<2&&y<35)col=accent;break;
}px(x,y,col);}}
// Small pectoral fin, gill and a readable, bright eye.
if(!['ray','seahorse','flat','ghost','eel','ribbon'].includes(s.shape)){fin([[49,34],[39,38],[45,43],[53,37]],mix(dark,main,.3));line(eye[0]-8,eye[1]+3,eye[0]-9,eye[1]+8,dark);}
if(s.shape==='flat'){ell(58,29,3,4,ivory);rect(59,28,2,3,edge);}
if(s.shape==='ghost'){rect(eye[0]-2,eye[1]-2,5,7,edge);rect(eye[0]-10,eye[1]-2,4,7,edge);px(eye[0]-1,eye[1]-1,ivory);line(61,40,66,40,dark);}
else if(s.shape==='robot'){rect(eye[0]-4,eye[1]-3,10,7,edge);rect(eye[0]-2,eye[1]-1,7,3,accent);px(eye[0]+3,eye[1]-1,ivory);}
else{ell(eye[0],eye[1],4,4,ivory);rect(eye[0]+1,eye[1]-1,3,4,edge);px(eye[0]+1,eye[1]-1,'#ffffff');line(mouth[0]-3,mouth[1],mouth[0],mouth[1],dark);}
if(s.feature==='whiskers'||s.feature==='barbel'){line(mouth[0]-1,mouth[1],mouth[0]+7,mouth[1]+4,accent);line(mouth[0]-2,mouth[1]+1,mouth[0]+2,mouth[1]+8,accent);if(s.feature==='whiskers')line(mouth[0]-3,mouth[1]-1,mouth[0]+9,mouth[1]-3,accent);}
if((s.feature==='spines'||s.feature==='spikes')&&s.shape==='puffer'){for(let i=0;i<10;i++){let a=i/10*Math.PI*2,x=49+Math.cos(a)*22,y=34+Math.sin(a)*22;line(x,y,x+Math.cos(a)*5,y+Math.sin(a)*5,edge);px(x+Math.cos(a)*3,y+Math.sin(a)*3,accent,2,2);}}
if(s.feature==='finlets'){for(let i=0;i<3;i++){poly([[29+i*4,27],[31+i*4,23],[33+i*4,27]],accent);poly([[29+i*4,39],[31+i*4,44],[33+i*4,39]],accent);}}
if(s.feature==='teeth'){rect(75,37,5,2,edge);px(76,37,ivory);px(79,37,ivory);}
if(s.feature==='lantern'){line(50,17,51,7,dark,2);line(51,7,64,7,dark,2);line(64,7,66,13,dark,2);ell(66,15,4,4,accent);px(65,13,ivory,2,2);}
if(s.feature==='lips'){rect(72,32,5,3,accent);rect(73,36,4,2,dark);}
if(s.feature==='spot')ell(41,24,4,5,dark);
// Twenty imagination fish get accessories beyond palette changes.
switch(s.feature){
case 'cat':poly([[43,21],[42,8],[52,16]],edge);poly([[57,17],[66,8],[67,23]],edge);poly([[45,18],[45,12],[50,17]],accent);poly([[60,18],[64,12],[65,20]],accent);line(64,36,76,33,dark);line(64,38,77,39,dark);rect(67,33,3,2,'#bd6d67');break;
case 'dog':ell(42,22,6,13,dark);rect(63,32,11,9,accent);ell(72,34,3,3,edge);line(70,40,70,44,'#d87f88',2);break;
case 'straw':rect(44,5,4,19,edge);rect(45,5,2,16,'#edb4b0');rect(45,5,12,3,edge);rect(47,6,9,1,ivory);break;
case 'leaf':for(let i=-1;i<=1;i++)poly([[47,18],[41+i*7,5+Math.abs(i)*4],[51+i*6,15]],'#4d965f');break;
case 'moon':ell(47,30,8,9,accent);ell(50,27,6,8,main);rect(34,42,18,2,accent);break;
case 'cloud':for(let i=0;i<3;i++)poly([[16+i*6,45],[13+i*6,51],[18+i*6,51]],accent);break;
case 'unicorn':poly([[58,19],[63,1],[67,21]],edge);poly([[60,18],[63,4],[65,18]],accent);star(31,17,ivory,3);break;
case 'electric':poly([[32,13],[24,22],[30,22],[24,31],[37,20],[30,20]],accent);poly([[26,43],[17,51],[25,50],[21,58],[34,46]],accent);break;
case 'gear':ell(40,31,8,8,dark);for(let i=0;i<8;i++){const a=i*Math.PI/4;rect(39+Math.cos(a)*9,30+Math.sin(a)*9,3,3,accent);}ell(40,31,5,5,accent);ell(40,31,2,2,edge);rect(55,45,11,3,edge);break;
case 'helmet':for(let x=47;x<82;x++){const a=(x-47)/35*Math.PI;px(x,32-Math.round(Math.sin(a)*22),'#e9f7fa');}line(81,29,81,40,'#e9f7fa',2);line(77,43,51,47,'#e9f7fa',2);rect(50,12,6,2,ivory);rect(53,17,3,6,ivory);rect(29,28,8,15,edge);rect(31,30,4,11,accent);break;
case 'flame':poly([[43,22],[42,10],[47,14],[50,2],[55,13],[62,8],[60,23]],accent);poly([[48,21],[49,13],[54,18],[56,12],[57,22]],'#fff1b2');break;
case 'ice':line(46,26,46,42,accent,2);line(39,30,54,38,accent);line(39,38,54,30,accent);poly([[40,17],[45,3],[49,16]],accent);break;
case 'sakura':for(const [x,y] of [[38,23],[48,42],[22,48]]){for(const [dx,dy] of [[0,-3],[3,-1],[2,3],[-2,3],[-3,-1]])ell(x+dx,y+dy,2,2,accent);px(x,y,'#f5ce7b',2,2);}break;
case 'ghost':star(24,19,accent,3);star(81,47,accent,2);break;
case 'coin':ell(44,28,8,8,edge);ell(44,28,6,6,accent);rect(42,26,4,4,dark);poly([[41,20],[35,12],[42,15],[47,10],[53,16],[59,12],[57,20]],accent);break;
case 'stars':star(43,25,accent,4);star(56,37,accent,3);star(26,28,ivory,2);star(66,20,ivory,2);break;
case 'phoenix':poly([[63,23],[60,8],[67,15],[71,5],[73,23]],accent);line(43,24,19,11,accent);line(41,42,18,56,accent);star(33,16,ivory,2);break;
case 'dragon':line(66,24,61,11,accent,2);line(61,11,56,8,accent,2);line(72,22,76,9,accent,2);line(76,9,81,7,accent,2);line(78,37,88,42,accent);line(86,41,90,38,accent);line(73,40,82,48,accent);break;
case 'crown':poly([[57,20],[53,8],[61,12],[66,2],[71,12],[80,8],[76,21]],edge);poly([[59,18],[56,11],[62,15],[66,6],[70,15],[77,11],[74,18]],accent);rect(58,20,17,3,accent);px(65,14,'#d7f1f3',3,3);star(37,23,'#f8e3a0',3);line(71,25,77,27,dark);line(28,44,8,56,'#d7e6eb',2);line(28,23,8,12,'#d7e6eb',2);star(15,49,accent,2);break;
}
cache.set(key,c);return c;}
function draw(ctx,s,x,y,size=1,dir=1,time=0,opts={}){if(!s)return;const frame=opts.still?1:Math.floor((Math.max(0,Number(time)||0)+Number(s.id.slice(-2))*.07)/.22)%3;const c=sprite(s,frame);ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x),Math.round(y));ctx.scale(dir<0?-1:1,1);ctx.drawImage(c,-36*size,-25.5*size,72*size,51*size);ctx.restore();}
function thumbnail(s,width=112,height=72){const key=s.id+':'+width+':'+height;if(thumbs.has(key))return thumbs.get(key);const c=document.createElement('canvas');c.width=width;c.height=height;const ctx=c.getContext('2d');draw(ctx,s,width/2,height/2,Math.min(width/81,height/59),1,220,{still:true});const url=c.toDataURL('image/png');thumbs.set(key,url);return url;}
window.FishArt={draw,thumbnail};
})();
