'use strict';
/* ================= utils ================= */
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rand=(a,b)=>a+Math.random()*(b-a);
const W=960,H=540,GY=484;
const cv=$('cv'),ctx=cv.getContext('2d');
const stage=$('stage');
function fit(){const r=stage.getBoundingClientRect();stage.style.fontSize=Math.max(7,r.width/48)+'px';}
addEventListener('resize',fit);fit();
function mulberry(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function rrect(x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function circ(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();}
function ovR(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function circleRect(cx,cy,r,rc){const nx=clamp(cx,rc.x,rc.x+rc.w),ny=clamp(cy,rc.y,rc.y+rc.h),dx=cx-nx,dy=cy-ny;return dx*dx+dy*dy<=r*r;}
if(document.fonts&&document.fonts.load){document.fonts.load('20px Bangers');}

/* ================= audio ================= */
let AC=null,MG=null,sndOn=true,NB=null;
function initAudio(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.42;MG.connect(AC.destination);}catch(e){}}
function tone(f0,f1,d,type,v,delay){if(!AC||!sndOn)return;type=type||'square';v=v==null?.18:v;delay=delay||0;const t0=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(Math.max(20,f0),t0);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+d);g.gain.setValueAtTime(v,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g);g.connect(MG);o.start(t0);o.stop(t0+d+.03);}
function noiz(d,v,f,type,delay){if(!AC||!sndOn)return;delay=delay||0;if(!NB){NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const ch=NB.getChannelData(0);for(let i=0;i<AC.sampleRate;i++)ch[i]=Math.random()*2-1;}const t0=AC.currentTime+delay,s=AC.createBufferSource();s.buffer=NB;s.loop=true;const fl=AC.createBiquadFilter();fl.type=type||'lowpass';fl.frequency.value=f||1200;const g=AC.createGain();g.gain.setValueAtTime(v||.2,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(fl);fl.connect(g);g.connect(MG);s.start(t0);s.stop(t0+d+.03);}
const SFX={
 transform(){tone(380,900,.16,'square',.22);tone(620,1500,.22,'square',.16,.05);noiz(.3,.14,3200,'highpass');},
 deny(){tone(170,90,.16,'sawtooth',.18);},
 revert(){tone(900,280,.22,'square',.15);},
 power(){tone(700,120,.5,'sawtooth',.2);noiz(.4,.12,600);},
 fire(){noiz(.16,.2,900);tone(320,110,.13,'sawtooth',.12);},
 shard(){tone(1300,760,.07,'triangle',.14);tone(1700,900,.06,'triangle',.1,.03);},
 punch(){noiz(.12,.3,320);tone(130,55,.13,'square',.24);},
 dash(){noiz(.13,.12,4200,'highpass');},
 jump(){tone(240,520,.12,'sine',.14);},
 hit(){tone(210,80,.07,'square',.18);},
 kill(){noiz(.24,.26,1400);tone(420,60,.24,'sawtooth',.18);},
 hurt(){tone(300,110,.2,'sawtooth',.24);noiz(.15,.15,800);},
 clink(){tone(1800,2400,.05,'triangle',.12);},
 pickup(){tone(620,940,.09,'sine',.18);tone(940,1250,.1,'sine',.14,.08);},
 wave(){tone(220,220,.1,'square',.14);tone(330,330,.12,'square',.14,.11);},
 clear(){[440,554,659,880].forEach((f,i)=>tone(f,f,.14,'square',.15,i*.09));},
 roar(){tone(95,38,.7,'sawtooth',.3);noiz(.6,.2,380);},
 die(){tone(400,60,.6,'sawtooth',.25);noiz(.5,.25,900);},
 win(){[523,659,784,1046,784,1046].forEach((f,i)=>tone(f,f,.16,'square',.16,i*.11));}
};
/* tiny music sequencer */
const BASSP=[55,0,55,58.3,55,0,65.4,0,49,0,49,55,58.27,0,43.65,0];
let mStep=0,mNext=0;
setInterval(()=>{
 if(!AC||!sndOn||state!=='play'||paused||!player||player.dead){mNext=AC?AC.currentTime+.06:0;mStep=0;return;}
 const spb=60/126/2;
 if(mNext<AC.currentTime)mNext=AC.currentTime+.05;
 while(mNext<AC.currentTime+.16){
  const n=BASSP[mStep%16],dl=mNext-AC.currentTime;
  if(n){const o=AC.createOscillator(),g=AC.createGain(),fl=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=n*(bossActive?.75:1);fl.type='lowpass';fl.frequency.value=520;g.gain.setValueAtTime(.06,mNext);g.gain.exponentialRampToValueAtTime(.001,mNext+spb*.9);o.connect(fl);fl.connect(g);g.connect(MG);o.start(mNext);o.stop(mNext+spb);}
  if(mStep%4===2)noiz(.03,.028,7000,'highpass',dl);
  mStep++;mNext+=spb;
 }
},70);

/* ================= data ================= */
const FORMS={
 ben:{name:'BEN',speed:255,jump:760,def:1,h:50,w:22},
 heatblast:{name:'HEATBLAST',speed:265,jump:790,def:1,h:56,w:26},
 xlr8:{name:'XLR8',speed:465,jump:810,def:1,h:54,w:24},
 fourarms:{name:'FOUR ARMS',speed:215,jump:840,def:1,h:66,w:34},
 diamondhead:{name:'DIAMONDHEAD',speed:245,jump:790,def:.5,h:58,w:28}
};
const ORDER=['heatblast','xlr8','fourarms','diamondhead'];
const ETYPES={
 drone:{hp:2,score:100,dmg:1,fly:1,shooter:1},
 fast:{hp:1,score:150,dmg:1,fly:1,sp:265},
 hunter:{hp:5,score:250,dmg:2,armor:1},
 turret:{hp:3,score:200,dmg:1,armor:0,static:1}
};
const PLATS=[
 [{x:180,y:372,w:160},{x:620,y:372,w:160},{x:400,y:272,w:160}],
 [{x:120,y:380,w:170},{x:670,y:380,w:170},{x:395,y:282,w:170}],
 [{x:150,y:380,w:150},{x:660,y:380,w:150},{x:405,y:290,w:150}]
];
const C={
 nara:'#9fb8a2',ben:'#aef07a',gwen:'#f48fd0',max:'#d9b06c',vil:'#ff5340',sys:'#7ee23a'
};
const CHAPTERS=[
 {name:'CH.1 — STRANGERS IN BELLWOOD',sub:'HOLD THE STREET',bg:0,
  intro:[
   {s:'NARRATOR',c:C.nara,t:'Summer vacation. 11 PM. A falling star slams into the quarry road outside Bellwood...'},
   {s:'NARRATOR',c:C.nara,t:'Ben Tennyson reaches toward the smoke — and a strange watch LEAPS onto his wrist.'},
   {s:'BEN',c:C.ben,t:'Ow—! Okay. Weird alien watch. Cool. Extremely cool. Please be a cool one.'},
   {s:'GWEN',c:C.gwen,t:'Ben! Whatever it is, it\'s broadcasting. Look at the sky!'},
   {s:'NARRATOR',c:C.nara,t:'Red dots descend through the dark. Drones. And they want the watch.'},
   {s:'GRANDPA MAX',c:C.max,t:'Kids, behind the Rust Bucket! Ben — make that thing do SOMETHING!'}
  ],
  waves:[[['drone',3]],[['drone',3],['fast',2]],[['drone',2],['fast',3],['turret',1]]],
  outro:[
   {s:'NARRATOR',c:C.nara,t:'Scrap litters the street. The night goes quiet.'},
   {s:'VILGAX (hologram)',c:C.vil,t:'Child. That device is the property of VILGAX. You are wearing my conquest.'},
   {s:'BEN',c:C.ben,t:'Yeah? Well... finders keepers, squid-face.'},
   {s:'GRANDPA MAX',c:C.max,t:'Everybody in! We\'re burning road — MOVE!'}
  ]},
 {name:'CH.2 — AMBUSH ON THE HIGHWAY',sub:'PROTECT THE RUST BUCKET',bg:1,
  intro:[
   {s:'NARRATOR',c:C.nara,t:'The Rust Bucket thunders down the desert highway. For a while, nothing follows.'},
   {s:'GWEN',c:C.gwen,t:'They\'re back. And these ones WALK.'},
   {s:'GRANDPA MAX',c:C.max,t:'Armor-plated hunters! Regular blasts just tickle them!'},
   {s:'SYSTEM',c:C.sys,t:'TIP: Armor shrugs off fireballs. Go FOUR ARMS (3) or DIAMONDHEAD (4) and hit them up close.'}
  ],
  waves:[[['hunter',2],['drone',2]],[['turret',2],['drone',3]],[['hunter',2],['turret',1],['drone',2],['fast',2]]],
  outro:[
   {s:'NARRATOR',c:C.nara,t:'The last hunter collapses into the asphalt. Too easily.'},
   {s:'GWEN',c:C.gwen,t:'The roadblocks... they weren\'t chasing us. They were herding us.'},
   {s:'NARRATOR',c:C.nara,t:'Above the mesas, a warship peels off the clouds. A tractor beam swallows the Rust Bucket whole.'},
   {s:'VILGAX',c:C.vil,t:'Come up, Ben Tennyson. Ten aliens, ten trophies... I only need the one wrist.'}
  ]},
 {name:'CH.3 — THE CONQUEROR\'S DECK',sub:'CLEAR THE DECK',bg:2,
  intro:[
   {s:'NARRATOR',c:C.nara,t:'The Chimeran Hammer. Flagship of Vilgax the Conqueror. Destroyer of ten worlds.'},
   {s:'VILGAX',c:C.vil,t:'The Omnitrix holds ten warriors. I have conquered ten worlds to take it.'},
   {s:'BEN',c:C.ben,t:'Then here\'s a new entry for your log: this watch doesn\'t come off... and neither do WE.'},
   {s:'SYSTEM',c:C.sys,t:'Clear the deck. Then... him.'}
  ],
  waves:[[['drone',3],['fast',2],['hunter',1]],'BOSS'],
  outro:[
   {s:'NARRATOR',c:C.nara,t:'Vilgax\'s flagship limps out of Earth\'s sky, trailing smoke.'},
   {s:'BEN',c:C.ben,t:'Ten heroes. One watch. And you brought an army.'},
   {s:'GWEN',c:C.gwen,t:'Don\'t let it go to his head, Grandpa.'},
   {s:'GRANDPA MAX',c:C.max,t:'Road trip\'s back on. Hero time, whenever it\'s needed.'},
   {s:'NARRATOR',c:C.nara,t:'THE END — but the watch still glows. HERO MODE unlocked.'}
  ]}
];

/* ================= state ================= */
let state='title',paused=false,T=0;
let player=null,enemies=[],shots=[],bolts=[],parts=[],rings=[],arcs=[],waves=[],beams=[],pops=[],pickups=[];
let boss=null,bossActive=false;
let chapterIdx=0,bgIndex=0,decor=null,platforms=PLATS[0];
let waveIdx=-1,spawnQueue=[],spawnTimer=0,waveActive=false,interT=0,clearPending=0;
let score=0,chapterStartScore=0,combo=0,comboTimer=0,bestCombo=0;
let shake=0,hitstop=0,flash=0,whiteFlash=0;
let banner=null,playT=0,chHints=[],heroMode=false,heroWaveN=0,heroStartScore=0;
let seenTransform=false,seenLow=false,seenLock=false,seenHunter=false,isTouch=false;
let heroUnlocked=false;
try{heroUnlocked=localStorage.getItem('b10hero')==='1';}catch(e){}
let deathT=0,overShown=false,wantAtk=false;

function mkPlayer(){return{x:W/2,y:GY,vx:0,vy:0,w:22,h:50,facing:1,form:'ben',hp:8,maxHp:8,energy:100,invuln:0,onGround:true,coyote:0,jbuf:0,atkCd:0,dashT:0,dashDir:1,dashId:0,dropT:0,lock:0,anim:0,punchT:0,benCd:0,dead:false,prevY:GY,trail:[],trailT:0};}
function prect(){return{x:player.x-player.w/2,y:player.y-player.h,w:player.w,h:player.h};}

/* ================= decor ================= */
function buildDecor(i){
 const R=mulberry(i*991+17);const d={stars:[],b1:[],b2:[],win:[],mesas:[],cacti:[],panels:[],dashes:[]};
 for(let k=0;k<70;k++)d.stars.push({x:R()*W,y:R()*300,s:R()*1.6+.4,tw:R()*6});
 if(i===0){
  let x=-20;while(x<W+40){const w=60+R()*90,h=110+R()*130;d.b1.push({x,w,h});x+=w+R()*30;}
  x=-30;while(x<W+60){const w=80+R()*110,h=60+R()*150;d.b2.push({x,w,h});for(let wy=0;wy<Math.floor(h/22);wy++)for(let wx=0;wx<Math.floor(w/20);wx++)if(R()<.24)d.win.push({x:x+6+wx*20,y:GY-h+10+wy*22,w:7,h:10,c:R()<.8?'#ffd98a':'#9fe8ff',a:.5+R()*.5});x+=w+R()*40;}
  for(let k=0;k<20;k++)d.dashes.push({x:k*52,y:GY+28});
 }else if(i===1){
  for(let k=0;k<5;k++){const mx=R()*W,w=140+R()*180,h=70+R()*90;d.mesas.push({x:mx,w,h});}
  for(let k=0;k<7;k++)d.cacti.push({x:R()*W,h:26+R()*30,s:R()<.5?-1:1});
  for(let k=0;k<24;k++)d.dashes.push({x:k*44,y:GY+26});
 }else{
  for(let k=0;k<13;k++){const px=k*76;d.panels.push({x:px,w:58,h:250+R()*120,glow:R()<.5,vent:R()<.4});}
  for(let k=0;k<18;k++)d.dashes.push({x:k*56,y:GY+24});
 }
 decor=d;
}

/* ================= flow ================= */
function showTitle(){state='title';paused=false;heroMode=false;bgIndex=0;buildDecor(0);platforms=PLATS[0];
 enemies=[];shots=[];bolts=[];parts=[];rings=[];arcs=[];waves=[];beams=[];pops=[];pickups=[];boss=null;bossActive=false;banner=null;
 ['hud','dial','hint','touch'].forEach(id=>$(id).classList.add('hidden'));
 $('ovTitle').classList.remove('hidden');$('ovOver').classList.add('hidden');$('ovWin').classList.add('hidden');$('ovPause').classList.add('hidden');$('ovStory').classList.add('hidden');$('ovHow').classList.add('hidden');
 $('btnHero').style.display=heroUnlocked?'':'none';
}
function loadChapter(i,hero){
 heroMode=!!hero;chapterIdx=i;
 if(hero){bgIndex=2;heroWaveN=0;heroStartScore=score;}
 else{bgIndex=CHAPTERS[i].bg;}
 buildDecor(bgIndex);platforms=PLATS[bgIndex];
 enemies=[];shots=[];bolts=[];parts=[];rings=[];arcs=[];waves=[];beams=[];pops=[];pickups=[];
 boss=null;bossActive=false;$('bossWrap').classList.add('hidden');
 player=mkPlayer();waveIdx=-1;waveActive=false;clearPending=0;combo=0;comboTimer=0;
 seenTransform=false;seenLow=false;seenLock=false;seenHunter=false;playT=0;overShown=false;
 if(!hero)chapterStartScore=score;
 $('chLabel').textContent=hero?'HERO MODE — ENDLESS':CHAPTERS[i].name;
 $('waveLabel').textContent=hero?'SURVIVE':'';
}
function beginPlay(){
 state='play';paused=false;
 ['hud','dial'].forEach(id=>$(id).classList.remove('hidden'));
 $('ovOver').classList.add('hidden');$('ovWin').classList.add('hidden');
 if(isTouch)$('touch').classList.remove('hidden');
 if(heroMode){showBanner('HERO MODE','SURVIVE THE ENDLESS WAR','#7ee23a',2.2);interT=1.6;}
 else{const ch=CHAPTERS[chapterIdx];showBanner(ch.name,ch.sub,'#aef07a',2.4);interT=1.8;}
 if(!heroMode&&chapterIdx===0){
  chHints=[
   {t:.6,txt:isTouch?'USE THE PADS TO MOVE • TAP THE DIAL TO TRANSFORM':'A / D — MOVE • SPACE — JUMP • J — ATTACK',f:false},
   {t:4.4,txt:'PRESS 1 — GO HEATBLAST!',f:false},
   {t:12,txt:'THE DIAL IS WAITING. PRESS 1 TO TRANSFORM!',f:false}
  ];
 }else chHints=[];
 SFX.wave();
}
function nextWave(){
 if(heroMode){heroWaveN++;const n=heroWaveN;const comp=[['drone',Math.min(9,3+n)],['fast',Math.min(6,Math.floor(n/2)+(n>1?1:0))],['hunter',Math.min(4,Math.floor(n/2))],['turret',Math.min(3,Math.floor((n-1)/3))]].filter(c=>c[1]>0);
  buildQueue(comp);waveActive=true;spawnTimer=.4;
  $('waveLabel').textContent='WAVE '+n;showBanner('WAVE '+n,'','#ffb7a8',1.4);SFX.wave();return;}
 const ch=CHAPTERS[chapterIdx];
 waveIdx++;
 if(waveIdx>=ch.waves.length){chapterClear();return;}
 const w=ch.waves[waveIdx];
 if(w==='BOSS'){startBoss();return;}
 buildQueue(w);waveActive=true;spawnTimer=.4;
 $('waveLabel').textContent='WAVE '+(waveIdx+1)+'/'+ch.waves.length;
 showBanner('WAVE '+(waveIdx+1)+' / '+ch.waves.length,'','#ffb7a8',1.4);SFX.wave();
}
function buildQueue(comp){
 spawnQueue=[];
 comp.forEach(([t,n])=>{for(let k=0;k<n;k++)spawnQueue.push(t);});
 for(let i=spawnQueue.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=spawnQueue[i];spawnQueue[i]=spawnQueue[j];spawnQueue[j]=t;}
}
function chapterClear(){
 if(heroMode){score+=500;addPop(player.x,player.y-70,'+500','#aef07a');player.hp=Math.min(player.maxHp,player.hp+2);showBanner('WAVE CLEAR','+500','#aef07a',1.3);interT=1.7;SFX.clear();return;}
 score+=1500;player.hp=player.maxHp;
 showBanner('CHAPTER CLEAR','+1500 BONUS','#aef07a',2);clearPending=2.2;SFX.clear();
}
function advanceChapter(){
 if(chapterIdx<2){loadChapter(chapterIdx+1);showStory(CHAPTERS[chapterIdx].intro,beginPlay);}
 else showStory(CHAPTERS[2].outro,()=>{heroUnlocked=true;try{localStorage.setItem('b10hero','1');}catch(e){}showWin();});
}
function showOver(){state='over';overShown=true;$('overScore').textContent=score;$('ovOver').classList.remove('hidden');['dial','touch','hint'].forEach(id=>$(id).classList.add('hidden'));}
function showWin(){state='win';$('winScore').textContent=score;$('winCombo').textContent='×'+bestCombo;$('btnHero').style.display='';$('ovWin').classList.remove('hidden');['hud','dial','touch','hint'].forEach(id=>$(id).classList.add('hidden'));SFX.win();}

/* ================= story ================= */
let storyLines=[],storyIdx=0,storyDone=null,typeIv=null,typing=false,fullText='';
function showStory(lines,done){state='story';storyLines=lines;storyIdx=0;storyDone=done;$('ovStory').classList.remove('hidden');renderLine();}
function renderLine(){
 const L=storyLines[storyIdx];$('storyName').textContent=L.s;$('storyName').style.color=L.c;
 fullText=L.t;let i=0;typing=true;$('storyText').textContent='';
 clearInterval(typeIv);
 typeIv=setInterval(()=>{i+=2;$('storyText').textContent=fullText.slice(0,i);if(i>=fullText.length){typing=false;clearInterval(typeIv);}},16);
}
function advanceStory(){
 if(state!=='story')return;
 if(typing){typing=false;clearInterval(typeIv);$('storyText').textContent=fullText;return;}
 storyIdx++;
 if(storyIdx>=storyLines.length){$('ovStory').classList.add('hidden');const cb=storyDone;storyDone=null;cb&&cb();}
 else renderLine();
}

/* ================= input ================= */
const keys={};
const KMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'jump',KeyW:'jump',Space:'jump',KeyJ:'atk',KeyZ:'atk',ArrowDown:'down',KeyS:'down',KeyQ:'revert'};
function press(k){
 if(state!=='play'||paused||!player||player.dead)return;
 if(k==='jump')player.jbuf=.12;
 if(k==='atk')wantAtk=true;
 if(k==='revert')manualRevert();
}
addEventListener('keydown',e=>{
 initAudio();if(AC&&AC.state==='suspended')AC.resume();
 const k=KMAP[e.code];
 if(k){if(e.code==='Space'||e.code.startsWith('Arrow'))e.preventDefault();if(!keys[k])press(k);keys[k]=true;}
 if(e.code.startsWith('Digit')){const d=+e.code.slice(5);if(d>=1&&d<=4)tryTransform(ORDER[d-1]);}
 if(e.code==='KeyP'&&state==='play')togglePause();
 if(e.code==='Enter'){if(state==='story')advanceStory();}
});
addEventListener('keyup',e=>{const k=KMAP[e.code];if(k)keys[k]=false;});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;if(state==='play'&&!paused)togglePause();});
document.addEventListener('pointerdown',()=>{initAudio();if(AC&&AC.state==='suspended')AC.resume();},{passive:true});
stage.addEventListener('contextmenu',e=>e.preventDefault());
isTouch=matchMedia('(pointer: coarse)').matches||'ontouchstart' in window;
function bindHold(id,k){const b=$(id);
 b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;press(k);});
 ['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>{keys[k]=false;}));}
bindHold('tLeft','left');bindHold('tRight','right');bindHold('tJump','jump');bindHold('tAtk','atk');

/* ================= transform ================= */
function tryTransform(f){
 if(state!=='play'||paused||!player||player.dead)return;
 if(f==='ben'){manualRevert();return;}
 if(player.lock>0){SFX.deny();showHint('OMNITRIX RECHARGING…',1.2);return;}
 if(player.form===f)return;
 if(player.energy<8){SFX.deny();showHint('LOW POWER — REVERT TO BEN (Q) TO RECHARGE!',2);return;}
 player.energy=Math.max(0,player.energy-8);
 player.form=f;player.h=FORMS[f].h;player.w=FORMS[f].w;player.dashT=0;
 SFX.transform();flash=.5;shake=Math.max(shake,3);
 rings.push({x:player.x,y:player.y-player.h/2,t:0,c:'#7ee23a'});
 burst(player.x,player.y-player.h/2,'#8df25a',16,230);
 if(!seenTransform){seenTransform=true;showHint(isTouch?'TAP HIT TO ATTACK!':'PRESS J TO ATTACK!',2.6);}
}
function manualRevert(){
 if(!player||player.form==='ben'||player.lock>0)return;
 player.form='ben';player.h=50;player.w=22;player.dashT=0;SFX.revert();
 rings.push({x:player.x,y:player.y-player.h/2,t:0,c:'#cfe8b0'});
}
function forcedRevert(){
 player.form='ben';player.h=50;player.w=22;player.dashT=0;player.lock=3.2;
 SFX.power();rings.push({x:player.x,y:player.y-player.h/2,t:0,c:'#ff5340'});
 if(!seenLock){seenLock=true;showHint('OMNITRIX LOCKED — DODGE UNTIL IT WAKES!',2.6);}
 else showHint('RECHARGING…',1.4);
}

/* ================= attack ================= */
function doAttack(){
 const f=player.form;
 if(player.lock>0)return;
 if(f==='ben'){
  if(player.benCd<=0){player.benCd=1.6;SFX.deny();showHint('TAP AN ALIEN FIRST — THE WATCH DOES THE REST! (1–4)',1.6);}
  return;
 }
 if(player.atkCd>0)return;
 const low=()=>{SFX.deny();showHint('LOW POWER!',1);};
 if(f==='heatblast'){
  if(player.energy<5){low();return;}
  player.energy-=5;player.atkCd=.36;
  shots.push({x:player.x+player.facing*16,y:player.y-player.h*.6,vx:player.facing*560,vy:0,dmg:2,type:'fire',life:1.4});
  burst(player.x+player.facing*18,player.y-player.h*.6,'#ffb544',4,120);SFX.fire();
 }else if(f==='xlr8'){
  if(player.energy<3){low();return;}
  player.energy-=3;player.atkCd=.3;player.dashT=.16;player.dashDir=player.facing;player.dashId++;
  SFX.dash();
 }else if(f==='fourarms'){
  if(player.energy<4){low();return;}
  player.energy-=4;player.atkCd=.55;player.punchT=.2;
  const cx=player.x+player.facing*38,cy=player.y-player.h*.55;
  arcs.push({x:cx,y:cy,t:0,dir:player.facing});
  let hit=false;
  for(const e of enemies){const ex=e.x,ey=e.type==='drone'||e.type==='fast'?e.y:e.y-e.h/2;
   const dx=(ex-cx)*player.facing,dy=ey-cy;
   if(dx>-16&&dx<62&&Math.abs(dy)<78){hurtEnemy(e,3,'melee',player.facing);hit=true;}}
  if(boss&&boss.state!=='dying'&&boss.state!=='entry'){
   const bx=boss.x-cx,by=(boss.y-55)-cy;
   if(bx*player.facing>-16&&bx*player.facing<80&&Math.abs(by)<90){hurtBoss(3);hit=true;}}
  for(let i=bolts.length-1;i>=0;i--){const b=bolts[i];if(Math.hypot(b.x-cx,b.y-cy)<86){burst(b.x,b.y,'#ffd9c9',5,150);bolts.splice(i,1);SFX.clink();}}
  if(hit){hitstop=.05;shake=Math.max(shake,4);}
  SFX.punch();
 }else if(f==='diamondhead'){
  if(player.energy<5){low();return;}
  player.energy-=5;player.atkCd=.42;
  for(const a of[-.2,0,.2])shots.push({x:player.x+player.facing*14,y:player.y-player.h*.62,vx:Math.cos(a)*520*player.facing,vy:Math.sin(a)*520,dmg:1,type:'shard',life:.8});
  SFX.shard();
 }
}

/* ================= damage ================= */
function hurtEnemy(e,dmg,src,kdir){
 let d=dmg;
 if(e.armor&&src==='shot')d=Math.max(.5,d*.25);
 e.hp-=d;e.flash=.1;
 if(kdir&&!e.static){e.vx=(e.vx||0)+kdir*220;if(e.type==='hunter')e.x+=kdir*6;}
 SFX.hit();burst(e.x,(e.type==='drone'||e.type==='fast')?e.y:e.y-e.h/2,'#ffd9a0',4,150);
 if(e.hp<=0)killEnemy(e);
}
function killEnemy(e){
 e.dead=true;combo++;comboTimer=4;bestCombo=Math.max(bestCombo,1+Math.floor(combo/4));
 const mult=Math.min(5,1+Math.floor(combo/4));
 const g=e.score*mult;score+=g;
 addPop(e.x,e.y-40,'+'+g,mult>1?'#aef07a':'#eaffdc');
 burst(e.x,(e.type==='drone'||e.type==='fast')?e.y:e.y-e.h/2,e.type==='hunter'?'#8fa3b5':'#ff9a5c',14,240);
 noiz(.2,.22,1400);tone(420,60,.22,'sawtooth',.15);
 if(Math.random()<.1&&!heroMode||Math.random()<.14)pickups.push({x:e.x,y:(e.type==='drone'||e.type==='fast')?e.y:e.y-16,vy:-120,t:9});
}
function hurtBoss(d){
 if(!boss||boss.state==='entry'||boss.state==='dying')return;
 boss.hp-=d;boss.flash=.1;SFX.hit();
 burst(boss.x+rand(-20,20),boss.y-rand(40,95),'#ffd9a0',4,160);
 if(boss.hp<=boss.maxHp*.5&&!boss.p2){boss.p2=true;SFX.roar();shake=7;burst(boss.x,boss.y-60,'#ff5340',20,300);showBanner('VILGAX IS ENRAGED','','#ff5340',1.6);}
 if(boss.hp<=0){boss.hp=0;boss.state='dying';boss.t=1.7;SFX.roar();}
}
function damagePlayer(d,kx){
 if(player.invuln>0||player.dead)return;
 if(FORMS[player.form].def<1){
  if(d>1)d=Math.ceil(d*.5);
  else if(Math.random()<.45){SFX.clink();burst(player.x,player.y-player.h/2,'#bff7d2',4,120);player.invuln=.35;return;}
 }
 player.hp-=d;player.invuln=1.1;combo=0;
 player.vx=kx*240;player.vy=Math.min(player.vy,-260);player.onGround=false;
 SFX.hurt();shake=5;burst(player.x,player.y-player.h/2,'#ff5340',8,200);
 if(player.hp<=0){
  player.hp=0;player.dead=true;deathT=1.3;
  burst(player.x,player.y-30,'#7ee23a',26,320);burst(player.x,player.y-30,'#ff5340',18,260);
  rings.push({x:player.x,y:player.y-30,t:0,c:'#ff5340'});SFX.die();shake=8;
 }
}

/* ================= fx helpers ================= */
function burst(x,y,c,n,sp){for(let i=0;i<n;i++){if(parts.length>260)break;const a=Math.random()*6.28,s=rand(sp*.3,sp);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-60,life:rand(.3,.7),max:.7,c,sz:rand(1.5,3.5),g:1});}}
function addPop(x,y,txt,c){pops.push({x,y,txt,c,t:0});}
function showBanner(main,sub,c,dur){banner={main,sub,c,dur,t:dur};}
let hintTimer=null;
function showHint(txt,dur){const h=$('hint');h.textContent=txt;h.classList.remove('hidden');clearTimeout(hintTimer);hintTimer=setTimeout(()=>h.classList.add('hidden'),(dur||3)*1000);}

/* ================= enemies ================= */
function mkE(t,x,y){const s=ETYPES[t];return{type:t,x,y,vx:0,vy:0,hp:s.hp,score:s.score,dmg:s.dmg,armor:!!s.armor,static:!!s.static,fly:!!s.fly,cd:rand(.8,1.8),ph:Math.random()*6,lungeT:0,lungeCd:1.5,flash:0,dead:false,h:0,aim:0};}
function spawnOne(t){
 if(t==='drone'||t==='fast'){const side=Math.random()<.5?-1:1;enemies.push(mkE(t,side<0?-24:W+24,rand(80,230)));}
 else if(t==='hunter'){const side=Math.random()<.5?-1:1;enemies.push(mkE(t,side<0?-22:W+22,GY));}
 else if(t==='turret'){enemies.push(mkE(t,rand(130,W-130),-30));}
}
function erect(e){
 if(e.type==='drone')return{x:e.x-13,y:e.y-13,w:26,h:26};
 if(e.type==='fast')return{x:e.x-9,y:e.y-9,w:18,h:18};
 if(e.type==='hunter')return{x:e.x-16,y:e.y-30,w:32,h:30};
 return{x:e.x-16,y:e.y-26,w:32,h:26};
}
function fireBolt(x,y,tx,ty,sp,spread){
 const a=Math.atan2(ty-y,tx-x)+(spread||0);
 bolts.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:4});
}
function updateEnemies(dt){
 for(const e of enemies){
  e.flash=Math.max(0,e.flash-dt);
  const dx=player.x-e.x,dir=Math.sign(dx)||1;
  if(e.fly){
   const sp=e.type==='fast'?265:125;
   const ty=player.y-player.h*.6+Math.sin(T*2.2+e.ph)*18;
   e.vx+=clamp(dx/60,-1,1)*sp*2.4*dt;e.vx=clamp(e.vx,-sp,sp);
   e.vy+=clamp((ty-e.y)/40,-1,1)*(e.type==='fast'?sp*3:sp*2.6)*dt;
   e.vy=clamp(e.vy,-sp,e.type==='fast'?sp:120);
   e.x+=e.vx*dt;e.y+=e.vy*dt;e.y=clamp(e.y,26,GY-16);
   if(e.type==='drone'){e.cd-=dt;if(e.cd<=0&&Math.abs(dx)<540&&!player.dead){e.cd=2.1+Math.random()*1.3;fireBolt(e.x,e.y,player.x,player.y-player.h/2,250);tone(600,200,.12,'sawtooth',.1);}}
  }else if(e.type==='hunter'){
   if(!seenHunter&&!heroMode&&chapterIdx===1){seenHunter=true;showHint('ARMORED! FIRE WON\'T PIERCE — GO FOUR ARMS (3) OR DIAMONDHEAD (4)!',3.4);}
   if(e.lungeT>0){e.lungeT-=dt;e.x+=e.lungeDir*300*dt;}
   else{e.lungeCd-=dt;e.x+=dir*66*dt;
    if(Math.abs(dx)<220&&e.lungeCd<=0){e.lungeCd=2.8;e.lungeT=.32;e.lungeDir=dir;}}
   e.x=clamp(e.x,10,W-10);
  }else if(e.type==='turret'){
   if(e.y<GY){e.y+=430*dt;if(e.y>=GY){e.y=GY;shake=Math.max(shake,2);burst(e.x,GY,'#8fa3b5',8,160);}}
   else{e.cd-=dt;e.aim=Math.atan2((player.y-player.h/2)-(e.y-14),player.x-e.x);
    if(e.cd<=0&&!player.dead){e.cd=2.3;e.tel=.3;
     fireBolt(e.x,e.y-14,player.x,player.y-player.h/2,265,-.09);
     fireBolt(e.x,e.y-14,player.x,player.y-player.h/2,265,.09);
     tone(500,180,.12,'sawtooth',.1);}}
  }
  if(!player.dead&&player.invuln<=0&&ovR(prect(),erect(e)))damagePlayer(e.dmg,Math.sign(player.x-e.x)||1);
 }
 enemies=enemies.filter(e=>!e.dead);
}

/* ================= boss ================= */
function startBoss(){
 bossActive=true;$('bossWrap').classList.remove('hidden');$('waveLabel').textContent='VILGAX';
 boss={x:W/2,y:-140,vx:0,vy:0,hp:60,maxHp:60,state:'entry',t:2,facing:1,flash:0,p2:false,spd:82,atkT:1.4,sub:0};
 showBanner('VILGAX','CONQUEROR OF TEN WORLDS','#ff5340',2.4);SFX.roar();
}
function brect(){return{x:boss.x-30,y:boss.y-100,w:60,h:100};}
function updateBoss(dt){
 const b=boss;if(!b)return;
 b.flash=Math.max(0,b.flash-dt);
 b.facing=Math.sign(player.x-b.x)||1;
 const spd=b.p2?118:82,cdm=b.p2?.62:1;
 switch(b.state){
  case 'entry':
   b.t-=dt;b.y+=((GY+140)/2)*dt*.9;if(b.y>GY)b.y=GY;
   if(b.t<=0){b.state='walk';b.atkT=1.2;burst(b.x,GY,'#ff7a3c',16,240);shake=6;}
   break;
  case 'walk':
   b.x+=b.facing*spd*dt;b.atkT-=dt;b.x=clamp(b.x,50,W-50);
   if(b.atkT<=0){
    const r=Math.random(),extra=enemies.length<3;
    if(r<.3){b.state='leapTele';b.t=.45;}
    else if(r<.55){b.state='sweepTele';b.t=.65;tone(200,900,.5,'sawtooth',.12);}
    else if(r<.8){b.state='fan';b.t=.35;b.sub=0;}
    else if(extra){b.state='summon';b.t=.7;}
    else{b.state='leapTele';b.t=.45;}
   }
   break;
  case 'leapTele':
   b.t-=dt;if(b.t<=0){
    const TT=.8,g=2600;b.vy=-g*TT/2;b.vx=(player.x-b.x)/TT;b.vx=clamp(b.vx,-720,720);
    b.state='leapAir';SFX.roar();}
   break;
  case 'leapAir':
   b.vy+=2600*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
   if(b.y>=GY){b.y=GY;b.vx=0;
    waves.push({x:b.x-20,dir:-1,t:0});waves.push({x:b.x+20,dir:1,t:0});
    shake=8;hitstop=.06;burst(b.x,GY,'#ff7a3c',20,320);noiz(.3,.3,500);tone(90,40,.3,'square',.25);
    if(!player.dead&&Math.abs(player.x-b.x)<95&&player.y>GY-70)damagePlayer(2,Math.sign(player.x-b.x)||1);
    b.state='recover';b.t=.55*cdm;}
   break;
  case 'sweepTele':
   b.t-=dt;if(b.t<=0){beams.push({y:GY-26,tele:0,dur:.5,t:0});noiz(.5,.25,2500,'bandpass');b.state='recover';b.t=.6*cdm;}
   break;
  case 'fan':
   b.t-=dt;
   if(b.t<=0){
    const n=5,ba=Math.atan2((player.y-player.h/2)-(b.y-72),player.x-b.x);
    for(let i=0;i<n;i++)fireBolt(b.x,b.y-72,player.x,player.y-player.h/2,300,(i-(n-1)/2)*.22);
    tone(700,200,.15,'sawtooth',.14);
    b.sub++;
    if(b.p2&&b.sub<2){b.t=.32;}else{b.state='recover';b.t=.55*cdm;}
   }
   break;
  case 'summon':
   b.t-=dt;
   if(b.t<=0){
    for(let i=0;i<2;i++)if(enemies.length<4){const side=i===0?-1:1;enemies.push(mkE('drone',b.x+side*60,b.y-120));}
    b.state='recover';b.t=.7*cdm;}
   break;
  case 'recover':
   b.t-=dt;if(b.t<=0){b.state='walk';b.atkT=rand(1,1.7)*cdm;}
   break;
  case 'dying':
   b.t-=dt;
   if(Math.random()<.4)burst(b.x+rand(-34,34),b.y-rand(10,100),Math.random()<.5?'#ff7a3c':'#aef07a',6,220);
   shake=Math.max(shake,4);
   if(Math.random()<.15)noiz(.15,.2,900);
   if(b.t<=0){
    burst(b.x,b.y-50,'#fff3b0',34,420);burst(b.x,b.y-50,'#ff7a3c',30,340);
    rings.push({x:b.x,y:b.y-50,t:0,c:'#aef07a'});whiteFlash=.5;shake=10;SFX.die();
    boss=null;bossActive=false;$('bossWrap').classList.add('hidden');
    score+=5000;addPop(W/2,GY-120,'+5000','#aef07a');
    chapterClear();}
   break;
 }
 if(!player.dead&&player.invuln<=0&&b.state!=='entry'&&b.state!=='dying'&&ovR(prect(),brect()))damagePlayer(2,Math.sign(player.x-b.x)||1);
}

/* ================= player update ================= */
function updatePlayer(dt){
 const p=player,F=FORMS[p.form];
 p.invuln=Math.max(0,p.invuln-dt);p.atkCd=Math.max(0,p.atkCd-dt);p.jbuf=Math.max(0,p.jbuf-dt);
 p.coyote=Math.max(0,p.coyote-dt);p.dropT=Math.max(0,p.dropT-dt);p.lock=Math.max(0,p.lock-dt);
 p.punchT=Math.max(0,p.punchT-dt);p.benCd=Math.max(0,p.benCd-dt);
 /* energy */
 if(p.form!=='ben'){p.energy-=3*dt;if(p.energy<=0){p.energy=0;forcedRevert();}
  if(p.energy<32&&!seenLow){seenLow=true;showHint('OMNITRIX LOW! PRESS Q TO REVERT TO BEN AND RECHARGE.',3);}}
 else p.energy=Math.min(100,p.energy+30*dt);
 /* move */
 const dir=(keys.right?1:0)-(keys.left?1:0);
 if(p.dashT>0){
  p.vx=p.dashDir*840;p.vy=0;p.dashT-=dt;
  p.trailT-=dt;
  if(p.trailT<=0){p.trailT=.025;p.trail.push({x:p.x,y:p.y,f:p.facing,t:.22});}
  for(const e of enemies){const er=erect(e);
   if(ovR(prect(),er)&&(e.dashId!==p.dashId)){e.dashId=p.dashId;hurtEnemy(e,1.5,'melee',p.dashDir);}}
  if(boss&&boss.state!=='dying'&&boss.state!=='entry'&&ovR(prect(),brect())&&(!boss.dashId||boss.dashId!==p.dashId)){boss.dashId=p.dashId;hurtBoss(1.5);}
  for(let i=bolts.length-1;i>=0;i--){const b=bolts[i];if(Math.abs(b.x-p.x)<26&&Math.abs(b.y-(p.y-p.h/2))<40){burst(b.x,b.y,'#9fe8ff',4,140);bolts.splice(i,1);SFX.clink();}}
 }else{
  const tgt=dir*F.speed,acc=p.onGround?3000:1700;
  if(tgt!==0){p.vx+=clamp(tgt-p.vx,-acc*dt,acc*dt);p.facing=dir;}
  else{const f=p.onGround?2600:600;p.vx-=clamp(p.vx,-f*dt,f*dt);}
  p.vy+=2100*dt;
  if(p.vy<0&&!keys.jump)p.vy+=1900*dt;
 }
 if(wantAtk){wantAtk=false;doAttack();}
 /* jump */
 if(p.jbuf>0&&(p.onGround||p.coyote>0)){
  p.vy=-F.jump;p.onGround=false;p.coyote=0;p.jbuf=0;SFX.jump();
  burst(p.x,p.y,'#9a8f7a',4,90);
 }
 if(keys.down&&p.onGround){p.dropT=.22;p.onGround=false;p.y+=2;}
 /* integrate */
 p.prevY=p.y;
 p.x=clamp(p.x+p.vx*dt,14,W-14);
 p.y+=p.vy*dt;
 /* ground & platforms */
 let landed=false;
 if(p.y>=GY){p.y=GY;landed=true;}
 else if(p.vy>=0&&p.dropT<=0){
  for(const pl of platforms){
   if(p.x>pl.x-6&&p.x<pl.x+pl.w+6&&p.prevY<=pl.y+2&&p.y>=pl.y){p.y=pl.y;landed=true;break;}
  }
 }
 if(landed){
  if(!p.onGround&&p.vy>500)burst(p.x,p.y,'#9a8f7a',5,100);
  p.vy=Math.min(p.vy,0);if(p.dashT<=0)p.vy=0;
  if(!p.onGround)p.onGround=true;
  p.coyote=.09;
 }else{if(p.onGround)p.coyote=.09;p.onGround=false;}
 if(Math.abs(p.vx)>30&&p.onGround)p.anim+=dt*Math.abs(p.vx)/32;else p.anim+=dt*1.2;
 /* ember trail for heatblast */
 if(p.form==='heatblast'&&Math.random()<.35)parts.push({x:p.x+rand(-6,6),y:p.y-p.h+rand(0,10),vx:rand(-20,20),vy:rand(-70,-30),life:.5,max:.5,c:Math.random()<.5?'#ffb544':'#ff7a1c',sz:2,g:-.3});
 for(const tr of p.trail)tr.t-=dt;
 p.trail=p.trail.filter(t=>t.t>0);
}

/* ================= world update ================= */
function update(dt){
 if(hitstop>0){hitstop-=dt;dt*=.12;}
 T+=dt;playT+=dt;
 if(player.dead){
  deathT-=dt;
  updateParts(dt);
  if(deathT<=0&&!overShown)showOver();
  return;
 }
 updatePlayer(dt);
 updateEnemies(dt);
 if(bossActive)updateBoss(dt);
 /* spawn / waves */
 if(waveActive&&spawnQueue.length){
  spawnTimer-=dt;
  if(spawnTimer<=0){spawnTimer=heroMode?Math.max(.3,.55-heroWaveN*.015):.55;spawnOne(spawnQueue.shift());}
 }
 if(waveActive&&!spawnQueue.length&&enemies.length===0&&!bossActive){
  waveActive=false;interT=1.3;SFX.wave();
  if(heroMode)chapterClear();
 }
 if(!waveActive&&!bossActive&&!heroMode||(!waveActive&&!bossActive&&heroMode&&interT>0)){
  interT-=dt;if(interT<=0&&clearPending<=0)nextWave();
 }
 if(clearPending>0){clearPending-=dt;if(clearPending<=0){advanceChapter();return;}}
 /* tutorial hints */
 for(const h of chHints){if(!h.f&&playT>=t_toSec(h.t)){h.f=true;showHint(h.txt,3.2);}}
 /* shots */
 for(let i=shots.length-1;i>=0;i--){
  const s=shots[i];s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
  if(s.type==='fire'&&Math.random()<.6)parts.push({x:s.x,y:s.y,vx:rand(-30,30),vy:rand(-30,30),life:.3,max:.3,c:'#ffb544',sz:2,g:0});
  let dead=s.life<=0||s.x<-30||s.x>W+30||s.y<-30||s.y>H+30;
  if(!dead){
   for(const e of enemies){if(e.dead)continue;
    if(circleRect(s.x,s.y,7,erect(e))){hurtEnemy(e,s.dmg,s.type==='shard'?'melee':'shot',Math.sign(s.vx));dead=true;break;}}
   if(!dead&&boss&&boss.state!=='dying'&&boss.state!=='entry'&&circleRect(s.x,s.y,7,brect())){hurtBoss(s.dmg);dead=true;}
   if(!dead&&s.type==='shard'){
    for(let j=bolts.length-1;j>=0;j--){const b=bolts[j];if(Math.hypot(b.x-s.x,b.y-s.y)<12){burst(b.x,b.y,'#bff7d2',5,150);bolts.splice(j,1);SFX.clink();}}
   }
   if(!dead&&s.type==='fire'){
    for(let j=bolts.length-1;j>=0;j--){const b=bolts[j];if(Math.hypot(b.x-s.x,b.y-s.y)<12){burst(b.x,b.y,'#ffb544',6,160);bolts.splice(j,1);dead=true;break;}}
   }
  }
  if(dead)shots.splice(i,1);
 }
 /* bolts */
 for(let i=bolts.length-1;i>=0;i--){
  const b=bolts[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
  let dead=b.life<=0||b.x<-20||b.x>W+20||b.y<-20||b.y>H+20;
  if(!dead&&!player.dead&&circleRect(b.x,b.y,5,prect())){damagePlayer(1,Math.sign(b.vx)||1);dead=true;}
  if(dead){burst(b.x,b.y,'#ff8a70',4,120);bolts.splice(i,1);}
 }
 /* boss ground shockwaves */
 for(let i=waves.length-1;i>=0;i--){
  const w=waves[i];w.x+=w.dir*340*dt;w.t+=dt;
  if(!player.dead&&player.invuln<=0&&player.onGround&&Math.abs(player.x-w.x)<24)damagePlayer(1,w.dir);
  if(w.x<-30||w.x>W+30)waves.splice(i,1);
 }
 /* beams */
 for(let i=beams.length-1;i>=0;i--){
  const bm=beams[i];bm.t+=dt;
  if(bm.t>bm.tele&&bm.t<bm.tele+bm.dur&&!player.dead&&player.invuln<=0){
   const pr=prect();
   if(pr.y<bm.y+13&&pr.y+pr.h>bm.y-13)damagePlayer(2,Math.sign(player.x-boss?player.x-(boss?boss.x:player.x):1)||1);
  }
  if(bm.t>bm.tele+bm.dur)beams.splice(i,1);
 }
 /* pickups */
 for(let i=pickups.length-1;i>=0;i--){
  const pk=pickups[i];pk.t-=dt;
  pk.vy+=1400*dt;pk.y+=pk.vy*dt;
  if(pk.y>GY-8){pk.y=GY-8;pk.vy=0;}
  if(!player.dead&&Math.hypot(player.x-pk.x,(player.y-player.h/2)-pk.y)<38){
   player.hp=Math.min(player.maxHp,player.hp+2);SFX.pickup();
   addPop(pk.x,pk.y-16,'+2 HP','#7ee23a');burst(pk.x,pk.y,'#7ee23a',8,140);pickups.splice(i,1);continue;}
  if(pk.t<=0)pickups.splice(i,1);
 }
 updateParts(dt);
 comboTimer-=dt;if(comboTimer<=0)combo=0;
}
function t_toSec(t){return t;}
function updateParts(dt){
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.g||0)*900*dt;if(p.life<=0)parts.splice(i,1);}
 for(let i=rings.length-1;i>=0;i--){rings[i].t+=dt;if(rings[i].t>.4)rings.splice(i,1);}
 for(let i=arcs.length-1;i>=0;i--){arcs[i].t+=dt;if(arcs[i].t>.18)arcs.splice(i,1);}
 for(let i=pops.length-1;i>=0;i--){pops[i].t+=dt;pops[i].y-=34*dt;if(pops[i].t>1)pops.splice(i,1);}
}

/* ================= drawing: characters ================= */
function drawOmni(x,y,r){
 circ(x,y,r,'#0d130c');
 ctx.fillStyle='#7ee23a';ctx.beginPath();
 ctx.moveTo(x-r*.62,y-r*.62);ctx.lineTo(x+r*.62,y-r*.62);ctx.lineTo(x+r*.2,y);ctx.lineTo(x+r*.62,y+r*.62);ctx.lineTo(x-r*.62,y+r*.62);ctx.lineTo(x-r*.2,y);ctx.closePath();ctx.fill();
}
function drawShadow(x,y,airH,w){
 const s=clamp(1-airH/300,.3,1);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,GY+4,w*s,4*s,0,0,7);ctx.fill();
}
function limb(x1,y1,x2,y2,w,c){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function flameShape(yb,w,h,c,sw){
 ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(-w,yb);
 ctx.quadraticCurveTo(-w*1.15,yb-h*.55,sw,yb-h);
 ctx.quadraticCurveTo(w*1.15,yb-h*.55,w,yb);ctx.closePath();ctx.fill();
}
function drawPlayer(){
 const p=player;if(!p||p.dead)return;
 const F=FORMS[p.form],mv=Math.abs(p.vx)>40,ph=p.anim,bob=mv?Math.sin(ph*12)*1.6:Math.sin(T*2)*.8;
 for(const tr of p.trail){
  ctx.globalAlpha=tr.t*2.2;ctx.fillStyle='#2fa8e0';
  rrect(tr.x-9,tr.y-F.h,tr.w+4,F.h,7);ctx.fill();ctx.globalAlpha=1;
 }
 drawShadow(p.x,GY,GY-p.y,p.w*.8);
 ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.facing,1);
 if(p.invuln>0&&Math.sin(T*42)>0)ctx.globalAlpha=.35;
 const swing=mv?Math.sin(ph*12)*6:0;
 if(p.form==='ben'){
  limb(-3,-20+bob,swing*-1,0,6,'#4a6b3a');limb(3,-20+bob,swing,0,6,'#4a6b3a');
  circ(swing,0,3,'#33302c');circ(-swing,0,3,'#33302c');
  rrect(-10,-38+bob,20,19,4);ctx.fillStyle='#f2f2ee';ctx.fill();
  ctx.fillStyle='#1c1c1c';ctx.fillRect(-3.5,-38+bob,7,19);
  limb(-9,-33+bob,-9-swing*.7,-21+bob,5,'#f2f2ee');limb(9,-33+bob,9+swing*.7,-21+bob,5,'#f2f2ee');
  circ(0,-45+bob,8,'#f0c9a2');
  ctx.fillStyle='#5a3b20';ctx.beginPath();ctx.arc(0,-45.5+bob,8.3,Math.PI*1.02,Math.PI*1.98);ctx.closePath();ctx.fill();
  circ(3,-45+bob,1.1,'#222');circ(6.2,-45+bob,1.1,'#222');
 }else if(p.form==='heatblast'){
  limb(-4,-22+bob,-swing,0,7,'#571f10');limb(4,-22+bob,swing,0,7,'#571f10');
  circ(swing,0,3.5,'#3a1408');circ(-swing,0,3.5,'#3a1408');
  rrect(-11,-40+bob,22,22,5);ctx.fillStyle='#6b2410';ctx.fill();
  ctx.strokeStyle='#ffb13d';ctx.lineWidth=1.8;
  for(let i=0;i<3;i++){ctx.globalAlpha=.5+.4*Math.sin(T*13+i*2.1);ctx.beginPath();
   ctx.moveTo(-6+i*6,-37+bob);ctx.lineTo(-3+i*6,-30+bob);ctx.lineTo(-7+i*7,-22+bob);ctx.stroke();}
  ctx.globalAlpha=1;
  limb(-10,-35+bob,-13-swing*.5,-22+bob,6,'#6b2410');limb(10,-35+bob,13+swing*.5,-22+bob,6,'#6b2410');
  circ(-13-swing*.5,-22+bob,2.6,'#ff9a3c');circ(13+swing*.5,-22+bob,2.6,'#ff9a3c');
  const sw=Math.sin(T*10)*3;
  flameShape(-42+bob,9,20,'#ff7a1c',sw);
  flameShape(-42.5+bob,6,14,'#ffb544',sw*1.3);
  flameShape(-43+bob,3,8,'#fff3b0',sw*.7);
  ctx.fillStyle='#fff3b0';ctx.fillRect(1.5,-46+bob,3,1.6);ctx.fillRect(6,-45.5+bob,3,1.6);
  drawOmni(0,-30+bob,5);
 }else if(p.form==='xlr8'){
  ctx.strokeStyle='#0e1216';ctx.lineWidth=5;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-7,-28);ctx.quadraticCurveTo(-22,-26+Math.sin(T*6)*3,-30,-38+Math.sin(T*6+1)*4);ctx.stroke();
  if(mv&&Math.abs(p.vx)>300){
   ctx.strokeStyle='rgba(159,232,255,.5)';ctx.lineWidth=2;
   for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-14-i*8,-42+i*12);ctx.lineTo(-30-i*10,-42+i*12);ctx.stroke();}
  }
  rrect(-8,-40+bob,16,22,6);ctx.fillStyle='#12161a';ctx.fill();
  ctx.fillStyle='#2fa8e0';ctx.beginPath();ctx.moveTo(-6,-36+bob);ctx.lineTo(0,-30+bob);ctx.lineTo(6,-36+bob);ctx.lineTo(0,-33+bob);ctx.closePath();ctx.fill();
  if(mv){circ(0,-4,5.5,'#14181c');ctx.strokeStyle='#2fa8e0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-4,5.5,T*14%6.28,T*14%6.28+2.4);ctx.stroke();}
  else{limb(-3,-20+bob,-swing,0,5,'#12161a');limb(3,-20+bob,swing,0,5,'#12161a');}
  limb(9,-35+bob,12+swing*.4,-24+bob,4,'#12161a');
  ctx.fillStyle='#12161a';ctx.beginPath();ctx.ellipse(2,-46+bob,7,6,0,0,7);ctx.fill();
  ctx.beginPath();ctx.moveTo(-4,-49+bob);ctx.lineTo(-14,-45+bob);ctx.lineTo(-4,-43+bob);ctx.closePath();ctx.fill();
  rrect(2.5,-49+bob,7.5,5,2);ctx.fillStyle='#8df2a8';ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(4,-48+bob,2,1.4);
 }else if(p.form==='fourarms'){
  limb(-6,-24+bob,-swing,0,9,'#8f2620');limb(6,-24+bob,swing,0,9,'#8f2620');
  circ(swing,0,4,'#2a1512');circ(-swing,0,4,'#2a1512');
  rrect(-17,-48+bob,34,28,7);ctx.fillStyle='#c0392e';ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(6,-48+bob,11,28);
  ctx.fillStyle='#181210';ctx.fillRect(-17,-23+bob,34,4.5);
  limb(-13,-32+bob,-14-swing,-22+bob,7,'#a52f26');limb(13,-32+bob,14+swing,-22+bob,7,'#a52f26');
  circ(-14-swing,-22+bob,5,'#d8442f');circ(14+swing,-22+bob,5,'#d8442f');
  const px=p.punchT>0?26:22;
  limb(14,-43+bob,px,-42+bob,8,'#c0392e');circ(px,-42+bob,6.8,'#d8442f');
  limb(-14,-43+bob,-22,-42+bob,8,'#c0392e');circ(-22,-42+bob,6.8,'#d8442f');
  circ(0,-55+bob,7.5,'#c0392e');
  ctx.fillStyle='#181210';ctx.beginPath();ctx.arc(0,-56.5+bob,7.6,Math.PI*1.05,Math.PI*1.95);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffe27a';
  circ(3,-56+bob,1.2,'#ffe27a');circ(6,-55+bob,1.2,'#ffe27a');circ(3,-52.5+bob,1.2,'#ffe27a');circ(6,-51.5+bob,1.2,'#ffe27a');
 }else if(p.form==='diamondhead'){
  ctx.fillStyle='#8fe8ab';
  ctx.beginPath();ctx.moveTo(-8,-24+bob);ctx.lineTo(-12,-2);ctx.lineTo(-4,0);ctx.lineTo(-3,-22+bob);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(8,-24+bob);ctx.lineTo(12,-2);ctx.lineTo(4,0);ctx.lineTo(3,-22+bob);ctx.closePath();ctx.fill();
  ctx.fillStyle='#b8f7cd';
  ctx.beginPath();ctx.moveTo(-13,-46+bob);ctx.lineTo(13,-46+bob);ctx.lineTo(10,-22+bob);ctx.lineTo(-10,-22+bob);ctx.closePath();ctx.fill();
  ctx.fillStyle='#5ecf8a';
  ctx.beginPath();ctx.moveTo(13,-46+bob);ctx.lineTo(10,-22+bob);ctx.lineTo(2,-40+bob);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#eafff0';ctx.lineWidth=1.4;ctx.strokeRect(-0,-0,0,0);
  ctx.beginPath();ctx.moveTo(-13,-46+bob);ctx.lineTo(13,-46+bob);ctx.stroke();
  ctx.fillStyle='#b8f7cd';
  ctx.beginPath();ctx.moveTo(-11,-46+bob);ctx.lineTo(-16,-58+bob);ctx.lineTo(-7,-46+bob);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(11,-46+bob);ctx.lineTo(16,-58+bob);ctx.lineTo(7,-46+bob);ctx.closePath();ctx.fill();
  limb(-11,-40+bob,-16-swing*.5,-26+bob,6,'#8fe8ab');limb(11,-40+bob,16+swing*.5,-26+bob,6,'#8fe8ab');
  ctx.fillStyle='#c8fbe0';
  ctx.beginPath();ctx.moveTo(-16-swing*.5,-30+bob);ctx.lineTo(-19-swing*.5,-22+bob);ctx.lineTo(-13-swing*.5,-24+bob);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(16+swing*.5,-30+bob);ctx.lineTo(19+swing*.5,-22+bob);ctx.lineTo(13+swing*.5,-24+bob);ctx.closePath();ctx.fill();
  ctx.fillStyle='#aef5c6';
  ctx.beginPath();ctx.moveTo(-6,-60+bob);ctx.lineTo(2,-64+bob);ctx.lineTo(9,-57+bob);ctx.lineTo(5,-48+bob);ctx.lineTo(-4,-48+bob);ctx.closePath();ctx.fill();
  ctx.fillStyle='#2ee06a';
  ctx.beginPath();ctx.moveTo(2,-57+bob);ctx.lineTo(5,-56+bob);ctx.lineTo(2.5,-54+bob);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(6,-56+bob);ctx.lineTo(8.5,-54.5+bob);ctx.lineTo(5.5,-53.5+bob);ctx.closePath();ctx.fill();
  drawOmni(-1,-34+bob,5);
 }
 ctx.restore();
 if(p.form==='xlr8'&&p.dashT>0){
  ctx.strokeStyle='rgba(143,242,168,.6)';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(p.x-p.dashDir*20,p.y-30);ctx.lineTo(p.x-p.dashDir*60,p.y-30);ctx.stroke();
 }
}

/* ================= drawing: enemies & boss ================= */
function drawEnemy(e){
 if(e.type==='drone'||e.type==='fast'){
  const r=e.type==='fast'?9:12,y=e.y;
  drawShadow(e.x,GY,GY-y,10);
  ctx.save();ctx.translate(e.x,y);
  if(e.flash>0){ctx.globalAlpha=.9;}
  circ(0,2,4,e.type==='fast'?'#ff5340':'#ff9a3c');
  circ(0,0,r,e.type==='fast'?'#5a2530':'#39424e');
  circ(0,-r*.15,r*.55,'#1c232b');
  const la=Math.atan2((player.y-player.h/2)-y,player.x-e.x);
  circ(Math.cos(la)*r*.45,Math.sin(la)*r*.45,3.2,'#ff4b3a');
  circ(Math.cos(la)*r*.45+1,Math.sin(la)*r*.45-1,1,'#ffd9c9');
  circ(-r*.9,0,3,'#2a333c');circ(r*.9,0,3,'#2a333c');
  ctx.fillStyle='rgba(255,170,80,.7)';
  ctx.beginPath();ctx.moveTo(-2.5,r-2);ctx.lineTo(0,r+5+Math.random()*3);ctx.lineTo(2.5,r-2);ctx.closePath();ctx.fill();
  ctx.restore();
 }else if(e.type==='hunter'){
  drawShadow(e.x,GY,0,14);
  ctx.save();ctx.translate(e.x,e.y);
  const st=Math.sin(T*9+e.ph)*3;
  limb(-6,-12,-8+st,0,5,'#1c232b');limb(6,-12,8-st,0,5,'#1c232b');
  rrect(-16,-30,32,20,3);ctx.fillStyle='#2c3440';ctx.fill();
  rrect(-16,-30,10,20,3);ctx.fillStyle='#4a5563';ctx.fill();
  circ(-11,-26,1,'#1c232b');circ(-11,-18,1,'#1c232b');
  ctx.fillStyle=e.flash>0?'#fff':'#ff5340';ctx.fillRect(0,-26,13,4);
  rrect(-4,-34,14,6,2);ctx.fillStyle='#39424e';ctx.fill();
  ctx.restore();
 }else if(e.type==='turret'){
  drawShadow(e.x,GY,e.y<GY?GY-e.y:0,14);
  ctx.save();ctx.translate(e.x,e.y);
  ctx.fillStyle='#232b34';ctx.fillRect(-18,-6,36,6);
  ctx.fillStyle='#39424e';ctx.beginPath();ctx.arc(0,-6,15,Math.PI,0);ctx.closePath();ctx.fill();
  ctx.save();ctx.translate(0,-12);ctx.rotate(e.aim||0);
  ctx.fillStyle='#2a333c';ctx.fillRect(0,-3.5,20,7);ctx.restore();
  ctx.fillStyle=e.tel>0?'#fff':(Math.sin(T*6)>0?'#ff4b3a':'#a33');
  circ(0,-13,3.4,e.tel>0?'#fff':'#ff4b3a');
  ctx.restore();
 }
}
function drawBoss(){
 const b=boss;if(!b)return;
 ctx.save();ctx.translate(b.x,b.y);
 const cr=b.state==='leapTele'?.5-b.t/.9:0;
 ctx.scale(b.facing*(1+cr*.12),1-cr*.15);
 const tint=b.p2?'#3a2333':null;
 limb(-13,-36,-18,0,13,'#182b20');limb(13,-36,18,0,13,'#182b20');
 ctx.fillStyle=tint||'#274a34';
 ctx.beginPath();ctx.moveTo(-26,-96);ctx.lineTo(26,-96);ctx.lineTo(18,-30);ctx.lineTo(-18,-30);ctx.closePath();ctx.fill();
 ctx.fillStyle='#14261b';
 ctx.fillRect(-20,-88,40,16);ctx.fillRect(-14,-62,28,18);
 circ(-6,-56,2.4,'#ff5340');circ(6,-56,2.4,'#ff5340');
 ctx.fillStyle='#14261b';ctx.fillRect(-24,-34,48,6);
 ctx.fillStyle=tint||'#1b3326';
 rrect(-38,-104,20,18,7);ctx.fill();rrect(18,-104,20,18,7);ctx.fill();
 ctx.beginPath();ctx.moveTo(-36,-104);ctx.lineTo(-30,-116);ctx.lineTo(-24,-104);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(24,-104);ctx.lineTo(30,-116);ctx.lineTo(36,-104);ctx.closePath();ctx.fill();
 const fa=b.state==='summon'?-70:(b.state==='leapAir'?-40:0);
 limb(-28,-96,-30,-56+fa*.3,10,tint||'#223c2b');limb(28,-96,30,-56-fa,10,tint||'#223c2b');
 circ(-30,-52+fa*.3,9,tint||'#2c4a36');circ(30,-52-fa,9,tint||'#2c4a36');
 /* head */
 circ(0,-106,13,'#5d9450');
 ctx.fillStyle='#3f7040';ctx.fillRect(-12,-114,24,6);
 const flashEye=b.state==='sweepTele'&&Math.sin(T*30)>0;
 circ(4,-106,2.8,flashEye?'#fff':'#ff2e1f');circ(10,-105,2.8,flashEye?'#fff':'#ff2e1f');
 for(let i=0;i<5;i++){
  const tx=-8+i*4,sw=Math.sin(T*3+i)*4;
  ctx.strokeStyle='#3f7040';ctx.lineWidth=3.6;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(tx,-96);ctx.quadraticCurveTo(tx+sw*.5,-84,tx+sw,-96+22+i%2*4);ctx.stroke();
 }
 if(b.p2){ctx.globalAlpha=.14;circ(0,-60,52,'#ff2e1f');ctx.globalAlpha=1;}
 if(b.flash>0){ctx.globalAlpha=.5;circ(0,-60,52,'#fff');ctx.globalAlpha=1;}
 ctx.restore();
 /* sweep aim line */
 if(b.state==='sweepTele'){
  ctx.strokeStyle='rgba(255,80,60,'+(0.25+0.3*Math.sin(T*30))+')';ctx.lineWidth=3;ctx.setLineDash([10,8]);
  ctx.beginPath();ctx.moveTo(b.x+b.facing*30,GY-26);ctx.lineTo(b.facing>0?W:0,GY-26);ctx.stroke();ctx.setLineDash([]);
 }
}

/* ================= drawing: world ================= */
function drawBG(i){
 let g=ctx.createLinearGradient(0,0,0,H);
 if(i===0){g.addColorStop(0,'#191040');g.addColorStop(.55,'#5a2a5e');g.addColorStop(1,'#c85a3a');}
 else if(i===1){g.addColorStop(0,'#0a1128');g.addColorStop(.7,'#1c2a52');g.addColorStop(1,'#31406e');}
 else{g.addColorStop(0,'#03130d');g.addColorStop(1,'#07231a');}
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 if(i!==2){
  for(const s of decor.stars){ctx.globalAlpha=clamp(1-s.y/320,0,1)*(.4+.5*Math.abs(Math.sin(T+s.tw)));ctx.fillStyle='#dfe8ff';ctx.fillRect(s.x,s.y,s.s,s.s);}
  ctx.globalAlpha=1;
 }
 if(i===0){
  for(const b of decor.b1){ctx.fillStyle='#1b1230';ctx.fillRect(b.x,GY-b.h,b.w,b.h);}
  for(const b of decor.b2){ctx.fillStyle='#0d0a18';ctx.fillRect(b.x,GY-b.h,b.w,b.h);}
  for(const w of decor.win){ctx.globalAlpha=w.a*(.7+.3*Math.sin(T*2+w.x));ctx.fillStyle=w.c;ctx.fillRect(w.x,w.y,w.w,w.h);}
  ctx.globalAlpha=1;
  circ(820,110,34,'#f5efd7');circ(808,102,26,'rgba(200,60,60,.14)');
 }else if(i===1){
  for(const m of decor.mesas){ctx.fillStyle='#131a33';ctx.beginPath();ctx.moveTo(m.x,GY);ctx.lineTo(m.x+m.w*.15,GY-m.h);ctx.lineTo(m.x+m.w*.85,GY-m.h);ctx.lineTo(m.x+m.w,GY);ctx.closePath();ctx.fill();}
  ctx.strokeStyle='#131a33';ctx.lineWidth=5;ctx.lineCap='round';
  for(const c of decor.cacti){ctx.beginPath();ctx.moveTo(c.x,GY);ctx.lineTo(c.x,GY-c.h);ctx.moveTo(c.x,GY-c.h*.55);ctx.lineTo(c.x+c.s*10,GY-c.h*.7);ctx.lineTo(c.x+c.s*10,GY-c.h*.9);ctx.stroke();}
  circ(150,120,44,'#e8ecff');circ(138,110,30,'#d8ddf5');circ(162,132,26,'#d8ddf5');circ(150,120,44,'rgba(232,236,255,.25)');
  /* rust bucket */
  ctx.save();ctx.translate(70,GY);
  rrect(-52,-52,110,40,6);ctx.fillStyle='#b9c4bd';ctx.fill();
  ctx.fillStyle='#7d8a82';ctx.fillRect(-52,-26,110,8);
  rrect(-38,-46,22,14,3);ctx.fillStyle='#31405c';ctx.fill();
  rrect(8,-46,22,14,3);ctx.fillStyle='#31405c';ctx.fill();
  circ(-28,-10,8,'#22282e');circ(28,-10,8,'#22282e');circ(-28,-10,3,'#59626b');circ(28,-10,3,'#59626b');
  ctx.restore();
 }else{
  for(const p of decor.panels){
   ctx.fillStyle='#0a2018';ctx.fillRect(p.x,40,p.w,p.h);
   ctx.strokeStyle='rgba(110,240,150,.22)';ctx.lineWidth=2;ctx.strokeRect(p.x,40,p.w,p.h);
   if(p.glow){ctx.fillStyle='rgba(110,240,150,.14)';ctx.fillRect(p.x+8,60+((T*20+p.x)%Math.max(1,p.h-90)),p.w-16,26);}
   if(p.vent){ctx.fillStyle='#061510';for(let k=0;k<3;k++)ctx.fillRect(p.x+10,180+k*16,p.w-20,7);}
  }
  ctx.fillStyle='#02070c';ctx.fillRect(300,52,360,86);
  ctx.strokeStyle='#2f7a4a';ctx.lineWidth=4;ctx.strokeRect(300,52,360,86);
  for(const s of decor.stars){if(s.x>300&&s.x<660)circ(300+(s.x-300),52+s.y*.29,s.s*.7,'#cfe3ff');}
  ctx.fillStyle='#122018';ctx.fillRect(280,138,400,8);
 }
 /* ground */
 ctx.fillStyle=i===0?'#241d2e':i===1?'#2c2438':'#0d1f17';
 ctx.fillRect(0,GY,W,H-GY);
 ctx.fillStyle=i===0?'#3a3046':i===1?'#463a52':'#1a3a2a';
 ctx.fillRect(0,GY,W,4);
 ctx.fillStyle=i===2?'rgba(110,240,150,.25)':'rgba(255,255,255,.12)';
 for(const dsh of decor.dashes)ctx.fillRect(dsh.x,dsh.y,26,3);
 if(i===2){ctx.fillStyle='rgba(255,80,60,.5)';for(let k=0;k<8;k++)ctx.fillRect(k*124,GY+40,62,5);}
}
function drawPlatforms(){
 for(const p of platforms){
  ctx.fillStyle=bgIndex===2?'#10251c':'#2a2f3a';
  ctx.fillRect(p.x,p.y,p.w,14);
  ctx.fillStyle=bgIndex===2?'#2f7a4a':'#575f70';
  ctx.fillRect(p.x,p.y,p.w,3.5);
  ctx.fillStyle='rgba(0,0,0,.4)';
  ctx.fillRect(p.x,p.y+14,p.w,3);
 }
}
function drawFX(){
 for(const pk of pickups){
  ctx.save();ctx.translate(pk.x,pk.y+Math.sin(T*4)*3);
  ctx.fillStyle='#f2f2ee';ctx.beginPath();ctx.moveTo(-7,-10);ctx.lineTo(7,-10);ctx.lineTo(5,10);ctx.lineTo(-5,10);ctx.closePath();ctx.fill();
  ctx.fillStyle='#7ee23a';ctx.fillRect(-7,-10,14,4);
  ctx.fillStyle='#ff5340';circ(0,-13,2.5,'#ff5340');ctx.strokeStyle='#4a8f37';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-13);ctx.lineTo(3,-17);ctx.stroke();
  ctx.restore();
  if(pk.t<2&&Math.sin(T*16)>0){ctx.globalAlpha=.4;circ(pk.x,pk.y,14,'#7ee23a');ctx.globalAlpha=1;}
 }
 for(const s of shots){
  if(s.type==='fire'){circ(s.x,s.y,7,'rgba(255,138,30,.5)');circ(s.x,s.y,4.5,'#ff8a1e');circ(s.x,s.y,2,'#ffe08a');}
  else{ctx.save();ctx.translate(s.x,s.y);ctx.rotate(Math.atan2(s.vy,s.vx));ctx.fillStyle='#bff7d2';ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(0,3.5);ctx.lineTo(-7,0);ctx.lineTo(0,-3.5);ctx.closePath();ctx.fill();ctx.restore();}
 }
 for(const b of bolts){
  circ(b.x,b.y,7,'rgba(255,75,58,.35)');circ(b.x,b.y,4.5,'#ff4b3a');circ(b.x-1,b.y-1,1.6,'#ffd9c9');
 }
 for(const w of waves){
  ctx.fillStyle='rgba(255,122,60,.85)';
  ctx.beginPath();ctx.moveTo(w.x-14,GY);ctx.lineTo(w.x,GY-26-Math.random()*6);ctx.lineTo(w.x+14,GY);ctx.closePath();ctx.fill();
  ctx.fillStyle='#fff3b0';ctx.beginPath();ctx.moveTo(w.x-5,GY);ctx.lineTo(w.x,GY-14);ctx.lineTo(w.x+5,GY);ctx.closePath();ctx.fill();
 }
 for(const bm of beams){
  if(bm.t<bm.tele){ctx.strokeStyle='rgba(255,80,60,'+(bm.t/bm.tele*.6)+')';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(0,bm.y);ctx.lineTo(W,bm.y);ctx.stroke();ctx.setLineDash([]);}
  else{
   const h=26;ctx.fillStyle='rgba(255,83,64,.75)';ctx.fillRect(0,bm.y-h/2,W,h);
   ctx.fillStyle='#fff';ctx.fillRect(0,bm.y-4,W,8);
   if(Math.random()<.5)burst(Math.random()*W,bm.y+rand(-10,10),'#ffd9c9',1,100);
  }
 }
 for(const a of arcs){
  const pr=a.t/.18;ctx.strokeStyle='rgba(255,217,160,'+(1-pr)+')';ctx.lineWidth=6*(1-pr)+2;
  ctx.beginPath();ctx.arc(a.x,a.y,30+pr*46,a.dir>0?-1.1:Math.PI-1.1,a.dir>0?1.1:Math.PI+1.1);ctx.stroke();
 }
 for(const r of rings){
  const pr=r.t/.4;ctx.strokeStyle=r.c;ctx.globalAlpha=1-pr;ctx.lineWidth=5*(1-pr)+1;
  ctx.beginPath();ctx.arc(r.x,r.y,10+pr*90,0,7);ctx.stroke();ctx.globalAlpha=1;
 }
 for(const p of parts){ctx.globalAlpha=clamp(p.life/p.max,0,1);circ(p.x,p.y,p.sz,p.c);}
 ctx.globalAlpha=1;
 ctx.textAlign='center';
 for(const p of pops){
  ctx.globalAlpha=1-p.t;ctx.font='19px Bangers, sans-serif';
  ctx.strokeStyle='#000';ctx.lineWidth=4;ctx.strokeText(p.txt,p.x,p.y);
  ctx.fillStyle=p.c;ctx.fillText(p.txt,p.x,p.y);ctx.globalAlpha=1;
 }
}
function drawBanner(){
 if(!banner)return;
 const pr=1-banner.t/banner.dur,ease=1-Math.pow(1-Math.min(1,pr*3),3);
 const a=banner.t<.4?banner.t/.4:1;
 ctx.globalAlpha=a;ctx.textAlign='center';
 ctx.font='52px Bangers, sans-serif';
 const x=W/2+(1-ease)*80;
 ctx.strokeStyle='#000';ctx.lineWidth=8;ctx.strokeText(banner.main,x,208);
 ctx.fillStyle=banner.c;ctx.fillText(banner.main,x,208);
 if(banner.sub){ctx.font='700 17px "Chakra Petch", sans-serif';ctx.strokeStyle='#000';ctx.lineWidth=5;ctx.strokeText(banner.sub,W/2,238);ctx.fillStyle='#eaffdc';ctx.fillText(banner.sub,W/2,238);}
 ctx.globalAlpha=1;
}
function render(){
 ctx.setTransform(1,0,0,1,0,0);
 ctx.clearRect(0,0,W,H);
 ctx.save();
 if(shake>0)ctx.translate(rand(-shake,shake),rand(-shake,shake));
 drawBG(bgIndex);
 drawPlatforms();
 if(state!=='title'){
  for(const e of enemies)drawEnemy(e);
  drawBoss();
  drawPlayer();
 }
 drawFX();
 ctx.restore();
 if(flash>0){ctx.fillStyle='rgba(126,226,58,'+(flash*.55)+')';ctx.fillRect(0,0,W,H);}
 if(whiteFlash>0){ctx.fillStyle='rgba(255,255,240,'+(whiteFlash*.7)+')';ctx.fillRect(0,0,W,H);}
 if(state==='play'&&heroMode&&Math.random()<.02&&parts.length<200)parts.push({x:Math.random()*W,y:-10,vx:0,vy:120,life:2,max:2,c:'rgba(126,226,58,.5)',sz:2,g:0});
 drawBanner();
}

/* ================= HUD sync ================= */
function syncHUD(){
 if(!player)return;
 $('hpFill').style.width=(player.hp/player.maxHp*100)+'%';
 $('hpBar').classList.toggle('hpLow',player.hp<=2);
 const en=$('enFill');
 if(player.lock>0){en.style.width=((1-player.lock/3.2)*100)+'%';en.style.background='#ff5340';$('enLock').classList.remove('hidden');$('dial').classList.add('locked');}
 else{en.style.width=player.energy+'%';en.style.background='#7ee23a';$('enLock').classList.add('hidden');$('dial').classList.remove('locked');}
 document.querySelectorAll('.db').forEach(b=>b.classList.toggle('active',b.dataset.form===player.form));
 $('scoreVal').textContent=score;
 const mult=Math.min(5,1+Math.floor(combo/4));
 if(combo>=4&&comboTimer>0){$('comboVal').classList.remove('hidden');$('comboVal').textContent='COMBO ×'+mult;}
 else $('comboVal').classList.add('hidden');
 if(bossActive&&boss)$('bossFill').style.width=(boss.hp/boss.maxHp*100)+'%';
}

/* ================= UI wiring ================= */
$('btnStart').onclick=()=>{initAudio();score=0;loadChapter(0);$('ovTitle').classList.add('hidden');showStory(CHAPTERS[0].intro,beginPlay);};
$('btnHow').onclick=()=>$('ovHow').classList.remove('hidden');
$('howBack').onclick=()=>$('ovHow').classList.add('hidden');
$('ovStory').onclick=advanceStory;
$('btnRetry').onclick=()=>{score=heroMode?heroStartScore:chapterStartScore;loadChapter(chapterIdx,heroMode);beginPlay();};
$('btnQuit').onclick=showTitle;
$('btnHero').onclick=()=>{score=0;loadChapter(0,true);$('ovWin').classList.add('hidden');beginPlay();};
$('btnReplay').onclick=()=>{score=0;loadChapter(0);$('ovWin').classList.add('hidden');showStory(CHAPTERS[0].intro,beginPlay);};
$('btnWinTitle').onclick=showTitle;
function togglePause(){
 if(state!=='play')return;
 paused=!paused;$('ovPause').classList.toggle('hidden',!paused);
}
$('pauseBtn').onclick=togglePause;
$('btnResume').onclick=togglePause;
$('btnPauseQuit').onclick=()=>{paused=false;$('ovPause').classList.add('hidden');showTitle();};
$('sndBtn').onclick=()=>{initAudio();sndOn=!sndOn;if(MG)MG.gain.value=sndOn?.42:0;$('sndBtn').textContent=sndOn?'SND ON':'SND OFF';};
document.querySelectorAll('.db').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();initAudio();tryTransform(b.dataset.form);}));

/* ================= main loop ================= */
let last=0;
function frame(ts){
 const now=ts/1000;
 let dt=Math.min(.033,now-(last||now-.016));
 last=now;
 T+=dt;
 shake=Math.max(0,shake-dt*16);
 flash=Math.max(0,flash-dt*1.7);
 whiteFlash=Math.max(0,whiteFlash-dt*1.4);
 if(banner){banner.t-=dt;if(banner.t<=0)banner=null;}
 if(state==='play'&&!paused)update(dt);
 render();
 syncHUD();
 requestAnimationFrame(frame);
}
buildDecor(0);
showTitle();
requestAnimationFrame(frame);
