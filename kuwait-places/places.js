/* Yalla, where to? — place data.
 *
 * This is the only file you need to edit to add, change or remove a place.
 *
 *   id       unique short slug. Saved and spun lists key off this, so never
 *            reuse one for a different place.
 *   name     { en, ar }  the place name
 *   area     { en, ar }  where it is
 *   vibe     the hangout it answers — the site's main filter:
 *              "coffee"    somewhere to sit and drink coffee or chai
 *              "eat"       a proper meal
 *              "chill"     hang out, no meal required
 *              "different" when the group wants something other than the usual
 *   cat      finer label shown on the card:
 *            cafe food breakfast dessert museum outdoors souq landmark activity
 *   price    0 = free, 1 = cheap, 2 = mid-range, 3 = splurge
 *   outdoor  true if there's real outdoor seating, or it's outdoors entirely
 *   group    true if a big group fits without a fight over tables
 *   late     true if it's usually still going past midnight
 *   quiet    you can hold a conversation here without raising your voice
 *   kids     a child is welcome and won't be bored or in the way
 *   shisha   shisha is served here
 *   coords   [lat, lng], approximate — used ONLY to order the list by
 *            distance for "Near me". Use null for anything with several
 *            branches or no single point; those sort last. The Directions
 *            link searches Maps by name, so it stays right either way.
 *   picky    feeds the picky-eater banner. Required for every "eat" and
 *            "coffee" place, and null for everything else:
 *              veg       there is a real vegetarian main, not just a side
 *              seafood   seafood is central here, so "no seafood" rules it out
 *              familiar  a menu a fussy eater already recognises
 *              meal      you can eat a full meal, not only coffee and cake
 *            These are judgements from the cuisine, NOT dietary guarantees.
 *            Do not add allergy fields here — an unverified "gluten-free"
 *            can put someone in hospital. The banner says as much, and
 *            allergies belong in a phone call to the venue.
 *   note     { en, ar }  one line on what the place is
 *   tip      { en, ar }  what to order, or what to actually do there
 *
 * Seed data: hours, prices and whether a place is still open change fast in
 * Kuwait, and coordinates here are area-level, not surveyed pins. Verify
 * before trusting an entry, and fix it here when it's wrong.
 */

window.PLACES = [
  {
    id: "al-boom",
    name: { en: "Al Boom", ar: "البوم" },
    area: { en: "Salwa", ar: "سلوى" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.292, 48.081],
    picky: { veg: false, seafood: true, familiar: false, meal: true },
    note: { en: "A restaurant built inside a real wooden dhow.", ar: "مطعم داخل سفينة خشبية حقيقية." },
    tip: { en: "Grilled hamour. Ask for a table on the upper deck.", ar: "هامور مشوي. اطلب طاولة في الطابق الأعلى." }
  },
  {
    id: "bait-7",
    name: { en: "Bait 7", ar: "بيت ٧" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.379, 47.995],
    picky: { veg: false, seafood: false, familiar: false, meal: true },
    note: { en: "Kuwaiti home cooking in a restored courtyard house.", ar: "أكل كويتي بيتي في بيت قديم مرمّم." },
    tip: { en: "Machboos dyay, and leave room for the mahalabiya.", ar: "مچبوس دياي، وخلّ مكان للمهلبية." }
  },
  {
    id: "baker-spice",
    name: { en: "Baker & Spice", ar: "بيكر آند سبايس" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "eat", cat: "breakfast", price: 3,
    outdoor: true, group: true, late: false,
    quiet: false, kids: true, shisha: false,
    coords: null,
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "The brunch everyone in Kuwait ends up at eventually.", ar: "البرانش اللي الكل في الكويت ينتهي فيه." },
    tip: { en: "Weekend mornings are packed — go early or go midweek.", ar: "صبح نهاية الأسبوع زحمة — روح بدري أو وسط الأسبوع." }
  },
  {
    id: "cafe-bazza",
    name: { en: "Café Bazza", ar: "كافيه بزة" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "eat", cat: "breakfast", price: 1,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: true,
    coords: null,
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "Kuwaiti breakfast and Arabic grills, with the décor to match.", ar: "ريوق كويتي ومشاوي عربية، وديكور على نفس الطراز." },
    tip: { en: "A Kuwaiti breakfast spread, shared, mid-morning.", ar: "سفرة ريوق كويتي، مشتركة، وسط الصبح." }
  },
  {
    id: "dar-hamad",
    name: { en: "Dar Hamad", ar: "دار حمد" },
    area: { en: "Sharq — Gulf Road", ar: "شرق — طريق الخليج" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.382, 47.995],
    picky: { veg: false, seafood: true, familiar: false, meal: true },
    note: { en: "The dressed-up version of Kuwaiti cuisine, with a sea view.", ar: "المطبخ الكويتي بأسلوب راقي، وعلى البحر." },
    tip: { en: "Murabyan (shrimp machboos). Book ahead on weekends.", ar: "مربيان. احجز مقدماً في نهاية الأسبوع." }
  },
  {
    id: "freej-swaileh",
    name: { en: "Freej Swaileh", ar: "فريج صويلح" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "eat", cat: "breakfast", price: 1,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: true,
    coords: null,
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "Kuwaiti breakfast done properly, and busy at every hour.", ar: "ريوق كويتي أصلي، وزحمة في كل وقت." },
    tip: { en: "Balaleet and chebab with a karak on the side.", ar: "بلاليط وچباب مع كرك." }
  },
  {
    id: "little-rubys",
    name: { en: "Little Ruby's", ar: "ليتل روبيز" },
    area: { en: "Kuwait City — Assima Mall", ar: "مدينة الكويت — مجمع العاصمة" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.3757, 47.9877],
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "A short menu done well — three salads, three pastas, three burgers.", ar: "منيو قصير ومتقن — ثلاث سلطات، ثلاث باستا، ثلاث برغر." },
    tip: { en: "The Bronte burger, and the fries are the real draw.", ar: "برغر البرونتي، والبطاطس هي السبب الحقيقي." }
  },
  {
    id: "mais-alghanim",
    name: { en: "Mais Alghanim", ar: "ميس الغانم" },
    area: { en: "Sharq — Gulf Road", ar: "شرق — طريق الخليج" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: true, group: true, late: false,
    quiet: false, kids: true, shisha: true,
    coords: [29.386, 47.993],
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "A Kuwait institution since the 1950s. Everyone has been.", ar: "من علامات الكويت منذ الخمسينات. الكل زارها." },
    tip: { en: "Mixed grill, hummus, and the fresh juice.", ar: "مشاوي مشكّلة، حمّص، وعصير طازج." }
  },
  {
    id: "matbakhi",
    name: { en: "Matbakhi", ar: "مطبخي" },
    area: { en: "Al-Rai — The Avenues", ar: "الري — الأفنيوز" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.302, 47.933],
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "Palestinian and Levantine home cooking that made MENA's 50 Best.", ar: "أكل فلسطيني وشامي بيتي، ودخل قائمة أفضل ٥٠ في المنطقة." },
    tip: { en: "Go with a group and share everything. Book ahead.", ar: "روحوا جماعة وتشاركوا كل شي. احجز مقدماً." }
  },
  {
    id: "melenzane",
    name: { en: "Melenzane", ar: "ميلنزاني" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.335, 48.07],
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "The Italian people in Kuwait actually rate.", ar: "المطعم الإيطالي اللي يمدحه أهل الكويت." },
    tip: { en: "Truffle pasta. Reserve — it fills up.", ar: "باستا الترفل. احجز، المكان يمتلئ بسرعة." }
  },
  {
    id: "oak-smoke",
    name: { en: "Oak & Smoke", ar: "أوك آند سموك" },
    area: { en: "Shuwaikh Industrial", ar: "الشويخ الصناعية" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.33, 47.92],
    picky: { veg: false, seafood: false, familiar: true, meal: true },
    note: { en: "Low-and-slow smoked meat, in a warehouse in Shuwaikh.", ar: "لحم مدخّن على نار هادية، في مستودع بالشويخ." },
    tip: { en: "Brisket, and come hungry. It's not a light meal.", ar: "بريسكِت، وتعال وأنت جوعان. ما هي أكلة خفيفة." }
  },
  {
    id: "ofk",
    name: { en: "OFK", ar: "أو إف كي" },
    area: { en: "Kuwait City — Al Hamra", ar: "مدينة الكويت — الحمرا" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: false, group: false, late: true,
    quiet: true, kids: false, shisha: false,
    coords: [29.3792, 47.9873],
    picky: { veg: true, seafood: false, familiar: false, meal: true },
    note: { en: "The best room in the city to eat in, high up in Al Hamra.", ar: "أجمل مكان تتعشى فيه بالمدينة، في أعلى الحمرا." },
    tip: { en: "Come for the view as much as the food. Book a window table.", ar: "تعال للمنظر مثل الأكل. احجز طاولة عند النافذة." }
  },
  {
    id: "slider-station",
    name: { en: "Slider Station", ar: "سلايدر ستيشن" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "eat", cat: "food", price: 1,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: null,
    picky: { veg: false, seafood: false, familiar: true, meal: true },
    note: { en: "Kuwait's own burger chain, and still the benchmark.", ar: "سلسلة البرغر الكويتية، ولا زالت المعيار." },
    tip: { en: "The classic slider and truffle fries.", ar: "السلايدر الكلاسيك وبطاطس الترفل." }
  },
  {
    id: "solo-pizza",
    name: { en: "Solo Pizza Napulitana", ar: "سولو بيتزا نابوليتانا" },
    area: { en: "Kuwait City — Al Soor", ar: "مدينة الكويت — السور" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.3742, 47.9861],
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "Certified Neapolitan pizza — the real, blistered, 90-second kind.", ar: "بيتزا نابوليتانا معتمدة — الأصلية، محروقة الأطراف، بتسعين ثانية." },
    tip: { en: "A margherita first. Judge the place on that.", ar: "مارغريتا أول. احكم على المكان منها." }
  },
  {
    id: "souq-sharq-fish",
    name: { en: "Souq Sharq fish market", ar: "سوق السمك — سوق شرق" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "eat", cat: "souq", price: 2,
    outdoor: false, group: true, late: false,
    quiet: false, kids: true, shisha: false,
    coords: [29.383, 47.993],
    picky: { veg: false, seafood: true, familiar: false, meal: true },
    note: { en: "Pick your fish off the ice, then hand it over to be cooked.", ar: "اختر سمكتك من الثلج، وسلّمها لتُطبخ." },
    tip: { en: "Zubaidi if it's in season. Go early for the catch.", ar: "زبيدي إذا كان موسمه. روح بدري على السمك الطازج." }
  },
  {
    id: "villa-fayrouz",
    name: { en: "Villa Fayrouz", ar: "فيلا فيروز" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: true, group: true, late: false,
    quiet: false, kids: true, shisha: true,
    coords: [29.333, 48.07],
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "Lebanese mezze in a converted villa garden.", ar: "مازة لبنانية في حديقة فيلا." },
    tip: { en: "Order too many cold mezze. That is the point.", ar: "اطلب مازة باردة أكثر من اللازم. هذا المقصود." }
  },
  {
    id: "white-robata",
    name: { en: "White Robata", ar: "وايت روباتا" },
    area: { en: "Kuwait City — JACC, Gulf Road", ar: "مدينة الكويت — مركز جابر، طريق الخليج" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: true, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.373, 47.981],
    picky: { veg: false, seafood: true, familiar: false, meal: true },
    note: { en: "Japanese robata grill, and the highest-ranked restaurant in the country.", ar: "مشاوي روباتا يابانية، وأعلى مطعم تصنيفاً في البلد." },
    tip: { en: "Reservations only, and book well ahead. Ask for the sea-side terrace.", ar: "بالحجز فقط، واحجز مقدماً بوقت. اطلب التراس المطل على البحر." }
  },
  {
    id: "48-east",
    name: { en: "48 East Roastery", ar: "٤٨ إيست روستري" },
    area: { en: "Salmiya — waterfront", ar: "السالمية — الواجهة البحرية" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: true, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.333, 48.091],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Specialty coffee with the sea directly outside.", ar: "قهوة مختصة والبحر قبالك." },
    tip: { en: "Sit outside near sunset, then walk the corniche.", ar: "اقعد بالخارج وقت الغروب، وبعدها تمشَّ على الكورنيش." }
  },
  {
    id: "altitude-roasters",
    name: { en: "Altitude Roasters", ar: "التيتيود روسترز" },
    area: { en: "Shuwaikh Industrial", ar: "الشويخ الصناعية" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.331, 47.922],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "One of the roasters that built Kuwait's specialty scene.", ar: "من المحامص اللي بنت مشهد القهوة المختصة في الكويت." },
    tip: { en: "Buy beans on the way out.", ar: "اشترِ حبوب وأنت طالع." }
  },
  {
    id: "arabica",
    name: { en: "% Arabica", ar: "٪ أرابيكا" },
    area: { en: "Al Bidaa — Gulf Road", ar: "البدع — طريق الخليج" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: true, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.331, 48.094],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Minimal, bright, and the coffee is the point — with the sea outside.", ar: "بسيط ومضيء، والقهوة هي الأساس — والبحر بالخارج." },
    tip: { en: "Spanish latte, then walk it off along the corniche.", ar: "سبانش لاتيه، وبعدها تمشَّ على الكورنيش." }
  },
  {
    id: "before-chocolate",
    name: { en: "Before Chocolate", ar: "بيفور شوكلت" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "dessert", price: 2,
    outdoor: false, group: false, late: true,
    quiet: true, kids: true, shisha: false,
    coords: [29.3339, 48.0783],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "A small dessert café that people cross town for.", ar: "كافيه حلا صغير يقطعون له المدينة." },
    tip: { en: "The Davos cake. That's what you came for.", ar: "كيكة الدافوس. هذا اللي يّيت له." }
  },
  {
    id: "beit-lothan",
    name: { en: "Beit Lothan", ar: "بيت لوثان" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: true, group: false, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.329, 48.093],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "An old seafront house turned art space, with a quiet garden café.", ar: "بيت قديم على البحر صار مساحة فنية، وفيه كافيه هادئ بالحديقة." },
    tip: { en: "Go when you want to talk without shouting.", ar: "روح لمّا تبغى تتكلم بدون ما تصرخ." }
  },
  {
    id: "chocolate-bar",
    name: { en: "The Chocolate Bar", ar: "ذا شوكلت بار" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "dessert", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.3339, 48.0783],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "The after-dinner stop, and it fits a table of six.", ar: "محطة بعد العشاء، وتستوعب طاولة لستة." },
    tip: { en: "Molten cake, one between two. It is a lot.", ar: "مولتن كيك، واحدة بين اثنين. الكمية كبيرة." }
  },
  {
    id: "cocoa-room",
    name: { en: "Cocoa Room", ar: "كوكوا روم" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "coffee", cat: "dessert", price: 2,
    outdoor: false, group: false, late: true,
    quiet: false, kids: true, shisha: false,
    coords: null,
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "The dessert café that started the Kuwait brunch look.", ar: "كافيه الحلا اللي بدأ ستايل البرانش في الكويت." },
    tip: { en: "Waffles, and the pistachio anything.", ar: "الوافل، وأي شي فيه فستق." }
  },
  {
    id: "coffee-museum",
    name: { en: "Coffee Museum", ar: "متحف القهوة" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.335, 48.08],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Part café, part collection — brewing gear from all over.", ar: "نصفه كافيه ونصفه مجموعة — أدوات تحضير من كل مكان." },
    tip: { en: "Ask them to brew a method you've never tried.", ar: "اطلب منهم طريقة تحضير ما جرّبتها قبل." }
  },
  {
    id: "hallab",
    name: { en: "Abdul Rahman Hallab", ar: "عبد الرحمن حلاب" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "dessert", price: 2,
    outdoor: false, group: false, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.3339, 48.0783],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "The Tripoli sweets house — oriental sweets made fresh, not stacked.", ar: "بيت حلويات طرابلس — حلويات شرقية طازجة، ما هي مركومة." },
    tip: { en: "Warm knafeh by the piece, eaten standing up.", ar: "كنافة سخنة بالحبة، وتاكلها واقف." }
  },
  {
    id: "haute-dolci",
    name: { en: "Haute Dolci", ar: "هوت دولتشي" },
    area: { en: "Al-Rai", ar: "الري" },
    vibe: "coffee", cat: "dessert", price: 3,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.302, 47.933],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Dessert treated like a night out, with rooftop seating.", ar: "الحلا كأنه طلعة، وفيه جلسة على السطح." },
    tip: { en: "Ask for the roof. The inside is the ordinary version.", ar: "اطلب السطح. الداخل هو النسخة العادية." }
  },
  {
    id: "karak-corniche",
    name: { en: "Karak on the corniche", ar: "كرك على الكورنيش" },
    area: { en: "Gulf Road", ar: "طريق الخليج" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: true,
    coords: [29.36, 48.03],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Not a place so much as a ritual: tea in the car, facing the sea.", ar: "ليست مكاناً بقدر ما هي عادة: چاي في السيارة قبال البحر." },
    tip: { en: "Karak and chebab from any roadside stand after sunset.", ar: "كرك وچباب من أي بسطة بعد المغرب." }
  },
  {
    id: "life-with-cacao",
    name: { en: "Life with Cacao", ar: "لايف ويث كاكاو" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "coffee", cat: "dessert", price: 3,
    outdoor: false, group: false, late: true,
    quiet: true, kids: true, shisha: false,
    coords: null,
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "For the chocolate end of the spectrum, in most of the big malls.", ar: "للطرف الشوكلاتي، وموجود في معظم المجمعات الكبيرة." },
    tip: { en: "The baklava cheesecake — both traditions at once.", ar: "تشيز كيك البقلاوة — التقليدين مع بعض." }
  },
  {
    id: "marina-crescent",
    name: { en: "Marina Crescent", ar: "مارينا كريسنت" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "outdoors", price: 2,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: true,
    coords: [29.3395, 48.0836],
    picky: { veg: true, seafood: false, familiar: true, meal: true },
    note: { en: "Waterfront strip of cafés facing the boats.", ar: "واجهة بحرية من المقاهي قبال القوارب." },
    tip: { en: "Coffee outside on a winter evening, not a summer one.", ar: "قهوة بالخارج في مسية شتوية، لا صيفية." }
  },
  {
    id: "mubarakiya-chai",
    name: { en: "Mubarakiya tea houses", ar: "مقاهي المباركية" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: true,
    coords: [29.376, 47.977],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Plastic stools in a market alley. The oldest hangout in the country.", ar: "كراسي بلاستيك في فريج السوق. أقدم مقعد في البلد." },
    tip: { en: "Chai haleeb and a shisha, any winter evening after 8.", ar: "چاي حليب وشيشة، أي مسية شتوية بعد الثمان." }
  },
  {
    id: "mug-roastery",
    name: { en: "Mug Coffee & Roastery", ar: "مق كوفي آند روستري" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.379, 47.992],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "A small Sharq roastery with a short, well-made menu.", ar: "محمصة صغيرة في شرق، بمنيو قصير ومتقن." },
    tip: { en: "Good for a quiet coffee before the corniche.", ar: "مناسب لقهوة هادئة قبل الكورنيش." }
  },
  {
    id: "oru-roasters",
    name: { en: "Oru Roasters", ar: "أورو روسترز" },
    area: { en: "Shuwaikh Industrial", ar: "الشويخ الصناعية" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.33, 47.92],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Raw industrial space, third-wave coffee. Worth the odd location.", ar: "مساحة صناعية خام وقهوة الموجة الثالثة. تستاهل الموقع الغريب." },
    tip: { en: "A filter coffee and a slow hour. Weekday mornings are empty.", ar: "قهوة فلتر وساعة هادئة. صبح أيام الأسبوع فاضي." }
  },
  {
    id: "pause-coffee",
    name: { en: "Pause Coffee Roasters", ar: "بوز كوفي روسترز" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.38, 47.993],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Roastery-led and serious about the coffee, not the decor.", ar: "محمصة تهتم بالقهوة أكثر من الديكور." },
    tip: { en: "Ask what they roasted this week and take it black.", ar: "اسأل شنو حمّصوا هذا الأسبوع واشربها سادة." }
  },
  {
    id: "sale-sucre",
    name: { en: "Salé Sucré", ar: "ساليه سوكريه" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "dessert", price: 2,
    outdoor: false, group: true, late: true,
    quiet: true, kids: true, shisha: false,
    coords: [29.3339, 48.0783],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Arabic sweets and cakes side by side, done properly.", ar: "حلويات عربية وكيك جنب جنب، ومتقنة." },
    tip: { en: "Mango kunafa, in season.", ar: "كنافة المانجو، في موسمها." }
  },
  {
    id: "tobys-estate",
    name: { en: "Toby's Estate", ar: "توبيز إستيت" },
    area: { en: "Salmiya — waterfront", ar: "السالمية — الواجهة البحرية" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.334, 48.09],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Bigger, brighter and easier to sit in with a few people.", ar: "أوسع وأضوى، وأسهل تقعد فيه مع مجموعة." },
    tip: { en: "The batch brew, and a table on the terrace.", ar: "الباتش برو، وطاولة على التراس." }
  },
  {
    id: "vol-1",
    name: { en: "Vol.1", ar: "فول ١" },
    area: { en: "Shuwaikh Industrial", ar: "الشويخ الصناعية" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.329, 47.921],
    picky: { veg: true, seafood: false, familiar: true, meal: false },
    note: { en: "Minimal, Japanese-influenced, and quiet enough to work in.", ar: "بسيط بتأثير ياباني، وهادي بما يكفي للشغل." },
    tip: { en: "Bring a laptop, take the corner seat.", ar: "خذ لابتوبك واقعد في الزاوية." }
  },
  {
    id: "360-mall",
    name: { en: "360 Mall", ar: "مجمع 360" },
    area: { en: "Zahra", ar: "الزهراء" },
    vibe: "chill", cat: "activity", price: 3,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: true,
    coords: [29.283, 47.993],
    picky: null,
    note: { en: "The quieter, higher-end mall, with a real cinema and a sports club.", ar: "المجمع الأهدأ والأرقى، وفيه سينما ونادي رياضي." },
    tip: { en: "Better than the Avenues if crowds aren't your thing.", ar: "أفضل من الأفنيوز إذا ما تحب الزحمة." }
  },
  {
    id: "al-kout",
    name: { en: "Al Kout Beach", ar: "شاطئ الكوت" },
    area: { en: "Fahaheel", ar: "الفحيحيل" },
    vibe: "chill", cat: "outdoors", price: 1,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: true,
    coords: [29.082, 48.13],
    picky: null,
    note: { en: "Beach, fountains and a mall, all in one stop down south.", ar: "شاطئ ونوافير ومجمع، كلها في مكان واحد بالجنوب." },
    tip: { en: "Evenings, for the fountain show and the sea breeze.", ar: "بالمسية، عشان عرض النوافير ونسمة البحر." }
  },
  {
    id: "avenues",
    name: { en: "The Avenues", ar: "الأفنيوز" },
    area: { en: "Al-Rai", ar: "الري" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.302, 47.933],
    picky: null,
    note: { en: "One of the largest malls on earth. A destination, not an errand.", ar: "من أكبر المجمعات في العالم. مقصد، لا مشوار." },
    tip: { en: "Start in Grand Avenue and don't plan anything after.", ar: "ابدأ من الجراند أفنيو ولا ترتب شي بعده." }
  },
  {
    id: "bowling",
    name: { en: "Bowling", ar: "البولينج" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: null,
    picky: null,
    note: { en: "The plan nobody objects to, and it fills two hours easily.", ar: "الخطة اللي ما أحد يعترض عليها، وتعبّي ساعتين بسهولة." },
    tip: { en: "Two lanes for six people, so nobody stands around waiting.", ar: "مسارين لستة أشخاص، عشان ما أحد يوقف ينتظر." }
  },
  {
    id: "cinescape",
    name: { en: "Cinema night", ar: "ليلة سينما" },
    area: { en: "Al-Rai / Zahra", ar: "الري / الزهراء" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: null,
    picky: null,
    note: { en: "The reliable fallback when nobody can agree on anything.", ar: "الخيار المضمون لمّا ما أحد يتفق على شي." },
    tip: { en: "Late show, then dessert. Book seats on the app first.", ar: "عرض متأخر، وبعده حلا. احجز المقاعد من التطبيق." }
  },
  {
    id: "desert-camping",
    name: { en: "Desert camping", ar: "التخييم في البر" },
    area: { en: "Kabd / Salmi", ar: "كبد / السالمي" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: true,
    coords: [29.17, 47.75],
    picky: null,
    note: { en: "The winter season everyone here plans their year around.", ar: "موسم الشتاء اللي يرتب عليه الناس سنتهم." },
    tip: { en: "Late November to February only. Go with someone who knows the way.", ar: "من آخر نوفمبر إلى فبراير فقط. روح مع أحد يعرف الطريق." }
  },
  {
    id: "green-island",
    name: { en: "Green Island", ar: "الجزيرة الخضراء" },
    area: { en: "Bneid Al-Qar", ar: "بنيد القار" },
    vibe: "chill", cat: "outdoors", price: 1,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.3839, 48.0007],
    picky: null,
    note: { en: "A man-made island off the Gulf Road, built for walking.", ar: "جزيرة صناعية على طريق الخليج، للمشي." },
    tip: { en: "Sunset from the amphitheatre end.", ar: "الغروب من جهة المسرح." }
  },
  {
    id: "gulf-road",
    name: { en: "Gulf Road corniche", ar: "كورنيش طريق الخليج" },
    area: { en: "Salmiya to Sharq", ar: "من السالمية إلى شرق" },
    vibe: "chill", cat: "outdoors", price: 0,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.36, 48.03],
    picky: null,
    note: { en: "Kilometres of seafront path — the city's real living room.", ar: "كيلومترات من الممشى البحري — مجلس المدينة الحقيقي." },
    tip: { en: "Cycle or walk it between November and March.", ar: "امشِ أو اركب دراجة بين نوفمبر ومارس." }
  },
  {
    id: "infunity",
    name: { en: "Infunity", ar: "إنفينيتي" },
    area: { en: "Zahra — 360 Mall", ar: "الزهراء — مجمع 360" },
    vibe: "chill", cat: "activity", price: 3,
    outdoor: false, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: [29.283, 47.993],
    picky: null,
    note: { en: "Rock climbing, rope courses and arcade games under one roof.", ar: "تسلق صخري ومسارات حبال وألعاب، كلها تحت سقف واحد." },
    tip: { en: "The rope course first, while everyone still has energy.", ar: "مسار الحبال أول، والكل عنده طاقة." }
  },
  {
    id: "karting",
    name: { en: "Go-karting", ar: "الكارتينج" },
    area: { en: "Several tracks", ar: "مسارات متعددة" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: null,
    picky: null,
    note: { en: "Competitive, loud, and over in twenty minutes. Ideal for a group.", ar: "تنافسي وعالي وينتهي في عشرين دقيقة. مثالي للجمعة." },
    tip: { en: "Book a group session so you all race together.", ar: "احجزوا جلسة جماعية عشان تتسابقون مع بعض." }
  },
  {
    id: "kubbar",
    name: { en: "Kubbar Island", ar: "جزيرة كبر" },
    area: { en: "Offshore — by boat", ar: "بحراً — بالقارب" },
    vibe: "chill", cat: "activity", price: 3,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [28.75, 48.49],
    picky: null,
    note: { en: "Clear water and coral, an hour out by boat.", ar: "ماي صافي وشعاب، ساعة بالقارب." },
    tip: { en: "Snorkelling. Charter with a group to split the cost.", ar: "سنوركل. استأجر قارب مع مجموعة لتقسيم التكلفة." }
  },
  {
    id: "padel",
    name: { en: "Padel courts", ar: "ملاعب البادل" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: true, group: true, late: true,
    quiet: false, kids: true, shisha: false,
    coords: null,
    picky: null,
    note: { en: "The group sport that took over Kuwait. Easy for beginners.", ar: "الرياضة اللي اجتاحت الكويت. سهلة للمبتدئين." },
    tip: { en: "Book a court for four, then eat after. Peak slots go days ahead.", ar: "احجز ملعب لأربعة، وكلوا بعدها. الأوقات الحلوة تنحجز بأيام." }
  },
  {
    id: "sea-city",
    name: { en: "Sabah Al-Ahmad Sea City", ar: "مدينة صباح الأحمد البحرية" },
    area: { en: "South Kuwait", ar: "جنوب الكويت" },
    vibe: "chill", cat: "outdoors", price: 1,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [28.66, 48.29],
    picky: null,
    note: { en: "A city of man-made canals cut into the desert coast.", ar: "مدينة قنوات صناعية محفورة في ساحل الصحراء." },
    tip: { en: "Worth the drive for the scale of it. Kayak if you can.", ar: "تستاهل السواقة عشان حجمها. جرّب الكياك إذا تقدر." }
  },
  {
    id: "shaheed-park",
    name: { en: "Al Shaheed Park", ar: "حديقة الشهيد" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "chill", cat: "outdoors", price: 0,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.369, 47.986],
    picky: null,
    note: { en: "The city's best park, with two museums built into it.", ar: "أفضل حديقة في المدينة، وفيها متحفان." },
    tip: { en: "Walk it after dark, when the skyline is lit.", ar: "تمشَّ فيها بعد المغرب، وقت إضاءة المدينة." }
  },
  {
    id: "shisha-marina",
    name: { en: "Shisha by the marina", ar: "شيشة على المارينا" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "chill", cat: "cafe", price: 2,
    outdoor: true, group: true, late: true,
    quiet: false, kids: false, shisha: true,
    coords: [29.3395, 48.0836],
    picky: null,
    note: { en: "The default group plan: a long table facing the boats.", ar: "الخطة الافتراضية للجمعة: طاولة طويلة قبال القوارب." },
    tip: { en: "Get there before 9 on a weekend or you're waiting.", ar: "وصّل قبل التسع في نهاية الأسبوع وإلا بتنتظر." }
  },
  {
    id: "shuwaikh-beach",
    name: { en: "Shuwaikh Beach", ar: "شاطئ الشويخ" },
    area: { en: "Shuwaikh", ar: "الشويخ" },
    vibe: "chill", cat: "outdoors", price: 0,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.356, 47.928],
    picky: null,
    note: { en: "Wide open sand, kitesurfers, and space to actually sit.", ar: "رمل واسع، وكايت سيرف، ومكان تقعد فيه فعلاً." },
    tip: { en: "Bring a mat and food. Best two hours before sunset.", ar: "خذ فرشة وأكل. أحلى وقت ساعتين قبل الغروب." }
  },
  {
    id: "souq-mubarakiya",
    name: { en: "Souq Mubarakiya", ar: "سوق المباركية" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "chill", cat: "souq", price: 1,
    outdoor: true, group: true, late: false,
    quiet: false, kids: true, shisha: true,
    coords: [29.376, 47.977],
    picky: null,
    note: { en: "The old market at the heart of the city, still working.", ar: "السوق القديم في قلب المدينة، ولا زال يعمل." },
    tip: { en: "Go in the evening. Dates, spices, and dinner in the alley cafés.", ar: "روح بالمسية. تمر، بهارات، وعشاء في مقاهي الفريج." }
  },
  {
    id: "al-hashemi",
    name: { en: "Al Hashemi Marine Museum", ar: "متحف الهاشمي البحري" },
    area: { en: "Salwa", ar: "سلوى" },
    vibe: "different", cat: "museum", price: 0,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.292, 48.081],
    picky: null,
    note: { en: "Home of the largest wooden dhow ever built.", ar: "يضم أكبر سفينة خشبية بُنيت في العالم." },
    tip: { en: "Pair it with dinner at Al Boom next door.", ar: "اجمعها مع عشاء في البوم المجاور." }
  },
  {
    id: "amricani",
    name: { en: "Amricani Cultural Centre", ar: "المركز الأمريكاني الثقافي" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.3735, 47.9945],
    picky: null,
    note: { en: "Islamic art exhibitions in Kuwait's old American hospital.", ar: "معارض فن إسلامي في المستشفى الأمريكاني القديم." },
    tip: { en: "Exhibitions rotate — check what's showing.", ar: "المعارض متغيرة — شوف الحالي." }
  },
  {
    id: "ascc",
    name: { en: "Sheikh Abdullah Al-Salem Cultural Centre", ar: "مركز الشيخ عبدالله السالم الثقافي" },
    area: { en: "Shuwaikh", ar: "الشويخ" },
    vibe: "different", cat: "museum", price: 2,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.3556, 47.9384],
    picky: null,
    note: { en: "Several full museums on one campus — science, history, space.", ar: "عدة متاحف كاملة في مجمع واحد — علوم، تاريخ، فضاء." },
    tip: { en: "Give it a whole day. Don't try to do all of it in two hours.", ar: "خصّص له يوم كامل. لا تحاول تشوف كل شي في ساعتين." }
  },
  {
    id: "bait-al-othman",
    name: { en: "Bait Al-Othman Museum", ar: "متحف بيت العثمان" },
    area: { en: "Hawally", ar: "حولي" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.279, 48.064],
    picky: null,
    note: { en: "Old Kuwaiti daily life, reconstructed room by room.", ar: "الحياة الكويتية القديمة، معاد بناؤها غرفة غرفة." },
    tip: { en: "The pearl-diving and pre-oil sections are the reason to come.", ar: "أقسام الغوص وما قبل النفط هي سبب الزيارة." }
  },
  {
    id: "dickson-house",
    name: { en: "Dickson House Cultural Centre", ar: "بيت ديكسون" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "different", cat: "museum", price: 0,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.38, 47.99],
    picky: null,
    note: { en: "A seafront house preserved from pre-oil Kuwait.", ar: "بيت على البحر محفوظ من كويت ما قبل النفط." },
    tip: { en: "Small enough to fold into a Gulf Road afternoon.", ar: "صغير، يناسب عصرية على طريق الخليج." }
  },
  {
    id: "failaka",
    name: { en: "Failaka Island", ar: "جزيرة فيلكا" },
    area: { en: "Offshore — ferry from Salmiya", ar: "بحراً — العبّارة من السالمية" },
    vibe: "different", cat: "activity", price: 2,
    outdoor: true, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.445, 48.33],
    picky: null,
    note: { en: "A day trip to Bronze Age ruins and an abandoned town.", ar: "رحلة يوم إلى آثار العصر البرونزي وقرية مهجورة." },
    tip: { en: "Book the ferry ahead and take water — shade is scarce.", ar: "احجز العبّارة مقدماً وخذ ماي — الظل قليل." }
  },
  {
    id: "grand-mosque",
    name: { en: "Grand Mosque", ar: "المسجد الكبير" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "different", cat: "landmark", price: 0,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.373, 47.988],
    picky: null,
    note: { en: "Kuwait's largest mosque, and the guided tour is genuinely good.", ar: "أكبر مسجد في الكويت، والجولة المرشدة ممتازة فعلاً." },
    tip: { en: "Free tours for visitors — check times before going.", ar: "جولات مجانية للزوار — تأكد من المواعيد قبل الزيارة." }
  },
  {
    id: "jacc",
    name: { en: "Sheikh Jaber Al-Ahmad Cultural Centre", ar: "مركز الشيخ جابر الأحمد الثقافي" },
    area: { en: "Shuwaikh", ar: "الشويخ" },
    vibe: "different", cat: "activity", price: 2,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.373, 47.981],
    picky: null,
    note: { en: "An opera house and concert complex on the waterfront.", ar: "دار أوبرا ومجمع حفلات على الواجهة البحرية." },
    tip: { en: "Check what's on before you plan the night around it.", ar: "شوف البرنامج قبل ترتب ليلتك عليه." }
  },
  {
    id: "kuwait-towers",
    name: { en: "Kuwait Towers", ar: "أبراج الكويت" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "different", cat: "landmark", price: 1,
    outdoor: false, group: false, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.3897, 48],
    picky: null,
    note: { en: "The country's front door, and the view from the top proves it.", ar: "واجهة البلد، والمنظر من فوق يثبت ذلك." },
    tip: { en: "Go up an hour before sunset.", ar: "اصعد قبل الغروب بساعة." }
  },
  {
    id: "mirror-house",
    name: { en: "Mirror House", ar: "بيت المرايا" },
    area: { en: "Qadsiya", ar: "القادسية" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.3475, 47.9905],
    picky: null,
    note: { en: "A family home covered, inside and out, in mirror mosaic.", ar: "بيت عائلة مغطى من الداخل والخارج بفسيفساء المرايا." },
    tip: { en: "Visits are by appointment only — arrange it before you drive over.", ar: "الزيارة بموعد مسبق فقط — رتّب قبل ما تروح." }
  },
  {
    id: "national-museum",
    name: { en: "Kuwait National Museum", ar: "متحف الكويت الوطني" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: true, late: false,
    quiet: true, kids: true, shisha: false,
    coords: [29.376, 47.984],
    picky: null,
    note: { en: "Kuwait's own story, plus a planetarium and a dhow in the yard.", ar: "قصة الكويت، مع قبة فلكية وسفينة في الساحة." },
    tip: { en: "Ask about planetarium show times when you buy the ticket.", ar: "اسأل عن مواعيد عرض القبة الفلكية عند شراء التذكرة." }
  },
  {
    id: "qurain-house",
    name: { en: "Al-Qurain Martyrs Museum", ar: "متحف الشهداء بالقرين" },
    area: { en: "Qurain", ar: "القرين" },
    vibe: "different", cat: "museum", price: 0,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.238, 48.064],
    picky: null,
    note: { en: "A house left exactly as the 1991 battle left it.", ar: "بيت تُرك كما تركته معركة ١٩٩١." },
    tip: { en: "Quiet, small, and heavier than any other museum here.", ar: "هادئ، صغير، وأثقل من أي متحف ثاني هنا." }
  },
  {
    id: "sadu-house",
    name: { en: "Sadu House", ar: "بيت السدو" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.3755, 47.9835],
    picky: null,
    note: { en: "Bedouin weaving kept alive, in a coral-and-gypsum courtyard house.", ar: "حفظ نسيج السدو البدوي، في بيت من الحجر والجص." },
    tip: { en: "Buy something woven. The shop funds the weavers.", ar: "اشترِ قطعة سدو. المحل يدعم النسّاجات." }
  },
  {
    id: "scientific-center",
    name: { en: "The Scientific Center", ar: "المركز العلمي" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "different", cat: "museum", price: 2,
    outdoor: true, group: true, late: false,
    quiet: false, kids: true, shisha: false,
    coords: [29.3494, 48.0925],
    picky: null,
    note: { en: "Aquarium, IMAX, and a working dhow harbour outside.", ar: "أكواريوم، آيماكس، وميناء سفن خشبية بالخارج." },
    tip: { en: "The aquarium tunnel, then walk the dhow harbour.", ar: "نفق الأكواريوم، وبعدها تمشَّ في ميناء السفن." }
  },
  {
    id: "tareq-rajab",
    name: { en: "Tareq Rajab Museum", ar: "متحف طارق رجب" },
    area: { en: "Jabriya", ar: "الجابرية" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    quiet: true, kids: false, shisha: false,
    coords: [29.317, 48.027],
    picky: null,
    note: { en: "A world-class Islamic art collection in a private basement.", ar: "مجموعة فن إسلامي عالمية في سرداب بيت خاص." },
    tip: { en: "The calligraphy museum is a separate building nearby — do both.", ar: "متحف الخط في مبنى قريب منفصل — زر الاثنين." }
  }
];
