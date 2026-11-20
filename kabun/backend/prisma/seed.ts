import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding KABUN COFFEE + ROASTERY Database...');

  // 1. Seed Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@kabuncoffee.com' },
    update: {
      username: 'admin',
      password: adminPassword,
      name: 'Kabun Manager',
    },
    create: {
      username: 'admin',
      email: 'admin@kabuncoffee.com',
      password: adminPassword,
      name: 'Kabun Manager',
    },
  });
  console.log(`👤 Admin ready: ${admin.email}`);

  // 2. Seed Default SiteSettings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {
      restaurantName: 'KABUN COFFEE + ROASTERY',
      tagline: 'CRAFTED FROM COFFEE',
      heroTitle1: 'CRAFTED FROM',
      heroTitle2: 'COFFEE',
      heroDescription:
        'Upscale specialty coffee roastery in Mekelle. Experience single-origin Ethiopian beans roasted with precision, slow-steeped cold brews, artisanal espresso creations, and freshly baked viennoiserie.',
      primaryCtaText: 'EXPLORE ROASTERY MENU',
      secondaryCtaText: 'OUR ROASTERY CRAFT',

      wifiSsid: 'Kabun_Guest_WiFi',
      wifiPassword: 'craftedfromcoffee',

      philosophyEyebrow: 'Our Roastery Craft',
      philosophyTitle: 'BORN IN ETHIOPIA.\nCRAFTED WITH OBSESSIVE PASSION.',
      philosophyDescription:
        'Kabun is more than a café — it is a sanctuary for coffee lovers, artists, and conversation. We source exceptional micro-lots from Yirgacheffe, Guji, and Sidama, hand-roasting small batches to honor Ethiopia\'s coffee heritage in a modern architectural lounge.',
      manifestoQuote: 'Every great conversation begins with an exceptional roast.',
      manifestoAuthor: 'The Roaster\'s Manifesto',

      galleryTitle: 'ATMOSPHERE & ARTISAN ROASTS',
      galleryDescription:
        'A glimpse into our warm wood interiors, illuminated night storefront, aromatic pour-over bar, and shared moments at Kabun.',

      addressLine1: 'Mekelle, Tigray, Ethiopia',
      addressLine2: 'ካቡን ኮፊ እና ሮስተሪ (Kebele 17 / Main Roastery)',
      openingHours: '7:00 AM – 10:30 PM',
      phone1: '0914000000',
      phone2: '0920000000',
      instagramHandle: '@KABUNCOFFEE',
      instagramUrl: 'https://www.instagram.com/kabuncoffee/',
      tiktokHandle: '@KABUNCOFFEE',
      tiktokUrl: 'https://www.tiktok.com/@kabuncoffee',
      facebookHandle: 'FB: KABUN COFFEE + ROASTERY - ካቡን',
      facebookUrl: 'https://www.facebook.com/search/top?q=KABUN%20COFFEE%20ROASTERY',

      accentColor: '#E5CFAF',
      backgroundColor: '#0E2F2C',
      cardColor: '#143834',
      fontFamily: 'Outfit, sans-serif',
      defaultTheme: 'dark',
    },
    create: {
      id: 'default',
      restaurantName: 'KABUN COFFEE + ROASTERY',
      tagline: 'CRAFTED FROM COFFEE',
      heroTitle1: 'CRAFTED FROM',
      heroTitle2: 'COFFEE',
      heroDescription:
        'Upscale specialty coffee roastery in Mekelle. Experience single-origin Ethiopian beans roasted with precision, slow-steeped cold brews, artisanal espresso creations, and freshly baked viennoiserie.',
      primaryCtaText: 'EXPLORE ROASTERY MENU',
      secondaryCtaText: 'OUR ROASTERY CRAFT',

      wifiSsid: 'Kabun_Guest_WiFi',
      wifiPassword: 'craftedfromcoffee',

      philosophyEyebrow: 'Our Roastery Craft',
      philosophyTitle: 'BORN IN ETHIOPIA.\nCRAFTED WITH OBSESSIVE PASSION.',
      philosophyDescription:
        'Kabun is more than a café — it is a sanctuary for coffee lovers, artists, and conversation. We source exceptional micro-lots from Yirgacheffe, Guji, and Sidama, hand-roasting small batches to honor Ethiopia\'s coffee heritage in a modern architectural lounge.',
      manifestoQuote: 'Every great conversation begins with an exceptional roast.',
      manifestoAuthor: 'The Roaster\'s Manifesto',

      galleryTitle: 'ATMOSPHERE & ARTISAN ROASTS',
      galleryDescription:
        'A glimpse into our warm wood interiors, illuminated night storefront, aromatic pour-over bar, and shared moments at Kabun.',

      addressLine1: 'Mekelle, Tigray, Ethiopia',
      addressLine2: 'ካቡን ኮፊ እና ሮስተሪ (Kebele 17 / Main Roastery)',
      openingHours: '7:00 AM – 10:30 PM',
      phone1: '0914000000',
      phone2: '0920000000',
      instagramHandle: '@KABUNCOFFEE',
      instagramUrl: 'https://www.instagram.com/kabuncoffee/',
      tiktokHandle: '@KABUNCOFFEE',
      tiktokUrl: 'https://www.tiktok.com/@kabuncoffee',
      facebookHandle: 'FB: KABUN COFFEE + ROASTERY - ካቡን',
      facebookUrl: 'https://www.facebook.com/search/top?q=KABUN%20COFFEE%20ROASTERY',

      accentColor: '#E5CFAF',
      backgroundColor: '#0E2F2C',
      cardColor: '#143834',
      fontFamily: 'Outfit, sans-serif',
      defaultTheme: 'dark',
    },
  });
  console.log('⚙️ Default Kabun Site Settings seeded.');

  // 3. Seed 15 Roastery Dining Tables
  for (let i = 1; i <= 15; i++) {
    const tableNum = String(i);
    await prisma.table.upsert({
      where: { tableNumber: tableNum },
      update: {
        label: `Table ${tableNum}`,
        sortOrder: i,
        capacity: i <= 4 ? 2 : i <= 12 ? 4 : 6,
        isActive: true,
      },
      create: {
        tableNumber: tableNum,
        label: `Table ${tableNum}`,
        sortOrder: i,
        capacity: i <= 4 ? 2 : i <= 12 ? 4 : 6,
        isActive: true,
      },
    });
  }
  console.log('🪑 Seeded 15 Roastery Tables (Table 1 - Table 15)');

  // 3. Clear previous items and categories for a clean slate
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});
  console.log('🧹 Purged previous items and categories.');

  // 4. Two Main Departments: COFFEE & BEVERAGES and BAKERY, PASTRIES & BITES
  const categoriesData = [
    // --- DEPARTMENT 1: COFFEE & BEVERAGES ---
    {
      name: 'Espresso & Hot Classics',
      slug: 'espresso-hot-classics',
      parentCategory: 'COFFEE',
      description: 'Precision extracted single-origin espresso drinks crafted with textured microfoam and Ethiopian specialty roasts.',
      sortOrder: 1,
      icon: 'coffee',
      items: [
        {
          name: 'Single Origin Espresso',
          price: 70,
          description: 'Intense, concentrated shot extracted under 9 bars with rich crema, notes of dark cocoa and bergamot from Yirgacheffe beans.',
          tags: 'Single-Origin,Yirgacheffe,Roaster Signature',
          image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Double Espresso (Doppio)',
          price: 90,
          description: 'Double shot of single-origin roast for bold richness, deep body, and clean citrus finish.',
          tags: 'Double Shot,Bold,Specialty Roast',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Traditional Macchiato',
          price: 80,
          description: 'Ethiopian classic layered with velvety steamed milk foam over rich single-origin espresso.',
          tags: 'Ethiopian Classic,House Favorite',
          image: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Double Macchiato',
          price: 110,
          description: 'Double shot of single-origin espresso marked with dense, sweet microfoam.',
          tags: 'Double Shot,Rich Crema',
          image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Cortado',
          price: 95,
          description: 'Equal parts double espresso and warm silky milk, reducing acidity while preserving rich roast character.',
          tags: 'Balanced,Silky,Barista Pick',
          image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Artisan Cappuccino',
          price: 110,
          description: 'Rich espresso topped with equal parts steamed milk and thick velvety microfoam with a dusting of cocoa.',
          tags: 'Velvety Microfoam,Classic',
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Café Latte',
          price: 120,
          description: 'Smooth single-origin espresso with generous velvety steamed milk and delicate hand-poured latte art.',
          tags: 'Latte Art,Smooth,All-Day',
          image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Flat White',
          price: 120,
          description: 'Double ristretto poured with finely micro-textured milk for a strong, velvety coffee profile without stiff foam.',
          tags: 'Double Ristretto,Microfoam,Specialty',
          image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spanish Latte',
          price: 140,
          description: 'Creamy espresso blended with sweetened condensed milk and steamed whole milk, sweet, smooth, and comforting.',
          tags: 'Sweet & Creamy,House Special',
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Café Mocha',
          price: 140,
          description: 'Espresso layered with rich artisan dark chocolate ganache, steamed whole milk, and light cocoa dusting.',
          tags: 'Belgian Chocolate,Espresso Ganache',
          image: 'https://images.unsplash.com/photo-1607681034540-2c46cc71896d?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rich Hot Chocolate',
          price: 120,
          description: 'Melted Belgian cocoa steamed with creamy whole milk and finished with toasted marshmallow foam.',
          tags: 'Velvety Cocoa,Warm Comfort',
          image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Signature & Cold Brews',
      slug: 'signature-cold-brews',
      parentCategory: 'COFFEE',
      description: 'Slow-steeped cold brews, iced signature lattes, and Italian chilled espresso creations.',
      sortOrder: 2,
      icon: 'ice-cream',
      items: [
        {
          name: 'Iced Spanish Latte',
          price: 160,
          description: 'Chilled espresso poured over sweet condensed milk, fresh milk, and crystal ice cubes. Sweet, creamy, and revitalizing.',
          tags: 'Iced Signature,Sweet Cream,Bestseller',
          image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Iced Caramel Macchiato',
          price: 160,
          description: 'Chilled milk marked with a fresh shot of espresso and drizzled with house-made salted caramel sauce.',
          tags: 'Caramel Drizzle,Chilled,Popular',
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Kabun 16-Hour Cold Brew',
          price: 150,
          description: 'Coarse-ground Guji micro-lot beans slow-steeped in cold filtered water for 16 hours. Ultra smooth, low acidity, notes of stone fruit and chocolate.',
          tags: '16hr Steeped,Low Acidity,Guji Micro-Lot',
          image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Affogato al Caffè',
          price: 140,
          description: 'A generous scoop of handcrafted vanilla bean gelato drowned in a hot double shot of fresh Kabun espresso.',
          tags: 'Vanilla Gelato,Hot Espresso,Italian Classic',
          image: 'https://images.unsplash.com/photo-1598908314732-07113901949e?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Shakerato',
          price: 130,
          description: 'Double espresso vigorously hand-shaken over ice and raw demerara sugar with a velvety frosted crema head.',
          tags: 'Hand-Shaken,Demerara Crema,Refreshing',
          image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Hand-Brewed / Roastery Pour-Over',
      slug: 'hand-brewed-pour-over',
      parentCategory: 'COFFEE',
      description: 'Artisanal manual filter brewing celebrating micro-lots from Yirgacheffe, Guji, and Sidama.',
      sortOrder: 3,
      icon: 'flame',
      items: [
        {
          name: 'V60 Single-Origin Pour-Over',
          price: 130,
          description: 'Hand-poured filter brew highlighting delicate floral jasmine, bergamot, and sweet peach notes of washed Yirgacheffe.',
          tags: 'Floral Jasmine,Bergamot,Yirgacheffe,Specialty Filter',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Chemex Clean Batch Brew',
          price: 150,
          description: 'Three-cup Chemex extraction delivering an exceptionally crisp, clean body with balanced sweetness and aromatic brightness.',
          tags: 'Crisp Body,Multi-Cup,Shared Experience',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Traditional Ethiopian Jebena Buna (Single-Origin)',
          price: 80,
          description: 'Hand-roasted specialty beans simmered in traditional clay jebena pot with ceremonial frankincense smoke and popcorn.',
          tags: 'Ceremonial,Clay Pot,Frankincense Aroma,Heritage',
          image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Frappes, Shakes & Smoothies',
      slug: 'frappes-shakes-smoothies',
      parentCategory: 'COFFEE',
      description: 'Hand-blended frappes, thick creamy shakes, and 100% freshly squeezed seasonal Ethiopian fruit juices.',
      sortOrder: 4,
      icon: 'cup-soda',
      items: [
        {
          name: 'Signature Oreo Cookie Frappe',
          price: 180,
          description: 'Blended Oreo cookies, double espresso, rich vanilla cream, crowned with fluffy whipped cream and chocolate biscuit crumble.',
          tags: 'Oreo Crunch,Blended Espresso,House Bestseller',
          image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Caramel Coffee Frappe',
          price: 175,
          description: 'Fresh espresso blended with rich caramel cream and ice, crowned with a golden caramel drizzle.',
          tags: 'Golden Caramel,Iced Espresso,Sweet Delight',
          image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Artisan Chocolate Milkshake',
          price: 160,
          description: 'Thick dark chocolate cream blended with chilled whole milk, vanilla gelato, and chocolate shavings.',
          tags: 'Belgian Dark Cocoa,Rich & Creamy',
          image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Fresh Seasonal Fruit Juice',
          price: 120,
          description: '100% freshly pressed local mango, avocado, strawberry, or classic Ethiopian layered Spris with lime squeeze.',
          tags: '100% Fresh,Mango,Avocado,Spris',
          image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Artisanal Teas & Refreshers',
      slug: 'artisanal-teas-refreshers',
      parentCategory: 'COFFEE',
      description: 'Spiced highland black teas, aromatic herbs, and chilled fruity infusions.',
      sortOrder: 5,
      icon: 'leaf',
      items: [
        {
          name: 'Spiced Ethiopian Tea',
          price: 70,
          description: 'Fragrant black tea infused with whole cardamom (korerima), cinnamon bark, and cloves. Warming and restorative.',
          tags: 'Cardamom (Korerima),Cinnamon,Highland Spices',
          image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Moroccan Mint Green Tea',
          price: 90,
          description: 'Gunpowder green tea steeped with fresh garden spearmint leaves and natural honey.',
          tags: 'Fresh Spearmint,Antioxidant,Revitalizing',
          image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Iced Hibiscus & Peach Tea',
          price: 120,
          description: 'Chilled ruby hibiscus tea infused with natural peach nectar, citrus slice, and mint garnish.',
          tags: 'Chilled Ruby Tea,Peach Nectar,Caffeine-Free',
          image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },

    // --- DEPARTMENT 2: BAKERY, PASTRIES & BITES ---
    {
      name: 'Viennoiserie & Pastries',
      slug: 'viennoiserie-pastries',
      parentCategory: 'BAKERY',
      description: 'Hand-laminated pure French butter pastries and brioche baked fresh every morning in our roastery kitchen.',
      sortOrder: 6,
      icon: 'croissant',
      items: [
        {
          name: 'Flaky Butter Croissant',
          price: 110,
          description: 'Hand-laminated pure French butter croissant, baked golden with airy honeycomb interior layers.',
          tags: 'French Butter,Honeycomb Layers,Baked Daily',
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Pain au Chocolat',
          price: 130,
          description: 'Flaky golden pastry filled with twin batons of rich Belgian dark chocolate.',
          tags: 'Belgian Dark Chocolate,Flaky Brioche,Morning Favorite',
          image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Glazed Cinnamon Roll',
          price: 120,
          description: 'Warm spiraled brioche dough rolled with Korintje cinnamon, brown butter, and creamy vanilla glaze.',
          tags: 'Warm Brioche,Cream Cheese Glaze,Sweet Treat',
          image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Artisan Biscotti & Shortbread Duo',
          price: 80,
          description: 'Twice-baked almond biscotti and buttery vanilla shortbread cookies, ideal for dipping into hot macchiato.',
          tags: 'Twice-Baked Almond,Perfect Dip,Classic Pairing',
          image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Cakes & Desserts',
      slug: 'cakes-desserts',
      parentCategory: 'BAKERY',
      description: 'Artisanal cakes, Italian espresso-infused desserts, and rich patisserie.',
      sortOrder: 7,
      icon: 'cake',
      items: [
        {
          name: 'Classic Italian Tiramisu',
          price: 170,
          description: 'Italian savoiardi ladyfingers soaked in Kabun single-origin espresso and layered with mascarpone cream and cocoa.',
          tags: 'Kabun Espresso Soaked,Mascarpone,Chef Signature',
          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'New York Style Baked Cheesecake',
          price: 180,
          description: 'Dense, velvety baked cream cheese with buttery graham cracker crust and wild berry compote.',
          tags: 'Velvety Cream,Graham Crust,Berry Compote',
          image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Rich Chocolate Fudge Cake',
          price: 170,
          description: 'Decadent multi-layered dark chocolate sponge filled with molten chocolate ganache and chocolate curls.',
          tags: 'Multi-Layer,Molten Ganache,Decadent',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Spiced Carrot Cake',
          price: 150,
          description: 'Moist spiced sponge studded with toasted walnuts and finished with velvety cream cheese frosting.',
          tags: 'Toasted Walnuts,Velvet Cream Cheese,Comforting',
          image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
    {
      name: 'Light Savory Bites & Breakfast',
      slug: 'light-savory-bites',
      parentCategory: 'BAKERY',
      description: 'Artisan toasts, toasted ciabatta paninis, and hearty morning plates.',
      sortOrder: 8,
      icon: 'sandwich',
      items: [
        {
          name: 'Sourdough Avocado Toast',
          price: 220,
          description: 'Toasted artisan sourdough bread, smashed avocado, soft-poached farm egg, chili flakes, and extra virgin olive oil.',
          tags: 'Poached Egg,Artisan Sourdough,Chili Flakes,Healthy',
          image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Roastery Club Sandwich',
          price: 240,
          description: 'Triple-decker toasted brioche with grilled herb chicken breast, smoked beef, cheddar, crisp lettuce, tomato, and dijonnaise with crispy potato wedges.',
          tags: 'Herb Chicken,Smoked Beef,Crispy Wedges,Hearty',
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Artisan Grilled Panini',
          price: 210,
          description: 'Warm ciabatta pressed with fresh mozzarella, sun-dried tomatoes, basil pesto, and balsamic glaze.',
          tags: 'Fresh Mozzarella,Basil Pesto,Sundried Tomato,Vegetarian',
          image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
        },
        {
          name: 'Breakfast Omelette & Croissant Platter',
          price: 230,
          description: 'Fluffy three-egg herb omelette with melted cheddar, paired with a fresh warm butter croissant, side salad, and seasonal fruit.',
          tags: 'Fluffy Herb Eggs,Butter Croissant,Fruit,Breakfast Combo',
          image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
  ];

  for (const catData of categoriesData) {
    const { items, ...categoryFields } = catData;

    const category = await prisma.category.create({
      data: categoryFields,
    });
    console.log(`📁 Created Category: ${category.name} (${category.parentCategory})`);

    for (let i = 0; i < items.length; i++) {
      const itemData = items[i];
      await prisma.menuItem.create({
        data: {
          ...itemData,
          categoryId: category.id,
          sortOrder: i + 1,
          isAvailable: true,
        },
      });
    }
    console.log(`   ✨ Seeded ${items.length} items in ${category.name}`);
  }

  console.log('🎉 KABUN COFFEE + ROASTERY Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
