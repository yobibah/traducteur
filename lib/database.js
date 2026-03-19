import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("translations.db");

export const createTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS translation (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      langueActuel TEXT NOT NULL,
      langueCible TEXT NOT NULL,
      sortie TEXT NOT NULL,
      allocution TEXT,
      exemple TEXT,
      isfavorite INTEGER DEFAULT 0
    );
  `);

  // Migration si la colonne est absente (table déjà existante)
  try {
    await db.execAsync(
      `ALTER TABLE translation ADD COLUMN isfavorite INTEGER DEFAULT 0`,
    );
  } catch (_) {}
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
  if (!message || !langueActuel || !langueCible || !sortie) return;
  await db.runAsync(
    `INSERT INTO translation (message, langueActuel, langueCible, sortie, allocution, exemple, isfavorite) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
};

export const getAll = async () =>
  (await db.getAllAsync("SELECT * FROM translation ORDER BY id DESC")) ?? [];

export const getOne = async (message, langueCible) =>
  (await db.getFirstAsync(
    `SELECT * FROM translation WHERE message = ? AND langueCible = ?`,
    [message, langueCible],
  )) || null;

export const supprimer = async (id) =>
  await db.runAsync("DELETE FROM translation WHERE id = ?", [id]);

export const toutDelete = async () =>
  await db.runAsync("DELETE FROM translation");

export const GetbyId = async (id) =>
  (await db.getFirstAsync(`SELECT * FROM translation WHERE id = ?`, [id])) ||
  null;

export const AddFavoriteUnfavorite = async (id, value) =>
  await db.runAsync("UPDATE translation SET isfavorite = ? WHERE id = ?", [
    value,
    id,
  ]);
