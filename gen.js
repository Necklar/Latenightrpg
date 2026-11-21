/* Late Night Live: The RPG. (c) 2026 Necklar. All rights reserved. */
/* Procedural content: generated guests, wildcard bits, headlines, running gags, callbacks */

const GEN = {
  first:["Dolores","Marv","Bunny","Sal","Trudy","Irv","Gloria","Chet","Wanda","Morty","Pearl","Rocco","Edna","Vic","Fran","Duke","Bev","Stan","Myrna","Lou"],
  last:["Finkel","Margolis","Petrakis","Dubrow","Kessler","Santangelo","Pruitt","Lomax","Feeney","Castellano","Biddle","Ostrowski","Plunkett","Gorski","Vance","Tuttle"],
  jobs:[{j:"tax attorney",t:"dull"},{j:"lounge singer",t:"charming"},{j:"competitive yodeler",t:"odd"},{j:"former child star",t:"volatile"},
        {j:"subway conductor",t:"charming"},{j:"amateur ventriloquist",t:"odd"},{j:"pro wrestling manager",t:"volatile"},{j:"orthodontist",t:"dull"},
        {j:"psychic to the pets of the rich",t:"odd"},{j:"disco roller skating champion",t:"charming"},{j:"Off-Off-Broadway playwright",t:"volatile"},
        {j:"weather balloon enthusiast",t:"dull"},{j:"stunt double",t:"charming"},{j:"insurance adjuster",t:"dull"},{j:"minor league mascot",t:"odd"}],
  from:["Staten Island","Hoboken","Scranton","Flushing","Buffalo","Paramus","Cleveland","the Bronx","Duluth","Yonkers"],
  quirk:["brought a ferret named Duke","won't stop doing card tricks","insists on sitting on the desk","is wearing two watches and won't say why",
         "has a laugh that sounds like a car alarm","answers every question with a question","arrived in full scuba gear","keeps calling you by the wrong name",
         "brought their mother, who heckles","has a parrot that only knows your name"],
  promo:["a cookbook called \"Soups of Regret\"","a self-help cassette, \"Stop Being Yourself\"","a line of novelty lamps","a one-person show about their divorce",
         "an exercise record, \"Sweatin' in Secaucus\"","a perfume for dogs","a board game about filing taxes","a thriller novel set entirely in a laundromat"],

  bitT:[
    {n:"{Noun} Court",d:"You preside as judge over disputes between audience members and their {noun}s."},
    {n:"Speed {Gerund}",d:"Audience members race to {verb} things against the clock while Lenny keeps time on the cowbell."},
    {n:"Ask a {Person}",d:"A real {person} from the neighborhood answers viewer mail, live and unrehearsed."},
    {n:"The {Adj} {Noun} Awards",d:"You hand out trophies to the {adj} {noun}s in Manhattan."},
    {n:"{Noun} Cam",d:"Strap a camera to a {noun} and see where it ends up."},
    {n:"Late Night {Noun} Theater",d:"The staff performs a dramatic reading using {noun}s as the entire cast."}
  ],
  noun:["toaster","pigeon","bagel","traffic cone","parking ticket","houseplant","lawn flamingo","rotary phone","bowling trophy","garden gnome"],
  verb:[["iron","Ironing"],["whistle","Whistling"],["knit","Knitting"],["juggle","Juggling"],["yodel","Yodeling"],["gift-wrap","Gift-Wrapping"]],
  person:["Cab Driver","Doorman","Hot Dog Vendor","Crossing Guard","Tugboat Captain","Lunch Lady","Locksmith","Night Janitor"],
  adj:["saddest","loudest","most suspicious","shiniest","least necessary"],
  bitWin:["\"{b}\" takes on a life of its own. By the end the audience is chanting.","It's stupid in exactly the right way. Walt holds the shot an extra beat because it's that good.","Nobody saw it coming, including the writers. \"{b}\" is a hit."],
  bitLose:["Nobody understands the premise, including you.","It's three minutes of polite confusion and one cough.","Halfway through, a writer mouths \"I'm sorry\" from the wings."],

  hSubj:["CITY COUNCIL","QUEENS MAN","PARKING DEPT.","SUBWAY RATS","MAYOR'S OFFICE","BROOKLYN BAKERY","NEW JERSEY","ZOO OFFICIALS","LOCAL PSYCHIC","STATEN ISLAND FERRY"],
  hVerb:["DECLARES WAR ON","UNVEILS PLAN FOR","LOSES","FILES SUIT AGAINST","CANNOT EXPLAIN","DENIES ANY LINK TO","BANS","FALLS IN LOVE WITH"],
  hObj:["PIGEONS","A GIANT BAGEL","DAYLIGHT SAVINGS","JAYWALKING","THE LETTER Q","ITS OWN SHADOW","A HAUNTED TOLLBOOTH","DISCO","SPATULAS"]
};

const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const art=s=>(/^[aeiouAEIOU]/.test(s)?"an ":"a ")+s;
const titleCase=s=>s.split(" ").map(cap).join(" ");

function genGuest(){
  const j=pick(GEN.jobs);
  const name=pick(GEN.first)+" "+pick(GEN.last);
  const t=Math.random()<.7?j.t:pick(["charming","dull","volatile","odd"]);
  return {name,t,gen:true,d:`${cap(art(j.j))} from ${pick(GEN.from)} who ${pick(GEN.quirk)}. Here to promote ${pick(GEN.promo)}.`};
}

function genBit(){
  const T=pick(GEN.bitT), noun=pick(GEN.noun), v=pick(GEN.verb), person=pick(GEN.person), adj=pick(GEN.adj);
  const fill=s=>s.replace(/\{Noun\}/g,titleCase(noun)).replace(/\{noun\}/g,noun).replace(/\{Gerund\}/g,v[1]).replace(/\{verb\}/g,v[0])
    .replace(/\{Person\}/g,person).replace(/\{person\}/g,person.toLowerCase()).replace(/\{Adj\}/g,titleCase(adj)).replace(/\{adj\}/g,adj);
  const name=fill(T.n);
  return {name,d:fill(T.d),w:6+Math.floor(Math.random()*11),base:.45+Math.random()*.15,gen:true,
    win:pick(GEN.bitWin).replace(/\{b\}/g,name),lose:pick(GEN.bitLose).replace(/\{b\}/g,name)};
}

function genHeadline(){ return `${pick(GEN.hSubj)} ${pick(GEN.hVerb)} ${pick(GEN.hObj)}`; }

/* Running gags: one is chosen each season and escalates every time you play into it */
const GAGS = [
  {name:"Phil the Hot Dog Guy",lines:[
    "A hot dog vendor named Phil wanders onto the set mid-segment, looking for the bathroom.",
    "Phil is back. He says he's lost again. This time he brought his cart.",
    "Phil enters to applause. He has clearly been practicing his entrance.",
    "Phil arrives in a tuxedo. He has an agent now.",
    "Phil walks on and the band plays his theme song. You did not authorize a theme song. It's a great theme song."]},
  {name:"The Clock That's Always Wrong",lines:[
    "The studio clock says 4:15. It's 12:40. Nobody can fix it.",
    "The clock now says 9:02. A man in the audience has brought his own clock in protest.",
    "The audience counts down together to a time that means nothing. The clock says 2:22.",
    "The clock has a fan club. They all wear wristwatches set to the wrong time.",
    "The clock spins wildly, then stops at exactly the right time. The crowd weeps. Then it's wrong again."]},
  {name:"Gary From Dayton",lines:[
    "A tourist named Gary from Dayton, Ohio is in the front row. He waves at the camera. A lot.",
    "Gary from Dayton is back. Same seat. Same wave. He says he extended his vacation.",
    "Gary has made a sign: \"DAYTON LOVES YOU.\" The audience gives him a round of applause.",
    "Gary has moved to New York. He quit his job. For this.",
    "Dayton, Ohio declares a Gary Day. The mayor of Dayton calls in live to thank you. Gary is crying."]}
];

/* Callback events: story threads planted earlier in the season come back */
function callbackEvent(th){
  switch(th.type){
    case "walkoff": return {title:`The return of ${th.name}`,text:`${th.name}'s agent calls. After last time's walk-off, they want to come back and "clear the air."`,
      a:[{t:"Book the rematch",d:"Lightning, meet bottle.",chance:.55,win:{ratings:9,weird:3},lose:{ratings:-3,patience:-4},
          wt:`${th.name} walks out, sits down, and says "I owe you an apology." Then walks off again, on purpose, as a bit. The crowd goes wild.`,
          lt:`${th.name} walks off again. Twice in one season. Somewhere, a record book is updated.`},
         {t:"Let it go",d:"Some bridges should stay burned.",fx:{morale:2},r:"You let it go. The writers quietly pin the walk-off photo to the bulletin board."}]};
    case "lincoln": return {title:"A memo from upstairs",text:"The vice president whose Lincoln you flattened has sent a memo. It's just a photograph of the car.",
      a:[{t:"Send a fruit basket",d:"Shaped like a Lincoln.",fx:{patience:6},r:"He keeps the fruit basket. He does not say thank you. That's a good sign."},
         {t:"Frame the memo and show it on air",d:"It's honestly a great photo.",fx:{ratings:6,patience:-8,weird:3},r:"The audience gives the photo a standing ovation. The VP watches from home, chewing very slowly."}]};
    case "revenge": return {title:"Retaliation",text:`The crew from ${th.floor} has had enough of your invasions. Word is they're crashing YOUR show tonight.`,
      a:[{t:"Welcome them with open arms",d:"Set out chairs. And snacks.",chance:.6,win:{ratings:8,weird:3},lose:{ratings:-3,control:-6},
          wt:"They storm in and you hand them coffee and a cue card. They end up doing a bit with you. It's great television.",
          lt:"They take over your desk for six minutes. You watch from the audience. It's humbling."},
         {t:"Barricade the door",d:"Stu has a ladder and a bad attitude.",fx:{control:4,morale:-2},r:"Stu holds the door for 40 minutes. He is a hero. He is also very tired."}]};
    case "fans": return {title:"The mailbag overfloweth",text:`Viewers have mailed in over 400 homemade tributes to "${th.bit}." Accounting wants them out of the hallway.`,
      a:[{t:"Show the best ones on air",d:"There's a diorama.",fx:{ratings:5,morale:2},r:"The diorama is incredible. Somebody in Ohio has way too much time and you love them."},
         {t:"Donate them to a children's hospital",d:"Good karma.",fx:{patience:4,morale:2},r:"The network sends out a press release about it. They take full credit."}]};
    case "cult": return {title:`${th.name} mania`,text:`A ${th.name} fan club has formed. Forty of them are outside the building in matching t-shirts.`,
      a:[{t:"Bring the fan club inside",d:"Fill the front rows.",fx:{ratings:6,weird:3},r:`The fan club chants "${th.name.split(" ")[0].toUpperCase()}!" for the entire monologue. You can't finish a single joke. It's the best monologue of your career.`},
         {t:"Keep it low-key",d:"Fame is fragile.",fx:{morale:3},r:"You send coffee down to the fans. They frame the cups."}]};
  }
}

const PAPERS=["THE MANHATTAN LEDGER","THE EVENING CLARION","THE DAILY HERALD-TIMES"];
