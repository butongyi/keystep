/* 键步如飞 · music.js
   音高表 / 三首曲子的旋律 / Web Audio 合成与整首排程
   由 键步如飞.html 以 <script src="music.js"></script> 引入
   想改曲子只动这个文件，游戏本体不用碰
*/
window.MUSIC=(function(){
'use strict';

/* ========== 音高表 ========== */
var FREQ={
  'B3':246.94,
  'C4':261.63,'C#4':277.18,'D4':293.66,'D#4':311.13,'E4':329.63,'F4':349.23,'F#4':369.99,
  'G4':392.00,'G#4':415.30,'A4':440.00,'A#4':466.16,'B4':493.88,
  'C5':523.25,'C#5':554.37,'D5':587.33,'D#5':622.25,'E5':659.25,'F5':698.46,'F#5':739.99,
  'G5':783.99,'G#5':830.61,'A5':880.00,'A#5':932.33,'B5':987.77
};

/* ========== 关卡：旋律都是公有领域的曲子
   三首都是"简单档"：最密的间隔也是一拍一个，没有半拍连打；
   长度都做到 2 分钟以上，靠段落（主题 / 高八度再现 / 半速段）拉长，而不是靠加难度
*/
var UP={'C4':'C5','C#4':'C#5','D4':'D5','D#4':'D#5','E4':'E5','F4':'F5','F#4':'F#5',
  'G4':'G5','G#4':'G#5','A4':'A5','A#4':'A#5','B4':'B5'};
/* 把一段旋律摆到第 off 拍：k=1 原速，k=2 每个音拉开一倍；up=1 升八度 */
function seq(phr,off,k,up){
  var out=[],i,b,n;
  for(i=0;i<phr.length;i++){
    b=phr[i][0]*(k||1)+off; n=phr[i][1];
    out.push([b, up? (UP[n]||n) : n]);
  }
  return out;
}
/* 循环一段短语很多遍，每段换一个间隔：segs=[[遍数, 间隔倍数], ...]
   loopLen 是一个循环占几拍；间隔倍数越小人越挤，听感就是"越来越快" */
function build(phr,loopLen,segs){
  var out=[],i,j,off=0;
  for(i=0;i<segs.length;i++){
    var c=segs[i][0],k=segs[i][1];
    for(j=0;j<c;j++){
      out=out.concat(seq(phr,off,k));
      off+=loopLen*k;
    }
  }
  return out;
}

/* 小星星：8 小节主题，两遍成一个循环 */
var STAR=[
  [0,'C4'],[1,'C4'],[2,'G4'],[3,'G4'],
  [4,'A4'],[5,'A4'],[6,'G4'],
  [8,'F4'],[9,'F4'],[10,'E4'],[11,'E4'],
  [12,'D4'],[13,'D4'],[14,'C4'],
  [16,'G4'],[17,'G4'],[18,'F4'],[19,'F4'],
  [20,'E4'],[21,'E4'],[22,'D4'],
  [24,'G4'],[25,'G4'],[26,'F4'],[27,'F4'],
  [28,'E4'],[29,'E4'],[30,'D4'],
  [32,'C4'],[33,'C4'],[34,'G4'],[35,'G4'],
  [36,'A4'],[37,'A4'],[38,'G4'],
  [40,'F4'],[41,'F4'],[42,'E4'],[43,'E4'],
  [44,'D4'],[45,'D4'],[46,'C4']
];

/* 欢乐颂：主题 8 小节 */
var JOY=[
  [0,'E4'],[1,'E4'],[2,'F4'],[3,'G4'],[4,'G4'],[5,'F4'],[6,'E4'],[7,'D4'],
  [8,'C4'],[9,'C4'],[10,'D4'],[11,'E4'],[12,'E4'],[13,'D4'],[14,'D4'],
  [16,'E4'],[17,'E4'],[18,'F4'],[19,'G4'],[20,'G4'],[21,'F4'],[22,'E4'],[23,'D4'],
  [24,'C4'],[25,'C4'],[26,'D4'],[27,'E4'],[28,'D4'],[29,'C4'],[30,'C4']
];

/* 致爱丽丝：A 段（去掉十六分/八分的碎音，全部压到整拍） */
var ELISE=[
  [0,'E5'],[1,'D#5'],[2,'E5'],[3,'D#5'],[4,'E5'],[5,'B4'],[6,'D5'],[7,'C5'],[8,'A4'],
  [10,'C4'],[11,'E4'],[12,'A4'],[13,'B4'],
  [15,'E4'],[16,'G#4'],[17,'B4'],[18,'C5'],
  [20,'E4'],[21,'E5'],[22,'D#5'],[23,'E5'],[24,'D#5'],[25,'E5'],[26,'B4'],[27,'D5'],[28,'C5'],[29,'A4'],
  [31,'C4'],[32,'E4'],[33,'A4'],[34,'B4'],
  [36,'E4'],[37,'G#4'],[38,'B4'],[39,'C5'],
  [41,'E4'],[42,'E5'],[43,'D#5'],[44,'E5'],[45,'D#5'],[46,'E5'],[47,'B4'],[48,'D5'],[49,'C5'],[50,'A4']
];

/* 难曲三首：都只取"能对得上公开简谱"的骨架句，靠越来越密的循环把难度拉起来
   土耳其进行曲（1=C，23 个音的骨架句，12 拍一循环） */
var TURK=[
  [0,'B4'],[0.5,'A4'],[1,'G#4'],[1.5,'A4'],[2,'C5'],[2.5,'B4'],[3,'A4'],[3.5,'B4'],
  [4,'E4'],[4.5,'D4'],[5,'C4'],[5.5,'B3'],[6,'C4'],[6.5,'E4'],[7,'A4'],[7.5,'B4'],
  [8,'C4'],[8.5,'D4'],[9,'E4'],[9.5,'D4'],[10,'C4'],[10.5,'B3'],[11,'A4']
];
/* 在山妖的洞窟中（1=D，B 小调骨架句，16 音 / 8 拍） */
var HALL=[
  [0,'B3'],[0.5,'C#4'],[1,'D4'],[1.5,'E4'],[2,'D4'],[2.5,'C#4'],[3,'B3'],[3.5,'D4'],
  [4,'E4'],[4.5,'F#4'],[5,'G4'],[5.5,'F#4'],[6,'E4'],[6.5,'D4'],[7,'C#4'],[7.5,'B3']
];
/* 匈牙利舞曲第五号（1=A，升 f 小调骨架句，16 音 / 8 拍） */
var HUNG=[
  [0,'F#4'],[0.5,'G#4'],[1,'A4'],[1.5,'B4'],[2,'C#5'],[2.5,'B4'],[3,'A4'],[3.5,'G#4'],
  [4,'F#4'],[4.5,'C#5'],[5,'B4'],[5.5,'A4'],[6,'G#4'],[6.5,'F#4'],[7,'E4'],[7.5,'F#4']
];

var LEVELS=[
  {
    name:'小星星', tag:'钢琴 · 96 · 2分07', bpm:96, kind:'piano', mood:'day',
    roots:[261.63,329.63,392.00,261.63],
    mel: seq(STAR,0,1)
      .concat( seq(STAR,48,1,1) )            /* 高八度再来一遍 */
      .concat( seq(STAR.slice(0,21),96,2) )  /* 半速段：一拍变两拍 */
      .concat( seq(STAR,144,1) )             /* 主题回来 */
      .concat( [[192,'G4'],[194,'F4'],[196,'E4'],[198,'D4'],[200,'C4'],[204,'C4']] )
  },
  {
    name:'欢乐颂', tag:'钢琴 · 96 · 2分06', bpm:96, kind:'piano', mood:'dusk',
    roots:[261.63,329.63,196.00,261.63],
    mel: seq(JOY,0,1)
      .concat( seq(JOY,32,1,1) )
      .concat( seq(JOY,64,2) )
      .concat( seq(JOY,128,1) )
      .concat( [[160,'E4'],[166,'E4'],[172,'F4'],[178,'G4'],[184,'G4'],[190,'F4'],[196,'E4'],[202,'D4']] )
  },
  {
    name:'致爱丽丝', tag:'小提琴 · 108 · 2分26', bpm:108, kind:'violin', mood:'night',
    roots:[220.00,164.81,196.00,220.00],
    mel: seq(ELISE,0,1)
      .concat( seq(ELISE,54,1) )
      .concat( seq(ELISE,108,2) )
      .concat( seq(ELISE,212,1) )
  },
  {
    name:'土耳其进行曲', tag:'钢琴 · 144 · 2分32', bpm:144, kind:'piano', mood:'day',
    roots:[261.63,329.63,392.00,220.00],
    mel: build(TURK,12,[[3,3],[4,2],[4,1.5],[6,1.25]])
  },
  {
    name:'在山妖的洞窟中', tag:'钢琴 · 132 · 2分05', bpm:132, kind:'piano', mood:'night',
    roots:[246.94,293.66,246.94,185.00],
    mel: build(HALL,8,[[3,3],[4,2],[5,1.5],[8,1.25]])
  },
  {
    name:'匈牙利舞曲第五号', tag:'小提琴 · 152 · 2分31', bpm:152, kind:'violin', mood:'dusk',
    roots:[369.99,440.00,554.37,329.63],
    mel: build(HUNG,8,[[3,3],[4,2.5],[5,2],[6,1.5],[8,1.25]])
  }
];
/* ========== 音频 ========== */
var AC=null, MASTER=null, NOISE=null, TICKON=true;
/* 两条总线：打歌走 SONGG，菜单走 MENUG，互不影响，可以单独静音/淡入 */
var CUR=null, SONGG=null, MENUG=null;
function bus(){ return CUR||MASTER; }
function init(vol){
  if(AC){ if(AC.state==='suspended') AC.resume(); return AC; }
  var C=window.AudioContext||window.webkitAudioContext;
  AC=new C();
  MASTER=AC.createGain(); MASTER.gain.value=Math.max(0,Math.min(1,(vol||90)/100)); MASTER.connect(AC.destination);
  SONGG=AC.createGain(); SONGG.gain.value=1; SONGG.connect(MASTER);
  MENUG=AC.createGain(); MENUG.gain.value=0.9; MENUG.connect(MASTER);
  var n=Math.floor(AC.sampleRate*0.5);
  NOISE=AC.createBuffer(1,n,AC.sampleRate);
  var d=NOISE.getChannelData(0);
  for(var i=0;i<n;i++) d[i]=Math.random()*2-1;
  return AC;
}

/* 钢琴音 */
function piano(t,f,vol,dur){
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='triangle'; o.frequency.value=f;
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(vol,t+0.008);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.start(t); o.stop(t+dur+0.04);
  var o2=AC.createOscillator(), g2=AC.createGain();
  o2.type='sine'; o2.frequency.value=f*2;
  o2.connect(g2); g2.connect(bus());
  g2.gain.setValueAtTime(0,t);
  g2.gain.linearRampToValueAtTime(vol*0.45,t+0.006);
  g2.gain.exponentialRampToValueAtTime(0.0001,t+dur*0.6);
  o2.start(t); o2.stop(t+dur*0.62);
}

/* 小提琴音：锯齿波 + 低通 + 揉弦 */
function violin(t,f,vol,dur){
  var o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=f;
  var lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2400; lp.Q.value=1.2;
  var gn=AC.createGain();
  var lfo=AC.createOscillator(); lfo.type='sine'; lfo.frequency.value=5.6;
  var lg=AC.createGain(); lg.gain.value=13;
  lfo.connect(lg); lg.connect(o.detune);
  o.connect(lp); lp.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(vol,t+0.055);
  gn.gain.setValueAtTime(vol,t+dur*0.55);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.start(t); o.stop(t+dur+0.05);
  lfo.start(t); lfo.stop(t+dur+0.05);
}
function bgmSnare(t,v){
  var s=AC.createBufferSource(), f=AC.createBiquadFilter(), gn=AC.createGain();
  s.buffer=NOISE; f.type='bandpass'; f.frequency.value=1500; f.Q.value=0.9;
  s.connect(f); f.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(v||0.06,t+0.004);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.12);
  s.start(t); s.stop(t+0.14);
}
function bgmBass(t,f,vol,dur){
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='triangle'; o.frequency.value=f;
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(vol,t+0.05);
  gn.gain.linearRampToValueAtTime(vol*0.8,t+dur*0.7);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.start(t); o.stop(t+dur+0.04);
}
function bgmBell(t,f,v){
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='sine'; o.frequency.value=f;
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(v,t+0.02);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.5);
  o.start(t); o.stop(t+0.55);
}
function inst(t,f,vol,dur,kind){
  if(kind==='violin') violin(t,f,vol,dur);
  else piano(t,f,vol,dur);
}

/* 背景 */
function bgmKick(t,v){
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='sine'; o.connect(gn); gn.connect(bus());
  o.frequency.setValueAtTime(150,t);
  o.frequency.exponentialRampToValueAtTime(52,t+0.12);
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(v||0.15,t+0.006);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.2);
  o.start(t); o.stop(t+0.24);
}
function bgmHat(t,v){
  var s=AC.createBufferSource(), hp=AC.createBiquadFilter(), gn=AC.createGain();
  s.buffer=NOISE; hp.type='highpass'; hp.frequency.value=5200;
  s.connect(hp); hp.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(v||0.055,t+0.003);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.05);
  s.start(t); s.stop(t+0.07);
}
function bgmPad(t,f,dur,vol){
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='sine'; o.frequency.value=f;
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(vol,t+0.16);
  gn.gain.linearRampToValueAtTime(vol,t+dur-0.25);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.start(t); o.stop(t+dur+0.05);
}

/* 整首一次性排程：旋律 + 伴奏一起排，保证连续 */
function scheduleSong(lv,beat,t0,endT){
  CUR=SONGG;
  for(var i=0;i<lv.mel.length;i++){
    var b=lv.mel[i][0], f=FREQ[lv.mel[i][1]];
    var nx=(i+1<lv.mel.length)?lv.mel[i+1][0]:(b+1);
    var gap=Math.max(0.09,(nx-b)*beat);
    var dur=lv.kind==='violin'?gap*0.97:Math.min(0.95,Math.max(beat*1.15,gap*1.05));
    inst(t0+b*beat, f, lv.kind==='violin'?0.30:0.32, dur, lv.kind);
  }
  scheduleBGM(lv,beat,t0,endT);
  CUR=null;
}
/* 节拍器：每拍一下，每 4 拍的第一拍重一点（重拍高音、其它拍低音） */
function bgmClick(t,v,acc){
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='triangle'; o.frequency.value= acc?1240:780;
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(v,t+0.004);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.055);
  o.start(t); o.stop(t+0.07);
}
function scheduleBGM(lv,beat,t0,endT){
  var beats=Math.ceil(endT/beat)+1;
  for(var b=0;b<beats;b++){
    var acc=(b%4===0);
    bgmClick(t0+b*beat, acc?0.13:0.062, acc);
  }
}

/* ========== 菜单音乐：主页 / 选曲 ==========
   八音盒琶音 + 氛围垫音，8 小节无缝循环
   home 72bpm：只有琶音和垫音，慢慢铺
   select 100bpm：同一套和弦，琶音变密，加一点轻鼓点，像"进了菜单"
   不进选曲列表，只属于界面
*/
var MENU_CH=[
  [220.00,261.63,329.63],   /* Am */
  [174.61,220.00,261.63],   /* F  */
  [261.63,329.63,392.00],   /* C  */
  [196.00,246.94,293.66],   /* G  */
  [220.00,261.63,329.63],
  [174.61,220.00,261.63],
  [261.63,329.63,392.00],
  [196.00,246.94,293.66]
];
var MENU_ARP=[[0,0],[1,1],[2,2],[3,1]];
var MENU_ARP_FAST=[[0,0],[0.5,1],[1,2],[1.5,1],[2,2],[2.5,1],[3,0],[3.5,2]];
var MENU_CFG={
  home:{bpm:72,arp:MENU_ARP,arpVol:0.13,padVol:0.050,drums:false},
  select:{bpm:100,arp:MENU_ARP_FAST,arpVol:0.105,padVol:0.042,drums:true}
};

function scheduleMenuCycle(kind,t0){
  var cfg=MENU_CFG[kind]||MENU_CFG.home, beat=60/cfg.bpm, bars=MENU_CH.length;
  CUR=MENUG;
  for(var i=0;i<bars;i++){
    var ch=MENU_CH[i], bt=t0+i*4*beat;
    for(var p=0;p<ch.length;p++) bgmPad(bt, ch[p], 4*beat-0.06, cfg.padVol);
    for(var a=0;a<cfg.arp.length;a++){
      var s=cfg.arp[a];
      piano(bt+s[0]*beat, ch[s[1]]*2, cfg.arpVol, Math.min(0.9, beat*1.6));
    }
    if(cfg.drums){
      bgmKick(bt,0.085); bgmKick(bt+2*beat,0.05);
      bgmBass(bt, ch[0]*0.5, 0.10, 2*beat-0.06);
      bgmBass(bt+2.5*beat, ch[0]*0.5, 0.05, 1.2*beat);
      for(var h=0;h<4;h++) bgmHat(bt+(0.5+h)*beat, 0.028);
    }
    if(i%2===1) bgmBell(bt+2*beat, ch[2]*2, 0.032);
  }
  CUR=null;
}

var MENU={on:false,kind:'home',until:0,timer:null};
/* 停菜单：旧总线直接淡到 0 并丢弃，已经排进去的音就哑掉了，不会和新的一段叠在一起 */
function menuStop(){
  MENU.on=false;
  if(MENU.timer){ clearTimeout(MENU.timer); MENU.timer=null; }
  if(MENUG&&AC){ var old=MENUG; MENUG=null; old.gain.cancelScheduledValues(AC.currentTime); old.gain.setTargetAtTime(0,AC.currentTime,0.06); }
}
function menuPump(){
  if(!MENU.on||!AC||!MENUG) return;
  var cfg=MENU_CFG[MENU.kind]||MENU_CFG.home, cyc=MENU_CH.length*4*(60/cfg.bpm);
  if(MENU.until<AC.currentTime) MENU.until=AC.currentTime+0.05;
  var guard=0;
  while(MENU.until<AC.currentTime+cyc && guard++<6){
    scheduleMenuCycle(MENU.kind, MENU.until);
    MENU.until+=cyc;
  }
  if(MENU.timer) clearTimeout(MENU.timer);
  MENU.timer=setTimeout(menuPump, Math.max(600,(cyc-1)*1000));
}
function menu(kind){
  if(!AC) return;
  var k=(kind==='select')?'select':'home';
  if(MENU.on&&MENU.kind===k&&MENUG) return;   /* 同一段还在放，别打断 */
  if(MENU.timer){ clearTimeout(MENU.timer); MENU.timer=null; }
  if(MENUG){ var old=MENUG; old.gain.cancelScheduledValues(AC.currentTime); old.gain.setTargetAtTime(0,AC.currentTime,0.06); }
  MENUG=AC.createGain();
  MENUG.gain.setValueAtTime(0,AC.currentTime);
  MENUG.gain.linearRampToValueAtTime(0.9,AC.currentTime+0.35);
  MENUG.connect(MASTER);
  MENU.kind=k; MENU.on=true; MENU.until=AC.currentTime+0.1;
  menuPump();
}
/* 打歌总线：每开一首新建一条，上一首已经排进去的音随旧总线一起哑掉 */
function songOn(){
  if(!AC) return;
  if(SONGG){ var old=SONGG; old.gain.cancelScheduledValues(AC.currentTime); old.gain.setTargetAtTime(0,AC.currentTime,0.05); }
  SONGG=AC.createGain(); SONGG.gain.value=1; SONGG.connect(MASTER);
}
function songOff(){
  if(SONGG&&AC){ var old=SONGG; SONGG=null; old.gain.cancelScheduledValues(AC.currentTime); old.gain.setTargetAtTime(0,AC.currentTime,0.07); }
}

function missSound(){
  var t=AC.currentTime+0.001;
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='sine'; o.frequency.setValueAtTime(120,t);
  o.frequency.exponentialRampToValueAtTime(60,t+0.16);
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(0.32,t+0.006);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.2);
  o.start(t); o.stop(t+0.22);
}
function tickSound(){
  if(!TICKON||!AC) return;
  var t=AC.currentTime+0.001;
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='square'; o.frequency.value=440;
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(0.06,t+0.004);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.07);
  o.start(t); o.stop(t+0.1);
}
/* 扑地的闷响 */
function thudSound(){
  if(!AC) return;
  var t=AC.currentTime+0.001;
  var o=AC.createOscillator(), gn=AC.createGain();
  o.type='triangle'; o.frequency.setValueAtTime(90,t);
  o.frequency.exponentialRampToValueAtTime(32,t+0.14);
  o.connect(gn); gn.connect(bus());
  gn.gain.setValueAtTime(0,t);
  gn.gain.linearRampToValueAtTime(0.3,t+0.01);
  gn.gain.exponentialRampToValueAtTime(0.0001,t+0.24);
  o.start(t); o.stop(t+0.26);
}

function setVol(v){ if(MASTER) MASTER.gain.value=Math.max(0,Math.min(1,v/100)); }
function setTick(v){ TICKON=!!v; }
function closeAudio(){
  MENU.on=false; if(MENU.timer){ clearTimeout(MENU.timer); MENU.timer=null; }
  SONGG=null; MENUG=null; CUR=null;
  if(AC){ try{ AC.close(); }catch(e){} } AC=null; MASTER=null; NOISE=null;
}
function schedule(lv,beat,t0,endT){ scheduleSong(lv,beat,t0,endT); }

return {
  FREQ:FREQ, LEVELS:LEVELS,
  init:init, setVol:setVol, setTick:setTick, close:closeAudio,
  schedule:schedule, inst:inst,
  menu:menu, menuStop:menuStop, songOn:songOn, songOff:songOff,
  miss:missSound, tick:tickSound, thud:thudSound
};
})();
