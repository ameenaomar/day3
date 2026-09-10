/* Yalla, where to? — place data.
 *
 * This is the only file you need to edit to add, change or remove a place.
 *
 *   id       unique short slug. Used to remember tried/saved state, so never
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
 *   price    0 = free, 1 = cheap, 2 = mid, 3 = splurge
 *   outdoor  true if there's real outdoor seating, or it's outdoors entirely
 *   group    true if a big group fits without a fight over tables
 *   late     true if it's usually still going past midnight
 *   note     { en, ar }  one line on what the place is
 *   tip      { en, ar }  what to order, or what to actually do there
 *
 * Seed data: hours, prices and whether a place is still open change fast in
 * Kuwait. Verify before trusting an entry, and fix it here when it's wrong.
 */

window.PLACES = [
  {
    id: "al-boom",
    name: { en: "Al Boom", ar: "البوم" },
    area: { en: "Salwa", ar: "سلوى" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: false, group: true, late: false,
    note: { en: "A restaurant built inside a real wooden dhow.", ar: "مطعم داخل سفينة خشبية حقيقية." },
    tip: { en: "Grilled hamour. Ask for a table on the upper deck.", ar: "هامور مشوي. اطلب طاولة في الطابق الأعلى." }
  },
  {
    id: "bait-7",
    name: { en: "Bait 7", ar: "بيت ٧" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: false, group: true, late: false,
    note: { en: "Kuwaiti home cooking in a restored courtyard house.", ar: "أكل كويتي بيتي في بيت قديم مرمّم." },
    tip: { en: "Machboos dyay, and leave room for the mahalabiya.", ar: "مچبوس دياي، وخلّ مكان للمهلبية." }
  },
  {
    id: "dar-hamad",
    name: { en: "Dar Hamad", ar: "دار حمد" },
    area: { en: "Sharq — Gulf Road", ar: "شرق — طريق الخليج" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: false, group: true, late: false,
    note: { en: "The dressed-up version of Kuwaiti cuisine, with a sea view.", ar: "المطبخ الكويتي بأسلوب راقي، وعلى البحر." },
    tip: { en: "Murabyan (shrimp machboos). Book ahead on weekends.", ar: "مربيان. احجز مقدماً في نهاية الأسبوع." }
  },
  {
    id: "freej-swaileh",
    name: { en: "Freej Swaileh", ar: "فريج صويلح" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "eat", cat: "breakfast", price: 1,
    outdoor: false, group: true, late: true,
    note: { en: "Kuwaiti breakfast done properly, and busy at every hour.", ar: "ريوق كويتي أصلي، وزحمة في كل وقت." },
    tip: { en: "Balaleet and chebab with a karak on the side.", ar: "بلاليط وچباب مع كرك." }
  },
  {
    id: "mais-alghanim",
    name: { en: "Mais Alghanim", ar: "ميس الغانم" },
    area: { en: "Sharq — Gulf Road", ar: "شرق — طريق الخليج" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: true, group: true, late: false,
    note: { en: "A Kuwait institution since the 1950s. Everyone has been.", ar: "من علامات الكويت منذ الخمسينات. الكل زارها." },
    tip: { en: "Mixed grill, hummus, and the fresh juice.", ar: "مشاوي مشكّلة، حمّص، وعصير طازج." }
  },
  {
    id: "melenzane",
    name: { en: "Melenzane", ar: "ميلنزاني" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "eat", cat: "food", price: 3,
    outdoor: false, group: false, late: false,
    note: { en: "The Italian people in Kuwait actually rate.", ar: "المطعم الإيطالي اللي يمدحه أهل الكويت." },
    tip: { en: "Truffle pasta. Reserve — it fills up.", ar: "باستا الترفل. احجز، المكان يمتلئ بسرعة." }
  },
  {
    id: "slider-station",
    name: { en: "Slider Station", ar: "سلايدر ستيشن" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "eat", cat: "food", price: 1,
    outdoor: true, group: true, late: true,
    note: { en: "Kuwait's own burger chain, and still the benchmark.", ar: "سلسلة البرغر الكويتية، ولا زالت المعيار." },
    tip: { en: "The classic slider and truffle fries.", ar: "السلايدر الكلاسيك وبطاطس الترفل." }
  },
  {
    id: "souq-sharq-fish",
    name: { en: "Souq Sharq fish market", ar: "سوق السمك — سوق شرق" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "eat", cat: "souq", price: 2,
    outdoor: false, group: true, late: false,
    note: { en: "Pick your fish off the ice, then hand it over to be cooked.", ar: "اختر سمكتك من الثلج، وسلّمها لتُطبخ." },
    tip: { en: "Zubaidi if it's in season. Go early for the catch.", ar: "زبيدي إذا كان موسمه. روح بدري على السمك الطازج." }
  },
  {
    id: "villa-fayrouz",
    name: { en: "Villa Fayrouz", ar: "فيلا فيروز" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "eat", cat: "food", price: 2,
    outdoor: true, group: true, late: false,
    note: { en: "Lebanese mezze in a converted villa garden.", ar: "مازة لبنانية في حديقة فيلا." },
    tip: { en: "Order too many cold mezze. That is the point.", ar: "اطلب مازة باردة أكثر من اللازم. هذا المقصود." }
  },
  {
    id: "arabica",
    name: { en: "% Arabica", ar: "٪ أرابيكا" },
    area: { en: "Al Bidaa — Gulf Road", ar: "البدع — طريق الخليج" },
    vibe: "coffee", cat: "cafe", price: 2,
    outdoor: true, group: false, late: false,
    note: { en: "Minimal, bright, and the coffee is the point — with the sea outside.", ar: "بسيط ومضيء، والقهوة هي الأساس — والبحر بالخارج." },
    tip: { en: "Spanish latte, then walk it off along the corniche.", ar: "سبانش لاتيه، وبعدها تمشَّ على الكورنيش." }
  },
  {
    id: "beit-lothan",
    name: { en: "Beit Lothan", ar: "بيت لوثان" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: true, group: false, late: false,
    note: { en: "An old seafront house turned art space, with a quiet garden café.", ar: "بيت قديم على البحر صار مساحة فنية، وفيه كافيه هادئ بالحديقة." },
    tip: { en: "Go when you want to talk without shouting.", ar: "روح لمّا تبغى تتكلم بدون ما تصرخ." }
  },
  {
    id: "cocoa-room",
    name: { en: "Cocoa Room", ar: "كوكوا روم" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "coffee", cat: "dessert", price: 2,
    outdoor: false, group: false, late: true,
    note: { en: "The dessert café that started the Kuwait brunch look.", ar: "كافيه الحلا اللي بدأ ستايل البرانش في الكويت." },
    tip: { en: "Waffles, and the pistachio anything.", ar: "الوافل، وأي شي فيه فستق." }
  },
  {
    id: "coffee-museum",
    name: { en: "Coffee Museum", ar: "متحف القهوة" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: false, group: false, late: false,
    note: { en: "Part café, part collection — brewing gear from all over.", ar: "نصفه كافيه ونصفه مجموعة — أدوات تحضير من كل مكان." },
    tip: { en: "Ask them to brew a method you've never tried.", ar: "اطلب منهم طريقة تحضير ما جرّبتها قبل." }
  },
  {
    id: "karak-corniche",
    name: { en: "Karak on the corniche", ar: "كرك على الكورنيش" },
    area: { en: "Gulf Road", ar: "طريق الخليج" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: true, group: true, late: true,
    note: { en: "Not a place so much as a ritual: tea in the car, facing the sea.", ar: "ليست مكاناً بقدر ما هي عادة: چاي في السيارة قبال البحر." },
    tip: { en: "Karak and chebab from any roadside stand after sunset.", ar: "كرك وچباب من أي بسطة بعد المغرب." }
  },
  {
    id: "marina-crescent",
    name: { en: "Marina Crescent", ar: "مارينا كريسنت" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "coffee", cat: "outdoors", price: 2,
    outdoor: true, group: true, late: true,
    note: { en: "Waterfront strip of cafés facing the boats.", ar: "واجهة بحرية من المقاهي قبال القوارب." },
    tip: { en: "Coffee outside on a winter evening, not a summer one.", ar: "قهوة بالخارج في مسية شتوية، لا صيفية." }
  },
  {
    id: "mubarakiya-chai",
    name: { en: "Mubarakiya tea houses", ar: "مقاهي المباركية" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "coffee", cat: "cafe", price: 1,
    outdoor: true, group: true, late: true,
    note: { en: "Plastic stools in a market alley. The oldest hangout in the country.", ar: "كراسي بلاستيك في فريج السوق. أقدم مقعد في البلد." },
    tip: { en: "Chai haleeb and a shisha, any winter evening after 8.", ar: "چاي حليب وشيشة، أي مسية شتوية بعد الثمان." }
  },
  {
    id: "360-mall",
    name: { en: "360 Mall", ar: "مجمع 360" },
    area: { en: "Zahra", ar: "الزهراء" },
    vibe: "chill", cat: "activity", price: 3,
    outdoor: false, group: true, late: true,
    note: { en: "The quieter, higher-end mall, with a real cinema and a sports club.", ar: "المجمع الأهدأ والأرقى، وفيه سينما ونادي رياضي." },
    tip: { en: "Better than the Avenues if crowds aren't your thing.", ar: "أفضل من الأفنيوز إذا ما تحب الزحمة." }
  },
  {
    id: "al-kout",
    name: { en: "Al Kout Beach", ar: "شاطئ الكوت" },
    area: { en: "Fahaheel", ar: "الفحيحيل" },
    vibe: "chill", cat: "outdoors", price: 1,
    outdoor: true, group: true, late: true,
    note: { en: "Beach, fountains and a mall, all in one stop down south.", ar: "شاطئ ونوافير ومجمع، كلها في مكان واحد بالجنوب." },
    tip: { en: "Evenings, for the fountain show and the sea breeze.", ar: "بالمسية، عشان عرض النوافير ونسمة البحر." }
  },
  {
    id: "avenues",
    name: { en: "The Avenues", ar: "الأفنيوز" },
    area: { en: "Al-Rai", ar: "الري" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: false, group: true, late: true,
    note: { en: "One of the largest malls on earth. A destination, not an errand.", ar: "من أكبر المجمعات في العالم. مقصد، لا مشوار." },
    tip: { en: "Start in Grand Avenue and don't plan anything after.", ar: "ابدأ من الجراند أفنيو ولا ترتب شي بعده." }
  },
  {
    id: "cinescape",
    name: { en: "Cinema night", ar: "ليلة سينما" },
    area: { en: "Al-Rai / Zahra", ar: "الري / الزهراء" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: false, group: true, late: true,
    note: { en: "The reliable fallback when nobody can agree on anything.", ar: "الخيار المضمون لمّا ما أحد يتفق على شي." },
    tip: { en: "Late show, then dessert. Book seats on the app first.", ar: "عرض متأخر، وبعده حلا. احجز المقاعد من التطبيق." }
  },
  {
    id: "desert-camping",
    name: { en: "Desert camping", ar: "التخييم في البر" },
    area: { en: "Kabd / Salmi", ar: "كبد / السالمي" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: true, group: true, late: false,
    note: { en: "The winter season everyone here plans their year around.", ar: "موسم الشتاء اللي يرتب عليه الناس سنتهم." },
    tip: { en: "Late November to February only. Go with someone who knows the way.", ar: "من آخر نوفمبر إلى فبراير فقط. روح مع أحد يعرف الطريق." }
  },
  {
    id: "green-island",
    name: { en: "Green Island", ar: "الجزيرة الخضراء" },
    area: { en: "Bneid Al-Qar", ar: "بنيد القار" },
    vibe: "chill", cat: "outdoors", price: 1,
    outdoor: true, group: true, late: false,
    note: { en: "A man-made island off the Gulf Road, built for walking.", ar: "جزيرة صناعية على طريق الخليج، للمشي." },
    tip: { en: "Sunset from the amphitheatre end.", ar: "الغروب من جهة المسرح." }
  },
  {
    id: "gulf-road",
    name: { en: "Gulf Road corniche", ar: "كورنيش طريق الخليج" },
    area: { en: "Salmiya to Sharq", ar: "من السالمية إلى شرق" },
    vibe: "chill", cat: "outdoors", price: 0,
    outdoor: true, group: true, late: false,
    note: { en: "Kilometres of seafront path — the city's real living room.", ar: "كيلومترات من الممشى البحري — مجلس المدينة الحقيقي." },
    tip: { en: "Cycle or walk it between November and March.", ar: "امشِ أو اركب دراجة بين نوفمبر ومارس." }
  },
  {
    id: "kubbar",
    name: { en: "Kubbar Island", ar: "جزيرة كبر" },
    area: { en: "Offshore — by boat", ar: "بحراً — بالقارب" },
    vibe: "chill", cat: "activity", price: 3,
    outdoor: true, group: true, late: false,
    note: { en: "Clear water and coral, an hour out by boat.", ar: "ماي صافي وشعاب، ساعة بالقارب." },
    tip: { en: "Snorkelling. Charter with a group to split the cost.", ar: "سنوركل. استأجر قارب مع مجموعة لتقسيم التكلفة." }
  },
  {
    id: "padel",
    name: { en: "Padel courts", ar: "ملاعب البادل" },
    area: { en: "Several branches", ar: "فروع متعددة" },
    vibe: "chill", cat: "activity", price: 2,
    outdoor: true, group: true, late: true,
    note: { en: "The group sport that took over Kuwait. Easy for beginners.", ar: "الرياضة اللي اجتاحت الكويت. سهلة للمبتدئين." },
    tip: { en: "Book a court for four, then eat after. Peak slots go days ahead.", ar: "احجز ملعب لأربعة، وكلوا بعدها. الأوقات الحلوة تنحجز بأيام." }
  },
  {
    id: "sea-city",
    name: { en: "Sabah Al-Ahmad Sea City", ar: "مدينة صباح الأحمد البحرية" },
    area: { en: "South Kuwait", ar: "جنوب الكويت" },
    vibe: "chill", cat: "outdoors", price: 1,
    outdoor: true, group: true, late: false,
    note: { en: "A city of man-made canals cut into the desert coast.", ar: "مدينة قنوات صناعية محفورة في ساحل الصحراء." },
    tip: { en: "Worth the drive for the scale of it. Kayak if you can.", ar: "تستاهل السواقة عشان حجمها. جرّب الكياك إذا تقدر." }
  },
  {
    id: "shaheed-park",
    name: { en: "Al Shaheed Park", ar: "حديقة الشهيد" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "chill", cat: "outdoors", price: 0,
    outdoor: true, group: true, late: false,
    note: { en: "The city's best park, with two museums built into it.", ar: "أفضل حديقة في المدينة، وفيها متحفان." },
    tip: { en: "Walk it after dark, when the skyline is lit.", ar: "تمشَّ فيها بعد المغرب، وقت إضاءة المدينة." }
  },
  {
    id: "shisha-marina",
    name: { en: "Shisha by the marina", ar: "شيشة على المارينا" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "chill", cat: "cafe", price: 2,
    outdoor: true, group: true, late: true,
    note: { en: "The default group plan: a long table facing the boats.", ar: "الخطة الافتراضية للجمعة: طاولة طويلة قبال القوارب." },
    tip: { en: "Get there before 9 on a weekend or you're waiting.", ar: "وصّل قبل التسع في نهاية الأسبوع وإلا بتنتظر." }
  },
  {
    id: "shuwaikh-beach",
    name: { en: "Shuwaikh Beach", ar: "شاطئ الشويخ" },
    area: { en: "Shuwaikh", ar: "الشويخ" },
    vibe: "chill", cat: "outdoors", price: 0,
    outdoor: true, group: true, late: false,
    note: { en: "Wide open sand, kitesurfers, and space to actually sit.", ar: "رمل واسع، وكايت سيرف، ومكان تقعد فيه فعلاً." },
    tip: { en: "Bring a mat and food. Best two hours before sunset.", ar: "خذ فرشة وأكل. أحلى وقت ساعتين قبل الغروب." }
  },
  {
    id: "souq-mubarakiya",
    name: { en: "Souq Mubarakiya", ar: "سوق المباركية" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "chill", cat: "souq", price: 1,
    outdoor: true, group: true, late: false,
    note: { en: "The old market at the heart of the city, still working.", ar: "السوق القديم في قلب المدينة، ولا زال يعمل." },
    tip: { en: "Go in the evening. Dates, spices, and dinner in the alley cafés.", ar: "روح بالمسية. تمر، بهارات، وعشاء في مقاهي الفريج." }
  },
  {
    id: "al-hashemi",
    name: { en: "Al Hashemi Marine Museum", ar: "متحف الهاشمي البحري" },
    area: { en: "Salwa", ar: "سلوى" },
    vibe: "different", cat: "museum", price: 0,
    outdoor: false, group: true, late: false,
    note: { en: "Home of the largest wooden dhow ever built.", ar: "يضم أكبر سفينة خشبية بُنيت في العالم." },
    tip: { en: "Pair it with dinner at Al Boom next door.", ar: "اجمعها مع عشاء في البوم المجاور." }
  },
  {
    id: "amricani",
    name: { en: "Amricani Cultural Centre", ar: "المركز الأمريكاني الثقافي" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    note: { en: "Islamic art exhibitions in Kuwait's old American hospital.", ar: "معارض فن إسلامي في المستشفى الأمريكاني القديم." },
    tip: { en: "Exhibitions rotate — check what's showing.", ar: "المعارض متغيرة — شوف الحالي." }
  },
  {
    id: "ascc",
    name: { en: "Sheikh Abdullah Al-Salem Cultural Centre", ar: "مركز الشيخ عبدالله السالم الثقافي" },
    area: { en: "Shuwaikh", ar: "الشويخ" },
    vibe: "different", cat: "museum", price: 2,
    outdoor: false, group: true, late: false,
    note: { en: "Several full museums on one campus — science, history, space.", ar: "عدة متاحف كاملة في مجمع واحد — علوم، تاريخ، فضاء." },
    tip: { en: "Give it a whole day. Don't try to do all of it in two hours.", ar: "خصّص له يوم كامل. لا تحاول تشوف كل شي في ساعتين." }
  },
  {
    id: "bait-al-othman",
    name: { en: "Bait Al-Othman Museum", ar: "متحف بيت العثمان" },
    area: { en: "Hawally", ar: "حولي" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: true, late: false,
    note: { en: "Old Kuwaiti daily life, reconstructed room by room.", ar: "الحياة الكويتية القديمة، معاد بناؤها غرفة غرفة." },
    tip: { en: "The pearl-diving and pre-oil sections are the reason to come.", ar: "أقسام الغوص وما قبل النفط هي سبب الزيارة." }
  },
  {
    id: "dickson-house",
    name: { en: "Dickson House Cultural Centre", ar: "بيت ديكسون" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "different", cat: "museum", price: 0,
    outdoor: false, group: false, late: false,
    note: { en: "A seafront house preserved from pre-oil Kuwait.", ar: "بيت على البحر محفوظ من كويت ما قبل النفط." },
    tip: { en: "Small enough to fold into a Gulf Road afternoon.", ar: "صغير، يناسب عصرية على طريق الخليج." }
  },
  {
    id: "failaka",
    name: { en: "Failaka Island", ar: "جزيرة فيلكا" },
    area: { en: "Offshore — ferry from Salmiya", ar: "بحراً — العبّارة من السالمية" },
    vibe: "different", cat: "activity", price: 2,
    outdoor: true, group: true, late: false,
    note: { en: "A day trip to Bronze Age ruins and an abandoned town.", ar: "رحلة يوم إلى آثار العصر البرونزي وقرية مهجورة." },
    tip: { en: "Book the ferry ahead and take water — shade is scarce.", ar: "احجز العبّارة مقدماً وخذ ماي — الظل قليل." }
  },
  {
    id: "grand-mosque",
    name: { en: "Grand Mosque", ar: "المسجد الكبير" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "different", cat: "landmark", price: 0,
    outdoor: false, group: true, late: false,
    note: { en: "Kuwait's largest mosque, and the guided tour is genuinely good.", ar: "أكبر مسجد في الكويت، والجولة المرشدة ممتازة فعلاً." },
    tip: { en: "Free tours for visitors — check times before going.", ar: "جولات مجانية للزوار — تأكد من المواعيد قبل الزيارة." }
  },
  {
    id: "jacc",
    name: { en: "Sheikh Jaber Al-Ahmad Cultural Centre", ar: "مركز الشيخ جابر الأحمد الثقافي" },
    area: { en: "Shuwaikh", ar: "الشويخ" },
    vibe: "different", cat: "activity", price: 2,
    outdoor: false, group: true, late: false,
    note: { en: "An opera house and concert complex on the waterfront.", ar: "دار أوبرا ومجمع حفلات على الواجهة البحرية." },
    tip: { en: "Check what's on before you plan the night around it.", ar: "شوف البرنامج قبل ترتب ليلتك عليه." }
  },
  {
    id: "kuwait-towers",
    name: { en: "Kuwait Towers", ar: "أبراج الكويت" },
    area: { en: "Sharq", ar: "شرق" },
    vibe: "different", cat: "landmark", price: 1,
    outdoor: false, group: false, late: false,
    note: { en: "The country's front door, and the view from the top proves it.", ar: "واجهة البلد، والمنظر من فوق يثبت ذلك." },
    tip: { en: "Go up an hour before sunset.", ar: "اصعد قبل الغروب بساعة." }
  },
  {
    id: "mirror-house",
    name: { en: "Mirror House", ar: "بيت المرايا" },
    area: { en: "Qadsiya", ar: "القادسية" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    note: { en: "A family home covered, inside and out, in mirror mosaic.", ar: "بيت عائلة مغطى من الداخل والخارج بفسيفساء المرايا." },
    tip: { en: "Visits are by appointment only — arrange it before you drive over.", ar: "الزيارة بموعد مسبق فقط — رتّب قبل ما تروح." }
  },
  {
    id: "national-museum",
    name: { en: "Kuwait National Museum", ar: "متحف الكويت الوطني" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: true, late: false,
    note: { en: "Kuwait's own story, plus a planetarium and a dhow in the yard.", ar: "قصة الكويت، مع قبة فلكية وسفينة في الساحة." },
    tip: { en: "Ask about planetarium show times when you buy the ticket.", ar: "اسأل عن مواعيد عرض القبة الفلكية عند شراء التذكرة." }
  },
  {
    id: "qurain-house",
    name: { en: "Al-Qurain Martyrs Museum", ar: "متحف الشهداء بالقرين" },
    area: { en: "Qurain", ar: "القرين" },
    vibe: "different", cat: "museum", price: 0,
    outdoor: false, group: false, late: false,
    note: { en: "A house left exactly as the 1991 battle left it.", ar: "بيت تُرك كما تركته معركة ١٩٩١." },
    tip: { en: "Quiet, small, and heavier than any other museum here.", ar: "هادئ، صغير، وأثقل من أي متحف ثاني هنا." }
  },
  {
    id: "sadu-house",
    name: { en: "Sadu House", ar: "بيت السدو" },
    area: { en: "Kuwait City", ar: "مدينة الكويت" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    note: { en: "Bedouin weaving kept alive, in a coral-and-gypsum courtyard house.", ar: "حفظ نسيج السدو البدوي، في بيت من الحجر والجص." },
    tip: { en: "Buy something woven. The shop funds the weavers.", ar: "اشترِ قطعة سدو. المحل يدعم النسّاجات." }
  },
  {
    id: "scientific-center",
    name: { en: "The Scientific Center", ar: "المركز العلمي" },
    area: { en: "Salmiya", ar: "السالمية" },
    vibe: "different", cat: "museum", price: 2,
    outdoor: true, group: true, late: false,
    note: { en: "Aquarium, IMAX, and a working dhow harbour outside.", ar: "أكواريوم، آيماكس، وميناء سفن خشبية بالخارج." },
    tip: { en: "The aquarium tunnel, then walk the dhow harbour.", ar: "نفق الأكواريوم، وبعدها تمشَّ في ميناء السفن." }
  },
  {
    id: "tareq-rajab",
    name: { en: "Tareq Rajab Museum", ar: "متحف طارق رجب" },
    area: { en: "Jabriya", ar: "الجابرية" },
    vibe: "different", cat: "museum", price: 1,
    outdoor: false, group: false, late: false,
    note: { en: "A world-class Islamic art collection in a private basement.", ar: "مجموعة فن إسلامي عالمية في سرداب بيت خاص." },
    tip: { en: "The calligraphy museum is a separate building nearby — do both.", ar: "متحف الخط في مبنى قريب منفصل — زر الاثنين." }
  }
];
