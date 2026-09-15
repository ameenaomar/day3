/**
 * Every user-facing string in the site lives here. Components never contain
 * literal copy — they read from `t(locale)`.
 *
 * Only the strings the foundation renders are present so far. Section copy,
 * quiz copy and package copy arrive with their build steps.
 */

import { type Locale } from "@/lib/i18n";
import { type QuizFieldKey, type QuizStepId } from "@/lib/quiz.config";

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  /** The dinar's unit, written the way each language writes it. */
  currency: string;
  nav: {
    /** Accessible label on the language toggle. */
    switchLanguage: string;
    /** The name of the language being switched TO, shown in that language. */
    otherLanguageName: string;
  };
  foundation: {
    eyebrow: string;
    headline: string;
    standfirst: string;
    directionLabel: string;
    localeLabel: string;
    paletteLabel: string;
    typeLabel: string;
    ratesLabel: string;
    displayFaceNote: string;
    swatches: { paper: string; sand: string; dove: string; ink: string };
    modes: { online: string; inPerson: string };
    perOutfit: string;
    wallpaperNote: string;
  };
  /**
   * Quiz copy, keyed by the ids in lib/quiz.config.ts. Options for fields
   * marked `bare` are absent: their values (sizes, heights) are shown as-is
   * in both languages, so there is nothing to translate.
   */
  quiz: {
    steps: Record<QuizStepId, { tag: string; question: string; sub: string }>;
    fields: Record<QuizFieldKey, { label: string; placeholder?: string; hint?: string }>;
    options: Partial<Record<QuizFieldKey, Record<string, { label: string; note?: string }>>>;
    measurements: Record<string, string>;
    /** Navigation and controls around the questions. */
    chrome: {
      stepOf: string;
      next: string;
      back: string;
      finish: string;
      optional: string;
      answerRequired: string;
      showMeasurements: string;
      hideMeasurements: string;
      measurementsHint: string;
      centimetres: string;
      startOver: string;
      savedNote: string;
    };
  };
};

const en: Dictionary = {
  meta: {
    // PLACEHOLDER — tagline pending §14.
    title: "Simply Styled",
    description: "Personal styling, online worldwide and in person in Kuwait.",
  },
  currency: "KD",
  nav: {
    switchLanguage: "Switch language",
    otherLanguageName: "العربية",
  },
  foundation: {
    eyebrow: "Foundation",
    headline: "Simply Styled",
    standfirst:
      "Design tokens, fonts, and the language layer. Switch the language to confirm the page flips direction and typeface.",
    directionLabel: "Direction",
    localeLabel: "Language",
    paletteLabel: "Palette",
    typeLabel: "Type",
    ratesLabel: "Rates",
    displayFaceNote: "Display face — stand-in for Palmore",
    swatches: {
      paper: "Coconut Milk",
      sand: "Warm Sand",
      dove: "Dove Gray",
      ink: "Espresso",
    },
    modes: { online: "Online", inPerson: "In person" },
    perOutfit: "from, per outfit",
    wallpaperNote: "Wallpaper slots — add files to public/images",
  },
  quiz: {
    steps: {
      basics: {
        tag: "Basics",
        question: "Who are we styling, and what for?",
        sub: "The occasion decides almost everything else.",
      },
      sizes: {
        tag: "Sizes",
        question: "The sizes you buy today.",
        sub: "What you actually wear beats any measurement we could guess.",
      },
      body: {
        tag: "Body data",
        question: "Your frame.",
        sub: "Two people wearing the same size need different cuts. This is where the fit is won.",
      },
      cut: {
        tag: "Coverage",
        question: "What must the look respect?",
        sub: "Tell us your rules once and we never break them.",
      },
      colour: {
        tag: "Colour",
        question: "Which of these looks like your skin in daylight?",
        sub: "You do not need to know your palette. We work it out from this.",
      },
      life: {
        tag: "Life",
        question: "Where will you actually wear this?",
        sub: "A look you never wear is a look we styled wrong.",
      },
      order: {
        tag: "Order",
        question: "How many outfits, and how shall we work?",
        sub: "Styling is 5 KD per outfit online, 10 KD in person. The more outfits, the lower the rate.",
      },
    },
    fields: {
      who: { label: "Styling for" },
      occasion: { label: "The occasion" },
      top: { label: "Top" },
      bottomW: { label: "Bottom (EU)" },
      bottomM: { label: "Waist (inches)" },
      bra: { label: "Bra size" },
      shoeW: { label: "Shoe (EU)" },
      shoeM: { label: "Shoe (EU)" },
      fitpref: { label: "How you like clothes to sit" },
      brand: { label: "A brand and size that fits you well", placeholder: "e.g. Zara M, Mango 38", hint: "This one line is the single most useful thing you can tell a stylist." },
      heightW: { label: "Height (cm)" },
      heightM: { label: "Height (cm)" },
      shoulders: { label: "Shoulders" },
      arms: { label: "Arm length" },
      torso: { label: "Torso and legs" },
      shapeW: { label: "Where you carry your width" },
      shapeM: { label: "Your build" },
      __exact: { label: "Exact measurements" },
      sleeve: { label: "Sleeves" },
      length: { label: "Length" },
      modest: { label: "Also plan for" },
      cover: { label: "I would rather not show" },
      never: { label: "Never send me" },
      tone: { label: "Skin undertone" },
      lovecol: { label: "Colours you already reach for" },
      life: { label: "Most of my week is" },
      bold: { label: "How much attention should the look get?" },
      mode: { label: "How we work together" },
      looks: { label: "Number of outfits" },
    },
    options: {
      who: {
        "women": { label: "Women" },
        "men": { label: "Men" },
      },
      occasion: {
        "wedding": { label: "Wedding or party" },
        "eid": { label: "Eid or Ramadan" },
        "grad": { label: "Graduation" },
        "work": { label: "Work or a new job" },
        "travel": { label: "Travel" },
        "everyday": { label: "Everyday reset" },
      },
      fitpref: {
        "fitted": { label: "Fitted" },
        "true": { label: "True to size" },
        "relaxed": { label: "Relaxed" },
        "oversized": { label: "Oversized" },
      },
      shoulders: {
        "narrow": { label: "Narrow", note: "Straps slip, seams hang past my shoulder" },
        "average": { label: "Average", note: "Shoulder seams usually land right" },
        "broad": { label: "Broad", note: "Jackets and shirts pull across my back" },
      },
      arms: {
        "short": { label: "Shorter", note: "Sleeves are always too long" },
        "average": { label: "Average", note: "Sleeves usually end at the wrist" },
        "long": { label: "Longer", note: "Sleeves are always too short" },
      },
      torso: {
        "short": { label: "Short body, long legs", note: "High-waisted trousers suit me" },
        "average": { label: "Fairly even", note: "Most waistlines sit where they should" },
        "long": { label: "Long body, shorter legs", note: "Tops ride up, dresses sit low" },
      },
      shapeW: {
        "hourglass": { label: "Waist is the narrowest", note: "Bust and hips fairly balanced" },
        "pear": { label: "Hips widest", note: "Smaller on top than on the bottom" },
        "rectangle": { label: "Straight up and down", note: "Shoulders, waist and hips similar" },
        "apple": { label: "Middle widest", note: "Slimmer arms and legs" },
        "inverted": { label: "Shoulders widest", note: "Narrower through the hips" },
        "unsure": { label: "Not sure", note: "Let the stylist decide from the rest" },
      },
      shapeM: {
        "slim": { label: "Slim", note: "Clothes hang loose on me" },
        "athletic": { label: "Athletic", note: "Broad chest, narrower waist" },
        "average": { label: "Average", note: "Standard cuts mostly work" },
        "broad": { label: "Solid", note: "Fuller through chest and middle" },
        "unsure": { label: "Not sure", note: "Let the stylist decide from the rest" },
      },
      sleeve: {
        "long": { label: "Long only" },
        "threequarter": { label: "Elbow or longer" },
        "any": { label: "Anything" },
      },
      length: {
        "maxi": { label: "Ankle length" },
        "midi": { label: "Midi or longer" },
        "any": { label: "Anything" },
      },
      modest: {
        "hijab": { label: "Hijab-friendly" },
        "abaya": { label: "Layers under abaya" },
        "opaque": { label: "Nothing sheer" },
        "nolayer": { label: "None of these" },
      },
      cover: {
        "arms": { label: "Arms" },
        "waist": { label: "Waist" },
        "legs": { label: "Legs" },
        "shoulders": { label: "Shoulders" },
        "chest": { label: "Chest" },
        "back": { label: "Back" },
        "nothing": { label: "Nothing — show it all" },
      },
      never: {
        "tight": { label: "Anything tight" },
        "prints": { label: "Loud prints" },
        "heels": { label: "High heels" },
        "neon": { label: "Neon colours" },
        "crop": { label: "Crop tops" },
        "logos": { label: "Big logos" },
      },
      tone: {
        "warm": { label: "Golden or olive", note: "Gold jewellery suits you. You tan easily." },
        "cool": { label: "Pink or blue-ish", note: "Silver suits you. You burn before you tan." },
        "neutral": { label: "Somewhere between", note: "Gold and silver both work on you." },
      },
      lovecol: {
        "black": { label: "Black & white" },
        "earth": { label: "Beige & brown" },
        "blue": { label: "Blues" },
        "green": { label: "Greens" },
        "jewel": { label: "Deep jewel tones" },
        "pastel": { label: "Pastels" },
      },
      life: {
        "office": { label: "Office" },
        "uni": { label: "University" },
        "home": { label: "At home" },
        "outings": { label: "Going out & family" },
        "travel": { label: "Travelling" },
        "active": { label: "Active & moving" },
      },
      bold: {
        "quiet": { label: "Quiet", note: "Nobody comments, everybody notices" },
        "polished": { label: "Polished", note: "Clearly put together" },
        "statement": { label: "Statement", note: "I want to be asked about it" },
      },
      mode: {
        "online": { label: "Online", note: "Anywhere in the world" },
        "inPerson": { label: "In person", note: "Kuwait only" },
      },
      looks: {
        "1": { label: "1 look" },
        "2": { label: "2 looks" },
        "3": { label: "3 looks" },
      },
    },
    measurements: {
      bust: "Bust",
      chest: "Chest",
      waist: "Waist",
      hip: "Hips",
      shoulderCm: "Shoulder, seam to seam",
      armCm: "Arm, shoulder to wrist",
      inseam: "Inseam",
    },
    chrome: {
      stepOf: "Step %s of %s",
      next: "Continue",
      back: "Back",
      finish: "Finish",
      optional: "Optional",
      answerRequired: "Answer the questions marked with * to continue.",
      showMeasurements: "Enter exact measurements in cm",
      hideMeasurements: "Hide exact measurements",
      measurementsHint:
        "You do not need a tape measure. The choices above are enough \u2014 exact numbers only make the fit better.",
      centimetres: "cm",
      startOver: "Start over",
      savedNote: "Your answers are saved on this device as you go.",
    },
  },
};

const ar: Dictionary = {
  meta: {
    title: "سِمبلي ستايلد",
    description: "تنسيق أزياء شخصي، أونلاين حول العالم وحضورياً في الكويت.",
  },
  currency: "د.ك",
  nav: {
    switchLanguage: "تغيير اللغة",
    otherLanguageName: "English",
  },
  foundation: {
    eyebrow: "الأساس",
    headline: "سِمبلي ستايلد",
    standfirst:
      "الألوان والخطوط وطبقة اللغة. غيّر اللغة للتأكد من أن الصفحة تقلب الاتجاه ونوع الخط.",
    directionLabel: "الاتجاه",
    localeLabel: "اللغة",
    paletteLabel: "الألوان",
    typeLabel: "الخط",
    ratesLabel: "الأسعار",
    displayFaceNote: "خط العناوين — بديل مؤقت عن Palmore",
    swatches: {
      paper: "حليب جوز الهند",
      sand: "رمل دافئ",
      dove: "رمادي حمامي",
      ink: "إسبريسو",
    },
    modes: { online: "أونلاين", inPerson: "حضورياً" },
    perOutfit: "تبدأ من، لكل إطلالة",
    wallpaperNote: "أماكن صور الخلفية — أضِف الملفات إلى public/images",
  },
  quiz: {
    steps: {
      basics: {
        tag: "الأساسيات",
        question: "لمن سنقوم بالتنسيق، ولماذا؟",
        sub: "المناسبة تحدد كل شيء تقريباً.",
      },
      sizes: {
        tag: "المقاسات",
        question: "المقاسات التي تشترينها اليوم.",
        sub: "ما تلبسينه فعلاً أهم من أي قياس نخمّنه.",
      },
      body: {
        tag: "بيانات الجسم",
        question: "بنية جسمك.",
        sub: "شخصان بالمقاس نفسه يحتاجان قَصّتين مختلفتين. هنا يُحسم المقاس.",
      },
      cut: {
        tag: "التغطية",
        question: "ما القواعد التي يجب أن تحترمها الإطلالة؟",
        sub: "أخبرينا بقواعدك مرة واحدة ولن نخالفها.",
      },
      colour: {
        tag: "اللون",
        question: "أيٌّ من هذه يشبه لون بشرتك في ضوء النهار؟",
        sub: "لا حاجة لمعرفة لوحة ألوانك. سنستنتجها من هنا.",
      },
      life: {
        tag: "نمط الحياة",
        question: "أين ستلبسين هذه الإطلالة فعلاً؟",
        sub: "الإطلالة التي لا تُلبس هي إطلالة أخطأنا فيها.",
      },
      order: {
        tag: "الطلب",
        question: "كم إطلالة، وكيف نعمل؟",
        sub: "التنسيق ٥ د.ك لكل إطلالة أونلاين، و١٠ د.ك حضورياً. كلما زاد العدد قلّ السعر.",
      },
    },
    fields: {
      who: { label: "التنسيق لـ" },
      occasion: { label: "المناسبة" },
      top: { label: "الأعلى" },
      bottomW: { label: "الأسفل (أوروبي)" },
      bottomM: { label: "الوسط (إنش)" },
      bra: { label: "مقاس حمالة الصدر" },
      shoeW: { label: "الحذاء (أوروبي)" },
      shoeM: { label: "الحذاء (أوروبي)" },
      fitpref: { label: "كيف تحبين أن تكون القصّة" },
      brand: { label: "ماركة ومقاس يناسبك تماماً", placeholder: "مثال: زارا M، مانجو ٣٨", hint: "هذا السطر هو أهم ما يمكنك إخباره للمنسّقة." },
      heightW: { label: "الطول (سم)" },
      heightM: { label: "الطول (سم)" },
      shoulders: { label: "الكتفان" },
      arms: { label: "طول الذراع" },
      torso: { label: "الجذع والساقان" },
      shapeW: { label: "أين يتمركز عرض جسمك" },
      shapeM: { label: "بنيتك" },
      __exact: { label: "المقاسات الدقيقة" },
      sleeve: { label: "الأكمام" },
      length: { label: "الطول" },
      modest: { label: "مع مراعاة" },
      cover: { label: "أفضّل عدم إبراز" },
      never: { label: "لا ترسلي لي أبداً" },
      tone: { label: "درجة لون البشرة" },
      lovecol: { label: "ألوان تختارينها دائماً" },
      life: { label: "معظم أسبوعي" },
      bold: { label: "كم من الانتباه تريدين للإطلالة؟" },
      mode: { label: "طريقة العمل" },
      looks: { label: "عدد الإطلالات" },
    },
    options: {
      who: {
        "women": { label: "نساء" },
        "men": { label: "رجال" },
      },
      occasion: {
        "wedding": { label: "عرس أو حفلة" },
        "eid": { label: "العيد أو رمضان" },
        "grad": { label: "تخرّج" },
        "work": { label: "العمل أو وظيفة جديدة" },
        "travel": { label: "سفر" },
        "everyday": { label: "تجديد اليومي" },
      },
      fitpref: {
        "fitted": { label: "ضيّقة" },
        "true": { label: "على المقاس" },
        "relaxed": { label: "واسعة" },
        "oversized": { label: "فضفاضة" },
      },
      shoulders: {
        "narrow": { label: "ضيّقان", note: "الحمالات تنزلق والخياطة تتجاوز كتفي" },
        "average": { label: "متوسطان", note: "خياطة الكتف تقع في مكانها عادة" },
        "broad": { label: "عريضان", note: "الجاكيتات والقمصان تشد على ظهري" },
      },
      arms: {
        "short": { label: "أقصر", note: "الأكمام دائماً أطول من اللازم" },
        "average": { label: "متوسط", note: "الأكمام تنتهي عند المعصم عادة" },
        "long": { label: "أطول", note: "الأكمام دائماً أقصر من اللازم" },
      },
      torso: {
        "short": { label: "جذع قصير وساقان طويلتان", note: "البنطلونات عالية الوسط تناسبني" },
        "average": { label: "متوازن", note: "معظم الخطوط تقع في مكانها" },
        "long": { label: "جذع طويل وساقان أقصر", note: "البلوزات ترتفع والفساتين تنزل" },
      },
      shapeW: {
        "hourglass": { label: "الوسط هو الأنحف", note: "الصدر والأرداف متوازنان" },
        "pear": { label: "الأرداف الأعرض", note: "الأعلى أصغر من الأسفل" },
        "rectangle": { label: "مستقيم", note: "الكتفان والوسط والأرداف متشابهة" },
        "apple": { label: "الوسط الأعرض", note: "ذراعان وساقان أنحف" },
        "inverted": { label: "الكتفان الأعرض", note: "الأرداف أضيق" },
        "unsure": { label: "غير متأكدة", note: "اتركي القرار للمنسّقة" },
      },
      shapeM: {
        "slim": { label: "نحيف", note: "الملابس واسعة عليّ" },
        "athletic": { label: "رياضي", note: "صدر عريض ووسط أضيق" },
        "average": { label: "متوسط", note: "القَصّات العادية تناسبني" },
        "broad": { label: "ممتلئ", note: "أعرض في الصدر والوسط" },
        "unsure": { label: "غير متأكد", note: "اتركي القرار للمنسّق" },
      },
      sleeve: {
        "long": { label: "طويلة فقط" },
        "threequarter": { label: "إلى الكوع أو أطول" },
        "any": { label: "أي نوع" },
      },
      length: {
        "maxi": { label: "إلى الكاحل" },
        "midi": { label: "ميدي أو أطول" },
        "any": { label: "أي طول" },
      },
      modest: {
        "hijab": { label: "مناسب للحجاب" },
        "abaya": { label: "طبقات تحت العباية" },
        "opaque": { label: "غير شفاف" },
        "nolayer": { label: "لا شيء من هذه" },
      },
      cover: {
        "arms": { label: "الذراعين" },
        "waist": { label: "الوسط" },
        "legs": { label: "الساقين" },
        "shoulders": { label: "الكتفين" },
        "chest": { label: "الصدر" },
        "back": { label: "الظهر" },
        "nothing": { label: "لا شيء — أبرزي الكل" },
      },
      never: {
        "tight": { label: "قطع ضيّقة" },
        "prints": { label: "نقشات صارخة" },
        "heels": { label: "كعب عالٍ" },
        "neon": { label: "ألوان فاقعة" },
        "crop": { label: "بلوزات قصيرة" },
        "logos": { label: "شعارات كبيرة" },
      },
      tone: {
        "warm": { label: "ذهبية أو زيتونية", note: "الذهب يناسبك. تسمرّين بسهولة." },
        "cool": { label: "وردية أو مائلة للأزرق", note: "الفضة تناسبك. تحترق بشرتك قبل أن تسمرّ." },
        "neutral": { label: "بين الاثنين", note: "الذهب والفضة يناسبانك معاً." },
      },
      lovecol: {
        "black": { label: "أسود وأبيض" },
        "earth": { label: "بيج وبني" },
        "blue": { label: "أزرق" },
        "green": { label: "أخضر" },
        "jewel": { label: "ألوان جوهرية غامقة" },
        "pastel": { label: "باستيل" },
      },
      life: {
        "office": { label: "المكتب" },
        "uni": { label: "الجامعة" },
        "home": { label: "في البيت" },
        "outings": { label: "خروج وعائلة" },
        "travel": { label: "سفر" },
        "active": { label: "حركة ونشاط" },
      },
      bold: {
        "quiet": { label: "هادئة", note: "لا أحد يعلّق، والجميع يلاحظ" },
        "polished": { label: "أنيقة", note: "واضح أنها منسّقة" },
        "statement": { label: "جذّابة", note: "أريد أن يسألوني عنها" },
      },
      mode: {
        "online": { label: "أونلاين", note: "من أي مكان في العالم" },
        "inPerson": { label: "حضورياً", note: "الكويت فقط" },
      },
      looks: {
        "1": { label: "إطلالة واحدة" },
        "2": { label: "إطلالتان" },
        "3": { label: "٣ إطلالات" },
      },
    },
    measurements: {
      bust: "محيط الصدر",
      chest: "محيط الصدر",
      waist: "الوسط",
      hip: "الأرداف",
      shoulderCm: "الكتف، من خيط لخيط",
      armCm: "الذراع، من الكتف للمعصم",
      inseam: "الطول الداخلي للساق",
    },
    chrome: {
      stepOf: "خطوة %s من %s",
      next: "متابعة",
      back: "رجوع",
      finish: "إنهاء",
      optional: "اختياري",
      answerRequired: "أجب عن الأسئلة المعلّمة بـ * للمتابعة.",
      showMeasurements: "إدخال المقاسات الدقيقة بالسنتيمتر",
      hideMeasurements: "إخفاء المقاسات الدقيقة",
      measurementsHint:
        "لا تحتاج إلى شريط قياس. الاختيارات أعلاه كافية \u2014 الأرقام الدقيقة تحسّن القصّة فقط.",
      centimetres: "سم",
      startOver: "البدء من جديد",
      savedNote: "تُحفظ إجاباتك على هذا الجهاز أولاً بأول.",
    },
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}
