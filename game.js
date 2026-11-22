/* Late Night Live: The RPG. (c) 2026 Necklar. All rights reserved. */
/* Game logic */
let S=null;
const $=s=>document.querySelector(s);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const clamp=v=>Math.max(0,Math.min(100,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));

function save(){try{localStorage.setItem("lnl-save5",JSON.stringify(S));}catch(e){}}
function load(){try{return JSON.parse(localStorage.getItem("lnl-save5"));}catch(e){return null;}}
function wipe(){try{localStorage.removeItem("lnl-save5");}catch(e){}}
function getFame(){try{return JSON.parse(localStorage.getItem("lnl-fame"))||{};}catch(e){return {};}}
function addFame(name,pts){try{const f=getFame();f[name]=(f[name]||0)+pts;localStorage.setItem("lnl-fame",JSON.stringify(f));}catch(e){}}
function getHof(){try{return JSON.parse(localStorage.getItem("lnl-hof"))||[];}catch(e){return [];}}
function addHof(entry){try{const h=getHof();h.push(entry);h.sort((a,b)=>b.score-a.score);localStorage.setItem("lnl-hof",JSON.stringify(h.slice(0,5)));}catch(e){}}

/* ---------- Tracking ---------- */
function bitRec(n){ if(!S.bits[n]) S.bits[n]={plays:0,hits:0,legend:0,best:0,fails:0,streak:0,retired:false}; return S.bits[n]; }
function bitStatus(n){
  const r=S.bits[n]; if(!r||!r.plays) return null;
  if(r.retired) return {k:"ret",t:"RETIRED"};
  if(r.legend>=1||r.hits>=2) return {k:"rec",t:"RECURRING"};
  if(r.hits===0) return {k:"one",t:"ONE-SHOT"};
  return {k:"pro",t:"PROMISING"};
}
const badge=s=>s?`<span class="badge b-${s.k}">${s.t}</span>`:"";
function guestRec(n){ if(!S.guests[n]) S.guests[n]={apps:0,good:0,walk:0,regular:false}; return S.guests[n]; }
function castStatus(c){ return c.fame>=60?{k:"cult",t:"CULT FAVORITE"}:c.fame>=35?{k:"rec",t:"REGULAR"}:{k:"new",t:"NEW FACE"}; }

function newState(host){
  return {host,ep:1,ratings:45,patience:60,campus:10,morale:60,weird:15,control:0,
    arnie:55,walt:55,lenny:55,chuck:55,stu:55,
    claimed:[],score:0,log:[],bit:null,guest:null,best:null,chuckChar:null,hint:null,
    bits:{},guests:{},cast:{},gSeg:0,threads:[],news:[],genBits:{},genGuests:{},
    gag:{i:Math.floor(Math.random()*GAGS.length),stage:0},warned:{},seenBack:[],mile:0,passed:[]};
}
const claimed=id=>S.claimed.includes(id);
const news=(p,t)=>{S.news.push({p,t});};
const thread=o=>{S.threads.push(Object.assign({ep:S.ep,done:false},o));};
const allBits=()=>BITS.concat(Object.values(S.genBits));
const allGuests=()=>GUESTS.concat(Object.values(S.genGuests));
function epDate(ep){const d=new Date(1982,1,1);let n=ep-1;while(n>0){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)n--;}
  return d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});}

function drawStats(){
  const el=$("#stats");
  if(!S){el.style.display="none";return;}
  el.style.display="grid";
  el.innerHTML = STATS.map(s=>`<div class="stat"><label>${s.n}<b>${S[s.k]}</b></label><div class="bar"><i style="width:${S[s.k]}%;background:${s.c}"></i></div></div>`).join("")
   + `<div class="row"><span class="floors" aria-label="Floors claimed">${FLOORS.map(f=>`<span class="fl ${claimed(f.id)?"on":""}" title="${esc(f.name)}">${f.f}</span>`).join("")}</span></div>`
   + `<div class="row crew">${Object.keys(CREW).map(k=>`<span>${CREW[k].n} <b>${S[k]}</b></span>`).join("")}</div>`
   + `<div class="row"><span>Episode <b>${Math.min(S.ep,EPISODES)}</b> of ${EPISODES}</span><span>Tonight <b>${S.score>0?"+":""}${S.score}</b></span></div>`
   + `<div class="row" style="justify-content:center;border:0;padding-top:0"><button class="boardbtn" id="openBoard">Bit Board</button></div>`;
  $("#openBoard").onclick=openBoard;
  $("#showTitle").textContent="LATE NIGHT WITH "+S.host.toUpperCase();
  $("#log").innerHTML=S.log.map(l=>`<li>${esc(l)}</li>`).join("");
}

function apply(fx){
  const chips=[];
  for(const k in fx){
    if(!(k in NAMES)) continue;
    let v=fx[k];
    /* audiences get harder to win as they grow */
    if(v>0&&(k==="ratings"||k==="campus")) v=Math.max(1,Math.round(v*Math.max(.2,(100-S[k])/GROWTH[k])));
    const before=S[k]; S[k]=clamp(S[k]+v); const d=S[k]-before;
    if(k==="ratings") S.score+=v;
    if(d!==0) chips.push(`<span class="chip ${k==="weird"?"":(d>0?"up":"down")}">${d>0?"+":""}${d} ${NAMES[k]}</span>`);
  }
  drawStats();
  return chips.length?`<div class="chips">${chips.join("")}</div>`:"";
}
const say=(who,line)=>`<div class="say"><b>${CREW[who].full}, ${CREW[who].role}</b>${line}</div>`;

function render({kicker,title,body,choices}){
  const m=$("#scene");
  m.innerHTML=`<div class="scene">${kicker?`<div class="kicker">${kicker}</div>`:""}<h2>${title}</h2>${body||""}<div class="choices"></div></div>`;
  const box=m.querySelector(".choices");
  (choices||[]).forEach(c=>{
    const b=document.createElement("button");
    b.className="choice"+(c.primary?" primary":"")+(c.crew?" crewc":"");
    b.innerHTML=`<span class="t">${c.t}</span>${c.d?`<span class="d">${c.d}</span>`:""}`;
    b.onclick=c.fn; box.appendChild(b);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}
function outcome(kicker,title,text,chips,next){
  render({kicker,title,body:`${text.startsWith("<")?text:`<p>${text}</p>`}${chips}`,choices:[{t:"Continue",primary:true,fn:()=>{if(checkFail(next))return;next();}}]});
}
function resolve(opt){
  if(opt.fx) return {text:opt.r||"Done.",chips:apply(opt.fx)};
  const ok=Math.random()<opt.chance;
  return {text:ok?opt.wt:opt.lt,chips:apply(ok?opt.win:opt.lose),ok};
}
const GROWTH={ratings:80,campus:110};
const K=t=>`EPISODE ${S.ep} · ${t}`;

/* ---------- Network pressure: cancellation only with low ratings ---------- */
function checkFail(next){
  if(S.morale<=0){ending("THE STAFF QUITS","Staff morale has collapsed. The writers quit together and the show cannot continue.");return true;}
  if(S.patience<=0){
    if(S.ratings<40){ending("CANCELLED","Your ratings are low and the network has run out of patience. The show is cancelled, effective immediately.");return true;}
    crisis(next); return true;
  }
  return false;
}
function crisis(next){
  const c=CRISES[0];
  S.log.push(`Ep ${S.ep}: Network crisis.`);
  render({kicker:K("NETWORK CRISIS"),title:c.name,body:`<p>${c.d}</p>${say("arnie","They're not going to cancel a show with these numbers. But they want blood. Let me know how you want to play it.")}`,
    choices:c.a.map(a=>({t:a.t,d:a.d,fn:()=>{
      let text,chips;
      if(a.arnie){const ok=Math.random()<.35+S.arnie*.006;
        chips=apply(ok?{patience:25,arnie:5}:{patience:10,morale:-5});
        text=ok?"Arnie met with the network and got them to back off for now.":"Arnie bought you a little time, but the network made the staff take a pay freeze.";}
      else if(a.bluff){const ok=Math.random()<Math.max(.1,(S.ratings-30)/60);
        chips=apply(ok?{patience:20,campus:3}:{patience:8,ratings:-5,morale:-5});
        text=ok?"You told the network you would take the show elsewhere. They backed down.":"The network did not back down. They moved two of your writers to another show.";}
      else {const r=resolve(a);text=r.text;chips=r.chips;}
      S.log.push(`Ep ${S.ep}: Crisis response: ${a.t}.`);
      outcome(K("NETWORK CRISIS"),"Result",text,chips,next);
    }}))});
}

/* ---------- Bit Board ---------- */
function openBoard(){
  const bits=Object.entries(S.bits).sort((a,b)=>(b[1].hits*10+b[1].legend*15+b[1].best)-(a[1].hits*10+a[1].legend*15+a[1].best));
  const cast=Object.values(S.cast).sort((a,b)=>b.fame-a.fame);
  const guests=Object.entries(S.guests).sort((a,b)=>b[1].good-a[1].good);
  $("#boardPanel").innerHTML=`<button class="close" id="closeBoard">Close</button><h2>BIT BOARD</h2>
   <p class="rules">A bit that hits twice, or goes legendary once, becomes <span class="badge b-rec">RECURRING</span> and can be brought back with a ratings bonus. A bit that fails its first time is a <span class="badge b-one">ONE-SHOT</span> and cannot air again. A recurring bit that fails twice in a row is <span class="badge b-ret">RETIRED</span>.</p>
   <h3>Bits</h3>${bits.length?`<table><tr><th>Bit</th><th class="n">Aired</th><th class="n">Hits</th><th class="n">Best</th></tr>${bits.map(([n,r])=>`<tr><td>${esc(n)}${badge(bitStatus(n))}${r.legend?` <span class="badge b-cult">x${r.legend} LEGENDARY</span>`:""}</td><td class="n">${r.plays}</td><td class="n">${r.hits}</td><td class="n">${r.best>0?"+":""}${r.best}</td></tr>`).join("")}</table>`:`<p class="empty">Nothing has aired yet.</p>`}
   <h3>Regulars</h3>${cast.length?`<table><tr><th>Character</th><th class="n">Fame</th><th class="n">Hits</th></tr>${cast.map(c=>`<tr><td>${esc(c.name)}${badge(castStatus(c))}<br><small>${esc(c.tag)}</small></td><td class="n">${c.fame}</td><td class="n">${c.hits}/${c.uses}</td></tr>`).join("")}</table>`:`<p class="empty">No regulars yet. They are discovered around the building.</p>`}
   <h3>Guests</h3>${guests.length?`<table><tr><th>Guest</th><th class="n">Visits</th><th class="n">Good segments</th></tr>${guests.map(([n,g])=>`<tr><td>${esc(n)}${g.regular?`<span class="badge b-rec">REGULAR</span>`:g.walk?`<span class="badge b-one">WALKED OFF</span>`:""}</td><td class="n">${g.apps}</td><td class="n">${g.good}</td></tr>`).join("")}</table>`:`<p class="empty">No guests yet.</p>`}
   <p class="rules">Guests who have two good segments in one visit become regulars you can book again.</p>`;
  $("#board").classList.add("open");
  $("#closeBoard").onclick=()=>$("#board").classList.remove("open");
}
$("#board").addEventListener("click",e=>{if(e.target.id==="board")$("#board").classList.remove("open");});

/* ---------- Title ---------- */
function title(){
  S=null; drawStats(); $("#showTitle").textContent="LATE NIGHT LIVE";
  const saved=load(); const hof=getHof();
  const fame=Object.entries(getFame()).sort((a,b)=>b[1]-a[1]).slice(0,5);
  render({kicker:"A TEXT RPG",title:"You have your own late night show.",
    body:`<p>It's 1982. UBC, a network owned by Consolidated Electric, has given you the 12:30 AM time slot, a small studio on the sixth floor of the UBC Tower, and eight episodes to prove the show works.</p>
      <p>Your staff:</p>
      ${Object.keys(CREW).map(k=>say(k,CREW[k].blurb)).join("")}
      <p><b>How it works.</b> Each episode you choose a bit, book a guest, deal with the network and the staff, then tape the show.</p>
      <p><b>Ratings</b> measure your overall audience. <b>Campus Buzz</b> measures how much high school and college students are into the show. <b>Network Patience</b> is how much the network will put up with. If patience runs out while ratings are good, the network makes demands. If patience runs out while ratings are low, the show is cancelled.</p>
      ${fame.length?`<div class="hof"><b>All-Time Hall of Fame</b> (across every season)<ol>${fame.map(([n,v])=>`<li>${esc(n)}, ${v} pts</li>`).join("")}</ol></div>`:""}
      ${hof.length?`<div class="hof"><b>Roof Drop Hall of Fame</b><ol>${hof.map(h=>`<li>${esc(h.item)}, ${h.score}/30 (${esc(h.host)})</li>`).join("")}</ol></div>`:""}
      <div class="lbl">Your host name</div><input type="text" id="hostName" maxlength="22" placeholder="e.g. Danny" autocomplete="off">`,
    choices:[
      {t:"Start the season",primary:true,fn:()=>{
        const n=($("#hostName").value||"").trim()||"Danny";
        wipe(); S=newState(n); S.log.push(`Season begins. Host: ${n}.`); drawStats(); paper();}},
      ...(saved&&saved.ep<=EPISODES?[{t:`Resume season with ${esc(saved.host)}`,d:`Continue from episode ${saved.ep}.`,fn:()=>{S=saved;drawStats();paper();}}]:[])
    ]});
}

/* ---------- Morning paper ---------- */
function paper(){
  S.score=0; S.headline=genHeadline(); S.hint=null;
  let campusNote="";
  if(S.ep>1){apply({campus:-4});}
  const m=CAMPUS_MILESTONES[S.mile];
  if(m&&S.campus>=m.at){S.mile++;campusNote=`<p><b>Campus Buzz:</b> ${m.t}</p>${m.fx?apply(m.fx):""}`;S.log.push(`Ep ${S.ep}: Campus milestone: ${m.t}`);}
  save(); drawStats();
  const ns=S.news.slice().sort((a,b)=>b.p-a.p);
  const top=S.ep===1?"UBC GIVES 12:30 SLOT TO NEW LATE NIGHT SHOW":(ns[0]?ns[0].t:`LATE NIGHT SHOW CONTINUES IN 12:30 SLOT`);
  const second=ns[1]?ns[1].t:null;
  S.news=[];
  const th=S.threads.find(t=>!t.done&&S.ep-t.ep>=2);
  const ev=th?callbackEvent(th):null;
  const body=`<div class="paper"><div class="mast">${PAPERS[(S.ep-1)%PAPERS.length]}</div><div class="pdate">${epDate(S.ep)}</div>
      <div class="head">${esc(top)}</div>${second?`<div class="sub2">ALSO: ${esc(second)}</div>`:""}<div class="sub2">CITY: ${esc(S.headline)}</div></div>
      ${campusNote}${ev?`<p><b>${esc(ev.title)}.</b> ${esc(ev.text)}</p>`:""}`;
  render({kicker:K("8:30 AM"),title:"Morning paper",body,
    choices:ev?ev.a.map(a=>({t:a.t,d:a.d,fn:()=>{th.done=true;const r=resolve(a);S.log.push(`Ep ${S.ep}: ${ev.title}. ${a.t}.`);outcome(K("9:00 AM"),ev.title,r.text,r.chips,pitch);}}))
              :[{t:"Go to the office",primary:true,fn:pitch}]});
}

/* ---------- Pitch meeting ---------- */
function pitch(){
  S.bit=null; S.guest=null; S.gSeg=0; S.chuckChar=pick(CHUCK_CHARS); drawStats();
  const wild=genBit(); wild.wild=true;
  const fresh=shuffle(BITS.filter(b=>!S.bits[b.name])).slice(0,2).concat([wild]);
  const back=allBits().filter(b=>{const st=bitStatus(b.name);return st&&(st.k==="rec"||st.k==="pro");})
    .sort((a,b)=>S.bits[b.name].hits-S.bits[a.name].hits).slice(0,3);
  let opts=fresh.map(b=>({b,ret:false})).concat(back.map(b=>({b,ret:true})));
  render({kicker:K("10:00 AM"),title:"Pitch meeting",
    body:`<p>The writers have pitches for tonight's bit. You can also bring back a bit that has worked before.</p>
      ${say("chuck",`I'll be around tonight as ${S.chuckChar}, if you need me.`)}`,
    choices:opts.map(({b,ret})=>{
      const r=S.bits[b.name];
      const d = ret
        ? `${badge(bitStatus(b.name))} Aired ${r.plays} time${r.plays===1?"":"s"}, ${r.hits} hit${r.hits===1?"":"s"}. ${bitStatus(b.name).k==="rec"?"Regular viewers know this one. Ratings bonus if it works.":"One more hit makes it recurring."}${r.plays>=3?" The audience may be getting tired of it.":""}`
        : `${b.wild?"New idea from the writers' room. ":""}${b.d} Weirdness +${b.w}.`;
      return {t:(ret?"Bring back: ":b.wild?"Wildcard: ":"")+b.name,d,crew:ret,fn:()=>{
        S.bit=b; if(b.gen) S.genBits[b.name]=b;
        const chips=apply({weird:ret?Math.ceil(b.w/3):b.w,...(b.mor?{morale:b.mor}:{})});
        outcome(K("10:15 AM"),"Bit chosen",`Tonight's bit is "${b.name}."`,chips,booking);
      }};
    })});
}

function finishBit(gain,hit,legend){
  const n=S.bit.name, r=bitRec(n), before=bitStatus(n);
  r.plays++; if(hit){r.hits++;r.streak=0;addFame(n,legend?3:1);}else{r.fails++;r.streak++;}
  if(legend) r.legend++;
  r.best=Math.max(r.best,gain);
  if(before&&before.k==="rec"&&r.streak>=2) r.retired=true;
  const after=bitStatus(n);
  let note="";
  if(!before||before.k!==after.k){
    const msg={rec:"NOW A RECURRING BIT",one:"ONE-SHOT: WILL NOT AIR AGAIN",pro:"PROMISING: ONE MORE HIT TO BECOME RECURRING",ret:"RETIRED"}[after.k];
    note=`<div class="chips"><span class="badge b-${after.k}" style="font-size:12px;padding:4px 8px">${msg}</span></div>`;
    S.log.push(`"${n}" is now ${after.t.toLowerCase()}.`);
  }
  return note;
}

/* ---------- Booking and pre-interview ---------- */
function booking(){
  const nGen=Math.random()<.5?1:2;
  const fresh=shuffle(GUESTS.filter(g=>!S.guests[g.name])).slice(0,3-nGen).concat(Array.from({length:nGen},genGuest));
  const regs=allGuests().filter(g=>S.guests[g.name]&&S.guests[g.name].regular);
  const opts=fresh.map(g=>({g,tag:""})).concat(regs.map(g=>({g,tag:"reg"})));
  if(S.ep>=2) opts.push({g:GRAVES,tag:"cult"});
  render({kicker:K("11:30 AM"),title:"Booking",
    body:`<p>These guests are available for tonight.</p>`,
    choices:opts.map(({g,tag})=>{
      const r=S.guests[g.name];
      const d = tag==="reg" ? `<span class="badge b-rec">REGULAR</span> Visit ${r.apps+1}. Better interview odds.`
              : tag==="cult" ? `<span class="badge b-cult">RECURRING GUEST</span> ${g.d}${r?` Visit ${r.apps+1}. Better odds each visit.`:""}`
              : g.d;
      return {t:g.name,d,crew:!!tag,fn:()=>{S.guest=g;if(g.gen)S.genGuests[g.name]=g;guestRec(g.name).apps++;S.gSeg=0;preInterview();}};
    })});
}

function bestStyle(g){ if(g.cult) return "rant"; const o=INTERVIEW[g.t]; return Object.keys(o).sort((a,b)=>o[b]-o[a])[0]; }
const HINT_NAME={straight:"play it straight",needle:"needle them",rails:"go off the rails",rant:"let him rant"};
function preInterview(){
  const g=S.guest;
  render({kicker:K("1:00 PM"),title:"Pre-interview",
    body:`<p>Someone needs to pre-interview ${esc(g.name)} to find out what will work on air.</p>`,
    choices:[
      {t:"Do it yourself",d:"You will know the best approach for the interview.",fn:()=>{S.hint=bestStyle(g);
        outcome(K("1:30 PM"),"Pre-interview notes",`Your notes say the best approach with ${esc(g.name)} is to ${HINT_NAME[S.hint]}.`,"",network);}},
      {t:"Have a segment producer do it",d:"Saves you time. The notes may not be accurate.",fn:()=>{S.hint=Math.random()<.7?bestStyle(g):pick(g.cult?["rant","straight"]:["straight","needle","rails"]);
        const c=apply({morale:1});
        outcome(K("1:30 PM"),"Pre-interview notes",`The segment producer's notes say to ${HINT_NAME[S.hint]} with ${esc(g.name)}.`,c,network);}},
      {t:"Skip it",d:"No notes. The interview will be less predictable.",fn:()=>{S.hint=null;const c=apply({weird:3});
        outcome(K("1:30 PM"),"No pre-interview",`You will go into the interview with ${esc(g.name)} without notes.`,c,network);}}
    ]});
}

/* ---------- Network note ---------- */
function network(){
  const n=pick(NOTES);
  const choices=n.a.map(a=>({t:a.t,d:a.d,fn:()=>{
      const chips=apply(a.fx); S.log.push(`Ep ${S.ep}: ${n.name}. ${a.t}.`);
      outcome(K("3:00 PM"),n.name,`You chose: ${a.t.toLowerCase()}.`,chips,backstage);}}));
  choices.push({t:"Have Arnie handle it",d:`Arnie deals with the network directly. Works better the more Arnie trusts you. (Arnie ${S.arnie})`,crew:true,fn:()=>{
    const ok=Math.random()<.4+S.arnie*.005;
    const chips=apply(ok?{patience:3,arnie:2}:{patience:-5,arnie:-3});
    S.log.push(`Ep ${S.ep}: ${n.name}. Arnie ${ok?"handled it":"could not handle it"}.`);
    outcome(K("3:00 PM"),n.name,ok?say("arnie","Done. They dropped it. Don't ask what it cost me.")+"<p>The network dropped the request.</p>":say("arnie","They wouldn't budge. And now they're annoyed with me too.")+"<p>The network is annoyed.</p>",chips,backstage);}});
  render({kicker:K("2:30 PM"),title:`Network note: ${n.name}`,body:`<p>A network executive comes to your office.</p><p class="q">${n.d}</p>`,choices});
}

/* ---------- Behind the scenes ---------- */
function backstage(){
  if(Math.random()>.65) return discover();
  let pool=BACKSTAGE.filter(b=>!S.seenBack.includes(b.name)); if(!pool.length){S.seenBack=[];pool=BACKSTAGE;}
  const b=pick(pool); S.seenBack.push(b.name);
  render({kicker:K("4:00 PM"),title:`Backstage: ${b.name}`,body:say(b.who,b.line),
    choices:b.a.map(a=>({t:a.t,d:a.d,fn:()=>{const r=resolve(a);S.log.push(`Ep ${S.ep}: ${b.name}. ${a.t}.`);outcome(K("4:15 PM"),b.name,r.text,r.chips,discover);}}))});
}

function discover(){
  const un=CAST.filter(c=>!S.cast[c.id]&&!S.passed.includes(c.id+S.ep));
  const force=S.ep>=2&&!Object.keys(S.cast).length;
  if(!un.length||!(force||Math.random()<.4)) return coldOpen();
  const c=un[0];
  render({kicker:K("4:45 PM"),title:`Possible regular: ${c.name}`,body:`<p>${c.disc}</p><p class="q">${c.d}</p>`,
    choices:[
      {t:`Put ${c.name.split(" ")[0]} on the show`,d:"Regulars can open the show. They get better and more popular with each appearance.",primary:true,fn:()=>{
        S.cast[c.id]={id:c.id,name:c.name,tag:c.tag,fame:20,uses:0,hits:0};
        S.log.push(`Ep ${S.ep}: Added ${c.name} as a regular.`);
        const chips=apply({weird:3,morale:2,campus:2});
        outcome(K("4:50 PM"),"New regular",`${c.name} agreed to appear on the show. ${c.name.split(" ")[0]} is now available in the cold open.`,chips,coldOpen);}},
      {t:"Not now",d:"You may have another chance later.",fn:()=>{S.passed.push(c.id+S.ep);coldOpen();}}
    ]});
}

/* ---------- Taping ---------- */
function coldOpen(){
  const cast=Object.values(S.cast);
  if(!cast.length) return monologue();
  const choices=[{t:"Open the show yourself",d:"Safe.",fn:()=>{const c=apply({ratings:1});outcome(K("TAPING"),"Cold open","You opened the show yourself.",c,monologue);}}];
  cast.forEach(cm=>{
    const def=CAST.find(x=>x.id===cm.id); const st=castStatus(cm);
    choices.push({t:def.open,d:`${badge(st)} Fame ${cm.fame}. ${cm.hits} of ${cm.uses} appearances went well.`,crew:true,fn:()=>{
      const ok=Math.random()<Math.min(.9,.45+cm.fame*.005);
      const before=st.k;
      cm.uses++; if(ok){cm.hits++;addFame(cm.name,1);}
      cm.fame=clamp(cm.fame+(ok?12:-3));
      const fx=ok?{ratings:4+Math.round(cm.fame/12),campus:3,...(cm.fame>=60?{morale:2}:{})}:{ratings:-2};
      let chips=apply(fx);
      const after=castStatus(cm);
      if(after.k!==before&&after.k==="cult"){thread({type:"cult",name:cm.name});news(7,`${cm.name.toUpperCase()} BECOMES LATE NIGHT FAVORITE`);}
      if(after.k!==before){chips+=`<div class="chips"><span class="badge b-${after.k}" style="font-size:12px;padding:4px 8px">${cm.name.toUpperCase()} IS NOW A ${after.t}</span></div>`;S.log.push(`${cm.name} is now a ${after.t.toLowerCase()}.`);}
      S.log.push(`Ep ${S.ep}: Cold open with ${cm.name}, ${ok?"went well":"did not work"}.`);
      outcome(K("TAPING"),"Cold open",pick(def[ok?"win":"lose"]),chips,monologue);
    }});
  });
  render({kicker:K("TAPING"),title:"Cold open",body:`<p>The show starts in thirty seconds. Choose who opens it.</p>`,choices});
}

function monologue(){
  const warm=S.stu>=65?.06:S.stu<35?-.06:0;
  const warmText=S.stu>=65?"Stu's warmup got the audience going. Monologue odds are better tonight.":S.stu<35?"Stu's warmup was flat tonight. The audience is cold.":"Stu warmed up the audience.";
  const mono=MONOLOGUE.map((o,i)=>Object.assign({},o,{chance:o.chance+warm},i===0?{d:`Today's headline: "${S.headline}."`}:{}));
  const opts=mono.map(o=>({t:o.t,d:o.d,fn:()=>{const r=resolve(o);outcome(K("TAPING"),"Monologue",r.text,r.chips,doBit);}}));
  opts.push({t:"Banter with Lenny",d:`Works better the more Lenny likes you. (Lenny ${S.lenny})`,crew:true,fn:()=>{
    const ok=Math.random()<.3+S.lenny*.005+warm;
    const chips=apply(ok?{ratings:6,lenny:5,morale:2,campus:2}:{ratings:-2,lenny:-3});
    outcome(K("TAPING"),"Monologue",ok
      ?say("lenny","You know, chief, I was going to tell that same joke, but I'm a professional.")+"<p>You and Lenny went back and forth for three minutes. The audience laughed throughout.</p>"
      :say("lenny","Sorry, what?")+"<p>Lenny did not hear the setup. The exchange did not work.</p>",chips,doBit);}});
  opts.push({t:"Take the camera into the control room",d:`Show viewers the people who make the show. Builds Campus Buzz. (Walt ${S.walt})`,crew:true,fn:()=>{
    const ok=Math.random()<.4+S.walt*.004;
    const chips=apply(ok?{ratings:2,campus:6,walt:3,morale:2}:{ratings:-2,campus:2,walt:-3,patience:-2});
    outcome(K("TAPING"),"Monologue",ok
      ?say("walt","Camera two, stay on the host. Yes, we're on TV. Wave.")+"<p>You introduced the control room crew. The audience applauded them.</p>"
      :say("walt","Not now. Please.")+"<p>Walt asked you to leave the control room on air.</p>",chips,doBit);}});
  render({kicker:K("TAPING"),title:"Monologue",body:`<p>${warmText}</p><p>The band plays you on. Choose the approach for tonight's monologue.</p>`,choices:opts});
}

function doBit(){
  const b=S.bit, r=S.bits[b.name], st=bitStatus(b.name);
  const isRec=st&&st.k==="rec";
  const fatigue=r?Math.max(0,r.plays-2)*.07:0;
  const ok=Math.random()<Math.max(.15,Math.min(.9,b.base+S.weird*.0025+(isRec?.08:0)-fatigue));
  if(b.pat) apply({patience:b.pat});
  if(ok){
    const big=Math.random()<S.weird/140;
    const fx=big?{ratings:14,morale:4,weird:4}:{ratings:9,morale:2};
    fx.campus=Math.round(b.w/4)+(isRec?3:0)+(big?4:0);
    if(isRec) fx.ratings+=BRING_BACK_BONUS;
    let chips=apply(fx); chips+=finishBit(fx.ratings,true,big);
    S.log.push(`Ep ${S.ep}: "${b.name}" ${big?"was legendary":"worked"}.`);
    if(big){news(8,`LATE NIGHT'S "${b.name.toUpperCase()}" THE TALK OF THE TOWN`); if(!S.threads.some(t=>t.type==="fans")) thread({type:"fans",bit:b.name});}
    else news(3,`LATE NIGHT'S "${b.name.toUpperCase()}" A HIT WITH VIEWERS`);
    outcome(K("TAPING"),big?`"${b.name}": legendary`:`"${b.name}": it worked`,(isRec?"Regular viewers recognized the bit. ":"")+b.win+(big?" This is one people will remember.":""),chips,afterBit);
  }else{
    render({kicker:K("TAPING"),title:`"${b.name}" is not working`,
      body:`<p>${isRec&&fatigue>0?"The audience has seen this bit several times. ":""}${b.lose}</p><p>Stu is signaling you to wrap it up.</p>`,
      choices:[
        {t:"Have Lenny play you out",d:"Ends the bit quickly. Small ratings loss.",crew:true,fn:()=>{
          let chips=apply({ratings:-1,morale:1,lenny:3}); chips+=finishBit(-1,false,false);
          S.log.push(`Ep ${S.ep}: "${b.name}" failed. Lenny played you out.`); news(2,`CRITICS UNIMPRESSED BY "${b.name.toUpperCase()}"`);
          outcome(K("TAPING"),"Played out","The band played you out of the segment.",chips,afterBit);}},
        {t:"Keep going",d:"Make the failure part of the joke. Counts as a hit if it works.",fn:()=>{
          const sv=Math.random()<.4+S.weird*.003;
          const fx=sv?{ratings:11,weird:6,morale:3,campus:5}:{ratings:-7,weird:4,patience:-4};
          let chips=apply(fx); chips+=finishBit(fx.ratings,sv,false);
          S.log.push(`Ep ${S.ep}: "${b.name}" failed. You kept going, ${sv?"and it turned around":"and it got worse"}.`);
          outcome(K("TAPING"),sv?"It turned around":"It got worse",sv?"You kept going and made the failure part of the joke. The audience laughed and applauded.":"You kept going. The audience did not respond, and several people left.",chips,afterBit);}}
      ]});
  }
}

function afterBit(){
  const g=GAGS[S.gag.i];
  if(Math.random()>.55) return remote();
  const st=Math.min(S.gag.stage,g.lines.length-1);
  render({kicker:K("TAPING"),title:`Running gag: ${g.name}`,body:`<p>${g.lines[st]}</p>${S.gag.stage?`<p class="q">Regular viewers will recognize this.</p>`:""}`,
    choices:[
      {t:"Play into it",d:`Running gags get bigger each time they work. Builds Campus Buzz. (Level ${S.gag.stage+1})`,crew:true,fn:()=>{
        const ok=Math.random()<Math.min(.85,.5+S.gag.stage*.08);
        let chips;
        if(ok){S.gag.stage++;chips=apply({ratings:3+S.gag.stage*2,weird:2,campus:2+S.gag.stage*2});addFame(g.name,1);if(S.gag.stage>=3)news(4+S.gag.stage,`${g.name.toUpperCase()} NOW A LATE NIGHT FIXTURE`);}
        else chips=apply({ratings:-2});
        S.log.push(`Ep ${S.ep}: ${g.name}, ${ok?"played into it (level "+S.gag.stage+")":"did not work"}.`);
        outcome(K("TAPING"),g.name,ok?"You played into it. The audience recognized it and laughed.":"You played into it, but the moment had passed.",chips,remote);}},
      {t:"Ignore it",d:"Move on with the show.",fn:()=>{const c=apply({ratings:-1});outcome(K("TAPING"),g.name,"You moved on with the show.",c,remote);}}
    ]});
}

/* ---------- Remote segment ---------- */
function remote(){
  const open=FLOORS.filter(f=>!claimed(f.id)&&(!f.boss||S.claimed.length>=3));
  render({kicker:K("TAPING"),title:"Remote segment",
    body:`<p>Walt has a handheld camera crew ready. Choose tonight's remote segment.</p>`,
    choices:[
      ...(open.length?[{t:"Invade another studio",d:`Interrupt a show on another floor and claim it. You control ${S.claimed.length} of ${FLOORS.length} floors.`,fn:()=>invadePick(open)}]:[]),
      {t:"Go to the roof",d:"Drop something off the building. Walt, Lenny and Chuck judge it.",fn:roofPick},
      {t:"Stu's field piece",d:`Stu goes out with a camera crew. Works better the more Stu likes you. (Stu ${S.stu})`,crew:true,fn:stuField},
      {t:"Stay at the desk",d:"A quiet segment. Gives the crew a break.",fn:()=>{const c=apply({morale:3,walt:2,stu:2});outcome(K("TAPING"),"At the desk","You did a short segment at the desk.",c,maybeDisaster);}}
    ]});
}

function stuField(){
  const p=pick(STU_FIELD);
  const ok=Math.random()<.35+S.stu*.006;
  const chips=apply(ok?{ratings:6,campus:5,stu:4}:{ratings:-2,stu:-2});
  S.log.push(`Ep ${S.ep}: Field piece: ${p.t}. ${ok?"Worked.":"Did not work."}`);
  if(ok) news(4,`LATE NIGHT STAGE MANAGER ${p.t.replace(/^Stu /,"").toUpperCase()}`);
  outcome(K("REMOTE"),p.t,ok?p.win:p.lose,chips,maybeDisaster);
}

function invadePick(open){
  render({kicker:K("REMOTE"),title:"Choose a floor",
    body:`<p>You have a few minutes before building security responds.</p>`,
    choices:open.map(f=>({t:`Floor ${f.f}: ${f.name}`,d:f.d+(f.perk?" Claiming this floor lets you cut the lights on other shows.":"")+(f.boss?" The final floor.":""),fn:()=>invadeHow(f)}))});
}

function invadeHow(f){
  const opts=[
    {t:"Bullhorn from the doorway",d:"Standard approach.",base:.5,win:{ratings:8,patience:-5,campus:4},lose:{ratings:3,patience:-5}},
    {t:"Hand out hot dogs to their audience",d:"Win over their audience first.",base:.55,win:{ratings:6,morale:2,patience:-3,campus:3},lose:{ratings:1,patience:-3}},
    {t:`Send Chuck in first as ${S.chuckChar}`,d:`A distraction. (Chuck ${S.chuck})`,base:.25+S.chuck*.004,crew:true,win:{ratings:10,weird:5,chuck:5,patience:-6,campus:5},lose:{ratings:-2,chuck:-3,patience:-6}}
  ];
  if(claimed("power")) opts.push({t:"Cut their lights",d:"Sully is standing by in the Power Room.",base:.85,win:{ratings:12,weird:4,patience:-10,campus:5},lose:{ratings:4,patience:-10},crew:true});
  render({kicker:K("REMOTE"),title:`Floor ${f.f}: ${f.name}`,body:`<p>${f.d}</p><p>Choose how to go in.</p>`,
    choices:opts.map(o=>({t:o.t,d:o.d,crew:o.crew,fn:()=>{
      const ok=Math.random()<Math.min(.92,o.base+(.5-f.def)*.5+S.walt*.002);
      let fx=Object.assign({},ok?o.win:o.lose);
      if(ok){ fx.control=f.boss?30:12; fx.walt=(fx.walt||0)+2; S.claimed.push(f.id); }
      if(f.boss){ fx.patience=(fx.patience||0)+(ok?-14:-6); if(ok) fx.ratings=(fx.ratings||0)+8; }
      let chips=apply(fx);
      if(ok) chips+=`<div class="chips"><span class="chip claim">FLOOR ${f.f} CLAIMED</span>${f.perk?`<span class="chip claim">UNLOCKED: Cut their lights</span>`:""}</div>`;
      S.log.push(`Ep ${S.ep}: Invaded ${f.name}. ${ok?"Claimed it.":"Removed by security."}`);
      if(ok){news(f.boss?12:6,f.boss?"LATE NIGHT HOST TAKES OVER EXECUTIVE SUITE":`LATE NIGHT HOST TAKES OVER FLOOR ${f.f} OF UBC TOWER`);
        if(["news","soap","game","sports","kids"].includes(f.id)&&Math.random()<.6) thread({type:"revenge",floor:f.name});}
      else news(3,`SECURITY STOPS LATE NIGHT RAID ON FLOOR ${f.f}`);
      outcome(K("REMOTE"),ok?"Floor claimed":"Stopped",f[ok?"win":"lose"],chips,maybeDisaster);
    }}))});
}

function roofPick(){
  const items=shuffle(DROPS).slice(0,4);
  const dots=n=>"●".repeat(Math.round(n/2))+"○".repeat(5-Math.round(n/2));
  render({kicker:K("THE ROOF"),title:"Roof drop",
    body:`<p>The crew has cleared the loading dock below. Walt, Lenny and Chuck will each score the drop out of 10 for splat and destruction.</p>
      ${S.best?`<p class="q">Best this season: ${esc(S.best.item)}, ${S.best.score}/30.</p>`:""}`,
    choices:items.map(it=>({t:it.n,d:`${it.d}<br>Splat ${dots(it.s)} · Destruction ${dots(it.b)}`,fn:()=>roofDrop(it)}))});
}

function roofDrop(it){
  const base=(it.s+it.b)/2+(it.bonus||0)+S.weird/25;
  const judge=lean=>Math.max(0,Math.min(10,Math.round(base+lean+rnd(-2,2))));
  let scores,text;
  if(it.n==="Mattress"&&Math.random()<.5){scores=[10,10,10];text="The mattress bounced and landed on a bus stop bench. All three judges gave it a 10.";}
  else if(it.n==="Mattress"){scores=[1,2,9];text="The mattress landed softly. Chuck gave it a 9.";}
  else{
    scores=[judge(it.b>it.s?1:-1),judge(it.s>it.b?1:-1),judge(1)];
    const t=scores.reduce((a,b)=>a+b,0);
    const n=it.n.toLowerCase();
    text=t>=25?`The ${n} hit the loading dock hard. The audience cheered.`:t>=16?`The ${n} broke apart on impact. The audience applauded.`:`The ${n} landed without much effect.`;
  }
  const total=scores.reduce((a,b)=>a+b,0);
  const fx={ratings:Math.round(total/3)-1,weird:3,campus:2};
  if(it.lenny) fx.lenny=it.lenny;
  let chips=apply(fx), hz="";
  news(total>=24?7:4,`LATE NIGHT HOST DROPS ${it.n.toUpperCase()} OFF UBC TOWER`);
  if(Math.random()<.12+(it.hz||0)){const hi=Math.floor(Math.random()*HAZARDS.length),h=HAZARDS[hi];hz=`<p><b>Accident.</b> ${h.t}</p>`;chips+=apply(h.fx);
    if(hi===0&&!S.threads.some(t=>t.type==="lincoln")){thread({type:"lincoln"});news(10,"EXECUTIVE'S CAR DAMAGED BY OBJECT DROPPED FROM UBC TOWER");}}
  let rec="";
  if(!S.best||total>S.best.score){S.best={item:it.n,score:total};rec=`<div class="chips"><span class="chip claim">SEASON BEST</span></div>`;}
  addHof({item:it.n,score:total,host:S.host});
  S.log.push(`Ep ${S.ep}: Dropped ${it.n.toLowerCase()} off the roof. ${total}/30.`);
  outcome(K("THE ROOF"),`Drop: ${it.n}`,`<p>${text}</p>
    <div class="judges"><div class="judge"><small>Walt</small><span>${scores[0]}</span></div><div class="judge"><small>Lenny</small><span>${scores[1]}</span></div><div class="judge"><small>Chuck</small><span>${scores[2]}</span></div></div>
    <p><b>Total: ${total}/30</b></p>${hz}${rec}`,chips,maybeDisaster);
}

function maybeDisaster(){
  if(Math.random()>=.45) return interview(1);
  const d=pick(DISASTERS.filter(x=>!x.needsClaim||S.claimed.length>0));
  const choices=d.a.map(a=>({t:a.t,d:a.d,fn:()=>{const r=resolve(a);S.log.push(`Ep ${S.ep}: ${d.name}. ${a.t}.`);outcome(K("TAPING"),d.name,r.text,r.chips,()=>interview(1));}}));
  choices.push({t:"Let Walt handle it from the control room",d:`Works better the more Walt trusts you. (Walt ${S.walt})`,crew:true,fn:()=>{
    const ok=Math.random()<.3+S.walt*.006;
    const chips=apply(ok?{ratings:5,walt:4}:{ratings:-3,walt:-3});
    S.log.push(`Ep ${S.ep}: ${d.name}. Walt ${ok?"handled it":"could not handle it"}.`);
    outcome(K("TAPING"),d.name,ok
      ?say("walt","Camera two, stay on the drummer. Hold it. Hold it.")+"<p>Walt stayed on a close-up of the drummer until the problem was fixed. Viewers at home did not notice.</p>"
      :say("walt","Go to black.")+"<p>The broadcast went black for nine seconds.</p>",chips,()=>interview(1));}});
  render({kicker:K("TAPING"),title:`Problem: ${d.name}`,body:`<p>${d.d}</p>`,choices});
}

/* ---------- Interview ---------- */
function interview(round){
  const g=S.guest;
  const intro=round===1?`<p>${esc(g.name)} is your guest. ${esc(g.d)}</p>`:`<p>Second segment with ${esc(g.name)}.</p>`;
  const note=s=>S.hint===s?" Your pre-interview notes recommend this.":"";
  const choices=[
    {t:"Play it straight",d:"Ask good questions and let the guest talk."+note("straight"),fn:()=>ivResolve("straight",round)},
    {t:"Needle them",d:"Tease the guest and see how they react."+note("needle"),fn:()=>ivResolve("needle",round)},
    {t:"Go off the rails",d:"Put the cue cards away and improvise."+note("rails"),fn:()=>ivResolve("rails",round)}
  ];
  if(g.cult) choices.unshift({t:"Let him rant",d:"Give Dr. Graves the floor."+note("rant"),crew:true,fn:()=>gravesRant(round)});
  if(round===2) choices.push({t:`Send in Chuck as ${S.chuckChar}`,d:`Chuck interrupts the interview in character. (Chuck ${S.chuck})`,crew:true,fn:chuckCrash});
  render({kicker:K("TAPING"),title:`Interview, segment ${round}`,body:intro+(S.hint?`<p class="q">Pre-interview notes: ${HINT_NAME[S.hint]}.</p>`:""),choices});
}

const GRAVES_WIN=["Dr. Graves spoke for four minutes about the void, then thanked you for having him. The audience gave him a standing ovation.",
  "Dr. Graves told viewers at home to go to bed and think about their lives. The audience applauded.",
  "Dr. Graves gave a speech about the meaninglessness of sandwiches. Lenny's band played one organ chord at the end. The audience cheered."];
const GRAVES_LOSE=["Dr. Graves lost his place during the speech and did not recover.","The speech was too dark for the audience. The sponsor called during the break."];
function gravesRant(round){
  const r=guestRec(GRAVES.name);
  const ok=Math.random()<Math.min(.9,.42+r.apps*.06+S.weird*.002+(S.hint==="rant"?.1:0));
  if(ok){S.gSeg++;r.good++;addFame(GRAVES.name,1);news(5,"PHILOSOPHER'S SPEECH ON LATE NIGHT DRAWS VIEWER MAIL");}
  const chips=apply(ok?{ratings:12+Math.min(6,r.apps),weird:4,campus:5}:{ratings:-3,weird:3,patience:-3});
  S.log.push(`Ep ${S.ep}: Dr. Graves, segment ${round}: ${ok?"worked":"did not work"}.`);
  outcome(K("TAPING"),"Dr. Graves",pick(ok?GRAVES_WIN:GRAVES_LOSE),chips,round===1?()=>interview(2):wrap);
}

function chuckCrash(){
  const g=S.guest;
  const ok=Math.random()<.25+S.chuck*.004+S.weird*.002;
  if(ok){S.gSeg++;guestRec(g.name).good++;}
  const chips=apply(ok?{ratings:11,weird:5,chuck:6,campus:4}:{ratings:-5,chuck:-4,morale:-1});
  S.log.push(`Ep ${S.ep}: Chuck interrupted the interview as ${S.chuckChar}. ${ok?"Worked.":"Did not work."}`);
  outcome(K("TAPING"),"Chuck",ok
    ?say("chuck",`(as ${S.chuckChar}) Sorry to interrupt. I have a question for ${esc(g.name)}.`)+`<p>${esc(g.name)} played along. The audience cheered.</p>`
    :say("chuck",`(as ${S.chuckChar}) Hello.`)+`<p>${esc(g.name)} did not know how to respond. Chuck left the stage.</p>`,chips,wrap);
}

function ivResolve(style,round){
  const g=S.guest, gr=guestRec(g.name);
  let chance=INTERVIEW[g.t][style]+(gr.regular&&!g.cult?.1:0)+(S.hint===style?.15:0); if(style==="rails") chance+=S.weird*.002;
  const ok=Math.random()<chance;
  let fx=ok?{ratings:style==="straight"?6:8}:{ratings:-4};
  if(style==="rails"){fx.weird=4;if(ok)fx.campus=3;}
  let text=pick(IV_LINES[style][ok?"win":"lose"]).replace(/\{g\}/g,esc(g.name));
  let walked=false;
  if(!ok&&g.t==="volatile"&&style==="needle"){walked=true;fx={ratings:6,patience:-8,weird:5,campus:4};text=`${esc(g.name)} took off the microphone and walked off the set.`;}
  if(ok&&g.t==="volatile"&&style==="needle") fx.ratings=12;
  if(ok){S.gSeg++;gr.good++;}
  if(walked){gr.walk++;news(9,`${g.name.toUpperCase()} WALKS OFF LATE NIGHT SET`);thread({type:"walkoff",name:g.name});}
  const chips=apply(fx);
  S.log.push(`Ep ${S.ep}: ${g.name}, segment ${round}, ${STYLE_NAMES[style].toLowerCase()}: ${walked?"walked off":ok?"worked":"did not work"}.`);
  outcome(K("TAPING"),walked?"Walk-off":"Interview",text,chips,(round===1&&!walked)?()=>interview(2):wrap);
}

/* ---------- After the show ---------- */
function arnieNote(tier){
  if(S.patience<25) return "The network is close to its limit. Give them a quiet episode or I can't protect you.";
  if(S.gSeg===0) return "The interview didn't work. Do the pre-interview yourself next time.";
  if(S.campus>=60&&S.ratings<55) return "The kids love us. The network doesn't care about kids yet. We need the broad audience too.";
  if(tier==="great") return "That's the show we want every night. Don't change anything.";
  if(S.weird>=70) return "It's getting very strange out there. Some of that is good. Some of it scares the sponsors.";
  if(tier==="bad") return "We've had worse nights. Not many.";
  return "Solid. Let's tighten the second half.";
}

function wrap(){
  const s=S.score, share=(3.2+s/8).toFixed(1);
  const tier=s>=20?"great":s>=6?"ok":"bad";
  const fx=tier==="great"?{patience:6,morale:4}:tier==="ok"?{patience:1}:{patience:-9,morale:-3};
  if(S.control>=50) fx.patience=(fx.patience||0)-3;
  fx.ratings=-7;
  const chips=apply(fx);
  let promo="";
  const gr=S.guest?guestRec(S.guest.name):null;
  if(gr&&S.gSeg>=2&&!gr.regular&&!S.guest.cult){gr.regular=true;promo=`<div class="chips"><span class="badge b-rec" style="font-size:12px;padding:4px 8px">${esc(S.guest.name).toUpperCase()} IS NOW A REGULAR GUEST</span></div>`;S.log.push(`${S.guest.name} became a regular guest.`);}
  if(S.guest&&S.guest.cult&&S.gSeg>=1) gr.regular=true;
  const q=pick(CREW_QUIPS[tier].filter(x=>x[0]!=="arnie"));
  S.log.push(`Ep ${S.ep}: ${share} share.`);
  const isLast=S.ep>=EPISODES;
  const critics={great:["\"The most dangerous hour on television.\" The Village Voice","\"Strange, and very funny.\" Daily News"],ok:["\"Occasionally brilliant, frequently baffling.\" TV Guide","\"A show for people who can't sleep.\" The Post"],bad:["\"Hard to watch.\" The Times","\"I have seen better television in a laundromat.\" Variety"]};
  render({kicker:K("AFTER THE SHOW"),title:"Notes meeting",
    body:`<div class="big">${share} share</div><p class="q">${pick(critics[tier])}</p>
      ${say("arnie",arnieNote(tier))}${say(q[0],q[1])}
      <p>Ratings drop slightly each week unless the show keeps improving.</p>${chips}${promo}`,
    choices:[{t:isLast?"Hear the network's decision":"Next episode",primary:true,fn:()=>{
      const go=()=>crewCheck(()=>{S.ep++;if(isLast)finale();else paper();});
      if(checkFail(go))return; go();}}]});
}

const CREW_LOW={arnie:"Arnie has stopped returning your calls. He has been having lunch with network executives.",
  walt:"Walt is packing up his headset after the show. He says the news division has offered him a job.",
  lenny:"Lenny skipped the after-show meeting. He has been seen having lunch with a rival bandleader.",
  chuck:"Chuck has stopped pitching ideas. He sits in the writers' room and does not talk.",
  stu:"Stu has asked to be transferred to the soap opera on the fifth floor."};
const CREW_HIGH={arnie:"Arnie got the network to approve a bigger budget for the rest of the season.",
  walt:"Walt stayed until 3 AM recutting tonight's opening. He did not mention it to anyone.",
  lenny:"Lenny wrote a new theme for the roof drops.",
  chuck:"Chuck pitched eleven new characters. Three of them are very good.",
  stu:"Stu has started bringing his own camera to film the audience before the show. Viewers love the footage."};
function crewCheck(next){
  const low=Object.keys(CREW).find(k=>S[k]<=25&&!S.warned[k]);
  const high=Object.keys(CREW).find(k=>S[k]>=85&&!S.warned[k+"hi"]);
  if(low){
    S.warned[low]=true;
    return render({kicker:K("AFTER THE SHOW"),title:`${CREW[low].n} is unhappy`,body:`<p>${CREW_LOW[low]}</p>`,choices:[
      {t:`Take ${CREW[low].n} to dinner`,d:"Repairs the relationship.",fn:()=>{const c=apply({[low]:20,morale:2});outcome(K("AFTER THE SHOW"),"Dinner",`You and ${CREW[low].n} talked it out over dinner.`,c,next);}},
      {t:"Leave it alone",d:"The staff will notice.",fn:()=>{const c=apply({[low]:-5,morale:-4});outcome(K("AFTER THE SHOW"),"No action","You left it alone. The rest of the staff noticed.",c,next);}}]});
  }
  if(high){
    S.warned[high+"hi"]=true;
    const c=apply(high==="arnie"?{patience:8,morale:3}:{ratings:4,morale:3,campus:2});
    return outcome(K("AFTER THE SHOW"),`${CREW[high].n} is all in`,`<p>${CREW_HIGH[high]}</p>`,c,next);
  }
  next();
}

/* ---------- Endings ---------- */
function finale(){
  const r=S.ratings, c=S.campus;
  if(claimed("exec")&&r>=50) return ending("YOU RUN THE TOWER","You control the executive suite and your ratings are strong. Consolidated Electric gives you control of the network's late night programming.");
  if(r>=75) return ending("RENEWED FOR FIVE YEARS","Your ratings are strong. The network renews the show for five years.");
  if(c>=60) return ending("CULT FAVORITE","Your ratings are modest, but the show has become a favorite of high school and college students. The network renews it for another season to keep the young audience.");
  if(r>=50) return ending("RENEWED FOR ONE SEASON","Your ratings are good enough. The network renews the show for one more season.");
  if(claimed("exec")) return ending("ESCORTED OUT","You took over the executive suite, but your ratings were not high enough. Security escorts you out of the building.");
  if(r>=35||c>=40) return ending("MOVED TO 2:00 AM","Your ratings are not strong enough for 12:30. The network moves the show to 2:00 AM.");
  ending("CANCELLED","Your ratings are too low. The network cancels the show.");
}

function ending(head,text){
  wipe();
  const cn=S.claimed.length?`You claimed ${S.claimed.length} of ${FLOORS.length} floors of the UBC Tower.`:"You did not claim any floors of the UBC Tower.";
  const rec=Object.keys(S.bits).filter(n=>{const t=bitStatus(n);return t&&t.k==="rec";});
  const cult=Object.values(S.cast).filter(c=>c.fame>=35);
  const regs=Object.keys(S.guests).filter(n=>S.guests[n].regular);
  const crewBest=Object.keys(CREW).sort((a,b)=>S[b]-S[a])[0];
  render({kicker:"SEASON FINALE",title:head,
    body:`<p>${text}</p><p>${cn}</p>
      ${S.best?`<p>Best roof drop: ${esc(S.best.item)}, ${S.best.score}/30.</p>`:""}
      <p>Recurring bits: ${rec.length?rec.map(esc).join(", "):"none"}.<br>Regulars: ${cult.length?cult.map(c=>esc(c.name)).join(", "):"none"}.<br>Regular guests: ${regs.length?regs.map(esc).join(", "):"none"}.</p>
      <p><button class="boardbtn" id="endBoard">See the full Bit Board</button></p>
      ${say(crewBest,S[crewBest]>=70?"Whatever you do next, I'm in.":"It was a job.")}
      <p class="q">Ratings ${S.ratings} · Campus Buzz ${S.campus} · Patience ${S.patience} · Morale ${S.morale} · Weirdness ${S.weird} · Tower Control ${S.control}</p>`,
    choices:[{t:"Start a new season",primary:true,fn:title}]});
  $("#endBoard").onclick=openBoard;
  S.log.push(`Season over: ${head}.`); drawStats();
}

$("#restartBtn").onclick=()=>{wipe();title();};
title();
