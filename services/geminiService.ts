import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client safely
// Checks if process exists (Node/Bundled env) or handles missing key gracefully
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export const askChefAI = async (question: string, context?: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key not configured for Gemini AI.");
    return "O Chef está offline no momento (Chave de API não configurada). Tente novamente mais tarde.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    let prompt = `Você é um Chef de Cozinha profissional e amigável. Responda à pergunta do utilizador em Português de Portugal.
    Seja conciso, prático e encorajador.
    Pergunta: ${question}`;

    if (context) {
      prompt += `\nContexto da receita atual: ${context}`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Desculpe, estou a ter dificuldades em encontrar essa resposta no momento.";
  } catch (error) {
    console.error("Erro ao consultar o Chef AI:", error);
    return "Ocorreu um erro ao contactar o Chef. Por favor, tente novamente mais tarde.";
  }
};

export const askGlobalChefAI = async (message: string, history: {role: string, content: string}[]): Promise<string> => {
  if (!apiKey) {
    return "O Chef está offline no momento. Por favor verifique a configuração da API Key.";
  }

  try {
    const model = 'gemini-2.5-flash';

    // Construct the prompt with history context
    // We manually simulate chat history here for the single-turn generateContent, 
    // or we could use startChat if we wanted to maintain a session object. 
    
    const systemInstruction = `
    Você é o "Chef Global", um especialista culinário com conhecimento enciclopédico de gastronomia mundial.
    
    A tua especialidade principal é a **Culinária Africana** e **Portuguesa**. 
    Você conhece detalhadamente mais de 50 pratos tradicionais africanos, com foco especial nos PALOP (Países Africanos de Língua Oficial Portuguesa).

    O teu repertório inclui, mas não se limita a:
    
    1. **Angola**: Moamba de Galinha, Calulu (Peixe/Carne), Funge (Mandioca/Milho), Mufete, Kizaka, Feijão de Óleo de Palma, Cocada Amarela, Farofa, Muzongué.
    2. **Cabo Verde**: Cachupa (Rica, Pobre, Refogada), Xerém, Modje de São Nicolau, Caldo de Peixe, Pastel com Diabo Dentro, Buzio, Pudim de Queijo, Cuscuz de Milho.
    3. **Moçambique**: Matapa com Caranguejo/Camarão, Frango à Zambeziana, Caril de Amendoim, Xima, Camarão Tigre Grelhado, Badjias, Mucapata.
    4. **Guiné-Bissau**: Caldo de Mancarra, Sigá, Cafriela de Frango, Yassa de Frango (influência regional), Caldo de Chabéu.
    5. **São Tomé e Príncipe**: Calulu de São Tomé, Molho no Fogo, Peixe Fumado com Banana Pão, Ijogó, Blablá.
    6. **Clássicos Continentais**: Jollof Rice (Nigéria/Gana), Egusi Soup, Fufu, Tagine (Norte de África), Couscous, Bobotie (África do Sul), Chakalaka, Bunny Chow, Injera e Doro Wat (Etiópia), Mafe.

    E claro, a cozinha Portuguesa (Rancho, Cozido à Portuguesa, Bacalhau em todas as formas, Arroz de Pato, etc.).

    **Instruções de Resposta:**
    - Ensine receitas completas e autênticas.
    - Explique a origem dos ingredientes (ex: óleo de palma, quiabos, mandioca, gindungo).
    - Sugira substituições para ingredientes difíceis de encontrar fora de África.
    - Responda sempre em Português de Portugal.
    - Seja caloroso, profissional e use Markdown para formatar listas de ingredientes e passos.
    `;

    const contents = [
      { role: 'user', parts: [{ text: systemInstruction }] },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents as any, 
    });

    return response.text || "Desculpe, não consegui processar o seu pedido culinário.";
  } catch (error) {
    console.error("Erro no Global Chef AI:", error);
    return "Tive um pequeno problema na cozinha (erro de conexão). Tente novamente.";
  }
};