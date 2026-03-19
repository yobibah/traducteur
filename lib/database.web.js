// database.web.js
const WEB_KEY = "translations";

export const createTable = async () => {
  if (!localStorage.getItem(WEB_KEY)) {
    localStorage.setItem(WEB_KEY, JSON.stringify([]));
  }
};

export const insertion = async ({
  message,
  langueActuel,
  langueCible,
  sortie,
  allocution,
  exemple,
  isfavorite = false,
}) => {
  if (!message || !langueActuel || !langueCible || !sortie) return;
  const data = JSON.parse(localStorage.getItem(WEB_KEY) || "[]");
  data.unshift({
    id: Date.now(),
    message,
    langueActuel,
    langueCible,
    sortie,
    allocution: allocution || "",
    exemple: exemple || "",
    isfavorite,
  });
  localStorage.setItem(WEB_KEY, JSON.stringify(data));
};

export const getAll = async () =>
  JSON.parse(localStorage.getItem(WEB_KEY) || "[]");

export const getOne = async (message, langueCible) => {
  const data = JSON.parse(localStorage.getItem(WEB_KEY) || "[]");
  return (
    data.find(
      (item) => item.message === message && item.langueCible === langueCible,
    ) || null
  );
};

export const supprimer = async (id) => {
  const data = JSON.parse(localStorage.getItem(WEB_KEY) || "[]");
  localStorage.setItem(
    WEB_KEY,
    JSON.stringify(data.filter((item) => item.id !== id)),
  );
};

export const toutDelete = async () =>
  localStorage.setItem(WEB_KEY, JSON.stringify([]));

export const GetbyId = async (id) => {
  const data = JSON.parse(localStorage.getItem(WEB_KEY) || "[]");
  return data.find((item) => item.id === id) || null;
};

export const AddFavoriteUnfavorite = async (id, value) => {
  const data = JSON.parse(localStorage.getItem(WEB_KEY) || "[]");
  const updated = data.map((item) =>
    item.id === id ? { ...item, isfavorite: value } : item,
  );
  localStorage.setItem(WEB_KEY, JSON.stringify(updated));
};
