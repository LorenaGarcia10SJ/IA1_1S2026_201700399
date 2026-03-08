const API_URL = "http://localhost:8000/medilogic";

export const diagnosticoCompleto = async (sintomas, alergias) => {
  const response = await fetch(`${API_URL}/diagnostico-completo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sintomas,
      alergias
    })
  });

  const data = await response.json();
  return data;
};