import * as SQLite from "expo-sqlite";

// ✅ OUVERTURE DB (synchrone = stable)
const db = SQLite.openDatabaseSync("translations.db");

// ✅ CREATION TABLE
export const createTable = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS translation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        langueActuel TEXT NOT NULL,
        langueCible TEXT NOT NULL,
        sortie TEXT NOT NULL,
        allocution TEXT NOT NULL,
        exemple TEXT NOT NULL
      );
    `);

    console.log("✅ Table prête");
  } catch (err) {
    console.log("❌ Erreur création table :", err);
  }
};

export const insertion = async ({
  message,
  langueActuel,
  langueCible,
  sortie,
  allocution,
  exemple,
}) => {
  try {
    // 🔒 sécurité
    if (!message || !langueActuel || !langueCible || !sortie) {
      console.log("❌ Données invalides");
      return;
    }

    await db.runAsync(
      `INSERT INTO translation 
      (message, langueActuel, langueCible, sortie, allocution, exemple) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        message,
        langueActuel,
        langueCible,
        sortie,
        allocution || "",
        exemple || "",
      ],
    );

    console.log("✅ Insertion réussie");
  } catch (err) {
    console.log("❌ Erreur insertion :", err);
  }
};

export const getAll = async () => {
  try {
    const result = await db.getAllAsync(
      "SELECT * FROM translation ORDER BY id DESC",
    );

    return result ?? [];
  } catch (err) {
    console.log("❌ Erreur getAll :", err);
    return [];
  }
};

export const getOne = async (message, langueCible) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT * FROM translation 
       WHERE message = ? AND langueCible = ?`,
      [message, langueCible],
    );

    return result || null;
  } catch (err) {
    console.log("❌ Erreur getOne :", err);
    return null;
  }
};

export const supprimer = async (id) => {
  try {
    await db.runAsync("DELETE FROM translation WHERE id = ?", [id]);

    console.log("🗑️ Supprimé");
  } catch (err) {
    console.log("❌ Erreur suppression :", err);
  }
};

export const toutDelete = async () => {
  try {
    await db.runAsync("DELETE FROM translation");

    console.log("🧹 Tout supprimé");
  } catch (err) {
    console.log("❌ Erreur delete all :", err);
  }
};
