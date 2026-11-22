/* Late Night Live: The RPG. (c) 2026 Necklar. All rights reserved. */
/* Handcrafted content */
const EPISODES = 8;
const STATS = [
  {k:"ratings", n:"Ratings", c:"var(--gold)"},
  {k:"patience", n:"Network Patience", c:"var(--blue)"},
  {k:"campus", n:"Campus Buzz", c:"#b98cff"},
  {k:"morale", n:"Staff Morale", c:"var(--green)"},
  {k:"weird", n:"Weirdness", c:"var(--pink)"},
  {k:"control", n:"Tower Control", c:"var(--orange)"}
];
const CREW = {
  arnie:{n:"Arnie", full:"Arnie Weintraub", role:"Executive Producer",
    blurb:"Thirty years in television. Handles the network, the budget and the guests' agents. Worries about every stunt."},
  walt:{n:"Walt", full:"Walt Brannigan", role:"Director",
    blurb:"Directed UBC's original late night show in the 1950s. Runs the control room. Says very little."},
  lenny:{n:"Lenny", full:"Lenny Sparks", role:"Bandleader",
    blurb:"Leads the house band and trades banter with you during the show."},
  chuck:{n:"Chuck", full:"Chuck Dooley", role:"Staff Writer and Performer",
    blurb:"Writes for the show and performs recurring characters on air."},
  stu:{n:"Stu", full:"Stu Rinaldi", role:"Stage Manager",
    blurb:"Runs the studio floor, warms up the audience and does on-camera field pieces."}
};
const NAMES = {ratings:"Ratings",patience:"Network Patience",campus:"Campus Buzz",morale:"Staff Morale",weird:"Weirdness",control:"Tower Control",
  arnie:"Arnie",walt:"Walt",lenny:"Lenny",chuck:"Chuck",stu:"Stu"};

const CHUCK_CHARS = ["The Man Who Lives in the Air Vent","Uncle Grizzle, the 400 Year Old Fur Trapper","The Fella Who Never Blinks","Professor Gravy, Expert on Everything","Captain Sideways","Your Long Lost Twin, Ronald"];

/* Crew dialogue after each show, by how the episode went */
const CREW_QUIPS = {
  great:[["walt","Fine."],["lenny","That was a good one, chief."],["chuck","I told you the air vent guy would work."],["stu","Audience didn't want to leave. I had to turn the lights up."],["arnie","The network called. They were polite. That never happens."]],
  ok:[["walt","Camera three was late. That's on me."],["lenny","Not bad. The horns were feeling it."],["chuck","I had a better ending but nobody asked."],["stu","Solid crowd. A little quiet in the back."],["arnie","Fine. It was fine. Get some sleep."]],
  bad:[["walt","We got it on tape."],["lenny","We'll always have the theme song."],["chuck","I've been in worse. I once did dinner theater in Delaware."],["stu","Half the audience left before the guest. I counted."],["arnie","Don't read the papers tomorrow. I'll read them for you."]]
};

/* Bits: plain descriptions and plain results */
const BITS = [
  {name:"Bodega Taste Test", d:"Blindfolded audience members taste snacks from the corner store and guess what they are.", w:5, base:.62,
   win:"Three audience members guessed every snack correctly. The audience laughed and applauded.", lose:"No one could identify the snacks. The audience was quiet."},
  {name:"Elevator Theater", d:"Hidden cameras in the building's elevator while you perform scenes from Shakespeare for people riding it.", w:15, base:.5,
   win:"An accountant joined in and performed a full scene with you. The audience applauded.", lose:"Most people took the stairs. The footage was mostly an empty elevator."},
  {name:"Crank Call the Chairman", d:"Call the chairman of Consolidated Electric live on the air.", w:10, base:.48, pat:-8,
   win:"The chairman picked up and played along for two minutes. The audience applauded.", lose:"His secretary put you on hold for the rest of the segment."},
  {name:"Hydraulic Press Hour", d:"Crush household items with a hydraulic press borrowed from a shop in New Jersey.", w:12, base:.56,
   win:"The bowling ball broke the press. The audience cheered.", lose:"The items crushed slowly and without much effect. The audience lost interest."},
  {name:"Rate My Pigeon", d:"Viewers bring pigeons from Central Park and you rate them.", w:20, base:.45,
   win:"One pigeon walked the length of the desk on cue. The audience cheered.", lose:"All six pigeons flew into the rafters. The segment ended early."},
  {name:"Intern Cam", d:"An intern wears a camera on his head and goes to buy hot dogs in Times Square.", w:10, base:.56, mor:-3,
   win:"The intern was pulled into a Broadway rehearsal on the way. The audience laughed throughout.", lose:"The camera was pointed at the sidewalk for most of the trip."},
  {name:"The Grievance Mailbag", d:"Read the angriest viewer letters out loud, in full.", w:4, base:.62,
   win:"The longest letter was nine pages about your tie. The audience laughed throughout.", lose:"Most of the letters were sad rather than angry. The audience was quiet."},
  {name:"Hallway Bowling", d:"Set up bowling pins at the end of the sixth floor hallway.", w:14, base:.5,
   win:"You rolled a strike on the first try. The audience cheered.", lose:"The ball rolled into the elevator and the doors closed. The segment ended."},
  {name:"Ask the Night Watchman", d:"The building's overnight security guard answers viewer questions.", w:8, base:.55,
   win:"His answers were short and direct. The audience laughed at each one.", lose:"He fell asleep during the second question."},
  {name:"Fruitcake Forensics", d:"Examine the oldest fruitcake in Manhattan with a lab coat and a magnifying glass.", w:9, base:.55,
   win:"A lab confirmed the fruitcake was from 1957. The audience applauded.", lose:"There was not much to find. The audience was quiet."},
  {name:"Weather From the Broom Closet", d:"Do a weather forecast from inside a supply closet.", w:11, base:.52,
   win:"The forecast turned out to be accurate. The audience laughed and applauded.", lose:"The closet door locked. The rest of the segment was muffled."},
  {name:"Stuff We Found in the Couch", d:"Search the green room couch on camera and appraise what you find.", w:7, base:.58,
   win:"You found a 1961 subway token and a letter addressed to a sportscaster. The audience laughed.", lose:"You found mostly crumbs. The audience was quiet."}
];
const BRING_BACK_BONUS = 3;

/* Discoverable regulars from around the building */
const CAST = [
  {id:"harold", name:"Harold Pinkney", tag:"Mailroom clerk, age 74",
   d:"A retired bank clerk from the Bronx who works in the mailroom. Reads cue cards very slowly and very seriously.",
   disc:"In the mailroom, an older man is reading a package label aloud, one word at a time. Two of your writers are watching from the hallway and laughing.",
   open:"Harold introduces the show",
   win:["Harold read the introduction slowly and forgot your name. The audience applauded him for a full minute.","Harold read the front and back of the cue card. The audience chanted his name."],
   lose:["Harold read the stage directions out loud along with the introduction.","Harold froze and waved at the camera for thirty seconds."]},
  {id:"rosa", name:"Rosa Delvecchio", tag:"Lobby deli owner",
   d:"Runs the deli in the lobby. Has an opinion about every celebrity and every sandwich.",
   disc:"At the deli in the lobby, Rosa is reviewing last night's show to the customers in line. \"The monologue? Like a pastrami with no mustard.\"",
   open:"Rosa reviews last night's show",
   win:["Rosa gave last night's show a seven out of ten. The audience applauded.","Rosa compared each of your recent guests to a cold cut. The audience laughed throughout."],
   lose:["Rosa spent the segment talking about her nephew's divorce.","Rosa was upset about something you said off camera and would not discuss the show."]},
  {id:"earl", name:"Earl Tibbs", tag:"Newsstand owner on the corner",
   d:"Has run the newsstand outside the building for 31 years. Knows everyone who works in the Tower by name.",
   disc:"Outside the building, Earl from the newsstand is telling a tourist exactly which floor every show tapes on. He knows your schedule better than you do.",
   open:"Earl reads tonight's headlines",
   win:["Earl read the day's headlines with his own commentary. The audience laughed at each one.","Earl announced which of the Tower's employees owe him money. The audience cheered."],
   lose:["Earl read the headlines with no commentary at all.","Earl lost his place and read the sports scores twice."]}
];

/* Recurring guest */
const GRAVES = {name:"Dr. Anselm Graves", d:"Recurring guest. A philosopher in a black turtleneck who gives long, intense speeches about death and the void, then thanks you politely for having him.", t:"odd", cult:true};

/* Handcrafted guests */
const GUESTS = [
  {name:"Rhonda Vale", d:"Soap opera star. Plays a scheming heiress on daytime television. Promoting her new perfume.", t:"charming"},
  {name:"Prof. Hal Brisket", d:"Zoologist at the Bronx Zoo. Brought a lemur named Gerald. Gerald bites.", t:"odd"},
  {name:"Teddy Strand", d:"Method actor. Is staying in character as a 19th century lighthouse keeper for an upcoming film.", t:"volatile"},
  {name:"The Fax Machines", d:"New wave band from Hoboken. Answers questions only with synthesizer sounds.", t:"odd"},
  {name:"Gus Ferro", d:"Retired astronaut. Walked in space in 1969. Speaks in a flat monotone.", t:"dull"},
  {name:"Dot Kowalski", d:"Competitive eater. Holds the record for pierogi eaten in ten minutes.", t:"charming"},
  {name:"Sen. Bud Calloway", d:"Former senator. Has written a 900 page thriller novel.", t:"dull"},
  {name:"Vivian Crane", d:"Film star. Has walked off three talk shows this year.", t:"volatile"},
  {name:"Marty Glick", d:"Stand-up comedian. Came up with you at the comedy clubs. Still owes you $40.", t:"charming"}
];
const INTERVIEW = {
  charming:{straight:.75,needle:.5,rails:.55}, dull:{straight:.35,needle:.55,rails:.6},
  volatile:{straight:.5,needle:.6,rails:.4}, odd:{straight:.3,needle:.45,rails:.72}
};
const STYLE_NAMES = {straight:"Play it straight",needle:"Needle them",rails:"Go off the rails"};
const IV_LINES = {
  straight:{win:["{g} told a good story. The audience laughed and applauded.","{g} was relaxed and funny. The segment went well."],
            lose:["{g} gave short answers. The segment was slow.","{g} talked about their project at length. The audience lost interest."]},
  needle:{win:["You teased {g} and {g} teased you back. The audience laughed throughout.","{g} laughed at your jabs and played along. The audience applauded."],
          lose:["{g} did not like the teasing. The segment was tense.","One of your jabs offended {g}. The audience reacted with an \"ooh.\""]},
  rails:{win:["You put the cue cards away and {g} went along with it. The audience cheered.","You and {g} improvised a fake commercial. The audience laughed throughout."],
         lose:["You went off script and {g} did not follow. The segment fell apart.","The segment became confusing. The audience was quiet."]}
};

/* Network notes. "Have Arnie handle it" is added to every note in the game logic. */
const NOTES = [
  {name:"Sponsor Complaint", d:"Sudsy Spree laundry flakes is upset that you called their jingle \"a hostage situation\" on air.",
   a:[{t:"Apologize on air",d:"The sponsor is satisfied. Viewers may find it dull.",fx:{patience:8,ratings:-3,weird:-5}},
      {t:"Do a bit about laundry",d:"Bigger laughs. The sponsor will be angrier.",fx:{weird:8,patience:-10,ratings:4,campus:3}}]},
  {name:"The Nephew", d:"A network vice president's nephew wants to perform his magic act on tonight's show. He knows one trick.",
   a:[{t:"Give him two minutes",d:"Keeps the vice president happy.",fx:{patience:10,ratings:-4,morale:-3}},
      {t:"Say no",d:"The staff will appreciate it. The vice president will not.",fx:{patience:-8,morale:6}}]},
  {name:"Cooking Segment", d:"Network research says viewers like cooking segments. They want one on tonight's show.",
   a:[{t:"Do a straight cooking segment",d:"The network is satisfied.",fx:{patience:6,weird:-4}},
      {t:"Cook everything with a blowtorch",d:"Funnier, and riskier with the network.",fx:{weird:10,ratings:3,patience:-5,campus:3}}]},
  {name:"Standards and Practices", d:"The network censor has flagged the word \"spatula\" in tonight's script without explanation.",
   a:[{t:"Cut it",d:"No conflict with the network.",fx:{patience:5,morale:-3,chuck:-3}},
      {t:"Say \"spatula\" eleven times",d:"The writers will love it. The censor will not.",fx:{ratings:5,weird:6,patience:-10,morale:4,chuck:4,campus:4}}]},
  {name:"Budget Cuts", d:"Accounting wants to cut the band's overtime pay.",
   a:[{t:"Accept the cut",d:"Saves the network money. The band will be unhappy.",fx:{patience:8,morale:-6,lenny:-12}},
      {t:"Pay the band yourself",d:"Costs you personally. Keeps the band happy.",fx:{morale:6,lenny:10}}]},
  {name:"Focus Group", d:"A focus group in Phoenix described you as \"smug.\"",
   a:[{t:"Smile more",d:"The network will like it. The show gets more conventional.",fx:{patience:6,weird:-6,morale:-2,campus:-3}},
      {t:"Read the report on air",d:"Viewers will enjoy it. The network will not.",fx:{ratings:6,weird:5,patience:-8,campus:5}}]},
  {name:"The Director", d:"The network wants to replace Walt with a younger director.",
   a:[{t:"Defend Walt",d:"Costs you with the network.",fx:{patience:-10,walt:15,morale:5}},
      {t:"Stay out of it",d:"Walt will find out.",fx:{patience:4,walt:-15}}]},
  {name:"Video Game Sponsor", d:"A home video game company will sponsor the show for a month if you play their new game on the air.",
   a:[{t:"Play it on the air",d:"The network gets a sponsor. Some viewers will see it as an ad.",fx:{patience:6,weird:-2,campus:2}},
      {t:"Turn it down",d:"The staff will respect it. The network will not.",fx:{patience:-6,morale:3}}]},
  {name:"Chuck's Opera", d:"Chuck wants to perform a twelve minute opera about his landlord. The network wants it cut.",
   a:[{t:"Let Chuck do it",d:"Chuck will be happy. The network will not.",fx:{chuck:12,weird:8,patience:-6,campus:4}},
      {t:"Cut it",d:"Chuck will be disappointed.",fx:{chuck:-10,patience:5}}]}
];

/* Network crisis: what happens when patience runs out but ratings are good */
const CRISES = [
  {name:"The network wants changes", d:"The network has run out of patience. Because your ratings are good, they are not cancelling the show. Instead they are demanding changes.",
   a:[{t:"Send Arnie to negotiate",d:"Depends on how much Arnie trusts you.",arnie:true},
      {t:"Agree to their demands",d:"Patience is restored. The show becomes safer and less interesting.",fx:{patience:30,weird:-10,campus:-6,morale:-6},r:"You agree to the network's list of changes. Several bits are cut for the rest of the season."},
      {t:"Call their bluff",d:"Works better the higher your ratings are.",bluff:true}]}
];

const DISASTERS = [
  {name:"Blackout", d:"The studio lights go out halfway through the show. The exit signs and the band's amplifiers still have power.",
   a:[{t:"Keep going by flashlight",d:"Risky.",chance:.6,win:{ratings:8,weird:6,campus:4},lose:{ratings:-4},wt:"You did the interview by flashlight. The audience stayed and applauded.",lt:"The audience could not see much. Several people left."},
      {t:"Go to commercial and wait",d:"Safe.",fx:{ratings:-3},r:"You went to commercial. The lights came back after eight minutes."}]},
  {name:"Heckler", d:"A man in the third row keeps shouting \"Do the thing!\" No one knows what he means.",
   a:[{t:"Bring him on stage",d:"Risky.",chance:.55,win:{ratings:7,weird:5,campus:3},lose:{ratings:-5,morale:-2},wt:"He did an impression of a city bus. The audience cheered.",lt:"He shouted into the microphone. Security walked him out."},
      {t:"Ignore him",d:"Safe.",fx:{ratings:-2},r:"He stopped shouting after ten minutes."}]},
  {name:"Crossed Wires", d:"Stu's headset is picking up a taxi dispatcher in Queens, and it is playing through the studio speakers.",
   a:[{t:"Put the dispatcher on the show",d:"Her name is Lorraine.",fx:{weird:6,ratings:5,campus:3},r:"You talked to Lorraine for three minutes. The audience laughed throughout."},
      {t:"Unplug everything",d:"Safe.",fx:{morale:-1},r:"The engineers fixed the problem in five minutes."}]},
  {name:"Cue Cards Out of Order", d:"The cue card handler dropped the cards. They are out of order and one is a lunch menu.",
   a:[{t:"Read them in whatever order",d:"Risky.",chance:.55,win:{ratings:6,weird:4,campus:4},lose:{ratings:-4},wt:"You read the lunch menu as if it were a joke. The audience laughed.",lt:"The monologue made no sense. The audience was confused."},
      {t:"Stall while they re-sort",d:"Safe.",fx:{ratings:-2,morale:-2},r:"You stalled for two minutes while the cards were sorted."}]},
  {name:"Pigeon in the Studio", d:"A pigeon is in the studio and has landed on camera two.",
   a:[{t:"Make it part of the show",d:"Risky.",chance:.6,win:{ratings:6,weird:8,campus:3},lose:{weird:4,ratings:-3},wt:"The pigeon stayed on the desk for the rest of the segment. The audience cheered.",lt:"The pigeon made a mess on the desk. The segment was cut short."},
      {t:"Have the crew catch it",d:"Safe.",fx:{ratings:-2,morale:-2},r:"It took the crew ten minutes to catch the pigeon."}]},
  {name:"Security Retaliation", d:"Building security, angry about your raids, has locked the band out of the studio.", needsClaim:true,
   a:[{t:"Do the show without the band",d:"Risky.",chance:.5,win:{ratings:7,weird:5,campus:4},lose:{ratings:-4,lenny:-4},wt:"You hummed the theme music. The audience hummed along.",lt:"The show felt empty without the band."},
      {t:"Apologize to the head of security",d:"Safe. Costs you some control of the building.",fx:{patience:4,ratings:-2,control:-6},r:"You apologized on air. The band was let back in."}]}
];

const MONOLOGUE = [
  {t:"Topical jokes",d:"Jokes about today's headlines.",chance:.65,win:{ratings:4},lose:{ratings:-2},wt:"The topical jokes worked. The audience laughed.",lt:"The topical jokes got polite laughter."},
  {t:"Jokes about yourself",d:"Your apartment, your hair, your lunch.",chance:.6,win:{ratings:5,morale:2},lose:{ratings:-3},wt:"The jokes about yourself worked. The audience laughed.",lt:"The jokes about yourself did not land."},
  {t:"Jokes about Consolidated Electric",d:"The company that owns the network. Viewers will like it. The network will not.",chance:.55,win:{ratings:7,patience:-6,weird:3,campus:4},lose:{ratings:-2,patience:-8},wt:"The jokes about the parent company got the biggest laughs of the night. The network noticed.",lt:"Only the crew laughed. A network executive was watching from the wings."}
];

/* Floors of the UBC Tower that can be invaded */
const FLOORS = [
  {id:"news",f:"3",name:"UBC Nightly News",d:"Anchor Grant Wexley is in the middle of a live broadcast.",def:.5,
   win:"You walked into frame behind Wexley holding a sign. He kept reading the news. Your audience watched on the monitor and cheered.",
   lose:"A floor manager stopped you at the door. Walt got the footage from three angles."},
  {id:"soap",f:"5",name:"\"Hearts of Hartford\" (soap opera)",d:"The cast is taping a dramatic reveal scene.",def:.4,
   win:"You walked into the scene and the cast played along. Your audience cheered.",
   lose:"You walked into a funeral scene. One of the actors threw a lamp."},
  {id:"game",f:"8",name:"\"Spin for Cash\" (game show)",d:"A game show with a large prize wheel.",def:.35,
   win:"You spun the wheel and won a dinette set for the contestant. Your audience cheered.",
   lose:"Security removed you. The host kept smiling the entire time."},
  {id:"sports",f:"12",name:"Weekend Sports Desk",d:"Two sportscasters are taping a segment about the Mets.",def:.45,
   win:"You sat down at the desk and did play-by-play of the vending machine. The sportscasters joined in.",
   lose:"You did not know enough about the Mets. The sportscasters asked you to leave."},
  {id:"kids",f:"17",name:"\"Captain Kazoo's Clubhouse\"",d:"A children's show with a moose puppet.",def:.4,
   win:"You and the moose puppet had a calm conversation about life. Your audience applauded.",
   lose:"The puppeteer walked you out of the studio while still operating the moose."},
  {id:"acct",f:"22",name:"Accounting Department",d:"Not a show. About forty accountants at their desks.",def:.3,
   win:"You led the department in a conga line. Your audience cheered.",
   lose:"An accountant reviewed your expense reports on the spot. You owe the network $14."},
  {id:"power",f:"30",name:"The Power Room",d:"The building's main electrical controls. Guarded by an engineer named Sully.",def:.55,perk:true,
   win:"You brought Sully a meatball sub. He showed you which switches control which floors. You can now cut the lights on other shows.",
   lose:"Sully refused the sandwich and asked you to leave."},
  {id:"exec",f:"52",name:"The Executive Suite",d:"The offices of Consolidated Electric's chairman. Available once you control three floors.",def:.6,boss:true,
   win:"You walked in with cameras rolling and sat at the head of the boardroom table. The chairman agreed to your demands on camera.",
   lose:"The chairman's assistant stopped you at the door."}
];

const DROPS = [
  {n:"Watermelon",s:8,b:3,d:"The standard."},
  {n:"Bowling ball",s:1,b:9,d:"Will not splat. Will make a dent."},
  {n:"Console TV set",s:3,b:10,d:"A 1974 wood-paneled television.",hz:.1},
  {n:"30 lbs of lime gelatin",s:10,b:1,d:"Molded in a large bucket."},
  {n:"Industrial jar of mayonnaise",s:9,b:4,d:"Five gallons."},
  {n:"Accordion",s:2,b:6,d:"Makes a sound on the way down.",bonus:2},
  {n:"Mattress",s:0,b:1,d:"Chuck's suggestion."},
  {n:"Crate of eggs",s:9,b:2,d:"Twelve dozen."},
  {n:"Vacuum cleaner",s:2,b:7,d:"An old upright model."},
  {n:"Paint-filled water balloons",s:10,b:2,d:"Twenty of them."},
  {n:"Pinata full of ketchup packets",s:9,b:5,d:"About 500 packets."},
  {n:"Upright piano",s:4,b:10,d:"Bought from a church in Queens. Lenny objects.",hz:.15,lenny:-5}
];
const HAZARDS = [
  {t:"It landed on a parked Lincoln that belongs to a Consolidated Electric vice president.",fx:{patience:-12,ratings:5,campus:3}},
  {t:"It hit a hot dog cart. The vendor was not hurt and is demanding payment.",fx:{ratings:3,morale:-2}},
  {t:"It splattered a tour group from Ohio. They enjoyed it.",fx:{ratings:4}}
];

/* Stu's on-camera field pieces */
const STU_FIELD = [
  {t:"Stu visits a bowling alley in Queens",win:"Stu bowled with a league team and lost badly. The audience applauded him.",lose:"The bowling alley was closed. Stu reported from the parking lot."},
  {t:"Stu asks people in Times Square about the show",win:"Most people had never heard of the show. Stu told them all to watch. The audience laughed throughout.",lose:"No one would stop to talk to Stu."},
  {t:"Stu tries to get a table at a fancy restaurant",win:"Stu used your name and was seated next to the kitchen. The audience laughed.",lose:"The restaurant turned Stu away at the door."},
  {t:"Stu tours the Staten Island Ferry",win:"Stu interviewed the captain, who turned out to be a fan. The audience applauded.",lose:"Stu got seasick. The piece was cut short."},
  {t:"Stu covers a county fair in New Jersey",win:"Stu judged a pie contest and caused an argument. The audience laughed throughout.",lose:"It rained. Stu reported from inside a tent."}
];

/* Behind-the-scenes events (Larry Sanders side of the show) */
const BACKSTAGE = [
  {name:"Credit Dispute", who:"arnie", line:"Two of your writers both say they wrote tonight's bit. One of them is threatening to quit.",
   a:[{t:"Credit both writers",d:"Keeps the peace.",fx:{morale:3},r:"Both writers get credit. The argument ends."},
      {t:"Side with the senior writer",d:"The junior writer may leave.",fx:{morale:-4,chuck:2},r:"The junior writer leaves the meeting early and does not come back that day."}]},
  {name:"Agent Call", who:"arnie", line:"Tonight's guest's agent says the guest won't do the show unless you plug their project three times.",
   a:[{t:"Agree",d:"The guest stays. The segment will feel like an ad.",fx:{ratings:-2,patience:3},r:"You agree. The agent sends a thank-you basket."},
      {t:"Refuse",d:"The guest might walk.",chance:.6,win:{morale:3,campus:2},lose:{ratings:-4},wt:"The agent backs down. The guest does the show anyway.",lt:"The guest arrives late and in a bad mood."}]},
  {name:"Writer Talking to the Network", who:"arnie", line:"I found out one of your writers has been pitching his own show to the network behind your back.",
   a:[{t:"Fire him",d:"Sends a message. Hurts morale.",fx:{morale:-6,patience:3},r:"The writer is let go. The writers' room is quiet for the rest of the day."},
      {t:"Talk to him privately",d:"Might keep him loyal.",fx:{morale:3,arnie:-3},r:"You talk it out. He apologizes. Arnie thinks you were too soft."}]},
  {name:"Bad Review", who:"arnie", line:"There's a bad review of the show in this morning's paper. Don't read it.",
   a:[{t:"Read it on the air",d:"Viewers will enjoy it.",fx:{ratings:3,campus:4,arnie:-2},r:"You read the review on air. The audience laughed at every insult."},
      {t:"Don't read it",d:"Nothing changes.",fx:{arnie:3},r:"You don't read it. Arnie is relieved."}]},
  {name:"Dressing Room Demands", who:"arnie", line:"Tonight's guest wants fresh flowers, a specific seltzer and the dressing room repainted.",
   a:[{t:"Do all of it",d:"Costs money and time.",fx:{morale:-3,patience:-2},r:"The staff spends the afternoon repainting the dressing room."},
      {t:"Do the flowers and seltzer only",d:"A compromise.",fx:{},r:"The guest notices the walls but says nothing."}]},
  {name:"Burnout", who:"chuck", line:"The head writer has been here three nights straight. He fell asleep in the writers' room.",
   a:[{t:"Send him home for a night",d:"Better morale. Tonight's material may be thinner.",fx:{morale:6,ratings:-2},r:"He goes home. The other writers cover for him."},
      {t:"Ask him to push through",d:"Morale will drop.",fx:{morale:-6,ratings:2},r:"He stays. The jokes are fine. He is not."}]},
  {name:"The Network Asks Arnie to Report on You", who:"arnie", line:"The network asked me to keep tabs on you and report back. I'm telling you because I won't do it.",
   a:[{t:"Thank Arnie",d:"Your relationship with Arnie gets stronger.",fx:{arnie:8},r:"Arnie nods and goes back to his office."},
      {t:"Ask Arnie to feed them false information",d:"Risky if the network finds out.",chance:.6,win:{patience:6,arnie:4},lose:{patience:-10,arnie:-4},wt:"The network believes the reports.",lt:"The network figures it out. Arnie is called upstairs."}]},
  {name:"Publicist Swap", who:"arnie", line:"A publicist is offering a bigger star tonight if we drop our booked guest.",
   a:[{t:"Keep the original guest",d:"Loyal. No change.",fx:{morale:2},r:"You keep the original booking. Word gets around that you keep your word."},
      {t:"Take the bigger star",d:"Better ratings. The original guest will be upset.",fx:{ratings:4,patience:3,campus:-2,morale:-2},r:"The original guest is bumped. Their agent says they will never come back."}]},
  {name:"Cable", who:"arnie", line:"The network's research people are worried about cable. They want to know why anyone would stay up for us when cable has movies all night.",
   a:[{t:"Tell them the show is the reason",d:"Confident. The network may not like the tone.",fx:{patience:-2,campus:2,arnie:2},r:"Arnie passes the message along, slightly reworded."},
      {t:"Promise a movie parody segment",d:"The network is reassured.",fx:{patience:4,weird:-2},r:"The network is satisfied. The writers start on a movie parody."}]},
  {name:"TV Guide Listing", who:"arnie", line:"TV Guide needs a one-line description of the show for next week's listings.",
   a:[{t:"Write a straight description",d:"The network approves.",fx:{patience:3},r:"The listing reads: \"Comedy and conversation.\""},
      {t:"Write something strange",d:"Readers who notice will be curious. The network will not be pleased.",fx:{campus:4,patience:-2,weird:2},r:"The listing reads: \"Host attempts to locate his own desk.\" Several readers write in to ask what it means."}]},
  {name:"Stu's Request", who:"stu", line:"The floor crew wants a coffee machine on the studio floor. We've asked for six months.",
   a:[{t:"Buy it yourself",d:"The crew will be grateful.",fx:{stu:10,morale:3},r:"A coffee machine is installed on the studio floor that afternoon."},
      {t:"Tell Stu to ask Accounting again",d:"Nothing changes.",fx:{stu:-6},r:"Stu goes back to Accounting. They say no again."}]}
];

/* Campus Buzz milestones (high school and college viewers, 1982: word of mouth only) */
const CAMPUS_MILESTONES = [
  {at:25,t:"Kids at a few high schools in New Jersey are staying up past their bedtimes to watch the show."},
  {at:40,t:"At lunch tables, kids who stayed up are describing last night's show in detail to kids who missed it."},
  {at:55,t:"College radio stations are describing your segments on the air. A photocopied fan newsletter is going around the dorms."},
  {at:70,t:"Fan letters from students are arriving by the bag. Students are lining up outside the building for tickets. Advertisers who want young viewers have called the network.",fx:{patience:10}},
  {at:85,t:"A kid in Ohio whose family owns a VCR has taped every episode and holds viewings for friends after school. Kids who have never seen the show can quote it."}
];

/* Walt's cutaways: quick, unannounced camera switches during awkward moments */
const CUT_SHOTS = ["LENNY","STU","THE DRUMMER","AUDIENCE, ROW 3","THE DESK","STAGE LEFT","THE BAND","WIDE SHOT","THE CUE CARDS","THE EXIT SIGN"];
const CUT_REACTIONS = ["You stopped mid-sentence. The audience laughed.","You looked toward the control room. The audience laughed.","You lost your place for a moment. The audience laughed.","You started to speak, then didn't. The audience laughed.","You turned to see what was on the monitor. The audience laughed."];
