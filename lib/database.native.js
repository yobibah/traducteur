import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("translations.db");

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
        exemple TEXT NOT NULL,
        isfavorite INTEGER DEFAULT 0
      );
    `);

    // Migration pour les tables déjà existantes
    try {
      await db.execAsync(
        `ALTER TABLE translation ADD COLUMN isfavorite INTEGER DEFAULT 0`,
      );
    } catch (_) {}

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
  isfavorite = 0,
}) => {
  try {
    if (!message || !langueActuel || !langueCible || !sortie) {
      console.log("❌ Données invalides");
      return;
    }

    await db.runAsync(
      `INSERT INTO translation 
      (message, langueActuel, langueCible, sortie, allocution, exemple, isfavorite) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        message,
        langueActuel,
        langueCible,
        sortie,
        allocution || "",
        exemple || "",
        isfavorite,
      ],
    );

    console.log("✅ Insertion réussie");
  } catch (err) {
    console.log("❌ Erreur insertion :", err);
  }
};

export const getAll = async () => {
  try {
    return (
      (await db.getAllAsync("SELECT * FROM translation ORDER BY id DESC")) ?? []
    );
  } catch (err) {
    console.log("❌ Erreur getAll :", err);
    return [];
  }
};

export const getOne = async (message, langueCible) => {
  try {
    return (
      (await db.getFirstAsync(
        `SELECT * FROM translation WHERE message = ? AND langueCible = ?`,
        [message, langueCible],
      )) || null
    );
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

export const GetbyId = async (id) => {
  try {
    return (
      (await db.getFirstAsync(`SELECT * FROM translation WHERE id = ?`, [
        id,
      ])) || null
    );
  } catch (err) {
    console.log("❌ Erreur GetbyId :", err);
    return null;
  }
};

export const AddFavoriteUnfavorite = async (id, value) => {
  try {
    await db.runAsync("UPDATE translation SET isfavorite = ? WHERE id = ?", [
      value,
      id,
    ]);
    console.log("⭐ Favori mis à jour");
  } catch (err) {
    console.log("❌ Erreur AddFavoriteUnfavorite :", err);
  }
};
