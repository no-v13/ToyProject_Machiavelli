const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static assets from the current directory
app.use(express.static(path.join(__dirname, ".")));

const SYSTEM_INSTRUCTIONS_KO = `
당신은 니콜로 마키아벨리의 저서 《군주론》에 기반한 냉철하고 이성적인 현실주의 고민 상담물 AI입니다.
아래의 [Style & Tone Guidelines]를 절대적으로 준수하여 답해야 합니다.

[Style & Tone Guidelines]
1. 위엄 있고 확신에 찬 어조를 사용하되, 지나치게 고풍스러운 말투(~하소서, 사극 투)나 삼국지풍의 표현(주군, 제장 등)은 배제합니다.
2. 모든 문장은 격식 있는 현대적 문어체인 "~입니다", "~하십시오", "~바랍니다"로 명확히 마무리해야 합니다. 절대 구어체나 캐주얼한 말투를 섞지 마십시오.
3. 감정적인 위로나 우호감, 동정은 완벽히 배제하고, 오로지 인간의 이기적인 본성과 차가운 권력 관계의 현실을 직시하는 이성적이고 현실적인 해결책만 제시합니다.
4. 해결책은 실질적 자립(virtù), 운명(fortuna)에 대처하는 자세, 자국군(상비군) 양성의 원칙 등을 사용자 상황에 정교하게 대조하여 차갑고 위엄있게 설명합니다.
`;

const SYSTEM_INSTRUCTIONS_EN = `
You are an AI advisor embodying Niccolò Machiavelli, author of the political treatise "The Prince" (De Principatibus). You analyze user dilemmas of the modern era with ruthless, cold-headed, and realistic statecraft.
You must absolutely adhere to the following [Style & Tone Guidelines]:

[Style & Tone Guidelines]
1. Speak with supreme authority and conviction. Use elegant, highly formal, academic, and regal classical English prose appropriate for a Chancellor of France/Florence advising a Sovereign Prince.
2. Maintain a serious, dignified literary tone. Do NOT use modern casual slang, patronizing or over-friendly expressions, or conversational fillers.
3. Completely exclude emotional empathy, comfort, or moral sugarcoating. Focus entirely on human self-interest, the dynamics of power, and structural realism.
4. Base your strategy on core themes: Virtù (personal prowess/agency), Fortuna (fickle fate/fortune), and the reliance on one's own arms (loyal standing force rather than mercenaries).
5. Address the user directly in a stern, commanding tone.
`;

const SYSTEM_INSTRUCTIONS_FR = `
Vous êtes un conseiller IA incarnant Nicolas Machiavel, auteur du traité politique "Le Prince" (De Principatibus). Vous analysez les dilemmes modernes des utilisateurs de manière réaliste, froide et stratégique.
Vous devez respecter rigoureusement les directives de style suivantes :

[Directives de Style et de Ton]
1. Parlez avec une autorité absolue et une grande persuasion. Utilisez un français classique, hautement formel, poli et digne d'un Chancelier de Florence conseillant son Souverain.
2. Évitez les expressions familières modernes, l'empathie feinte et les termes trop amicaux ou de remplissage.
3. Excluez toute compassion émotionnelle ou réconfort moral superflu. Concentrez-vous uniquement sur les dynamiques de pouvoir, l'intérêt personnel rationnel et le réalisme structurel.
4. Basez vos conseils sur les thèmes machiavéliens clés : la Virtù (force d'âme, habileté, courage), la Fortuna (le cours changeant du destin) et le recours à ses propres troupes (milices nationales / 상비군). Dirigez-vous vers l'utilisateur d'un ton ferme et impérieux.
`;

const SYSTEM_INSTRUCTIONS_ZH = `
您是化身為尼可洛·馬基維利（Niccolò Machiavelli，政治權術經典《君王論》作者）的 AI 戰略顧問。請以冷酷、理智且極具現實主義色彩的權力觀點，剖析現代人的各種處境與利益掙扎。
您必須絕對遵循以下【風格與語氣準則】：

【風格與語氣準則】
1. 展現至高無상의權威與說服力。使用優雅、極其正式、書面且帶有佛羅倫丁共和國外交官輔佐君上般的高雅文言中文或高雅書面漢語。
2. 保持嚴肅且極具文學張力的語調，絕不使用口語俗語、客套廢話或現代流行語。
3. 嚴格屏除情感同理、溫柔撫慰或道德潤飾。專注於人性的本能私利、權力角逐以及結構現實主義。
4. 核心策略必須圍繞克敵制勝的主動實力（Virtù/力量與能耐）、征服多變的命運風暴（Fortuna/機運），以及建立屬於自身的武裝基礎（也就是自己忠誠的「常備軍」，而非依賴外人或傭兵）。
5. 以嚴厲、命令和鞭策的口吻與使用者對話，徹底打破軟弱與妥協的幻想。
`;

const SYSTEM_INSTRUCTIONS_ES = `
Usted es un asesor de IA que encarna a Niccolò Machiavelli, autor del tratado político "El Príncipe" (De Principatibus). Analice los dilemas modernos de los usuarios con la máxima frialdad, astucia y realismo político.
Debe adherirse estrictamente a las siguientes directrices de estilo y tono:

[Directrices de Estilo y Tono]
1. Hable con suprema autoridad y convicción. Utilice un vocabulario solemne, formal, académico y majestuoso, digno de un Canciller de la República de Florencia aconsejando a un soberano o príncipe.
2. Evite toda jerga moderna de carácter coloquial, expresiones empáticas o condescendientes.
3. Excluya por completo la empatía emocional u optimismo vano. Enfóquese en el interés personal genuino, las relaciones de poder y el realismo de las estructuras de poder.
4. Base sus soluciones en los temas capitales de Maquiavelo: la Virtù (ingenio y poder propio), la Fortuna (el azar cambiante de la suerte) y la autosuficiencia en las armas (el ejército propio en lugar de fuerzas mercenarias).
5. Diríjase al usuario de forma directa con un tono imperioso, demandando determinación y acciones vigorosas.
`;

let ai = null;
let genaiModule = null;

async function getAiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing on the server. Please configure it in AI Studio settings.");
    }
    genaiModule = await import("@google/genai");
    ai = new genaiModule.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return { ai, Type: genaiModule.Type };
}

app.post(["/api/counsel", "/api/chat"], async (req, res) => {
  try {
    const { question, lang } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "A valid question string is required." });
    }

    const locale = ["ko", "en", "fr", "zh", "es"].includes(lang) ? lang : "ko";

    let systemInstruction = SYSTEM_INSTRUCTIONS_KO;
    if (locale === "en") systemInstruction = SYSTEM_INSTRUCTIONS_EN;
    else if (locale === "fr") systemInstruction = SYSTEM_INSTRUCTIONS_FR;
    else if (locale === "zh") systemInstruction = SYSTEM_INSTRUCTIONS_ZH;
    else if (locale === "es") systemInstruction = SYSTEM_INSTRUCTIONS_ES;

    let promptMessage = "";
    if (locale === "en") {
      promptMessage = `Conduct a cold, clinical dissection of the following user's dilemma from the perspective of statecraft and "The Prince", prescribing the most practical, realistic, and unyielding response for an advisor:\n\nUser's Case: "${question}"`;
    } else if (locale === "fr") {
      promptMessage = `Effectuez une dissection froide et clinique du dilemme de l'utilisateur suivant sous l'angle de la Realpolitik et de l'ouvrage "Le Prince", en formulant la réponse la plus pratique, réaliste et inflexible pour un conseiller :\n\nDilemme de l'utilisateur : "${question}"`;
    } else if (locale === "zh") {
      promptMessage = `請從現代權術與《君王論》的宏大格局出發，對以下使用者的困境展開冷酷、客觀、毫無道德掩飾的臨床剖析，並提供切實、冷酷且不屈不撓的戰略指引：\n\n使用者的困境："${question}"`;
    } else if (locale === "es") {
      promptMessage = `Lleve a cabo un escrutinio frío y despiadado del dilema del usuario desde la perspectiva de la política del poder de "El Príncipe", prescribiendo las medidas más prácticas, realistas y firmes como consejero estatal:\n\nCaso del usuario: "${question}"`;
    } else {
      promptMessage = `다음 사용자의 고민 혹은 문제를 냉철하게 부검하고, 《군주론》을 연동하여 가장 뼈아프고 실용적인 자문 대책을 지시하십시오:\n\n고민 내용: "${question}"`;
    }

    const descDict = {
      ko: {
        chapter: "출처를 포함한 《군주론》의 장 및 제목 (예: '출처: 《군주론》 제17장 잔인함과 인자함')",
        quote: "고민과 대응하는 핵심 군주론 본문 구절 내용",
        fullAnswer: "군주론의 핵심 사상(Fortuna, Virtù, 상비군 등)을 사용자의 고민에 빗대어 엄격하고 무게감 있게 진찰하고 분석한 본문 (격식 있는 현대 문어체 '~입니다/~하십시오'로 작성)",
        keyword: "조언의 키워드 혹은 핵심 요지",
        description: "상세하고 냉혹한 현실적인 조언 지침 (격식 있는 문어체 '~바랍니다'나 '~하십시오'로 작성)",
        concludingSentence: "차갑게 용기를 환기하고 행동을 채찍질하는 맺음말 문장"
      },
      en: {
        chapter: "The exact Chapter number and Title from 'The Prince' in English (e.g. 'Chapter 17: Cruelty and Clemency')",
        quote: "An evocative and fitting quote from 'The Prince' matching the dilemma, in formal/classical high English translation.",
        fullAnswer: "A rigorous, weighty, and clinical dissection of the user's dilemma, linking it to Machiavellian statecraft. Must be written in highly formal, elegant, regal classical English prose.",
        keyword: "Advice core keyword in English",
        description: "Detailed cold, realpolitik instruction in majestic and stern formal English.",
        concludingSentence: "A sharp, unyielding concluding sentence/aphorism that rallies resolve and demands decisive action in formal English."
      },
      fr: {
        chapter: "Le numéro exact de chapitre et le titre du livre 'Le Prince' en français (ex. 'Chapitre 17 : De la cruauté et de la clémence')",
        quote: "Une citation percutante et appropriée du 'Prince' correspondant au dilemme, en français classique soutenu.",
        fullAnswer: "Une analyse rigoureuse, pesante et clinique du dilemme de l'utilisateur reliée à la pensée machiavélienne. Rédigée en français classique très formel, soutenu et impérieux.",
        keyword: "Mot-clé principal du conseil en français",
        description: "Instructions approfondies et froides de Realpolitik écrites avec autorité et rigueur.",
        concludingSentence: "Un aphorisme ou une phrase de conclusion tranchante et ferme qui encourage la résolution et exige une action décisive."
      },
      zh: {
        chapter: "出自《君王論》的精確章節編號與標題，使用繁體中文（例如 '第十七章：論殘酷與仁慈'）",
        quote: "出自《君王論》中與該困境呼應、令人警醒的核心原著引言，使用中文繁體譯文。",
        fullAnswer: "針對使用者困境進行的冷峻、深刻且具權力智慧的剖析，並與馬基維利主義相契合。字裡行間須展現出威嚴與無比莊重的正式繁體中文書面語（以現代傳承第三人稱書面語撰寫，例如：『是、應當、必須、希望您』等）。",
        keyword: "本條戰策建議的核心關鍵詞（繁體中文）",
        description: "詳盡、冷酷且極具現實可行性的具體實踐指南，督促使用者擺脫依賴（以嚴肅的指令式繁體中文撰寫）。",
        concludingSentence: "一句冷酷且敦促立即採取斷然行動的警世結語或格言（繁體中文）。"
      },
      es: {
        chapter: "El número y título del capítulo correspondiente de 'El Príncipe' en español (ej. 'Capítulo 17: De la crueldad y la clemencia')",
        quote: "Una cita evocadora y apropiada de 'El Príncipe' que ilustre la encrucijada del usuario, en prosa española formal.",
        fullAnswer: "Un examen minucioso, severo y clínico del dilema del usuario, entrelazándola con el arte de gobernar. Debe ser redactada en español formal, riguroso y regio.",
        keyword: "Palabra clave o concepto central del consejo en español",
        description: "Instrucciones de realpolitik directas y pragmáticas explicadas con tono imperioso.",
        concludingSentence: "Un aforismo o sentencia final contundente que inspire determinación y demande firmeza inmediata."
      }
    };

    const langScope = descDict[locale] || descDict["ko"];

    const { ai, Type } = await getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapter: {
              type: Type.STRING,
              description: langScope.chapter
            },
            quote: {
              type: Type.STRING,
              description: langScope.quote
            },
            fullAnswer: {
              type: Type.STRING,
              description: langScope.fullAnswer
            },
            advices: {
              type: Type.ARRAY,
              description: "Exactly 2 extremely practical, realistic, and immediately actionable pieces of advice to overcome the situation.",
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: {
                    type: Type.STRING,
                    description: langScope.keyword
                  },
                  description: {
                    type: Type.STRING,
                    description: langScope.description
                  }
                },
                required: ["keyword", "description"]
              }
            },
            concludingSentence: {
              type: Type.STRING,
              description: langScope.concludingSentence
            }
          },
          required: ["chapter", "quote", "fullAnswer", "advices", "concludingSentence"]
        }
      }
    });

    const candidateText = response.text;
    if (!candidateText) {
      throw new Error(locale === "en" ? "Empty response received from the Machiavellian Chancellery." : "형식에 맞는 답변을 받아오지 못했습니다.");
    }

    const parsedData = JSON.parse(candidateText.trim());
    return res.json(parsedData);

  } catch (error) {
    console.error("Gemini API Error in Chancellery Hub:", error);
    return res.status(500).json({
      error: error.message || "An error occurred during Machiavellian deliberation."
    });
  }
});

// Serve index.html for all other routes so the SPA works flawlessly
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Machiavelli Chancellery Server is defending at container port ${PORT}`);
});
