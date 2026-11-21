/* Late Night Live: The RPG. (c) 2026 Necklar. All rights reserved. */
/* Game logic */
let S=null;
const $=s=>document.querySelector(s);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const clamp=v=>Math.max(0,Math.min(100,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));

function save(){try{localStorage.setItem("lnl-save4",JSON.stringify(S));}catch(e){}}
function load(){try{return JSON.parse(localStorage.getItem("lnl-save4"));}catch(e){return null;}}
function wipe(){try{localStorage.removeItem("lnl-save4");}catch(e){}}
function getFame(){try{return JSON.parse(localStorage.getItem("lnl-fame"))||{};}catch(e){return {};}}
function addFame(name,pts){try{const f=getFame();f[name]=(f[name]||0)+pts;localStorage.setItem("lnl-fame",JSON.stringify(f));}catch(e){}}

/* ---------- Tracking: bits, cast, guests ---------- */
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
function getHof(){try{return JSON.parse(localStorage.getItem("lnl-hof"))||[];}catch(e){return [];}}
function addHof(entry){try{const h=getHof();h.push(entry);h.sort((a,b)=>b.score-a.score);localStorage.setItem("lnl-hof",JSON.stringify(h.slice(0,5)));}catch(e){}}

function newState(host){
  return {host,ep:1,ratings:45,patience:60,morale:60,weird:15,control:0,
    walt:55,lenny:55,chuck:55,claimed:[],score:0,log:[],bit:null,guest:null,best:null,chuckChar:null,
    bits:{},guests:{},cast:{},gSeg:0,
    threads:[],news:[],genBits:{},genGuests:{},gag:{i:Math.floor(Math.random()*GAGS.length),stage:0},warned:{}};
}
const claimed=id=>S.claimed.includes(id);
const news=(p,t)=>{(S.news=S.news||[]).push({p,t});};
const thread=(o)=>{(S.threads=S.threads||[]).push(Object.assign({ep:S.ep,done:false},o));};
const allBits=()=>BITS.concat(Object.values(S.genBits||{}));
const allGuests=()=>GUESTS.concat(Object.values(S.genGuests||{}));
function epDate(ep){const d=new Date(1982,1,1);let n=ep-1;while(n>0){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)n--;}
  return d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});}

function drawStats(){
  const el=$("#stats");
  if(!S){el.style.display="none";return;}
  el.style.display="grid";
  el.innerHTML = STATS.map(s=>`<div class="stat ${s.wide?"wide":""}"><label>${s.n}<b>${S[s.k]}</b></label><div class="bar"><i style="width:${S[s.k]}%;background:${s.c}"></i></div></div>`).join("")
   + `<div class="row"><span class="floors" aria-label="Floors claimed">${FLOORS.map(f=>`<span class="fl ${claimed(f.id)?"on":""}" title="${esc(f.name)}">${f.f}</span>`).join("")}</span></div>`
   + `<div class="row crew"><span>Walt <b>${S.walt}</b></span><span>Lenny <b>${S.lenny}</b></span><span>Chuck <b>${S.chuck}</b></span></div>`
   + `<div class="row"><span>Episode <b>${Math.min(S.ep,EPISODES)}</b> of ${EPISODES}</span><span>Tonight's buzz <b>${S.score>0?"+":""}${S.score}</b></span></div>`
   + `<div class="row" style="justify-content:center;border:0;padding-top:0"><button class="boardbtn" id="openBoard">Bit Board</button></div>`;
  $("#openBoard").onclick=openBoard;
  $("#showTitle").textContent="LATE NIGHT WITH "+S.host.toUpperCase();
  $("#log").innerHTML=S.log.map(l=>`<li>${esc(l)}</li>`).join("");
}

function apply(fx){
  const chips=[];
  for(const k in fx){
    if(!(k in NAMES)) continue;
    const before=S[k]; S[k]=clamp(S[k]+fx[k]); const d=S[k]-before;
    if(k==="ratings") S.score+=fx[k];
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
  render({kicker,title,body:`${text.startsWith("<")?text:`<p>${text}</p>`}${chips}`,choices:[{t:"Continue",primary:true,fn:()=>{if(checkFail())return;next();}}]});
}
function resolve(opt){
  if(opt.fx) return {text:opt.r||"You handle it and keep moving. The show goes on.",chips:apply(opt.fx)};
  const ok=Math.random()<opt.chance;
  return {text:ok?opt.wt:opt.lt,chips:apply(ok?opt.win:opt.lose),ok};
}
function checkFail(){
  if(S.patience<=0){ending("CANCELLED","Consolidated Electric pulls the plug mid-season. Your desk is in a dumpster on 49th Street by morning.");return true;}
  if(S.morale<=0){ending("MUTINY","The writers walk out together and start a rival show in a Chinese restaurant. It's better than yours.");return true;}
  return false;
}
const K=t=>`EPISODE ${S.ep} · ${t}`;

/* ---------- Bit Board ---------- */
function openBoard(){
  const bits=Object.entries(S.bits).sort((a,b)=>(b[1].hits*10+b[1].legend*15+b[1].best)-(a[1].hits*10+a[1].legend*15+a[1].best));
  const cast=Object.values(S.cast).sort((a,b)=>b.fame-a.fame);
  const guests=Object.entries(S.guests).sort((a,b)=>b[1].good-a[1].good);
  $("#boardPanel").innerHTML=`<button class="close" id="closeBoard">Close</button><h2>BIT BOARD</h2>
   <p class="rules">A bit that hits twice, or goes legendary once, becomes <span class="badge b-rec">RECURRING</span> and can be brought back, with a bonus when the audience recognizes it. A bit that bombs its debut is a <span class="badge b-one">ONE-SHOT</span> and never airs again. Recurring bits wear out: bomb twice in a row and they're <span class="badge b-ret">RETIRED</span>.</p>
   <h3>Bits</h3>${bits.length?`<table><tr><th>Bit</th><th class="n">Aired</th><th class="n">Hits</th><th class="n">Best</th></tr>${bits.map(([n,r])=>`<tr><td>${esc(n)}${badge(bitStatus(n))}${r.legend?` <span class="badge b-cult">x${r.legend} LEGENDARY</span>`:""}</td><td class="n">${r.plays}</td><td class="n">${r.hits}</td><td class="n">${r.best>0?"+":""}${r.best}</td></tr>`).join("")}</table>`:`<p class="empty">Nothing has aired yet.</p>`}
   <h3>Recurring characters</h3>${cast.length?`<table><tr><th>Character</th><th class="n">Fame</th><th class="n">Hits</th></tr>${cast.map(c=>`<tr><td>${esc(c.name)}${badge(castStatus(c))}<br><small>${esc(c.tag)}</small></td><td class="n">${c.fame}</td><td class="n">${c.hits}/${c.uses}</td></tr>`).join("")}</table>`:`<p class="empty">No one discovered yet. Keep your eyes open around the building.</p>`}
   <h3>Guests</h3>${guests.length?`<table><tr><th>Guest</th><th class="n">Visits</th><th class="n">Great segments</th></tr>${guests.map(([n,g])=>`<tr><td>${esc(n)}${g.regular?`<span class="badge b-rec">REGULAR</span>`:g.walk?`<span class="badge b-one">WALKED OFF</span>`:""}</td><td class="n">${g.apps}</td><td class="n">${g.good}</td></tr>`).join("")}</table>`:`<p class="empty">No guests yet.</p>`}
   <p class="rules">Guests who nail both interview segments become regulars you can book again.</p>`;
  $("#board").classList.add("open");
  $("#closeBoard").onclick=()=>$("#board").classList.remove("open");
}
$("#board").addEventListener("click",e=>{if(e.target.id==="board")$("#board").classList.remove("open");});

/* ---------- Scenes ---------- */
function title(){
  S=null; drawStats(); $("#showTitle").textContent="LATE NIGHT LIVE";
  const saved=load(); const hof=getHof();
  render({kicker:"A TEXT RPG",title:"You just got your own show.",
    body:`<p>It's 1982. UBC, a network owned by the appliance giant Consolidated Electric, has handed you the 12:30 slot, a tiny studio on the 6th floor, and eight episodes to prove you're not a mistake.</p>
      <p>Your crew:</p>
      ${say("walt",CREW.walt.blurb)}${say("lenny",CREW.lenny.blurb)}${say("chuck",CREW.chuck.blurb)}
      <p>Every season is different: guests and bits are generated fresh, the morning paper reacts to what you did, and old stories come back to haunt you. Pitch bits and turn the hits into recurring segments. Discover oddball regulars. Book guests. Invade other shows and take over the Tower floor by floor. Throw things off the roof. Try not to get cancelled.</p>
      ${(()=>{const f=Object.entries(getFame()).sort((a,b)=>b[1]-a[1]).slice(0,5);return f.length?`<div class="hof"><b>All-Time Hall of Fame</b> (bits, regulars and guests, across every season)<ol>${f.map(([n,v])=>`<li>${esc(n)}, ${v} pts</li>`).join("")}</ol></div>`:"";})()}
      ${hof.length?`<div class="hof"><b>Roof Drop Hall of Fame</b><ol>${hof.map(h=>`<li>${esc(h.item)}, ${h.score}/30 (${esc(h.host)})</li>`).join("")}</ol></div>`:""}
      <div class="lbl">Your host name</div><input type="text" id="hostName" maxlength="22" placeholder="e.g. Danny" autocomplete="off">`,
    choices:[
      {t:"Roll tape",d:"Start a new season.",primary:true,fn:()=>{
        const n=($("#hostName").value||"").trim()||"Danny";
        wipe(); S=newState(n); S.log.push(`Season begins. Host: ${n}. Running gag: ${GAGS[S.gag.i].name}.`); drawStats(); paper();}},
      ...(saved&&saved.ep<=EPISODES?[{t:`Resume season with ${esc(saved.host)}`,d:`Pick up at episode ${saved.ep}.`,fn:()=>{S=saved;drawStats();paper();}}]:[])
    ]});
}

/* ---------- Morning paper: the world reacts ---------- */
function paper(){
  S.score=0; S.headline=genHeadline(); save(); drawStats();
  const ns=(S.news||[]).slice().sort((a,b)=>b.p-a.p);
  const top=S.ep===1?"UBC HANDS 12:30 SLOT TO UNKNOWN; INDUSTRY PUZZLED":(ns[0]?ns[0].t:`${S.host.toUpperCase()} STILL EMPLOYED, SOURCES SAY`);
  const second=ns[1]?ns[1].t:null;
  S.news=[];
  const th=(S.threads||[]).find(t=>!t.done&&S.ep-t.ep>=2);
  const ev=th?callbackEvent(th):null;
  const body=`<div class="paper"><div class="mast">${PAPERS[(S.ep-1)%PAPERS.length]}</div><div class="pdate">${epDate(S.ep)} · 25¢</div>
      <div class="head">${esc(top)}</div>${second?`<div class="sub2">ALSO: ${esc(second)}</div>`:""}<div class="sub2">CITY: ${esc(S.headline)}</div></div>
      ${ev?`<p><b>${esc(ev.title)}.</b> ${esc(ev.text)}</p>`:`<p>You read it twice on the subway, then once more in the elevator.</p>`}`;
  const go=()=>pitch();
  render({kicker:K("8:30 AM"),title:"The morning paper",body,
    choices:ev?ev.a.map(a=>({t:a.t,d:a.d,fn:()=>{th.done=true;const r=resolve(a);S.log.push(`Ep ${S.ep}: ${ev.title}. ${a.t}.`);outcome(K("9:00 AM"),ev.title,r.text,r.chips,go);}}))
              :[{t:"Head into the office",primary:true,fn:go}]});
}

/* ---------- Running gag ---------- */
function afterBit(){
  const g=GAGS[S.gag.i];
  if(Math.random()>.55) return remote();
  const st=Math.min(S.gag.stage,g.lines.length-1);
  render({kicker:K("TAPING"),title:`Running gag: ${g.name}`,body:`<p>${g.lines[st]}</p>${S.gag.stage?`<p class="q">The audience recognizes it. They're waiting to see what you do.</p>`:""}`,
    choices:[
      {t:"Play into it",d:`Running gags get bigger every time they land. (Level ${S.gag.stage+1})`,crew:true,fn:()=>{
        const ok=Math.random()<Math.min(.85,.5+S.gag.stage*.08);
        let chips;
        if(ok){S.gag.stage++;chips=apply({ratings:3+S.gag.stage*2,weird:2});addFame(g.name,1);if(S.gag.stage>=3)news(4+S.gag.stage,`${g.name.toUpperCase()} MANIA SWEEPS NATION`);}
        else chips=apply({ratings:-2});
        S.log.push(`Ep ${S.ep}: ${g.name}, ${ok?"played into it (level "+S.gag.stage+")":"it fell flat"}.`);
        outcome(K("TAPING"),ok?"The gag grows":"Not tonight",ok?"You lean all the way in. The audience roars like it's an old friend. It kind of is.":"You try to milk it, but the moment's gone. The audience politely waits for you to move on.",chips,remote);}},
      {t:"Ignore it and keep going",d:"Professionals don't break.",fn:()=>{const c=apply({ratings:-1});outcome(K("TAPING"),"Moving on","You push through. A few people in the back are still giggling.",c,remote);}}
    ]});
}

/* ---------- Crew moods ---------- */
const CREW_LOW={walt:"Walt is quietly packing up his headset after the show. \"Got a call from the news division,\" he says. \"They respect directors over there.\"",
  lenny:"Lenny skipped the after-show hang. He's been seen having lunch with a rival bandleader.",
  chuck:"Chuck has stopped pitching. He just sits in the writers' room eating crackers and staring at the wall."};
const CREW_HIGH={walt:"Walt stayed until 3 AM recutting tonight's opening. He won't take credit for it.",
  lenny:"Lenny wrote you a theme for the roof drops. It's called \"Gravity Always Wins.\" It slaps.",
  chuck:"Chuck pitched eleven new characters at dinner. Three of them are genuinely brilliant."};
function crewCheck(next){
  const low=Object.keys(CREW).find(k=>S[k]<=25&&!S.warned[k]);
  const high=Object.keys(CREW).find(k=>S[k]>=85&&!S.warned[k+"hi"]);
  if(low){
    S.warned[low]=true;
    return render({kicker:K("AFTER THE SHOW"),title:`${CREW[low].n} is unhappy`,body:`<p>${CREW_LOW[low]}</p>`,choices:[
      {t:`Take ${CREW[low].n} out for a steak`,d:"Clear the air. You're buying.",fn:()=>{const c=apply({[low]:20,morale:2});outcome(K("AFTER THE SHOW"),"Patched up",`${CREW[low].n} orders the most expensive thing on the menu. Then laughs. You're good.`,c,next);}},
      {t:"Let it ride",d:"Everybody gets grumpy sometimes.",fn:()=>{const c=apply({[low]:-5,morale:-4});outcome(K("AFTER THE SHOW"),"Tension",`The staff noticed. Nobody says anything, which is worse.`,c,next);}}]});
  }
  if(high){
    S.warned[high+"hi"]=true;
    const c=apply({ratings:4,morale:3});
    return outcome(K("AFTER THE SHOW"),`${CREW[high].n} has your back`,`<p>${CREW_HIGH[high]}</p>`,c,next);
  }
  next();
}

function pitch(){
  S.bit=null; S.guest=null; S.gSeg=0; S.chuckChar=pick(CHUCK_CHARS); drawStats();
  const wild=genBit(); wild.wild=true;
  const fresh=shuffle(BITS.filter(b=>!S.bits[b.name])).slice(0,2).concat([wild]);
  const back=allBits().filter(b=>{const st=bitStatus(b.name);return st&&(st.k==="rec"||st.k==="pro");})
    .sort((a,b)=>S.bits[b.name].hits-S.bits[a.name].hits).slice(0,3);
  let opts=fresh.map(b=>({b,ret:false})).concat(back.map(b=>({b,ret:true})));
  if(!opts.length) opts=shuffle(BITS).slice(0,3).map(b=>({b,ret:false}));
  render({kicker:K("10:00 AM"),title:"The pitch meeting",
    body:`<p>The writers are crammed into a room that smells like coffee and fear. Pick tonight's bit: something new, or bring back something that worked.</p>
      ${say("chuck",`I'll also be in the building tonight as <i>${S.chuckChar}</i>. Just in case you need me. You'll need me.`)}`,
    choices:opts.map(({b,ret})=>{
      const r=S.bits[b.name];
      const d = ret
        ? `${badge(bitStatus(b.name))} Aired ${r.plays}x, ${r.hits} hit${r.hits===1?"":"s"}.${r.plays>=3?" Starting to feel familiar.":""} ${bitStatus(b.name).k==="rec"?"Audiences know this one: bonus if it hits.":"One more hit makes it recurring."}`
        : `${b.d}<br>Weirdness +${b.w}`;
      return {t:(ret?"Bring back: ":b.wild?"Wildcard: ":"")+b.name,d:(b.wild&&!ret?"Fresh from the writers' room, never tried before. ":"")+d,crew:ret,fn:()=>{
        S.bit=b; if(b.gen) S.genBits[b.name]=b;
        const chips=apply({weird:ret?Math.ceil(b.w/3):b.w,...(b.mor?{morale:b.mor}:{})});
        outcome(K("10:15 AM"),ret?"The return":"It's in the show.",ret?`"${b.name}" is back. The prop guy digs the old props out of storage.`:`The writers scatter to build props for "${b.name}." Someone is already on the phone with a guy who knows a guy.`,chips,booking);
      }};
    })});
}

/* records the bit result; returns extra chip html for status changes */
function finishBit(gain,hit,legend){
  const n=S.bit.name, r=bitRec(n), before=bitStatus(n);
  r.plays++; if(hit){r.hits++;r.streak=0;addFame(n,legend?3:1);}else{r.fails++;r.streak++;}
  if(legend) r.legend++;
  r.best=Math.max(r.best,gain);
  if(before&&before.k==="rec"&&r.streak>=2) r.retired=true;
  const after=bitStatus(n);
  let note="";
  if(!before||before.k!==after.k){
    const msg={rec:"NOW A RECURRING BIT",one:"ONE-SHOT: NEVER AGAIN",pro:"PROMISING: ONE MORE HIT TO GO RECURRING",ret:"RETIRED: THE BIT HAS RUN ITS COURSE"}[after.k];
    note=`<div class="chips"><span class="badge b-${after.k}" style="font-size:12px;padding:4px 8px">${msg}</span></div>`;
    S.log.push(`"${n}" is now ${after.t.toLowerCase()}.`);
  }
  return note;
}

function booking(){
  const nGen=Math.random()<.5?1:2;
  const fresh=shuffle(GUESTS.filter(g=>!S.guests[g.name])).slice(0,3-nGen).concat(Array.from({length:nGen},genGuest));
  const regs=allGuests().filter(g=>S.guests[g.name]&&S.guests[g.name].regular);
  const opts=fresh.map(g=>({g,tag:""})).concat(regs.map(g=>({g,tag:"reg"})));
  if(S.ep>=2) opts.push({g:GRAVES,tag:"cult"});
  if(!opts.length) shuffle(GUESTS).slice(0,3).forEach(g=>opts.push({g,tag:""}));
  render({kicker:K("1:00 PM"),title:"Booking the guest",
    body:`<p>Your talent booker drops a stack of folders on the desk. "These are who said yes. Pick one before they change their minds."</p>`,
    choices:opts.map(({g,tag})=>{
      const r=S.guests[g.name];
      const d = tag==="reg" ? `<span class="badge b-rec">REGULAR</span> Visit #${r.apps+1}. The audience already loves them. Better odds.`
              : tag==="cult" ? `<span class="badge b-cult">RECURRING GUEST</span> ${g.d}${r?` Visit #${r.apps+1}. The cult grows.`:""}`
              : g.d;
      return {t:g.name,d,crew:!!tag,fn:()=>{S.guest=g;if(g.gen)S.genGuests[g.name]=g;guestRec(g.name).apps++;S.gSeg=0;network();}};
    })});
}

function network(){
  const n=pick(NOTES);
  const suit = S.control>=40 ? "A man in a gray suit appears in your doorway. He's sweating. Word has gotten around about you taking over floors." : "A man in a gray suit appears in your doorway. He doesn't knock. They never knock.";
  render({kicker:K("3:30 PM"),title:`Network note: ${n.name}`,body:`<p>${suit}</p><p class="q">${n.d}</p>`,
    choices:n.a.map(a=>({t:a.t,d:a.d,fn:()=>{
      const chips=apply(a.fx); S.log.push(`Ep ${S.ep}: ${n.name}. ${a.t}.`);
      outcome(K("4:00 PM"),"Noted.","The suit writes something on a clipboard and disappears. Lenny's band starts warming up. Taping is at 5:30.",chips,discover);
    }}))});
}

function discover(){
  const un=CAST.filter(c=>!S.cast[c.id]&&!(S.passed||[]).includes(c.id+S.ep));
  const force = S.ep>=2 && !Object.keys(S.cast).length;
  if(!un.length || !(force||Math.random()<.45)) return coldOpen();
  const c=un[0];
  render({kicker:K("4:45 PM"),title:`Discovery: ${c.name}`,body:`<p>${c.disc}</p><p class="q">${c.d}</p>`,
    choices:[
      {t:`Put ${c.name.split(" ")[0]} on the show`,d:"Every great show has its regulars. Maybe this is one.",primary:true,fn:()=>{
        S.cast[c.id]={id:c.id,name:c.name,tag:c.tag,fame:20,uses:0,hits:0};
        S.log.push(`Ep ${S.ep}: Discovered ${c.name}.`);
        const chips=apply({weird:3,morale:2});
        outcome(K("4:50 PM"),"A new regular?",`${c.name} agrees, after asking twice if this is a prank. You'll find ${c.name.split(" ")[0]} in the cold open choices from now on.`,chips,coldOpen);}},
      {t:"Not now",d:"Maybe another time.",fn:()=>{S.passed=(S.passed||[]).concat(c.id+S.ep);coldOpen();}}
    ]});
}

function coldOpen(){
  const cast=Object.values(S.cast);
  if(!cast.length) return monologue();
  const choices=[{t:"Open the show yourself",d:"Straightforward. Reliable.",fn:()=>{const c=apply({ratings:1});outcome(K("TAPING"),"And we're on","You walk out, wave, and get on with it.",c,monologue);}}];
  cast.forEach(cm=>{
    const def=CAST.find(x=>x.id===cm.id); const st=castStatus(cm);
    choices.push({t:def.open,d:`${badge(st)} Fame ${cm.fame}. ${cm.hits}/${cm.uses} hits so far.`,crew:true,fn:()=>{
      const ok=Math.random()<Math.min(.9,.45+cm.fame*.005);
      const before=st.k;
      cm.uses++; if(ok){cm.hits++;addFame(cm.name,1);}
      cm.fame=clamp(cm.fame+(ok?12:-3));
      const fx=ok?{ratings:4+Math.round(cm.fame/12),...(cm.fame>=60?{morale:2}:{})}:{ratings:-2};
      let chips=apply(fx);
      const after=castStatus(cm);
      if(after.k!==before&&after.k==="cult"){thread({type:"cult",name:cm.name});news(7,`${cm.name.toUpperCase()}: AMERICA'S NEWEST STAR?`);}
      if(after.k!==before){chips+=`<div class="chips"><span class="badge b-${after.k}" style="font-size:12px;padding:4px 8px">${cm.name.toUpperCase()} IS NOW A ${after.t}</span></div>`;S.log.push(`${cm.name} is now a ${after.t.toLowerCase()}.`);}
      S.log.push(`Ep ${S.ep}: Cold open with ${cm.name}, ${ok?"hit":"miss"}.`);
      outcome(K("TAPING"),"Cold open",pick(def[ok?"win":"lose"]),chips,monologue);
    }});
  });
  render({kicker:K("TAPING"),title:"Cold open",body:`<p>Thirty seconds to air. Walt is counting down in your ear. Who opens the show tonight?</p>`,choices});
}

function monologue(){
  const mono=MONOLOGUE.map((o,i)=>i===0?Object.assign({},o,{d:`Today's paper: "${S.headline||genHeadline()}." Reliable.`,wt:`Your take on "${S.headline}" kills. The mayor's office calls to complain, which is a great sign.`}):o);
  const opts=mono.map(o=>({t:o.t,d:o.d,fn:()=>{const r=resolve(o);outcome(K("TAPING"),"How'd it go?",r.text,r.chips,doBit);}}));
  opts.push({t:"Riff with Lenny",d:`Banter with your bandleader. Works better the more he likes you. (Lenny ${S.lenny})`,crew:true,fn:()=>{
    const ok=Math.random()<.3+S.lenny*.005;
    const chips=apply(ok?{ratings:6,lenny:5,morale:2}:{ratings:-2,lenny:-3});
    outcome(K("TAPING"),ok?"The double act":"Dead air",ok
      ?say("lenny","You know, chief, I was gonna say that same joke, but I'm a professional.")+"<p>You two go back and forth for three minutes. The audience feels like they're in on something.</p>"
      :say("lenny","...What?")+"<p>Lenny didn't hear the setup over his own keyboard. You repeat it. It's worse the second time.</p>",chips,doBit);
  }});
  render({kicker:K("TAPING"),title:"The monologue",body:`<p>Lenny counts in the band. The announcer bellows your name. You walk out to applause and squint into the lights. What's the angle tonight?</p>`,choices:opts});
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
    if(isRec) fx.ratings+=BRING_BACK_BONUS;
    let chips=apply(fx); chips+=finishBit(fx.ratings,true,big);
    S.log.push(`Ep ${S.ep}: "${b.name}" ${big?"was legendary":"worked"}.`);
    if(big){news(8,`"${b.name.toUpperCase()}" THE TALK OF THE TOWN`); if(!S.threads.some(t=>t.type==="fans")) thread({type:"fans",bit:b.name});}
    else news(3,`LATE NIGHT'S "${b.name.toUpperCase()}" A HIT, VIEWERS SAY`);
    outcome(K("TAPING"),big?`"${b.name}" is LEGENDARY`:`"${b.name}" works`,(isRec?"The audience cheers the second they hear the name. ":"")+b.win+(big?" People will be talking about this one for years.":""),chips,afterBit);
  }else{
    render({kicker:K("TAPING"),title:`"${b.name}" is dying`,
      body:`<p>${isRec&&fatigue>0?"The audience has seen this one before. You can feel it. ":""}${b.lose}</p><p>Stu, your stage manager, is making the "wrap it up" sign so hard his arm might come off.</p>`,
      choices:[
        {t:"Signal Lenny to play you out",d:"The band can cover anything.",crew:true,fn:()=>{
          let chips=apply({ratings:-1,morale:1,lenny:3}); chips+=finishBit(-1,false,false);
          S.log.push(`Ep ${S.ep}: "${b.name}" bombed. Lenny played you out.`); news(2,`CRITICS BAFFLED BY "${b.name.toUpperCase()}"`);
          outcome(K("TAPING"),"Saved by the band",say("lenny","Ladies and gentlemen, that was a bit!")+"<p>The horns kick in so loud nobody remembers what just happened.</p>",chips,afterBit);}},
        {t:"Commit harder",d:"Lean into the failure. Make the failure the joke. If it works, it counts as a hit.",fn:()=>{
          const sv=Math.random()<.4+S.weird*.003;
          const fx=sv?{ratings:11,weird:6,morale:3}:{ratings:-7,weird:4,patience:-4};
          let chips=apply(fx); chips+=finishBit(fx.ratings,sv,false);
          S.log.push(`Ep ${S.ep}: "${b.name}" bombed. Committed harder, ${sv?"and it turned around":"and it got worse"}.`);
          outcome(K("TAPING"),sv?"The comeback":"The free fall",sv?"You start narrating your own failure like a nature documentary. The audience realizes the bomb IS the bit. They go wild.":"You keep going. And going. A man in the front row checks his watch, then checks it again, then leaves.",chips,afterBit);}}
      ]});
  }
}

/* ---------- Remote segment: invasions and roof drops ---------- */
function remote(){
  const open=FLOORS.filter(f=>!claimed(f.id)&&(!f.boss||S.claimed.length>=3));
  render({kicker:K("TAPING"),title:"Remote segment",
    body:`<p>Walt's handheld camera crew is standing by at the studio door with the long cable. Where are we going tonight?</p>
      ${say("walt",S.walt>=70?"Wherever you go, we're right behind you. Don't look back.":S.walt>=40?"Just give me a heads up before you start running.":"I'll follow you. Slowly. Thinking about my pension.")}`,
    choices:[
      ...(open.length?[{t:"Invade another studio",d:`Crash a show on another floor and claim it. ${S.claimed.length} of ${FLOORS.length} floors are yours.`,fn:()=>invadePick(open)}]:[]),
      {t:"Go to the roof",d:"Throw something off the building. The judges are waiting.",fn:roofPick},
      {t:"Stay in the studio",d:"Do a quiet desk piece. The crew gets a breather.",fn:()=>{const c=apply({morale:3,walt:2});outcome(K("TAPING"),"A calm moment","You do five minutes on the history of your desk. It's oddly soothing.",c,maybeDisaster);}}
    ]});
}

function invadePick(open){
  render({kicker:K("REMOTE"),title:"Pick a target",
    body:`<p>The elevator directory lists every floor in the UBC Tower. You've got about four minutes before security figures out what's happening.</p>`,
    choices:open.map(f=>({t:`Floor ${f.f}: ${f.name}`,d:f.d+(f.perk?" <b>Claiming this unlocks a new weapon.</b>":"")+(f.boss?" <b>The big one.</b>":""),fn:()=>invadeHow(f)}))});
}

function invadeHow(f){
  const opts=[
    {t:"Bullhorn from the doorway",d:"The classic. Loud, rude, effective.",base:.5,win:{ratings:8,patience:-5},lose:{ratings:3,patience:-5}},
    {t:"Bribe their audience with hot dogs",d:"Win the room before the room knows it's been won.",base:.55,win:{ratings:6,morale:2,patience:-3},lose:{ratings:1,patience:-3}},
    {t:`Send Chuck in first as ${S.chuckChar}`,d:`Chaos as a distraction. (Chuck ${S.chuck})`,base:.25+S.chuck*.004,crew:true,win:{ratings:10,weird:5,chuck:5,patience:-6},lose:{ratings:-2,chuck:-3,patience:-6}}
  ];
  if(claimed("power")) opts.push({t:"Kill their lights",d:"Sully is standing by in the Power Room. One phone call.",base:.85,win:{ratings:12,weird:4,patience:-10},lose:{ratings:4,patience:-10},crew:true});
  render({kicker:K("REMOTE"),title:`Floor ${f.f}: ${f.name}`,body:`<p>${f.d}</p><p>The red ON AIR light is glowing over their door. How do you go in?</p>`,
    choices:opts.map(o=>({t:o.t,d:o.d,crew:o.crew,fn:()=>{
      const chance=Math.min(.92,o.base+(.5-f.def)*.5+S.walt*.002);
      const ok=Math.random()<chance;
      let fx=Object.assign({},ok?o.win:o.lose);
      if(ok){ fx.control=f.boss?30:12; fx.walt=(fx.walt||0)+2; S.claimed.push(f.id); }
      if(f.boss){ fx.patience=(fx.patience||0)+(ok?-14:-6); if(ok) fx.ratings=(fx.ratings||0)+8; }
      let chips=apply(fx);
      if(ok) chips+=`<div class="chips"><span class="chip claim">FLOOR ${f.f} CLAIMED</span>${f.perk?`<span class="chip claim">UNLOCKED: Kill their lights</span>`:""}</div>`;
      S.log.push(`Ep ${S.ep}: Invaded ${f.name}. ${ok?"Claimed it.":"Thrown out."}`);
      if(ok){news(f.boss?12:6,f.boss?"LATE NIGHT HOST SEIZES EXECUTIVE SUITE; CHAIRMAN \"FINE WITH IT\"":`LATE NIGHT HOST SEIZES FLOOR ${f.f} OF UBC TOWER`);
        if(["news","soap","game","sports","kids"].includes(f.id)&&Math.random()<.6) thread({type:"revenge",floor:f.name});}
      else news(3,`SECURITY REPELS LATE NIGHT RAID ON FLOOR ${f.f}`);
      outcome(K("REMOTE"),ok?"Territory taken":"Repelled",f[ok?"win":"lose"],chips,maybeDisaster);
    }}))});
}

function roofPick(){
  const items=shuffle(DROPS).slice(0,4);
  render({kicker:K("THE ROOF"),title:"Drop zone",
    body:`<p>Fifty-four floors up. Wind howling. A crew member below has cleared the loading dock and is holding a sign that says PLEASE.</p>
      <p>Your three judges (Walt, Lenny and Chuck) score each drop on splat and destruction.</p>
      ${S.best?`<p class="q">Your best this season: ${esc(S.best.item)}, ${S.best.score}/30.</p>`:""}`,
    choices:items.map(it=>({t:it.n,d:`${it.d}<br>Splat ${"●".repeat(Math.round(it.s/2))}${"○".repeat(5-Math.round(it.s/2))} · Destruction ${"●".repeat(Math.round(it.b/2))}${"○".repeat(5-Math.round(it.b/2))}`,fn:()=>roofDrop(it)}))});
}

function roofDrop(it){
  const base=(it.s+it.b)/2+(it.bonus||0)+S.weird/25;
  let mattress = it.n==="Mattress";
  const judge=(lean)=>Math.max(0,Math.min(10,Math.round(base+lean+rnd(-2,2))));
  let scores;
  let text;
  if(mattress && Math.random()<.5){
    scores=[10,10,10];
    text="The mattress lands flat, bounces eleven feet back into the air, and lands perfectly on a bus stop bench. A man sits down on it. He seems happy. The judges are on their feet.";
  } else if(mattress){
    scores=[1,2,9];
    text="The mattress floats down like a leaf and lands with a soft \"fwump.\" Walt and Lenny are unimpressed. Chuck gives it a 9 out of loyalty.";
  } else {
    scores=[judge(it.b>it.s?1:-1),judge(it.s>it.b?1:-1),judge(1)];
    const total=scores.reduce((a,b)=>a+b,0);
    text = total>=25?`The ${it.n.toLowerCase()} hits the loading dock with a sound they hear in New Jersey. The camera shakes. The audience screams with joy.`
         : total>=16?`A solid impact. Pieces of ${it.n.toLowerCase()} everywhere. The crowd on the sidewalk applauds.`
         : `It lands with more of a "thud" than you'd hoped. Somewhere, a pigeon is disappointed.`;
  }
  const total=scores.reduce((a,b)=>a+b,0);
  const fx={ratings:Math.round(total/3)-1,weird:3};
  if(it.lenny) fx.lenny=it.lenny;
  let chips=apply(fx);
  let hz="";
  news(total>=24?7:4,`LATE NIGHT HOST DROPS ${it.n.toUpperCase()} OFF UBC TOWER; JUDGES GIVE IT ${total}`);
  if(Math.random()<.12+(it.hz||0)){const hi=Math.floor(Math.random()*HAZARDS.length),h=HAZARDS[hi];hz=`<p><b>Oh no.</b> ${h.t}</p>`;chips+=apply(h.fx);
    if(hi===0&&!S.threads.some(t=>t.type==="lincoln")){thread({type:"lincoln"});news(10,"EXECUTIVE'S LINCOLN FLATTENED BY FALLING OBJECT");}}
  let rec="";
  if(!S.best||total>S.best.score){S.best={item:it.n,score:total};rec=`<div class="chips"><span class="chip claim">NEW SEASON BEST</span></div>`;}
  addHof({item:it.n,score:total,host:S.host});
  S.log.push(`Ep ${S.ep}: Dropped a ${it.n.toLowerCase()} off the roof. ${total}/30.`);
  const body=`<p>${text}</p>
    <div class="judges"><div class="judge"><small>Walt</small><span>${scores[0]}</span></div><div class="judge"><small>Lenny</small><span>${scores[1]}</span></div><div class="judge"><small>Chuck</small><span>${scores[2]}</span></div></div>
    <p><b>Total: ${total}/30</b></p>${hz}${rec}`;
  outcome(K("THE ROOF"),`Drop: ${it.n}`,body,chips,maybeDisaster);
}

function maybeDisaster(){
  if(Math.random()<.45){
    const pool=DISASTERS.filter(d=>!d.needsClaim||S.claimed.length>0);
    const d=pick(pool);
    const choices=d.a.map(a=>({t:a.t,d:a.d,fn:()=>{const r=resolve(a);S.log.push(`Ep ${S.ep}: ${d.name}. ${a.t}.`);outcome(K("TAPING"),"Back on track. Sort of.",r.text,r.chips,()=>interview(1));}}));
    choices.push({t:"Trust Walt in the booth",d:`Let the director improvise the save. (Walt ${S.walt})`,crew:true,fn:()=>{
      const ok=Math.random()<.3+S.walt*.006;
      const chips=apply(ok?{ratings:5,walt:4}:{ratings:-3,walt:-3});
      S.log.push(`Ep ${S.ep}: ${d.name}. Walt ${ok?"saved it":"couldn't save it"}.`);
      outcome(K("TAPING"),ok?"Walt's save":"Even Walt can't fix this",ok
        ?say("walt","Camera two, get me the drummer. Tight. Tighter. Hold.")+"<p>Walt cuts to a close-up of the drummer's face for 40 seconds. Somehow it looks planned. Somehow it's art.</p>"
        :say("walt","Go to black.")+"<p>The screen goes dark for nine long seconds. Viewers at home assume their TVs are broken.</p>",chips,()=>interview(1));
    }});
    render({kicker:K("TAPING"),title:`Uh oh: ${d.name}`,body:`<p>${d.d}</p>`,choices});
  } else interview(1);
}

function interview(round){
  const g=S.guest;
  const intro=round===1?`<p>${esc(g.name)} walks out to applause and settles into the chair. ${esc(g.d)}</p>`:`<p>You've got one more segment with ${esc(g.name)} before Lenny plays you out.</p>`;
  const choices=[
    {t:"Play it straight",d:"Ask good questions. Let them shine.",fn:()=>ivResolve("straight",round)},
    {t:"Needle them",d:"Poke. Prod. See what happens.",fn:()=>ivResolve("needle",round)},
    {t:"Go off the rails",d:"Throw out the cue cards entirely.",fn:()=>ivResolve("rails",round)}
  ];
  if(g.cult) choices.unshift({t:"Let him rant",d:"Give Dr. Graves the floor and get out of the way. His fans came for this.",crew:true,fn:()=>gravesRant(round)});
  if(round===2) choices.push({t:`Send in Chuck as ${S.chuckChar}`,d:`Interrupt your own interview. (Chuck ${S.chuck})`,crew:true,fn:chuckCrash});
  render({kicker:K("TAPING"),title:`Interview, segment ${round}`,body:intro,choices});
}

const GRAVES_WIN=["\"Man is a pebble flung into the abyss! And the abyss... does not even notice the pebble!\" He sits back down, sips his water, and says \"Thank you, I love your program.\" The audience is on its feet.",
  "Dr. Graves delivers four uninterrupted minutes on the futility of sandwiches. Lenny's band underscores it with a single ominous organ chord. Pure art.",
  "He stares into camera one: \"You, at home. Yes, you. Go to bed.\" Half of America does. The other half calls in to request him back."];
const GRAVES_LOSE=["Dr. Graves starts a rant about death, but loses his place and spends the rest of the segment looking for it.","The rant goes very dark, very fast. The sponsor calls during the commercial break."];
function gravesRant(round){
  const r=guestRec(GRAVES.name);
  const ok=Math.random()<Math.min(.9,.42+r.apps*.06+S.weird*.002);
  if(ok){S.gSeg++;r.good++;addFame(GRAVES.name,1);news(5,"PHILOSOPHER'S RANT SENDS HALF OF AMERICA TO BED");}
  const chips=apply(ok?{ratings:12+Math.min(6,r.apps),weird:4}:{ratings:-3,weird:3,patience:-3});
  S.log.push(`Ep ${S.ep}: Dr. Graves ranted, segment ${round}: ${ok?"triumph":"too dark"}.`);
  outcome(K("TAPING"),ok?"The void applauds":"Too much void",pick(ok?GRAVES_WIN:GRAVES_LOSE),chips,round===1?()=>interview(2):wrap);
}

function chuckCrash(){
  const g=S.guest;
  const ok=Math.random()<.25+S.chuck*.004+S.weird*.002;
  if(ok){S.gSeg++;guestRec(g.name).good++;}
  const chips=apply(ok?{ratings:11,weird:5,chuck:6}:{ratings:-5,chuck:-4,morale:-1});
  S.log.push(`Ep ${S.ep}: Chuck crashed the interview as ${S.chuckChar}. ${ok?"It killed.":"It died."}`);
  outcome(K("TAPING"),ok?"Chuck strikes again":"Chuck strikes out",ok
    ?say("chuck",`(as ${S.chuckChar}) Sorry to interrupt. I've been living in this building for eleven years and I have a question for ${esc(g.name)}.`)+`<p>${esc(g.name)} plays along beautifully. It becomes the highlight of the night.</p>`
    :say("chuck",`(as ${S.chuckChar}) Hello. It is I.`)+`<p>${esc(g.name)} has no idea what's going on. Neither does the audience. Chuck exits slowly. Very slowly.</p>`,chips,wrap);
}

function ivResolve(style,round){
  const g=S.guest;
  const gr=guestRec(g.name);
  let chance=INTERVIEW[g.t][style]+(gr.regular&&!g.cult?.1:0); if(style==="rails") chance+=S.weird*.002;
  const ok=Math.random()<chance;
  let fx=ok?{ratings:style==="straight"?6:8}:{ratings:-4};
  if(style==="rails") fx.weird=4;
  let text=pick(IV_LINES[style][ok?"win":"lose"]).replace(/\{g\}/g,esc(g.name));
  let walked=false;
  if(!ok&&g.t==="volatile"&&style==="needle"){walked=true;fx={ratings:6,patience:-8,weird:5};text=`${esc(g.name)} stands up, rips off the microphone, and walks off the set. It's a disaster. It's also the clip every station will run tomorrow.`;}
  if(ok&&g.t==="volatile"&&style==="needle") fx.ratings=12;
  if(ok){S.gSeg++;gr.good++;} if(walked){gr.walk++;news(9,`${g.name.toUpperCase()} STORMS OFF LATE NIGHT SET`);thread({type:"walkoff",name:g.name});}
  const chips=apply(fx);
  S.log.push(`Ep ${S.ep}: ${g.name}, segment ${round}, ${style==="rails"?"off the rails":style}: ${walked?"walk-off":ok?"worked":"flopped"}.`);
  outcome(K("TAPING"),walked?"WALK-OFF":ok?"That's television":"Oof",text,chips,(round===1&&!walked)?()=>interview(2):wrap);
}

function wrap(){
  const s=S.score; const share=(3.2+s/8).toFixed(1);
  const tier=s>=20?"great":s>=6?"ok":"bad";
  const fx=tier==="great"?{patience:6,morale:4}:tier==="ok"?{patience:1}:{patience:-9,morale:-3};
  if(S.control>=50) fx.patience=(fx.patience||0)-3;
  fx.ratings=-6;
  const chips=apply(fx)+`<p class="q">Audiences are fickle. Ratings slip a little every week unless you keep surprising them.</p>`;
  let promo="";
  const gr=S.guest?guestRec(S.guest.name):null;
  if(gr&&S.gSeg>=2&&!gr.regular&&!S.guest.cult){gr.regular=true;promo=`<div class="chips"><span class="badge b-rec" style="font-size:12px;padding:4px 8px">${esc(S.guest.name).toUpperCase()} IS NOW A REGULAR GUEST</span></div>`;S.log.push(`${S.guest.name} became a regular guest.`);}
  if(S.guest&&S.guest.cult&&S.gSeg>=1) gr.regular=true;
  const q=pick(CREW_QUIPS[tier]);
  S.log.push(`Ep ${S.ep} rated a ${share} share.`);
  const isLast=S.ep>=EPISODES;
  const critics={great:["\"The most dangerous 60 minutes on television.\" The Village Voice","\"Unhinged, in the best way.\" Daily News"],ok:["\"Occasionally brilliant, frequently baffling.\" TV Guide","\"A show for people who can't sleep. Fair enough.\" The Post"],bad:["\"Like watching a man argue with a vending machine.\" The Times","\"I have seen better television in a laundromat.\" Variety"]};
  render({kicker:K("NEXT MORNING"),title:"The overnights are in",
    body:`<div class="big">${share} share</div><p class="q">${pick(critics[tier])}</p>${say(q[0],q[1])}
      ${S.control>=50?"<p>Rumor has it the chairman of Consolidated Electric now takes the stairs to avoid running into you.</p>":""}${chips}${promo}`,
    choices:[{t:isLast?"See the network's decision":"On to the next episode",primary:true,fn:()=>{if(checkFail())return;crewCheck(()=>{S.ep++;if(isLast)finale();else paper();});}}]});
}

function finale(){
  const r=S.ratings,p=S.patience;
  if(claimed("exec")&&r>=50) return ending("YOU OWN THE TOWER","With the executive suite under your control and ratings through the roof, Consolidated Electric surrenders. The building is renamed in your honor. Sully is promoted to Vice President of Lights.");
  if(r>=82&&p>=40) return ending("RENEWED: FIVE YEARS","The network gives you a five year deal, a bigger studio, and a parking space with your name on it.");
  if(r>=50&&p>=25) return ending("RENEWED: ONE SEASON","You get another season. Barely. The memo says \"cautiously optimistic,\" which at this network is basically a hug.");
  if(p>=50) return ending("MOVED TO 2:00 AM","The suits like you, but the numbers don't. Your new audience is insomniacs, truckers, and college kids. That's where legends start.");
  if(claimed("exec")) return ending("ESCORTED OUT, A LEGEND","You took the executive suite but the numbers weren't there. Security walks you out of the building to a standing ovation from every floor you conquered.");
  ending("CANCELLED","Eight episodes. One wild ride. Your show becomes a bootleg tape that people trade in dorm rooms for decades.");
}

function ending(head,text){
  wipe();
  const wn=S.weird>=70?"You will be remembered as one of the strangest people ever to sit behind a desk.":S.weird>=40?"You found the sweet spot between strange and watchable.":"You played it pretty safe. Maybe too safe.";
  const cn=S.claimed.length?`You claimed ${S.claimed.length} of ${FLOORS.length} floors of the UBC Tower.`:"You never left your floor. The other shows never knew you existed.";
  const crewBest=Object.keys(CREW).sort((a,b)=>S[b]-S[a])[0];
  render({kicker:"SEASON FINALE",title:head,
    body:`<p>${text}</p><p>${wn} ${cn}</p>
      ${S.best?`<p>Best roof drop: ${esc(S.best.item)}, ${S.best.score}/30.</p>`:""}
      ${(()=>{const rec=Object.keys(S.bits).filter(n=>{const t=bitStatus(n);return t&&t.k==="rec";});const cult=Object.values(S.cast).filter(c=>c.fame>=35);const regs=Object.keys(S.guests).filter(n=>S.guests[n].regular);
        return `<p>Your show's legacy: ${rec.length?`recurring bits ${rec.map(esc).join(", ")}`:"no recurring bits"}; ${cult.length?`regulars ${cult.map(c=>esc(c.name)).join(", ")}`:"no breakout regulars"}; ${regs.length?`guests who kept coming back: ${regs.map(esc).join(", ")}`:"no repeat guests"}.</p>`;})()}
      <p><button class="boardbtn" id="endBoard">See the full Bit Board</button></p>
      ${say(crewBest,S[crewBest]>=70?"Whatever you do next, I'm in.":"It was a job. A weird, weird job.")}
      <p class="q">Ratings ${S.ratings} · Patience ${S.patience} · Morale ${S.morale} · Weirdness ${S.weird} · Tower Control ${S.control}</p>`,
    choices:[{t:"Start a new season",primary:true,fn:title}]});
  $("#endBoard").onclick=openBoard;
  S.log.push(`Season over: ${head}.`); drawStats();
}


$("#restartBtn").onclick=()=>{wipe();title();};
title();
