/* Late Night Live: The RPG. (c) 2026 Necklar. All rights reserved. */
/* Handcrafted content */
const EPISODES = 8;
const STATS = [
  {k:"ratings", n:"Ratings", c:"var(--gold)"},
  {k:"patience", n:"Network Patience", c:"var(--blue)"},
  {k:"morale", n:"Staff Morale", c:"var(--green)"},
  {k:"weird", n:"Weirdness", c:"var(--pink)"},
  {k:"control", n:"Tower Control", c:"var(--orange)", wide:true}
];
const CREW = {
  walt:{n:"Walt", full:"Walt Brannigan", role:"Director",
    blurb:"Runs the booth. Has directed live TV through two fires and a loose bear. Has never raised his voice."},
  lenny:{n:"Lenny", full:"Lenny Sparks", role:"Bandleader",
    blurb:"Sunglasses indoors, year round. Will vamp on one chord for as long as it takes to save you."},
  chuck:{n:"Chuck", full:"Chuck Dooley", role:"Staff writer and recurring weirdo",
    blurb:"Performs characters no one asked for. About half the time, he's a genius."}
};
const NAMES = {ratings:"Ratings",patience:"Network Patience",morale:"Staff Morale",weird:"Weirdness",control:"Tower Control",walt:"Walt",lenny:"Lenny",chuck:"Chuck"};

const CHUCK_CHARS = ["The Man Who Lives in the Air Vent","Uncle Grizzle, the 400 Year Old Fur Trapper","The Fella Who Never Blinks","Professor Gravy, Expert on Everything","Captain Sideways, Who Only Walks Sideways","Your Long Lost Twin, Ronald"];

const CREW_QUIPS = {
  great:[["walt","Clean show. Mostly. I'll take it."],["lenny","Man, that was a groove. That was a GROOVE."],["chuck","I told you the air vent guy would work. Nobody listens to me."]],
  ok:[["walt","Camera three caught your bad side twice. On purpose."],["lenny","Not bad, chief. The horns were feeling it."],["chuck","I had a better ending but nobody asked."]],
  bad:[["walt","Well. Nobody died."],["lenny","Hey, we'll always have the theme song."],["chuck","I've been in worse. I once did dinner theater in Delaware."]]
};

const BITS = [
  {name:"Bodega Taste Test", d:"Blindfolded audience members rate mystery snacks from the corner store.", w:5, base:.62,
   win:"A woman from Yonkers identifies a 1979 snack cake by smell alone. Standing ovation.", lose:"Everyone just says \"tastes like a snack.\" Twelve times."},
  {name:"Elevator Theater", d:"Hidden cameras in the elevator while you perform Shakespeare for strangers.", w:15, base:.5,
   win:"An accountant headed to 22 joins in as Mercutio. He's incredible. He's also late for a meeting.", lose:"Everyone takes the stairs. The camera captures four minutes of an empty elevator."},
  {name:"Crank Call the Chairman", d:"Phone Consolidated Electric's chairman live to ask if his refrigerator is running.", w:10, base:.48, pat:-8,
   win:"He actually checks. It is running. It's one of HIS refrigerators. The audience loses its mind.", lose:"His secretary puts you on hold. The hold music plays for a full segment."},
  {name:"Hydraulic Press Hour", d:"Crush household items with an industrial press borrowed from a guy in New Jersey.", w:12, base:.56,
   win:"The bowling ball does not crush. The press does. Sparks. Glory.", lose:"It's mostly slow squishing of grapefruit. Very slow."},
  {name:"Rate My Pigeon", d:"Viewers bring pigeons from Central Park. You judge them on poise and attitude.", w:20, base:.45,
   win:"A pigeon named Sal walks the desk like a runway model. A star is born.", lose:"All six pigeons escape into the rafters. They live there now."},
  {name:"Intern Cam", d:"Strap a camera to an intern and send him to buy hot dogs in Times Square.", w:10, base:.56, mor:-3,
   win:"He accidentally walks into a Broadway rehearsal and gets cast.", lose:"The feed is mostly the intern's thumb and the word \"sorry.\""},
  {name:"The Grievance Mailbag", d:"Read the angriest viewer letters aloud, in full, with dramatic music.", w:4, base:.62,
   win:"A letter from Ohio is nine pages about your tie. The crowd chants the last line with you.", lose:"Angry letters turn out to be mostly sad. The room gets quiet."},
  {name:"Hallway Bowling", d:"Ten pins at the end of the 6th floor hallway. The ball goes through the newsroom.", w:14, base:.5,
   win:"Strike! The weatherman catches a gutter ball live on the news feed downstairs.", lose:"The ball rolls into the elevator. The doors close. It's gone."},
  {name:"Ask the Night Watchman", d:"The building's overnight security guard answers viewer questions about life, love, and parking.", w:8, base:.55,
   win:"\"Should I marry her?\" \"Does she have a car?\" Wisdom. Pure wisdom.", lose:"He falls asleep on the second question. Gently snoring. For a while."},
  {name:"Fruitcake Forensics", d:"A lab coat, a magnifying glass, and the oldest fruitcake in Manhattan.", w:9, base:.55,
   win:"Carbon dating places it in the Eisenhower administration. It is still moist. Somehow.", lose:"It's just a fruitcake. You stare at it. It stares back."},
  {name:"Weather From the Broom Closet", d:"Do the forecast from a supply closet with a flashlight and a mop.", w:11, base:.52,
   win:"\"Partly mop-py with a chance of bucket.\" Somehow the forecast is accurate.", lose:"The closet door locks behind you. The rest of the segment is muffled."},
  {name:"Stuff We Found in the Couch", d:"Dig through the green room couch on camera and appraise everything you find.", w:7, base:.58,
   win:"A 1961 subway token, a single earring, and what appears to be a love letter to a sportscaster.", lose:"Mostly crumbs. Expensive crumbs, says Chuck. Nobody laughs."}
];
const BRING_BACK_BONUS = 3;

const CAST = [
  {id:"harold", name:"Harold Pinkney", tag:"Mailroom clerk, age 74",
   d:"A retired bank clerk from the Bronx who works in the mailroom. Reads cue cards like ransom notes. Has no idea he's funny.",
   disc:"In the mailroom, a tiny old man in a too-big suit is reading a package label aloud with enormous solemnity: \"Fourth. Floor. Accounting.\" Two of your writers are crying with laughter in the hallway.",
   open:"Harold introduces the show",
   win:["\"Ladies and gentlemen. The. Show.\" Harold forgets your name halfway through and just points at you. Standing ovation.","Harold reads the cue card, pauses, then reads the back of the cue card too. The crowd chants his name."],
   lose:["Harold reads the stage directions out loud. All of them. It takes a while.","Harold gets stage fright and just waves for 30 seconds. It's sweet. It's not funny."]},
  {id:"rosa", name:"Rosa Delvecchio", tag:"Lobby deli owner",
   d:"Runs the deli in the lobby. Has opinions about every celebrity and every sandwich, and shares both loudly.",
   disc:"You go down for a sandwich and Rosa, behind the counter, is loudly reviewing your show to a line of customers. \"The monologue? Eh. Like a pastrami with no mustard.\"",
   open:"Rosa reviews last night's show",
   win:["\"Last night? A good show. Seven out of ten. Like a nice rye. Not great rye, but rye.\" The audience loves her.","Rosa grades your guests like cold cuts. Your last guest is \"bologna.\" The crowd howls."],
   lose:["Rosa spends the whole segment talking about her nephew's divorce.","Rosa is mad at you about something you said off camera. She won't say what."]},
  {id:"stu", name:"Stu Rinaldi", tag:"Stage manager",
   d:"Your stage manager. Gruff, from Staten Island, and terrified of cameras. Which is why you keep pointing them at him.",
   disc:"During a commercial break, Walt accidentally puts Stu on the monitor as he's yelling at a light stand. The audience sees it and cheers. Stu freezes like a deer.",
   open:"Point the camera at Stu",
   win:["Stu, cornered, gives the funniest two-word weather report in history: \"It's cold.\" Applause break.","Stu attempts a dance to get the camera off him. It does not work. It's magnificent."],
   lose:["Stu simply walks out of frame. The camera follows. He walks out of the building.","Stu stares into the lens in pure silent anger. It's actually a bit scary."]}
];

const GRAVES = {name:"Dr. Anselm Graves", d:"Recurring guest. A gaunt philosopher in a black turtleneck who delivers furious, gloomy monologues about the void, then politely thanks you for having him.", t:"odd", cult:true};

const GUESTS = [
  {name:"Rhonda Vale", d:"Soap opera star promoting her perfume, \"Midnight Regret.\"", t:"charming"},
  {name:"Prof. Hal Brisket", d:"Zoologist who brought a lemur named Gerald. Gerald bites.", t:"odd"},
  {name:"Teddy Strand", d:"Method actor still fully in character as a 19th century lighthouse keeper.", t:"volatile"},
  {name:"The Fax Machines", d:"New wave band from Hoboken. They only speak in synth noises.", t:"odd"},
  {name:"Gus Ferro", d:"Retired astronaut. Walked in space. Talks like a dial tone.", t:"dull"},
  {name:"Dot Kowalski", d:"Competitive speed eater. Holds the record for pierogi.", t:"charming"},
  {name:"Sen. Bud Calloway", d:"Senator turned thriller novelist. His book is 900 pages.", t:"dull"},
  {name:"Vivian Crane", d:"Famously difficult film star. Has walked off three talk shows this year.", t:"volatile"},
  {name:"Marty Glick", d:"Your old stand-up buddy from the comedy club days. Still owes you $40.", t:"charming"}
];
const INTERVIEW = {
  charming:{straight:.75,needle:.5,rails:.55}, dull:{straight:.35,needle:.55,rails:.6},
  volatile:{straight:.5,needle:.6,rails:.4}, odd:{straight:.3,needle:.45,rails:.72}
};
const IV_LINES = {
  straight:{win:["{g} opens up with a genuinely great story. The audience leans in.","{g} is warm, funny, and makes you look good. TV magic."],
            lose:["{g} answers in one word. Then another one word. You can hear the clock.","You ask about the project. {g} talks about the project. For a while."]},
  needle:{win:["You tease {g} and they fire right back. It's a real tennis match.","{g} cracks under the needling and laughs so hard they cry."],
          lose:["{g} does not find that funny. The temperature drops 20 degrees.","The jab lands wrong. {g} stares at you. The audience goes \"ooooh.\""]},
  rails:{win:["You abandon the cards and ask {g} to help rearrange the desk. Best segment of the year.","You and {g} start a fake infomercial for nothing. Lenny's band joins in."],
         lose:["You go off the rails. {g} does not come with you. You're alone out there.","The chaos becomes noise. Walt says, calmly, over the headset: \"What is happening.\""]}
};

const NOTES = [
  {name:"Sponsor Panic", d:"Sudsy Spree laundry flakes is furious that you called their jingle \"a hostage situation.\"",
   a:[{t:"Apologize on air",d:"Contrite. Sincere. Deeply boring.",fx:{patience:8,ratings:-3,weird:-5}},
      {t:"Do a whole bit about laundry",d:"Double down, with props.",fx:{weird:8,patience:-10,ratings:4}}]},
  {name:"The Nephew", d:"A vice president's nephew wants to perform his magic act tonight. He does one trick. It is a coin.",
   a:[{t:"Give him two minutes",d:"Keeps the suits happy.",fx:{patience:10,ratings:-4,morale:-3}},
      {t:"Politely refuse",d:"The writers will love you for it.",fx:{patience:-8,morale:6}}]},
  {name:"Cooking Segment", d:"Research says women 25 to 54 love cooking. The network wants a cooking segment. Tonight.",
   a:[{t:"Do it by the book",d:"A nice frittata. Very wholesome.",fx:{patience:6,weird:-4}},
      {t:"Cook everything with a blowtorch",d:"Technically still cooking.",fx:{weird:10,ratings:3,patience:-5}}]},
  {name:"Standards & Practices", d:"The network censor has flagged the word \"spatula\" in tonight's script. Nobody knows why.",
   a:[{t:"Cut it",d:"Pick your battles.",fx:{patience:5,morale:-3,chuck:-3}},
      {t:"Say \"spatula\" eleven times",d:"Pick this battle.",fx:{ratings:5,weird:6,patience:-10,morale:4,chuck:4}}]},
  {name:"Budget Cuts", d:"Accounting wants to cut the band's overtime. Lenny is standing right behind the suit, listening.",
   a:[{t:"Let it go",d:"The network notices you're a team player.",fx:{patience:8,morale:-6,lenny:-12}},
      {t:"Pay the band yourself",d:"Your accountant sighs audibly.",fx:{morale:6,lenny:10}}]},
  {name:"Focus Group", d:"A focus group in Phoenix described you as \"smug\" and \"possibly a raccoon in a suit.\"",
   a:[{t:"Smile more",d:"Be likable. Be normal. Be someone else.",fx:{patience:6,weird:-6,morale:-2}},
      {t:"Read the report on air",d:"Including the raccoon part.",fx:{ratings:6,weird:5,patience:-8}}]},
  {name:"The Memo About Walt", d:"The network wants to replace Walt with a younger director who \"understands MTV.\"",
   a:[{t:"Go to bat for Walt",d:"Threaten to walk.",fx:{patience:-10,walt:15,morale:5}},
      {t:"Stay out of it",d:"Walt hears about it anyway. Walt hears about everything.",fx:{patience:4,walt:-15}}]},
  {name:"Chuck's Pitch", d:"Chuck wants to perform a 12 minute one-man opera about his landlord. The network wants it killed.",
   a:[{t:"Let Chuck have his opera",d:"Give him four minutes. He'll take six.",fx:{chuck:12,weird:8,patience:-6}},
      {t:"Kill it",d:"Chuck goes very quiet.",fx:{chuck:-10,patience:5}}]}
];

const DISASTERS = [
  {name:"Blackout", d:"Halfway through the show, the studio lights die. Only the exit signs and the band's amps still work.",
   a:[{t:"Do the show by flashlight",d:"Commit to the spooky.",chance:.6,win:{ratings:8,weird:6},lose:{ratings:-4},wt:"The flashlight interview becomes a ghost story. Iconic.",lt:"Mostly the audience sees your chin, lit from below."},
      {t:"Go to commercial and wait",d:"Play it safe.",fx:{ratings:-3}}]},
  {name:"The Heckler", d:"A man in row three keeps yelling \"DO THE THING!\" Nobody knows what the thing is.",
   a:[{t:"Bring him on stage",d:"Let him do the thing.",chance:.55,win:{ratings:7,weird:5},lose:{ratings:-5,morale:-2},wt:"The thing is a perfect impression of a city bus. He gets a recurring spot.",lt:"The thing is just yelling, but closer to the microphone."},
      {t:"Ignore him",d:"He'll get tired. Eventually.",fx:{ratings:-2}}]},
  {name:"Crossed Wires", d:"The stage manager's headset is picking up a taxi dispatcher in Queens, and it's playing through the house speakers.",
   a:[{t:"Put the dispatcher on the show",d:"Her name is Lorraine. She has opinions.",fx:{weird:6,ratings:5}},
      {t:"Unplug everything",d:"Silence. Professionalism.",fx:{morale:-1}}]},
  {name:"Cue Card Chaos", d:"The cue card guy tripped. Every card is out of order and one is a lunch menu.",
   a:[{t:"Read them in whatever order",d:"Including the menu.",chance:.55,win:{ratings:6,weird:4},lose:{ratings:-4},wt:"\"Our next guest... tuna melt, $3.25.\" The room loses it.",lt:"It sounds like you're having a medical event. A nurse is sent, as a precaution."},
      {t:"Stall with desk drumming",d:"Buy time while they re-sort.",fx:{ratings:-2,morale:-2}}]},
  {name:"Loose Pigeon", d:"A pigeon has gotten into the studio and landed on camera two.",
   a:[{t:"Make it the new co-host",d:"Give it a name tag.",chance:.6,win:{ratings:6,weird:8},lose:{weird:4,ratings:-3},wt:"\"Lenny Jr.\" nods at all the right moments. The audience adores him.",lt:"The pigeon is not a professional. The pigeon does what pigeons do."},
      {t:"Have the crew catch it",d:"This could take a while.",fx:{ratings:-2,morale:-2}}]},
  {name:"Security Retaliation", d:"Building security, still mad about your raids, has \"accidentally\" locked the band out of the studio.", needsClaim:true,
   a:[{t:"Do the show a cappella",d:"You hum the theme. Badly.",chance:.5,win:{ratings:7,weird:5},lose:{ratings:-4,lenny:-4},wt:"The audience hums along. It's weirdly moving. Lenny watches from the hallway window, proud.",lt:"Your humming is not good. Lenny can hear it through the door. He's wincing."},
      {t:"Apologize to the head of security",d:"On air. With a fruit basket.",fx:{patience:4,ratings:-2,control:-6}}]}
];

const MONOLOGUE = [
  {t:"Topical jokes",d:"Headlines from today's paper. Reliable.",chance:.65,win:{ratings:4},lose:{ratings:-2},wt:"Solid. The jokes about the mayor really land.",lt:"The jokes are fine. The audience is fine. Everything is fine."},
  {t:"Roast yourself",d:"Your hair, your apartment, your sad sandwich.",chance:.6,win:{ratings:5,morale:2},lose:{ratings:-3},wt:"The sandwich material kills. You'll be hearing about it for weeks.",lt:"Self-deprecation curdles into something closer to a confession."},
  {t:"Take shots at Consolidated Electric",d:"The parent company makes toasters and also owns your show.",chance:.55,win:{ratings:7,patience:-6,weird:3},lose:{ratings:-2,patience:-8},wt:"\"They make jet engines, refrigerators, and THIS show. Guess which one has the most hot air.\" The crowd roars. Upstairs, an executive does not.",lt:"Only the crew laughs. And the executive is watching from the wings."}
];

const FLOORS = [
  {id:"news",f:"3",name:"UBC Nightly News",d:"Anchor Grant Wexley, the most serious man in America, is mid-broadcast.",def:.5,
   win:"You stroll into frame behind Wexley holding a sign that says HI MOM. He doesn't flinch. He just says \"...and in other news\" and points at you. Legendary.",
   lose:"Wexley's floor manager tackles you before you clear the door. The tackle is excellent. Walt gets it from three angles."},
  {id:"soap",f:"5",name:"\"Hearts of Hartford\" (soap taping)",d:"An evil twin is about to be revealed.",def:.4,
   win:"You burst in at the exact moment of the reveal, claiming to be the evil twin's evil twin. The cast plays along. The soap writes you in.",
   lose:"You burst in at the wrong moment. It's a funeral scene. The widow throws a lamp."},
  {id:"game",f:"8",name:"\"Spin for Cash\" (game show)",d:"A giant wheel and a host with alarmingly white teeth.",def:.35,
   win:"You spin the wheel yourself and win a dinette set. The contestant gets to keep it. The audience treats you like a folk hero.",
   lose:"The host keeps smiling the entire time security removes you. He never stops smiling. It's unsettling."},
  {id:"sports",f:"12",name:"Weekend Sports Desk",d:"Two guys in blazers arguing about the Mets.",def:.45,
   win:"You take over the desk and do a full play-by-play of the hallway vending machine. The guys in blazers join in as color commentators.",
   lose:"You don't know enough about the Mets. They can tell. It's humiliating."},
  {id:"kids",f:"17",name:"\"Captain Kazoo's Clubhouse\"",d:"A kids' show with a moose puppet who has clearly seen things.",def:.4,
   win:"You and the moose puppet have a quiet, heartfelt talk about the meaning of life. Parents across America weep.",
   lose:"The moose puppet's operator is a former Marine. The moose escorts you out personally."},
  {id:"acct",f:"22",name:"Accounting Department",d:"Not a show. Just forty people with calculators who hate you.",def:.3,
   win:"You lead the whole department in a conga line past the expense reports. Morale in Accounting is up 400 percent.",
   lose:"They audit you. On the spot. Turns out you owe the network $14."},
  {id:"power",f:"30",name:"The Power Room",d:"The building's main electrical controls, guarded by a man named Sully.",def:.55,perk:true,
   win:"You bring Sully a meatball sub. Sully is now your best friend. Sully shows you which switch does what. You now control the lights in the entire Tower.",
   lose:"Sully does not want a meatball sub. Sully wants you to leave. Sully is very large."},
  {id:"exec",f:"52",name:"The Executive Suite",d:"Where Consolidated Electric's chairman eats his lunch. Only reachable once you control three floors.",def:.6,boss:true,
   win:"You walk in with Walt's cameras rolling and sit at the head of the boardroom table. You announce a new company policy: free hot dogs. The chairman, stunned, says \"...fine.\" You own this building now.",
   lose:"The chairman's assistant stops you with one look. You've never been so scared. The elevator ride down takes a lifetime."}
];

const DROPS = [
  {n:"Watermelon",s:8,b:3,d:"The classic. A summer splat."},
  {n:"Bowling ball",s:1,b:9,d:"Won't splat. Will dent the planet."},
  {n:"Console TV set",s:3,b:10,d:"A 1974 Zenith with wood paneling.",hz:.1},
  {n:"30 lbs of lime gelatin",s:10,b:1,d:"Molded into the shape of a chairman."},
  {n:"Industrial jar of mayonnaise",s:9,b:4,d:"Five gallons. Restaurant size."},
  {n:"Accordion",s:2,b:6,d:"Plays one final, glorious chord on the way down.",bonus:2},
  {n:"Mattress",s:0,b:1,d:"Chuck swears it will be funny."},
  {n:"Crate of eggs",s:9,b:2,d:"Twelve dozen. Grade A."},
  {n:"Vacuum cleaner",s:2,b:7,d:"Still plugged into an extension cord."},
  {n:"Paint-filled water balloons",s:10,b:2,d:"Twenty of them. Every color."},
  {n:"Pinata full of ketchup packets",s:9,b:5,d:"A party for the sidewalk."},
  {n:"Upright piano",s:4,b:10,d:"Bought from a church in Queens. Lenny objects.",hz:.15,lenny:-5}
];
const HAZARDS = [
  {t:"It lands squarely on a parked Lincoln. The Lincoln belongs to a Consolidated Electric vice president.",fx:{patience:-12,ratings:5}},
  {t:"It clips a hot dog cart. The vendor is unharmed and absolutely furious. He's suing. He's also now a fan.",fx:{ratings:3,morale:-2}},
  {t:"It splatters a tour group from Ohio. They LOVED it. They're telling everyone back home.",fx:{ratings:4}}
];
