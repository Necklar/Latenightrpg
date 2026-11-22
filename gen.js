/* Late Night Live: The RPG. (c) 2026 Necklar. All rights reserved. */
/* Procedural content: generated guests, wildcard bits, headlines, running gags, callbacks */

const GEN = {
  first:["Dolores","Marv","Bunny","Sal","Trudy","Irv","Gloria","Chet","Wanda","Morty","Pearl","Rocco","Edna","Vic","Fran","Duke","Bev","Stan","Myrna","Lou"],
  last:["Finkel","Margolis","Petrakis","Dubrow","Kessler","Santangelo","Pruitt","Lomax","Feeney","Castellano","Biddle","Ostrowski","Plunkett","Gorski","Vance","Tuttle"],
  from:["Staten Island","Hoboken","Scranton","Flushing","Buffalo","Paramus","Cleveland","the Bronx","Duluth","Yonkers"],
  /* Each job has matching talents, quirks and things to promote */
  jobs:[
    {j:"competitive yodeler",t:"odd",talent:["Will yodel today's weather forecast.","Can yodel any song you name."],
     quirk:["Warms up constantly backstage.","Considers yodeling a serious art form."],promo:["an instructional album, \"Yodel With Confidence\"","the regional yodeling finals this weekend"]},
    {j:"tax attorney",t:"dull",talent:["Can recite this year's tax code changes from memory.","Will find a deduction for anything on your desk."],
     quirk:["Brought receipts for everything, including the cab ride over.","Asks how much the show pays its writers."],promo:["a paperback guide to deductions","a free tax seminar at a Holiday Inn"]},
    {j:"lounge singer",t:"charming",talent:["Will sing a standard with Lenny's band.","Can sing any song in the style of any other singer."],
     quirk:["Calls everyone \"sweetheart.\"","Brought a personal spotlight operator."],promo:["a live album recorded in Atlantic City","a two-week run at a Catskills resort"]},
    {j:"former child star",t:"volatile",talent:["Can still do the catchphrase from the old sitcom.","Will reenact a famous scene from the old sitcom."],
     quirk:["Does not like being asked about the catchphrase.","Brought a scrapbook of old reviews."],promo:["a comeback dinner theater tour","a tell-all memoir"]},
    {j:"subway conductor",t:"charming",talent:["Can announce every stop on the A train from memory.","Can identify any subway line by the sound of its brakes."],
     quirk:["Is wearing the uniform.","Keeps checking a pocket watch."],promo:["the Transit Authority's new courtesy campaign","a retirement party next week after 30 years"]},
    {j:"ventriloquist",t:"odd",talent:["Brought a dummy, Mr. Pemberton, who will do most of the talking.","Will have the dummy interview you."],
     quirk:["Will not speak without the dummy.","Says the dummy does not like you."],promo:["a children's show pilot that hasn't been picked up","a Vegas lounge act"]},
    {j:"pro wrestling manager",t:"volatile",talent:["Will deliver a threatening speech about any topic you give.","Can throw a chair without hitting anyone."],
     quirk:["Is wearing sunglasses and a cape.","Refers to you as \"the so-called host.\""],promo:["a Saturday night wrestling card in Queens","a grudge match he says is real"]},
    {j:"orthodontist",t:"dull",talent:["Has a collection of 400 retainers.","Can identify celebrities by their teeth."],
     quirk:["Keeps commenting on people's teeth.","Brought a model of a jaw."],promo:["a dental hygiene filmstrip for schools","a practice opening in Paramus"]},
    {j:"pet psychic",t:"odd",talent:["Will read the mind of any animal in the building.","Says she can talk to the pigeons on the roof."],
     quirk:["Says the studio has a strange energy.","Brought a client's poodle."],promo:["a book of conversations with Park Avenue poodles","a pet psychic advice column"]},
    {j:"roller disco champion",t:"charming",talent:["Will skate a routine across the stage.","Can skate backwards while juggling."],
     quirk:["Will not take off the skates.","Brought a portable disco ball."],promo:["a roller rink opening in New Jersey","an exercise record for skaters"]},
    {j:"playwright",t:"volatile",talent:["Will perform a monologue from the new play.","Will critique your monologue."],
     quirk:["Considers television beneath serious art.","Brought a copy of the script and won't put it down."],promo:["a four-hour play opening in a church basement","a one-act festival in the East Village"]},
    {j:"weather balloon hobbyist",t:"dull",talent:["Brought a weather balloon and wants to launch it from the roof.","Can predict tomorrow's weather by touching the air."],
     quirk:["Talks about air pressure constantly.","Brought a barometer."],promo:["a newsletter with 60 subscribers","a balloon launch in Central Park on Sunday"]},
    {j:"stunt performer",t:"charming",talent:["Will fall down the studio stairs on cue.","Will set a sleeve on fire and put it out."],
     quirk:["Lists every bone ever broken.","Has never been in a scene where anyone sees the face."],promo:["an action movie opening Friday","a stunt show at a theme park"]},
    {j:"minor league mascot",t:"odd",talent:["Will perform in full costume.","Will lead the audience in a cheer."],
     quirk:["Does not speak while in costume.","Communicates only with gestures."],promo:["the Scranton team's dollar hot dog night","opening day next month"]},
    {j:"insurance adjuster",t:"dull",talent:["Can estimate the value of anything on your desk.","Will assess the studio for hazards."],
     quirk:["Has already noted three fire code violations.","Asks if you have a policy."],promo:["an industry award just won","a seminar on home safety"]}
  ],

  bitT:[
    {n:"{Noun} Court",d:"You act as judge in disputes between audience members and their {noun}s."},
    {n:"Speed {Gerund}",d:"Audience members race to {verb} things against the clock."},
    {n:"Ask a {Person}",d:"A {person} from the neighborhood answers viewer mail live."},
    {n:"The {Adj} {Noun} Awards",d:"You give trophies for the {adj} {noun}s in Manhattan."},
    {n:"{Noun} Cam",d:"A camera is attached to a {noun} and sent somewhere in the city."},
    {n:"Late Night {Noun} Theater",d:"The staff performs a dramatic reading using {noun}s as the cast."}
  ],
  noun:["toaster","pigeon","bagel","traffic cone","parking ticket","houseplant","lawn flamingo","push-button phone","bowling trophy","garden gnome"],
  verb:[["iron","Ironing"],["whistle","Whistling"],["knit","Knitting"],["juggle","Juggling"],["yodel","Yodeling"],["gift-wrap","Gift-Wrapping"]],
  person:["Cab Driver","Doorman","Hot Dog Vendor","Crossing Guard","Tugboat Captain","Lunch Lady","Locksmith","Night Janitor"],
  adj:["saddest","loudest","most suspicious","shiniest","least necessary"],
  bitWin:["The bit worked. The audience laughed throughout.","The bit worked. The audience cheered at the end."],
  bitLose:["The bit did not work. The audience was quiet.","The bit did not work. The audience was confused by the premise."],

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
  const t=Math.random()<.8?j.t:pick(["charming","dull","volatile","odd"]);
  return {name,t,gen:true,d:`${cap(art(j.j))} from ${pick(GEN.from)}. ${pick(j.talent)} ${pick(j.quirk)} Promoting ${pick(j.promo)}.`};
}

function genBit(){
  const T=pick(GEN.bitT), noun=pick(GEN.noun), v=pick(GEN.verb), person=pick(GEN.person), adj=pick(GEN.adj);
  const fill=s=>s.replace(/\{Noun\}/g,titleCase(noun)).replace(/\{noun\}/g,noun).replace(/\{Gerund\}/g,v[1]).replace(/\{verb\}/g,v[0])
    .replace(/\{Person\}/g,person).replace(/\{person\}/g,person.toLowerCase()).replace(/\{Adj\}/g,titleCase(adj)).replace(/\{adj\}/g,adj);
  return {name:fill(T.n),d:fill(T.d),w:6+Math.floor(Math.random()*11),base:.45+Math.random()*.15,gen:true,
    win:pick(GEN.bitWin),lose:pick(GEN.bitLose)};
}

function genHeadline(){ return `${pick(GEN.hSubj)} ${pick(GEN.hVerb)} ${pick(GEN.hObj)}`; }

/* Running gags: one per season, grows each time you play into it */
const GAGS = [
  {name:"Phil the Hot Dog Vendor",lines:[
    "A hot dog vendor named Phil walks onto the set during a segment. He is looking for the bathroom.",
    "Phil walks onto the set again. He has his cart with him this time.",
    "Phil walks on. The audience applauds when they see him.",
    "Phil walks on wearing a tuxedo. He says he has an agent now.",
    "Phil walks on and Lenny's band plays a theme song for him."]},
  {name:"The Studio Clock",lines:[
    "The studio clock is showing the wrong time. No one has been able to fix it.",
    "The studio clock is wrong again. An audience member brought their own clock.",
    "The audience counts down to the time shown on the broken clock.",
    "Audience members are wearing watches set to the wrong time.",
    "The studio clock spins and stops at the correct time, then goes wrong again."]},
  {name:"Gary From Dayton",lines:[
    "A tourist named Gary from Dayton, Ohio is in the front row. He waves at the camera repeatedly.",
    "Gary from Dayton is in the front row again. He extended his vacation.",
    "Gary has a sign that says \"DAYTON LOVES YOU.\"",
    "Gary has moved to New York so he can attend every taping.",
    "The mayor of Dayton calls in to declare a Gary Day."]}
];

/* Callback events: story threads from earlier in the season come back */
function callbackEvent(th){
  switch(th.type){
    case "walkoff": return {title:`${th.name} wants to come back`,text:`${th.name}'s agent called. After the walk-off, ${th.name} wants to return to the show.`,
      a:[{t:"Book the return visit",d:"Risky.",chance:.55,win:{ratings:9,weird:3,campus:4},lose:{ratings:-3,patience:-4},
          wt:`${th.name} returned and apologized on air. The audience applauded.`,
          lt:`${th.name} returned and walked off again.`},
         {t:"Decline",d:"Nothing changes.",fx:{morale:2},r:"You decline. The staff is relieved."}]};
    case "lincoln": return {title:"Memo from upstairs",text:"The vice president whose car was damaged by your roof drop sent a memo. It contains only a photograph of the car.",
      a:[{t:"Send an apology and a fruit basket",d:"Patience goes up.",fx:{patience:6},r:"He accepts the fruit basket. He does not respond to the apology."},
         {t:"Show the memo on air",d:"Viewers will enjoy it. The vice president will not.",fx:{ratings:6,patience:-8,weird:3,campus:5},r:"The audience applauded the photograph."}]};
    case "revenge": return {title:"Retaliation",text:`The staff of ${th.floor} plans to interrupt your show tonight in return for your raid.`,
      a:[{t:"Let them in",d:"Risky.",chance:.6,win:{ratings:8,weird:3,campus:4},lose:{ratings:-3,control:-6},
          wt:"They came in during the monologue. You did a short bit together. The audience cheered.",
          lt:"They took over your desk for six minutes."},
         {t:"Block the door",d:"Stu will handle it.",fx:{control:4,morale:-2,stu:2},r:"Stu kept the door shut for 40 minutes."}]};
    case "fans": return {title:"Fan mail",text:`More than 400 viewers have mailed in homemade tributes to "${th.bit}." Most are from high school and college students.`,
      a:[{t:"Show the best ones on air",d:"Builds Campus Buzz.",fx:{ratings:4,morale:2,campus:6},r:"You showed a dozen of them on air. The audience applauded each one."},
         {t:"Donate them to a children's hospital",d:"The network approves.",fx:{patience:4,morale:2},r:"The network issues a press release about the donation."}]};
    case "cult": return {title:`${th.name} fan club`,text:`A ${th.name} fan club has formed. About forty members are outside the building.`,
      a:[{t:"Bring the fan club inside",d:"Builds Campus Buzz.",fx:{ratings:5,weird:3,campus:6},r:`The fan club sat in the front rows and chanted for ${th.name.split(" ")[0]} during the monologue.`},
         {t:"Keep it low-key",d:"Nothing changes.",fx:{morale:3},r:"You send coffee down to the fans."}]};
  }
}

const PAPERS=["THE MANHATTAN LEDGER","THE EVENING CLARION","THE DAILY HERALD-TIMES"];
