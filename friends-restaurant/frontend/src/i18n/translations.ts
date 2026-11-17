export type Language = 'en' | 'ti' | 'am';

export interface Translations {
  home: string;
  ourMenu: string;
  aboutUs: string;
  atmosphere: string;
  locationHours: string;
  freeWifi: string;
  guestWifi: string;
  copyPassword: string;
  passwordCopied: string;
  close: string;
  exploreMenu: string;
  visitRoastery: string;
  visitGarden: string;
  coffee: string;
  bakery: string;
  food: string;
  drinks: string;
  allCoffee: string;
  allBakery: string;
  allFood: string;
  allDrinks: string;
  searchPlaceholderCoffee: string;
  searchPlaceholderBakery: string;
  searchPlaceholderFood: string;
  searchPlaceholderDrinks: string;
  clearSearch: string;
  dishes: string;
  items: string;
  address: string;
  diningHours: string;
  roasteryHours: string;
  kitchenCloses: string;
  contactSocial: string;
  backToTop: string;
  chefSpecial: string;
  houseSpecial: string;
  dailyOpen: string;
  artisanDishes: string;
  freshToOrder: string;
  philosophyEyebrow: string;
  atmosphereEyebrow: string;
  noDishesFound: string;
  trySearching: string;
  showAll: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    home: 'Home',
    ourMenu: 'Our Menu',
    aboutUs: 'Our Roastery Craft',
    atmosphere: 'Atmosphere',
    locationHours: 'Location & Hours',
    freeWifi: 'Guest Wi-Fi',
    guestWifi: 'Complimentary Guest Wi-Fi',
    copyPassword: 'Copy Password',
    passwordCopied: 'Password Copied!',
    close: 'Close',
    exploreMenu: 'EXPLORE ROASTERY MENU',
    visitRoastery: 'VISIT OUR ROASTERY',
    visitGarden: 'VISIT OUR ROASTERY',
    coffee: 'COFFEE & BEVERAGES',
    bakery: 'BAKERY & BITES',
    food: 'BAKERY & BITES',
    drinks: 'COFFEE & BEVERAGES',
    allCoffee: 'All Coffee & Drinks',
    allBakery: 'All Bakery & Bites',
    allFood: 'All Bakery & Bites',
    allDrinks: 'All Coffee & Drinks',
    searchPlaceholderCoffee: 'Search espresso, pour-over, cold brew, frappes, tea...',
    searchPlaceholderBakery: 'Search croissants, pastries, cakes, panini, toast...',
    searchPlaceholderFood: 'Search croissants, pastries, cakes, panini, toast...',
    searchPlaceholderDrinks: 'Search espresso, pour-over, cold brew, frappes, tea...',
    clearSearch: 'Clear Search',
    dishes: 'items',
    items: 'items',
    address: 'Roastery Location',
    diningHours: 'Roastery Hours',
    roasteryHours: '7:00 AM – 10:30 PM',
    kitchenCloses: 'Barista bar closes 10:00 PM',
    contactSocial: 'Connect & Social',
    backToTop: 'Back to Top',
    chefSpecial: "Roaster's Special",
    houseSpecial: 'House Signature',
    dailyOpen: '7:00 AM • Daily Open',
    artisanDishes: 'Single-Origin Roasts & Fresh Bakery',
    freshToOrder: 'Freshly Roasted & Baked Daily',
    philosophyEyebrow: 'Our Roastery Craft',
    atmosphereEyebrow: 'Atmosphere & Moments • Crafted From Coffee',
    noDishesFound: 'No coffee, drinks, or bakery items match your selection.',
    trySearching: 'Try selecting "All" or clear your search term.',
    showAll: 'Show All',
  },
  ti: {
    home: 'መእተዊ',
    ourMenu: 'ዝርዝር መስተን መግብን',
    aboutUs: 'ስራሕ ሮስተሪና',
    atmosphere: 'ከባቢና',
    locationHours: 'ቦታን ሰዓታትን',
    freeWifi: 'ናጻ ዋይፋይ',
    guestWifi: 'ናጻ ናይ ጋሻ ዋይፋይ',
    copyPassword: 'ፓስዎርድ ቅዳሕ',
    passwordCopied: 'ተቀዲሑ!',
    close: 'ዕጾ',
    exploreMenu: 'ዝርዝር ሮስተሪ ርአ',
    visitRoastery: 'ናብ ሮስተሪና ምጹ',
    visitGarden: 'ናብ ሮስተሪና ምጹ',
    coffee: 'ቡንን መስተታትን',
    bakery: 'መቁርስን ፓስትሪን',
    food: 'መቁርስን ፓስትሪን',
    drinks: 'ቡንን መስተታትን',
    allCoffee: 'ኩሉ ቡንን መስተታትን',
    allBakery: 'ኩሉ መቁርስን ፓስትሪን',
    allFood: 'ኩሉ መቁርስን ፓስትሪን',
    allDrinks: 'ኩሉ ቡንን መስተታትን',
    searchPlaceholderCoffee: 'ኤስፕሬሶ፣ ፖር-ኦቨር፣ ኮልድ ብሩ፣ ፍራፔ፣ ሻሂ ድለይ...',
    searchPlaceholderBakery: 'ክሮዋሳን፣ ፓስትሪ፣ ኬክ፣ ፓኒኒ፣ ኣቮካዶ ቶስት ድለይ...',
    searchPlaceholderFood: 'ክሮዋሳን፣ ፓስትሪ፣ ኬክ፣ ፓኒኒ፣ ኣቮካዶ ቶስት ድለይ...',
    searchPlaceholderDrinks: 'ኤስፕሬሶ፣ ፖር-ኦቨር፣ ኮልድ ብሩ፣ ፍራፔ፣ ሻሂ ድለይ...',
    clearSearch: 'ድለይ ሰርዝ',
    dishes: 'ዓይነታት',
    items: 'ዓይነታት',
    address: 'አድራሻና',
    diningHours: 'ናይ ስራሕ ሰዓታት',
    roasteryHours: '1:00 ቅ.ቀ – 4:30 ድ.ቀ',
    kitchenCloses: 'ባር ሰዓት 4:00 ድ.ቀ ይዕጾ',
    contactSocial: 'ርክብን ማሕበራዊ ሚድያን',
    backToTop: 'ናብ ላዕሊ ተመለስ',
    chefSpecial: 'ፍሉይ ናይ ሮስተር',
    houseSpecial: 'ናይ ቤቱ ፍሉይ',
    dailyOpen: '1:00 ቅ.ቀ • መዓልታዊ ክፉት',
    artisanDishes: 'ፍሉይ ቡንን ትኩስ ፓስትሪን',
    freshToOrder: '100% ሓድሽ ዝተቆሎን ዝተሰርሐን',
    philosophyEyebrow: 'ስራሕ ሮስተሪና',
    atmosphereEyebrow: 'ከባቢናን መኣድናን • ካቡን ኮፊ',
    noDishesFound: 'ዝተረኽበ ቡን፣ መስተ ወይ ፓስትሪ የለን።',
    trySearching: 'ኩሉ ዝብል ምረጽ ወይ ድለይ ቀይር።',
    showAll: 'ኩሉ ኣርእይ',
  },
  am: {
    home: 'መነሻ',
    ourMenu: 'የመጠጥና የምግብ ዝርዝር',
    aboutUs: 'የሮስተሪያችን ጥበብ',
    atmosphere: 'ከባቢያችን',
    locationHours: 'አድራሻና የስራ ሰዓት',
    freeWifi: 'ነጻ ዋይፋይ',
    guestWifi: 'ነጻ የእንግዳ ዋይፋይ',
    copyPassword: 'የይለፍ ቃል ቅዳ',
    passwordCopied: 'ተቀድቷል!',
    close: 'ዝጋ',
    exploreMenu: 'የሮስተሪ ዝርዝር ይመልከቱ',
    visitRoastery: 'ወደ ሮስተሪያችን ይምጡ',
    visitGarden: 'ወደ ሮስተሪያችን ይምጡ',
    coffee: 'ቡና እና መጠጦች',
    bakery: 'ቁርስ እና ፔስትሪ',
    food: 'ቁርስ እና ፔስትሪ',
    drinks: 'ቡና እና መጠጦች',
    allCoffee: 'ሁሉም ቡና እና መጠጦች',
    allBakery: 'ሁሉም ቁርስ እና ፔስትሪ',
    allFood: 'ሁሉም ቁርስ እና ፔስትሪ',
    allDrinks: 'ሁሉም ቡና እና መጠጦች',
    searchPlaceholderCoffee: 'ኤስፕሬሶ፣ ፖር-ኦቨር፣ ኮልድ ብሩ፣ ፍራፔ፣ ሻይ ፈልግ...',
    searchPlaceholderBakery: 'ክሮዋሳን፣ ፔስትሪ፣ ኬክ፣ ፓኒኒ፣ አቮካዶ ቶስት ፈልግ...',
    searchPlaceholderFood: 'ክሮዋሳን፣ ፔስትሪ፣ ኬክ፣ ፓኒኒ፣ አቮካዶ ቶስት ፈልግ...',
    searchPlaceholderDrinks: 'ኤስፕሬሶ፣ ፖር-ኦቨር፣ ኮልድ ብሩ፣ ፍራፔ፣ ሻይ ፈልግ...',
    clearSearch: 'ፍለጋ ሰርዝ',
    dishes: 'አይነቶች',
    items: 'አይነቶች',
    address: 'አድራሻችን',
    diningHours: 'የስራ ሰዓታት',
    roasteryHours: '1:00 ጥዋት – 4:30 ማታ',
    kitchenCloses: 'የቡና ማስተናገጃው 4:00 ይዘጋል',
    contactSocial: 'አድራሻና ማህበራዊ ሚዲያ',
    backToTop: 'ወደ ላይ ተመለስ',
    chefSpecial: 'የሮስተሩ ልዩ',
    houseSpecial: 'የቤቱ መለያ',
    dailyOpen: '1:00 ጥዋት • በየቀኑ ክፍት',
    artisanDishes: 'ምርጥ ቡናዎችና ትኩስ ፔስትሪ',
    freshToOrder: '100% ትኩስ የተቆላና በየቀኑ የሚጋገር',
    philosophyEyebrow: 'የሮስተሪያችን ጥበብ',
    atmosphereEyebrow: 'ከባቢያችንና ገበታችን • ካቡን ኮፊ',
    noDishesFound: 'የተገኘ ቡና፣ መጠጥ ወይም ፔስትሪ የለም።',
    trySearching: 'ሁሉንም የሚለውን ይምረጡ ወይም ፍለጋውን ያጽዱ።',
    showAll: 'ሁሉንም አሳይ',
  },
};

export const translateCategory = (name: string, lang: Language): string => {
  if (lang === 'en') return name;

  const upper = (name || '').toUpperCase();

  if (lang === 'ti') {
    if (upper.includes('ESPRESSO') || upper.includes('HOT CLASSIC')) return 'ኤስፕሬሶን ሙቁል ቡንን';
    if (upper.includes('SIGNATURE') || upper.includes('COLD BREW')) return 'ዝሑል ቡንን ፍሉይ መስተን';
    if (upper.includes('POUR-OVER') || upper.includes('HAND-BREWED') || upper.includes('JEBENA')) return 'ፊልተር ፖር-ኦቨርን ጀበናን';
    if (upper.includes('FRAPPE') || upper.includes('SHAKE') || upper.includes('SMOOTHIE')) return 'ፍራፔን ሼክን ጁስን';
    if (upper.includes('TEA') || upper.includes('REFRESHER')) return 'ሻሂን ቀዝቃዛ መስተን';
    if (upper.includes('VIENNOISERIE') || upper.includes('PASTRIES') || upper.includes('CROISSANT')) return 'ክሮዋሳንን ፓስትሪን';
    if (upper.includes('CAKE') || upper.includes('DESSERT')) return 'ኬክን ጥዑም መግብን';
    if (upper.includes('SAVORY') || upper.includes('BREAKFAST') || upper.includes('PANINI')) return 'ቁርስን ሳንድዊችን';
    if (upper.includes('FOOD')) return 'መቁርስን ፓስትሪን';
    if (upper.includes('DRINK') || upper.includes('BEVERAGE')) return 'ቡንን መስተታትን';
  }

  if (lang === 'am') {
    if (upper.includes('ESPRESSO') || upper.includes('HOT CLASSIC')) return 'ኤስፕሬሶ እና ትኩስ ቡና';
    if (upper.includes('SIGNATURE') || upper.includes('COLD BREW')) return 'ቀዝቃዛ ቡና እና ኮልድ ብሩ';
    if (upper.includes('POUR-OVER') || upper.includes('HAND-BREWED') || upper.includes('JEBENA')) return 'የተጣራ ፖር-ኦቨር እና ጀበና';
    if (upper.includes('FRAPPE') || upper.includes('SHAKE') || upper.includes('SMOOTHIE')) return 'ፍራፔ፣ ሼክ እና ጁስ';
    if (upper.includes('TEA') || upper.includes('REFRESHER')) return 'ሻይ እና ማደሻ መጠጦች';
    if (upper.includes('VIENNOISERIE') || upper.includes('PASTRIES') || upper.includes('CROISSANT')) return 'ክሮዋሳን እና ፔስትሪ';
    if (upper.includes('CAKE') || upper.includes('DESSERT')) return 'ኬክ እና ጣፋጮች';
    if (upper.includes('SAVORY') || upper.includes('BREAKFAST') || upper.includes('PANINI')) return 'ቁርስ እና ሳንድዊች';
    if (upper.includes('FOOD')) return 'ቁርስ እና ፔስትሪ';
    if (upper.includes('DRINK') || upper.includes('BEVERAGE')) return 'ቡና እና መጠጦች';
  }

  return name;
};
