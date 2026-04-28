/* ── DEMO DATA ──────────────────────────────────────────
   Static seed data shown when the user is not signed in.
   Once authenticated, js/db.js loads the user's real data
   from Supabase and replaces these globals.
   ──────────────────────────────────────────────────── */

const trips = [
  { id: 'demo-italy', title:"Italy · Summer 2024", sub:"June 12 — July 3 · with Marco & Sarah", stats:{stops:6,days:21,photos:142,rec:8},
    stops:[
      {name:"Rome",emoji:"🇮🇹",date:"Jun 12–16",lat:41.9028,lng:12.4964,x:18,y:42,tags:["culture","food","✨ gem"],narration:"Rome doesn't ask for your attention — it commands it.",color:"red",pol:"🏛️",polcap:"Pantheon, dawn",rec:true},
      {name:"Florence",emoji:"🇮🇹",date:"Jun 17–20",lat:43.7696,lng:11.2558,x:28,y:30,tags:["art","food"],narration:"The Oltrarno neighborhood is where Florence actually lives.",color:"red",pol:"🌉",polcap:"Ponte Vecchio",rec:true},
      {name:"Cinque Terre",emoji:"🇮🇹",date:"Jun 21–23",lat:44.1461,lng:9.6439,x:16,y:24,tags:["hiking","coast"],narration:"Swam in water so clear it felt invented.",color:"gold",pol:"🏖️",polcap:"Vernazza trail",rec:true},
      {name:"Venice",emoji:"🇮🇹",date:"Jun 24–26",lat:45.4408,lng:12.3155,x:38,y:20,tags:["culture"],narration:"Worth two nights. Not more. Get completely lost.",color:"blue",pol:"🚣",polcap:"Early gondola"},
      {name:"Amalfi",emoji:"🇮🇹",date:"Jun 27–Jul 1",lat:40.6340,lng:14.6027,x:32,y:60,tags:["coast","food"],narration:"Drove the coast road at sunset. One of the best decisions of my life.",color:"gold",pol:"🌺",polcap:"Positano cliff",rec:true},
      {name:"Sicily",emoji:"🇮🇹",date:"Jul 1–3",lat:38.1157,lng:13.3615,x:46,y:72,tags:["food","culture"],narration:"The arancini at Mercato del Capo changed how I think about food.",color:"gold",pol:"🍊",polcap:"Palermo market",rec:true}
    ]
  },
  { id: 'demo-japan', title:"Japan · Spring 2024", sub:"March 28 — April 14 · solo", stats:{stops:5,days:17,photos:312,rec:11},
    stops:[
      {name:"Tokyo",emoji:"🇯🇵",date:"Mar 28–Apr 4",lat:35.6762,lng:139.6503,x:72,y:28,tags:["food","city"],narration:"Seven days and I could have stayed seven more.",color:"red",pol:"🗼",polcap:"Shinjuku midnight",rec:true},
      {name:"Kyoto",emoji:"🇯🇵",date:"Apr 5–8",lat:35.0116,lng:135.7681,x:60,y:38,tags:["temples","✨ gem"],narration:"Fushimi Inari before dawn. Nobody but foxes.",color:"gold",pol:"⛩️",polcap:"Fushimi 5am",rec:true},
      {name:"Nara",emoji:"🇯🇵",date:"Apr 9",lat:34.6851,lng:135.8050,x:62,y:44,tags:["nature"],narration:"The deer bowed back.",color:"red",pol:"🦌",polcap:"The famous bow",rec:true},
      {name:"Osaka",emoji:"🇯🇵",date:"Apr 10–12",lat:34.6937,lng:135.5022,x:58,y:46,tags:["food"],narration:"Takoyaki for every meal, no regrets.",color:"red",pol:"🌃",polcap:"Dotonbori",rec:true},
      {name:"Hakone",emoji:"🇯🇵",date:"Apr 13–14",lat:35.2324,lng:139.1072,x:68,y:34,tags:["nature","onsen"],narration:"Fuji appeared once, perfectly framed, then vanished.",color:"gold",pol:"🗻",polcap:"Fuji glimpse",rec:true}
    ]
  },
  { id: 'demo-portugal', title:"Portugal · Fall 2023", sub:"Sept 8–22 · with Jamie", stats:{stops:4,days:14,photos:87,rec:6},
    stops:[
      {name:"Lisbon",emoji:"🇵🇹",date:"Sept 8–12",lat:38.7223,lng:-9.1393,x:8,y:40,tags:["music","food"],narration:"Fado on a Tuesday in Alfama, wine for four euros.",color:"gold",pol:"🎸",polcap:"Fado in Alfama",rec:true},
      {name:"Sintra",emoji:"🇵🇹",date:"Sept 13",lat:38.7978,lng:-9.3876,x:6,y:38,tags:["castles"],narration:"Go early before the coaches arrive.",color:"red",pol:"🏰",polcap:"Pena Palace"},
      {name:"Porto",emoji:"🇵🇹",date:"Sept 14–18",lat:41.1579,lng:-8.6291,x:8,y:30,tags:["wine","✨ gem"],narration:"I preferred Porto to Lisbon and cannot fully explain why.",color:"gold",pol:"🌉",polcap:"Dom Luís dusk",rec:true},
      {name:"Algarve",emoji:"🇵🇹",date:"Sept 19–22",lat:37.0990,lng:-8.6733,x:10,y:52,tags:["coast","beach"],narration:"Kayaked through sea caves in water so cold it hurt.",color:"red",pol:"🏖️",polcap:"Piedade caves",rec:true}
    ]
  }
];

// Photo library (demo)
const photoList = [
  {id:1,e:"🏛️",loc:"Pantheon",time:"Jun 12",conf:"high",bg:"#2a1a0a"},
  {id:2,e:"🍕",loc:"Trastevere",time:"Jun 12",conf:"high",bg:"#1a2a0a"},
  {id:3,e:"☕",loc:"Campo de' Fiori",time:"Jun 13",conf:"high",bg:"#0a1a2a"},
  {id:4,e:"🌅",loc:"Pincio Hill",time:"Jun 13",conf:"high",bg:"#2a0a10"},
  {id:5,e:"🏺",loc:"Capitoline",time:"Jun 13",conf:"high",bg:"#2a1a1a"},
  {id:6,e:"🌙",loc:"Colosseum",time:"Jun 15",conf:"high",bg:"#0a0a2a"},
  {id:7,e:"🍷",loc:"Pigneto",time:"Jun 14",conf:"maybe",bg:"#0a2a1a"},
  {id:8,e:"🎭",loc:"Navona",time:"Jun 14",conf:"high",bg:"#1a0a1a"},
  {id:9,e:"🌿",loc:"Borghese",time:"Jun 16",conf:"high",bg:"#0a2a0a"},
  {id:10,e:"🗺️",loc:"Centro",time:"Jun 14",conf:"maybe",bg:"#1a0a2a"},
  {id:11,e:"🛵",loc:"Centro",time:"Jun 15",conf:"maybe",bg:"#0a2a2a"},
  {id:12,e:"🎶",loc:"Navona",time:"Jun 16",conf:"maybe",bg:"#2a0a2a"},
];

const plStopData = [
  {name:"Rome",ct:47,color:"#d4a017"},{name:"Florence",ct:38,color:"#e74c3c"},
  {name:"Cinque Terre",ct:29,color:"#3498db"},{name:"Venice",ct:22,color:"#7b5ea7"},
  {name:"Amalfi Coast",ct:54,color:"#27ae60"},{name:"Sicily",ct:31,color:"#e67e22"}
];

// Narration AI drafts (demo)
const narrDrafts = [
  `We arrived exhausted but the first espresso at a tiny bar near the Pantheon set the tone for everything. Rome doesn't ask for your attention — it commands it. The city moves at two speeds: the ancient, which barely moves at all, and the tourist current, which you learn to step sideways out of.\n\nFive days is not enough. We ate badly the first night and brilliantly the last, at Roscioli, where the cacio e pepe was so good it felt rude. The sunset from Pincio Hill with Marco and Sarah is something I keep returning to. Nobody said anything for a while. That was the right call.`,
  `Rome exists in layers — the ancient pressing through the modern like a fever dream of marble and exhaust fumes and the best coffee you have ever had. You don't visit Rome so much as surrender to it.\n\nFive days losing ourselves in the right ways. A wrong turn near the Aventine that led to a courtyard with an orange tree and a view nobody told us about. The Colosseum at night, lit from within, our video running too long because neither of us wanted to stop looking.`
];

// Itinerary stops (demo — Rome Day 1)
const itinStops = [
  { time:"7:00 AM",dur:"2 hrs",name:"The Pantheon at Dawn",type:"hist",tagline:"The most perfectly preserved ancient building on earth — almost nobody there at this hour",dot:"hist",
    hist:{title:"What you're actually looking at",text:`Built by Hadrian around <em>125 AD</em>. That oculus — 27 feet across — was designed to connect the building to Jupiter. Its <em>unreinforced concrete dome</em> remained the world's largest for 1,300 years. Michelangelo said it seemed like the work of angels.`},
    prac:[{i:"⏰",t:"Arrive 7am — quiet before it opens at 9am"},{i:"🎟️",t:"€5 entry. Skip first-Sunday crowds."},{i:"☕",t:"Caffè Sant'Eustachio: 3 minutes away"}],
    tips:["Stand under the oculus 10 minutes. Watch the light move.","Raphael is buried here. Left aisle.","The floor is original — slightly convex to drain rain."],
    ai:"The Pantheon sits at the intersection of three things Romans were obsessed with: engineering perfection, religious syncretism, and the relationship between humanity and the cosmos. That oculus wasn't just a skylight — it connected the building to Jupiter himself. When you stand under it, you're replicating a gesture 1,900 years of visitors have made before you."
  },
  { time:"10:00 AM",dur:"3 hrs",name:"Colosseum & Roman Forum",type:"hist",tagline:"Walk where 50,000 Romans roared — and understand what they were actually cheering for",dot:"hist",
    hist:{title:"The politics of spectacle",text:`The games weren't just entertainment — they were <em>political infrastructure</em>. Emperors bought loyalty with spectacle. The phrase "<em>bread and circuses</em>" — Juvenal's critique that Romans traded civic engagement for free food and games.`},
    prac:[{i:"🎟️",t:"Book timed entry online 2+ weeks ahead."},{i:"🕐",t:"Forum first — less crowded at 10am."},{i:"🥵",t:"June is hot. Water bottle + hat essential."}],
    tips:["SUPER ticket (€22) includes underground and arena floor.","Look west from the top tier — the view Romans had for 400 years.","Arch of Titus commemorates the destruction of Jerusalem, 70 AD."],
    ai:"The engineering underneath should genuinely astonish you. The hypogeum had 80 vertical shafts with counterweighted elevators that raised lions, tigers, and stage sets simultaneously."
  },
  { time:"1:30 PM",dur:"2 hrs",name:"Lunch in Testaccio",type:"food",tagline:"The neighborhood Romans actually eat in — built on a hill of 53 million broken amphoras",dot:"food",
    hist:{title:"The city built on broken pots",text:`Monte Testaccio is a <em>35-meter hill made entirely of broken terracotta amphoras</em> from the ancient Roman port. The slaughterhouse district until the 1970s — that tradition produced <em>cacio e pepe, coda alla vaccinara, and supplì</em>.`},
    prac:[{i:"🍽️",t:"Roscioli Salumeria for lunch — book ahead."},{i:"🛒",t:"Mercato di Testaccio: Tues–Sun. Supplì at Box 15."},{i:"💶",t:"Budget €25–35pp with wine."}],
    tips:["Order cacio e pepe here — this is its birthplace, effectively.","Supplì from the market: the Roman street food revelation.","Look for doors in the hill — caves used as wine bars."],
    ai:"What the market reveals is that Roman food culture was always stratified. The fifth quarter went to the workers. They turned necessity into mastery. Cacio e pepe — three ingredients — is arguably the most technically demanding pasta dish in the canon."
  },
  { time:"4:00 PM",dur:"2 hrs",name:"Trastevere at Golden Hour",type:"cult",tagline:"The medieval neighborhood that survived — cobblestones, ivy, and the best evening light in Rome",dot:"cult",
    hist:{title:"The district that stayed medieval",text:`Trastevere — "across the Tiber" — housed Rome's immigrant communities: Syrian traders, Jewish families, sailors. Its <em>medieval street pattern</em> survived because it lay outside the walls.`},
    prac:[{i:"🌅",t:"4–6pm is golden hour. Piazza di Santa Maria."},{i:"🍷",t:"Aperitivo at 5pm: Freni e Frizioni."},{i:"🚶",t:"Walk up Gianicolo hill for the best sunset panorama."}],
    tips:["Basilica mosaics best in afternoon light — €1 for the lights.","Piazza Trilussa at dusk: where Romans actually gather.","Da Enzo al 29 for dinner — book 2 weeks ahead."],
    ai:"The basilica is still a working neighborhood church. Locals light candles for real intentions alongside tourists photographing the mosaics. That coexistence is quintessential Rome."
  }
];

// Insider intel data (demo)
const intelData = [
  {
    reddit: {
      subs: 'r/italy · r/travel · r/solotravel',
      thread: 'Going to Rome for 5 days — what do locals actually recommend?',
      upvotes: '4.2K', postCount: '847',
      consensus: 'The universal advice: the tourist trap radius around major sights is real and exactly as bad as they say. Walk two blocks in any direction and everything gets better — the food, the prices, the atmosphere.',
      tips: [
        { score:'2.4K', text:'Book the Colosseum underground tickets the moment they open — they sell out 6 weeks ahead in summer.', user:'RomeLocal_2019', sub:'r/italy', awards:['🏆','✨'] },
        { score:'1.8K', text:'Roscioli for dinner but you need a reservation 2–3 weeks out.', user:'cacio_e_pepe_forever', sub:'r/travel', awards:['🥇'] },
        { score:'1.1K', text:"The Pantheon before 9am and Pincio Hill at exactly golden hour. These two alone justify the trip.", user:'perpetual_wanderer_82', sub:'r/solotravel' },
        { score:'890', text:"Skip the Vatican in July/August unless you book first-entry tickets.", user:'europeanrailpass', sub:'r/travel' }
      ]
    },
    bloggers: [
      { avatar:'🧳', name:'Nomadic Matt', blog:'nomadicmatt.com', monthly:'2.1M', quote:"Rome is one of the few cities where I genuinely recommend 5 days minimum.", tags:['Budget tips','5-day plan','Neighborhoods'] },
      { avatar:'👩', name:'The Blonde Abroad', blog:'theblondeabroad.com', monthly:'1.4M', quote:"Solo female travel in Rome is genuinely easy and wonderful.", tags:['Solo female','Neighborhoods','Safety'] },
      { avatar:'📸', name:'Earth Trekkers', blog:'earthtrekkers.com', monthly:'680K', quote:'The two-day Vatican + Colosseum sprint is the worst way to do Rome.', tags:['Itinerary','Photography','Family'] }
    ]
  },
  {
    reddit: {
      subs: 'r/italy · r/travel',
      thread: 'Florence in 4 days — what am I missing that tourists skip?',
      upvotes: '2.8K', postCount: '512',
      consensus: 'Cross the river. Oltrarno is where Florence actually lives.',
      tips: [
        { score:'1.9K', text:'The Uffizi is worth it but book the first slot of the day.', user:'florentine_obsessed', sub:'r/italy', awards:['🏆'] },
        { score:'1.3K', text:'Oltrarno for dinner every night.', user:'slow_travel_sara', sub:'r/travel' },
        { score:'876', text:"Climb the Duomo not the Campanile.", user:'arch_history_nerd', sub:'r/italy', awards:['✨'] }
      ]
    },
    bloggers: [
      { avatar:'🎨', name:'Rick Steves', blog:'ricksteves.com', monthly:'3.2M', quote:'Florence rewards slowing down. Pick two museums per day maximum.', tags:['Classic guide','Art','Culture'] },
      { avatar:'🍷', name:'The Infatuation', blog:'theinfatuation.com', monthly:'1.8M', quote:'The restaurant scene in Oltrarno has never been better.', tags:['Food-focused','Restaurant picks','Neighborhoods'] }
    ]
  },
  {
    reddit: { subs: 'r/italy · r/solotravel', thread: 'Cinque Terre — is it still worth it?', upvotes: '1.9K', postCount: '334',
      consensus: "Worth it if and only if you go early.",
      tips: [
        { score:'1.4K', text:'Train between villages, walk the trail one direction only.', user:'cinque_terre_vet', sub:'r/italy', awards:['🏆','🌟'] },
        { score:'982', text:'Vernazza is the best village.', user:'ligurian_coast_fan', sub:'r/solotravel' }
      ]
    },
    bloggers: [
      { avatar:'🏖️', name:'The Planet D', blog:'theplanetd.com', monthly:'920K', quote:"September over July, always.", tags:['Timing','Photography','Couples'] }
    ]
  },
  {
    reddit: { subs: 'r/italy · r/travel', thread: 'Venice — how long is enough?', upvotes: '3.1K', postCount: '621',
      consensus: "Two nights, not three. Get completely lost immediately.",
      tips: [
        { score:'2.1K', text:"Get lost on arrival. Don't use maps for the first three hours.", user:'venetian_by_choice', sub:'r/italy', awards:['🏆','🌟','✨'] },
        { score:'1.4K', text:'Dorsoduro for dinner. Castello for morning walks.', user:'slow_italy_traveler', sub:'r/travel' }
      ]
    },
    bloggers: [
      { avatar:'🚣', name:'Walks of Italy', blog:'walksofitaly.com', monthly:'850K', quote:'The early morning in Venice — before 8am — is a completely different city.', tags:['Walking','Hidden spots','Photography'] }
    ]
  }
];

// Trending trips (Discover screen)
const trendingTrips = [
  { rank:1, name:"Italy · <em>Summer 2024</em>", tagline:"Rome to Sicily over 3 weeks. Every gem, every honest mistake, the cacio e pepe that ruined all future pasta.", creator:"@adventurewithmark", avatar:"👨", followers:"12.4K", role:"Travel writer", saves:"4.2K", days:21, stops:6, photos:142, tags:["Couple","Food","Culture"], pins:[{c:'r',x:18,y:42},{c:'r',x:28,y:30},{c:'g',x:16,y:24},{c:'b',x:38,y:20},{c:'g',x:32,y:60},{c:'g',x:46,y:72}], region:"europe", featured:true,
    stops_list:["🇮🇹 Rome","🇮🇹 Florence","🇮🇹 Cinque Terre","🇮🇹 Venice","🇮🇹 Amalfi","🇮🇹 Sicily"] },
  { rank:2, name:"Japan · <em>Cherry Blossom</em>", tagline:"Two weeks chasing sakura from Tokyo to Kyoto. Fushimi Inari pre-dawn alone is worth the flight.", creator:"@thefoodwanderer", avatar:"👩‍🦱", followers:"8.7K", role:"Solo traveler", saves:"3.8K", days:14, stops:5, photos:312, tags:["Solo","Spring","Photography"], pins:[{c:'r',x:72,y:28},{c:'g',x:60,y:38},{c:'r',x:62,y:44},{c:'r',x:58,y:46},{c:'g',x:68,y:34}], region:"asia", featured:true,
    stops_list:["🇯🇵 Tokyo","🇯🇵 Kyoto","🇯🇵 Nara","🇯🇵 Osaka","🇯🇵 Hakone"] },
  { rank:3, name:"Iceland · Ring Road", tagline:"10 days driving the full ring. Glaciers, geysers, black sand beaches. Northern lights twice.", creator:"@nordicwanderer", avatar:"🧔", followers:"6.2K", role:"Adventure photographer", saves:"3.1K", days:10, stops:7, photos:284, tags:["Couple","Nature","Photography","Roadtrip"], pins:[{c:'b',x:30,y:30},{c:'b',x:50,y:25},{c:'g',x:70,y:35},{c:'g',x:75,y:55},{c:'b',x:55,y:65}], region:"europe",
    stops_list:["🇮🇸 Reykjavík","🇮🇸 Snæfellsnes","🇮🇸 Akureyri","🇮🇸 Mývatn","🇮🇸 Egilsstaðir","🇮🇸 Höfn","🇮🇸 Vík"] },
  { rank:4, name:"Vietnam · <em>North to South</em>", tagline:"Two weeks from Hanoi to Saigon. Halong Bay junk, Hoi An tailors, food worth a return flight.", creator:"@slowmotion_jen", avatar:"👩", followers:"9.1K", role:"Food writer", saves:"2.9K", days:14, stops:6, photos:198, tags:["Couple","Food","Culture","Budget"], pins:[{c:'r',x:55,y:25},{c:'g',x:60,y:35},{c:'r',x:50,y:55},{c:'g',x:55,y:65},{c:'b',x:48,y:75}], region:"asia",
    stops_list:["🇻🇳 Hanoi","🇻🇳 Halong Bay","🇻🇳 Hoi An","🇻🇳 Hue","🇻🇳 Da Nang","🇻🇳 Ho Chi Minh"] },
  { rank:5, name:"Peru · Sacred Valley", tagline:"Inca trail done right. Machu Picchu at sunrise. Acclimatize properly.", creator:"@peakseeker_d", avatar:"🧗", followers:"4.8K", role:"Adventure guide", saves:"2.7K", days:12, stops:5, photos:167, tags:["Solo","Adventure","Nature","Culture"], pins:[{c:'r',x:25,y:55},{c:'g',x:30,y:60},{c:'g',x:32,y:62},{c:'r',x:28,y:65}], region:"americas",
    stops_list:["🇵🇪 Lima","🇵🇪 Cusco","🇵🇪 Sacred Valley","🇵🇪 Machu Picchu","🇵🇪 Lake Titicaca"] }
];

const newThisWeek = [
  { name:"Scotland · Highlands Loop", creator:"@highland_holly", avatar:"🧔", days:8, stops:5, hours:14 },
  { name:"Colombia · Coffee Country", creator:"@beanchaser_bea", avatar:"☕", days:11, stops:4, hours:22 },
  { name:"Norway · Fjord Express", creator:"@northern_nils", avatar:"🧗", days:9, stops:6, hours:8 },
  { name:"Sri Lanka · Tea & Temples", creator:"@ceylon_sasha", avatar:"🍵", days:10, stops:5, hours:36 },
  { name:"Costa Rica · Pacific to Caribbean", creator:"@purasoul_paco", avatar:"🌿", days:12, stops:6, hours:16 }
];

const top30Cities = [
  { rank:1, name:"Tokyo", country:"Japan", flag:"🇯🇵", emoji:"🗼", tagline:"The future and the past coexist on every street corner.", days:"5–7", season:"Spring · Fall", trips:847, gradient:"linear-gradient(135deg,#1a0530,#0a0a2a)", region:"asia" },
  { rank:2, name:"Rome", country:"Italy", flag:"🇮🇹", emoji:"🏛️", tagline:"2,700 years of civilization layered into walking distance.", days:"4–6", season:"Spring · Fall", trips:1240, gradient:"linear-gradient(135deg,#3a1a0a,#1a0a05)", region:"europe" },
  { rank:3, name:"Paris", country:"France", flag:"🇫🇷", emoji:"🗼", tagline:"Walk it, eat in arrondissements, ignore the lines.", days:"4–5", season:"Spring · Fall", trips:1580, gradient:"linear-gradient(135deg,#1a1535,#0a0a1a)", region:"europe" },
  { rank:4, name:"Kyoto", country:"Japan", flag:"🇯🇵", emoji:"⛩️", tagline:"Temples before dawn. The real Japan only locals show you.", days:"3–5", season:"Spring · Fall", trips:692, gradient:"linear-gradient(135deg,#2a0a1a,#1a0a0a)", region:"asia" },
  { rank:5, name:"Lisbon", country:"Portugal", flag:"🇵🇹", emoji:"🛤️", tagline:"Hills, fado, four-euro wine. The capital that never quite caught on.", days:"3–4", season:"Spring · Fall", trips:534, gradient:"linear-gradient(135deg,#0a1a2a,#0a0a1a)", region:"europe" },
  { rank:6, name:"Mexico City", country:"Mexico", flag:"🇲🇽", emoji:"🌋", tagline:"The food capital nobody outside Mexico is talking about enough.", days:"4–6", season:"Fall · Winter", trips:421, gradient:"linear-gradient(135deg,#2a1a0a,#1a0a0a)", region:"americas" },
  { rank:7, name:"Marrakech", country:"Morocco", flag:"🇲🇦", emoji:"🕌", tagline:"Get lost in the medina. That's the entire instruction manual.", days:"3–4", season:"Spring · Fall", trips:387, gradient:"linear-gradient(135deg,#3a1a0a,#1a0a05)", region:"africa" },
  { rank:8, name:"Cape Town", country:"South Africa", flag:"🇿🇦", emoji:"⛰️", tagline:"Mountains meeting the ocean. Wine country thirty minutes away.", days:"4–6", season:"Nov–Mar", trips:312, gradient:"linear-gradient(135deg,#0a2a1a,#0a1a0a)", region:"africa" },
  { rank:9, name:"Buenos Aires", country:"Argentina", flag:"🇦🇷", emoji:"💃", tagline:"The Paris of South America with steaks and tango at 11pm.", days:"3–5", season:"Oct–Apr", trips:298, gradient:"linear-gradient(135deg,#1a0a2a,#0a0a1a)", region:"americas" },
  { rank:10, name:"Istanbul", country:"Turkey", flag:"🇹🇷", emoji:"🕌", tagline:"Two continents, one city. The bazaars are the lesser story.", days:"3–5", season:"Spring · Fall", trips:445, gradient:"linear-gradient(135deg,#2a1a0a,#1a0a05)", region:"europe" },
  { rank:11, name:"Bangkok", country:"Thailand", flag:"🇹🇭", emoji:"🛕", tagline:"Sensory overload as a feature, not a bug. The street food capital.", days:"3–4", season:"Nov–Feb", trips:391, gradient:"linear-gradient(135deg,#2a0a1a,#1a0a0a)", region:"asia" },
  { rank:12, name:"New York", country:"USA", flag:"🇺🇸", emoji:"🗽", tagline:"The city you've seen a thousand times still surprises you.", days:"4–6", season:"Spring · Fall", trips:1120, gradient:"linear-gradient(135deg,#0a1525,#0a0a1a)", region:"americas" },
  { rank:13, name:"Barcelona", country:"Spain", flag:"🇪🇸", emoji:"🏖️", tagline:"Gaudí, tapas, beach. The most livable city in Europe.", days:"4–5", season:"Spring · Fall", trips:687, gradient:"linear-gradient(135deg,#2a1a0a,#1a0a0a)", region:"europe" },
  { rank:14, name:"Singapore", country:"Singapore", flag:"🇸🇬", emoji:"🌃", tagline:"Asia's clean, expensive, and astonishing future-city.", days:"2–3", season:"Year-round", trips:189, gradient:"linear-gradient(135deg,#0a1a2a,#0a0a1a)", region:"asia" },
  { rank:15, name:"Reykjavík", country:"Iceland", flag:"🇮🇸", emoji:"🌋", tagline:"Base for the wildest country in Europe. The aurora is the bonus.", days:"2–3", season:"Sep–Mar", trips:267, gradient:"linear-gradient(135deg,#0a1535,#0a0a1a)", region:"europe" },
  { rank:16, name:"Hanoi", country:"Vietnam", flag:"🇻🇳", emoji:"🛺", tagline:"The chaos has a rhythm. Stay long enough to feel it.", days:"3–4", season:"Oct–Dec", trips:234, gradient:"linear-gradient(135deg,#2a0a1a,#1a0a0a)", region:"asia" },
  { rank:17, name:"Cusco", country:"Peru", flag:"🇵🇪", emoji:"🏔️", tagline:"Gateway to Machu Picchu but worth four days in its own right.", days:"4–5", season:"May–Sep", trips:178, gradient:"linear-gradient(135deg,#3a1a0a,#1a0a05)", region:"americas" },
  { rank:18, name:"Cairo", country:"Egypt", flag:"🇪🇬", emoji:"🐫", tagline:"The Pyramids never disappoint. The food culture is the surprise.", days:"3–4", season:"Oct–Apr", trips:156, gradient:"linear-gradient(135deg,#3a2a0a,#1a0a05)", region:"africa" },
  { rank:19, name:"Sydney", country:"Australia", flag:"🇦🇺", emoji:"🏖️", tagline:"The opera house and the harbor. Beach culture as religion.", days:"3–5", season:"Oct–Apr", trips:312, gradient:"linear-gradient(135deg,#0a1a35,#0a0a1a)", region:"oceania" },
  { rank:20, name:"Prague", country:"Czechia", flag:"🇨🇿", emoji:"🏰", tagline:"The medieval city that never got modernized. Beer is the religion.", days:"3–4", season:"Spring · Fall", trips:298, gradient:"linear-gradient(135deg,#2a1a0a,#1a0a05)", region:"europe" },
  { rank:21, name:"Hong Kong", country:"China", flag:"🇭🇰", emoji:"🏙️", tagline:"The skyline, the dim sum, the night markets, the hiking nobody knows about.", days:"3–4", season:"Oct–Dec", trips:201, gradient:"linear-gradient(135deg,#1a0a2a,#0a0a1a)", region:"asia" },
  { rank:22, name:"Venice", country:"Italy", flag:"🇮🇹", emoji:"🚣", tagline:"Two nights, not three. Get completely lost on arrival.", days:"2–3", season:"Spring · Fall", trips:512, gradient:"linear-gradient(135deg,#0a1a2a,#0a0a1a)", region:"europe" },
  { rank:23, name:"Hoi An", country:"Vietnam", flag:"🇻🇳", emoji:"🏮", tagline:"Lanterns at night. Custom tailoring overnight. Most photogenic place in Asia.", days:"2–3", season:"Feb–May", trips:189, gradient:"linear-gradient(135deg,#3a1a0a,#1a0a05)", region:"asia" },
  { rank:24, name:"Edinburgh", country:"Scotland", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", emoji:"🏰", tagline:"Festivals in August, ghost stories all year.", days:"3–4", season:"Aug · Spring", trips:234, gradient:"linear-gradient(135deg,#0a1535,#0a0a1a)", region:"europe" },
  { rank:25, name:"Dubai", country:"UAE", flag:"🇦🇪", emoji:"🌆", tagline:"Maximalism made manifest. The desert experiences are the real story.", days:"3–4", season:"Nov–Mar", trips:267, gradient:"linear-gradient(135deg,#3a2a0a,#1a0a05)", region:"asia" },
  { rank:26, name:"Stockholm", country:"Sweden", flag:"🇸🇪", emoji:"🏝️", tagline:"Built on 14 islands. The archipelago is the trip extension worth doing.", days:"3–4", season:"Jun–Aug", trips:142, gradient:"linear-gradient(135deg,#0a1a2a,#0a0a1a)", region:"europe" },
  { rank:27, name:"Hawaii (Maui)", country:"USA", flag:"🇺🇸", emoji:"🌺", tagline:"The Road to Hana is worth its reputation. Avoid the resort strip.", days:"5–7", season:"Apr–Oct", trips:198, gradient:"linear-gradient(135deg,#0a2a1a,#0a1a0a)", region:"americas" },
  { rank:28, name:"Tbilisi", country:"Georgia", flag:"🇬🇪", emoji:"🍷", tagline:"Most-recommended emerging destination. Wine for €3, food unforgettable.", days:"3–4", season:"Spring · Fall", trips:87, gradient:"linear-gradient(135deg,#2a1a0a,#1a0a0a)", region:"europe" },
  { rank:29, name:"Queenstown", country:"New Zealand", flag:"🇳🇿", emoji:"🏔️", tagline:"Adventure capital. Base in Wanaka instead.", days:"4–6", season:"Dec–Feb", trips:156, gradient:"linear-gradient(135deg,#0a2a2a,#0a1a1a)", region:"oceania" },
  { rank:30, name:"Mérida", country:"Mexico", flag:"🇲🇽", emoji:"🏛️", tagline:"The colonial city tourism forgot. Food culture rivals Mexico City.", days:"3–4", season:"Nov–Mar", trips:124, gradient:"linear-gradient(135deg,#2a1a0a,#1a0a0a)", region:"americas" }
];

// Story frames for share modal
const storyFrames = [
  { type:'title', label:'Title Card' },
  { type:'stop', idx:0, city:'Rome', date:'Jun 12–16', narr:'"Rome doesn\'t ask for your attention — it commands it."', emoji:'🏛️', bg:'#2a1a0a' },
  { type:'stop', idx:1, city:'Florence', date:'Jun 17–20', narr:'"The Oltrarno neighborhood is where Florence actually lives."', emoji:'🌉', bg:'#1a2a0a' },
  { type:'stop', idx:2, city:'Cinque Terre', date:'Jun 21–23', narr:'"Swam in water so clear it felt invented."', emoji:'🏖️', bg:'#0a1a2a' },
  { type:'stop', idx:3, city:'Venice', date:'Jun 24–26', narr:'"Worth two nights. Not more. Get completely lost."', emoji:'🚣', bg:'#0a0a2a' },
  { type:'stop', idx:4, city:'Amalfi', date:'Jun 27–Jul 1', narr:'"Drove the coast road at sunset. One of the best decisions of my life."', emoji:'🌺', bg:'#2a0a10' },
  { type:'stop', idx:5, city:'Sicily', date:'Jul 1–3', narr:'"The arancini at Mercato del Capo changed how I think about food."', emoji:'🍊', bg:'#2a1a0a' },
  { type:'final', label:'Route Reveal + Download' }
];

const captions = {
  hook: `Rome doesn't ask for your attention — it commands it. ✨\n\n21 days across Italy. 6 cities. The best cacio e pepe of my life (Roscioli, no contest).\n\nFull interactive map in bio 🗺️\n\n#italytravel #rome #wanderapp #travelitaly #italy2024`,
  personal: `Three weeks across Italy and I'm still processing it.\n\nThe Pantheon at dawn before the tourists. A wrong turn in Trastevere that became the best night of the trip. Arancini in Palermo that genuinely changed how I think about food.\n\nFull route at link in bio — every stop mapped, every gem marked 🗺️\n\n#italytravel #travelstories #italy2024 #wanderapp`,
  minimal: `Italy. 21 days. 6 cities.\n\nRoute + recommendations at pinned.app/italy ↗\n\n#italy #italytravel #wanderapp`
};

// Quick Trip Builder templates
const qbTemplates = {
  italy: { name:'Italy', flag:'🇮🇹', title:'Italy · <em>Your trip</em>', dates:'Pick your dates', days:21,
    pins:[{x:18,y:38,c:'r',name:'Rome'},{x:22,y:30,c:'r',name:'Florence'},{x:14,y:24,c:'g',name:'Cinque Terre'},{x:26,y:22,c:'b',name:'Venice'},{x:20,y:60,c:'g',name:'Amalfi'},{x:24,y:74,c:'g',name:'Sicily'}] },
  japan: { name:'Japan', flag:'🇯🇵', title:'Japan · <em>Your trip</em>', dates:'Pick your dates', days:14,
    pins:[{x:22,y:32,c:'r',name:'Tokyo'},{x:18,y:42,c:'g',name:'Hakone'},{x:14,y:50,c:'r',name:'Kyoto'},{x:12,y:56,c:'b',name:'Osaka'},{x:8,y:62,c:'g',name:'Hiroshima'}] },
  portugal: { name:'Portugal', flag:'🇵🇹', title:'Portugal · <em>Your trip</em>', dates:'Pick your dates', days:10,
    pins:[{x:22,y:28,c:'r',name:'Porto'},{x:24,y:42,c:'g',name:'Lisbon'},{x:26,y:54,c:'b',name:'Sintra'},{x:30,y:70,c:'g',name:'Lagos'}] },
  iceland: { name:'Iceland', flag:'🇮🇸', title:'Iceland · <em>Ring road</em>', dates:'Pick your dates', days:8,
    pins:[{x:20,y:30,c:'r',name:'Reykjavik'},{x:30,y:24,c:'g',name:'Vík'},{x:42,y:32,c:'b',name:'Höfn'},{x:38,y:50,c:'g',name:'Akureyri'}] },
  vietnam: { name:'Vietnam', flag:'🇻🇳', title:'Vietnam · <em>North to South</em>', dates:'Pick your dates', days:16,
    pins:[{x:22,y:22,c:'r',name:'Hanoi'},{x:18,y:32,c:'b',name:'Ha Long Bay'},{x:28,y:46,c:'g',name:'Hoi An'},{x:32,y:60,c:'r',name:'Saigon'}] },
  morocco: { name:'Morocco', flag:'🇲🇦', title:'Morocco · <em>Imperial cities</em>', dates:'Pick your dates', days:10,
    pins:[{x:18,y:30,c:'r',name:'Marrakech'},{x:24,y:24,c:'g',name:'Fes'},{x:14,y:42,c:'b',name:'Essaouira'},{x:30,y:50,c:'g',name:'Sahara'}] },
  mexico: { name:'Mexico', flag:'🇲🇽', title:'Mexico · <em>Yucatán</em>', dates:'Pick your dates', days:9,
    pins:[{x:22,y:36,c:'r',name:'Mexico City'},{x:34,y:42,c:'g',name:'Oaxaca'},{x:48,y:30,c:'b',name:'Mérida'},{x:54,y:36,c:'g',name:'Tulum'}] },
  peru: { name:'Peru', flag:'🇵🇪', title:'Peru · <em>Inca trail</em>', dates:'Pick your dates', days:11,
    pins:[{x:22,y:30,c:'r',name:'Lima'},{x:30,y:48,c:'g',name:'Cusco'},{x:34,y:54,c:'b',name:'Machu Picchu'},{x:38,y:62,c:'g',name:'Sacred Valley'}] }
};

// Expose stops_ref used by the inline onclick handlers in renderStopList
window.stops_ref = trips.map(t => t.stops);
