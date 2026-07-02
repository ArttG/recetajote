// Krijon/rifreskon vetëm përdoruesin admin — PA prekur recetat ekzistuese.
// Përdorim:  npm run create-admin
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "recipeapp";

if (!uri) {
  console.error("❌ Mungon MONGODB_URI në .env.local");
  process.exit(1);
}

const adminEmail = "admin@recetajote.com";
const adminPass = "admin123";

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const password = await bcrypt.hash(adminPass, 10);
  await db.collection("users").updateOne(
    { email: adminEmail },
    {
      $set: { name: "Administratori", role: "admin", password },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
  console.log(`✅ Admini u sigurua: ${adminEmail} / ${adminPass}`);

  // Pastron llogaritë e testit të krijuara gjatë debug-imit (nëse ka).
  const cleanup = await db.collection("users").deleteMany({ email: { $regex: "^claudetest" } });
  if (cleanup.deletedCount) console.log(`🧹 U fshinë ${cleanup.deletedCount} llogari testi.`);

  await client.close();
  console.log("🎉 Përfundoi.");
}

main().catch((err) => {
  console.error("❌ Gabim:", err);
  process.exit(1);
});
