import Uri from "../hooks/uri";

interface prompt {
  message: string;
  langueActuel: string;
  langueCible: string;
}

interface PromptResponse {
  sortie: string;
  allocution: string;
  exemple: string;
}



const Aiservice = async ({
  message,
  langueActuel,
  langueCible,
}: prompt): Promise<PromptResponse> => {
  const { Ai_Token } = Uri();


  try {
const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${Ai_Token}`,
  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Traduis "${message}" de ${langueActuel} vers ${langueCible}.

Réponds UNIQUEMENT en JSON:

{"sortie":"...","allocution":"...","exemple":"..."}
                  `,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    console.log("DATA 👉", JSON.stringify(data, null, 2));
      console.log(message)

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🔥 EXTRACTION JSON SAFE
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("JSON introuvable");

    const parsed = JSON.parse(jsonMatch[0]);

    return parsed;
  } catch (err) {
    console.log("ERREUR AI ❌", err);

    return {
      sortie: "Erreur",
      allocution: "",
      exemple: "",
    };
  }
};

export default Aiservice;