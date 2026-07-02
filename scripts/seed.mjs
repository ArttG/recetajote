// Seed script — mbush databazën me receta shembull + një admin.
// Përdorim: npm run seed   (lexon .env.local përmes --env-file)
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "recipeapp";

if (!uri) {
  console.error("❌ Mungon MONGODB_URI në .env.local");
  process.exit(1);
}

const recipes = [
  {
    title: "Byrek me spinaq",
    description: "Byrek tradicional shqiptar me spinaq dhe petë të hollë.",
    category: "Drekë",
    cookTime: 60,
    servings: 6,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
    ingredients: ["500g petë", "400g spinaq", "2 vezë", "100ml vaj ulliri", "Kripë"],
    steps: ["Përgatit mbushjen me spinaq.", "Shtro petët në tavë.", "Shto mbushjen.", "Piq në 200°C për 40 min."],
  },
  {
    title: "Tavë kosi",
    description: "Mish qengji i pjekur me kos dhe vezë — klasik i kuzhinës shqiptare.",
    category: "Darkë",
    cookTime: 90,
    servings: 4,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
    ingredients: ["800g mish qengji", "500g kos", "3 vezë", "50g gjalpë", "Oriz", "Kripë e piper"],
    steps: ["Skuq mishin.", "Përziej kosin me vezët.", "Bashko në tavë.", "Piq për 45 min."],
  },
  {
    title: "Sallatë greke",
    description: "Sallatë e freskët me domate, kastravec, ullinj dhe djathë feta.",
    category: "Sallata",
    cookTime: 15,
    servings: 2,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800",
    ingredients: ["2 domate", "1 kastravec", "100g feta", "Ullinj", "Vaj ulliri", "Rigon"],
    steps: ["Pri perimet.", "Shto djathin dhe ullinjtë.", "Spërkat me vaj dhe rigon."],
  },
  {
    title: "Petulla",
    description: "Petulla të buta, ideale për mëngjes me mjaltë ose reçel.",
    category: "Mëngjes",
    cookTime: 30,
    servings: 4,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    ingredients: ["300g miell", "2 vezë", "250ml qumësht", "Maja", "Sheqer", "Kripë"],
    steps: ["Përziej përbërësit.", "Lëri brumin të fryhet.", "Skuq në vaj të nxehtë."],
  },
  {
    title: "Supë me perime",
    description: "Supë e ngrohtë dhe e shëndetshme me perime sezonale.",
    category: "Supa",
    cookTime: 40,
    servings: 4,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800",
    ingredients: ["2 karota", "2 patate", "1 qepë", "Selino", "Lëng perimesh", "Kripë e piper"],
    steps: ["Pri perimet.", "Zieji në lëng për 30 min.", "Shto erëza sipas dëshirës."],
  },
  {
    title: "Bakllava",
    description: "Ëmbëlsirë tradicionale me arra dhe sherbet.",
    category: "Ëmbëlsira",
    cookTime: 75,
    servings: 8,
    imageUrl: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800",
    ingredients: ["500g petë", "300g arra", "200g gjalpë", "300g sheqer", "Ujë", "Limon"],
    steps: ["Shtro petët me gjalpë.", "Shto arrat.", "Piq derisa të skuqet.", "Hidh sherbetin e ftohtë."],
  },
];

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // Receta
  await db.collection("recipes").deleteMany({});
  const withDates = recipes.map((r) => ({ ...r, createdBy: "admin@recetajote.com", createdAt: new Date() }));
  await db.collection("recipes").insertMany(withDates);
  console.log(`✅ U shtuan ${withDates.length} receta`);

  // Admin user
  const adminEmail = "admin@recetajote.com";
  const existing = await db.collection("users").findOne({ email: adminEmail });
  if (!existing) {
    const password = await bcrypt.hash("admin123", 10);
    await db.collection("users").insertOne({
      name: "Administratori",
      email: adminEmail,
      password,
      role: "admin",
      createdAt: new Date(),
    });
    console.log(`✅ U krijua admini: ${adminEmail} / admin123`);
  } else {
    await db.collection("users").updateOne({ email: adminEmail }, { $set: { role: "admin" } });
    console.log(`ℹ️ Admini ekziston tashmë (u sigurua roli admin): ${adminEmail}`);
  }

  await client.close();
  console.log("🎉 Seed përfundoi.");
}

main().catch((err) => {
  console.error("❌ Gabim gjatë seed:", err);
  process.exit(1);
});
