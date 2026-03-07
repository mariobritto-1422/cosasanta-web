"use client";

import { useState, useEffect, useRef } from "react";

const WA_BG       = "#0B141A";
const WA_HEADER   = "#1F2C34";
const WA_BUBBLE_L = "#1F2C34";
const WA_BUBBLE_R = "#005C4B";
const WA_GREEN    = "#00A884";
const WA_TEXT     = "#E9EDEF";
const WA_MUTED    = "#8696A0";
const WA_TIME     = "#667781";
const ORANGE      = "#F07428";

const nowTime = (): string => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

type StepTipo = "opciones" | "texto" | "loading";

interface Step {
  id: string;
  bot: string | ((a?: string, b?: string) => string);
  tipo: StepTipo;
  opciones?: string[];
  placeholder?: string;
  respuestaAlternativa?: string;
}

const STEPS: Step[] = [
  {
    id: "bienvenida",
    bot: `¡Hola! 👋 Soy *AutoPost*, tu agente de contenido de *cosa$anta*.\n\nEn menos de 2 minutos te genero un *calendario completo de publicaciones* personalizado para tu negocio. 🚀\n\n¿Empezamos?`,
    tipo: "opciones",
    opciones: ["¡Sí, empecemos! 🔥", "¿Cómo funciona?"],
    respuestaAlternativa: `Perfecto. Solo necesito *4 datos* sobre tu negocio y la IA hace el resto.\n\nGenero posts para Instagram, Facebook y LinkedIn — con texto, formato y hashtags listos para publicar.\n\n¿Arrancamos?`,
  },
  {
    id: "nombre",
    bot: `Genial! 💪\n\n¿Cuál es el *nombre de tu empresa o marca*?`,
    tipo: "texto",
    placeholder: "Ej: Clínica Sonrisa, Moda Actual, Estudio Contable...",
  },
  {
    id: "rubro",
    bot: (nombre?: string) =>
      `Perfecto, *${nombre}*! 🎯\n\n¿A qué se dedica tu negocio? Describímelo brevemente.`,
    tipo: "texto",
    placeholder: "Ej: Vendo ropa deportiva para mujeres, soy dentista, tengo una panadería...",
  },
  {
    id: "tono",
    bot: () =>
      `Entendido! 📌\n\nEl *tono de comunicación* de tu marca, ¿cómo lo definirías?`,
    tipo: "opciones",
    opciones: [
      "🎯 Profesional y serio",
      "😊 Cercano y amigable",
      "🔥 Energético y motivador",
      "✨ Elegante y aspiracional",
    ],
  },
  {
    id: "objetivo",
    bot: () =>
      `Casi listo! Un último dato 🏁\n\n¿Cuál es tu *principal objetivo* en redes sociales?`,
    tipo: "opciones",
    opciones: [
      "📈 Conseguir más clientes",
      "💡 Posicionarme como experto",
      "🛍️ Vender productos/servicios",
      "❤️ Fidelizar clientes actuales",
    ],
  },
  {
    id: "generando",
    bot: () =>
      `¡Perfecto! Tengo todo lo que necesito. 🧠✨\n\nLa IA está analizando tu negocio y creando tu calendario...\n\n⏳ Esto tarda unos segundos...`,
    tipo: "loading",
  },
];

interface Post {
  semana: number;
  dia: string;
  tipo: string;
  texto: string;
  hashtags: string[];
}

interface Message {
  type: "bot" | "user" | "typing";
  text?: string;
  time?: string;
  id: number;
}

const TIPO_COLOR: Record<string, string> = {
  Educativo:     "#3B82F6",
  Promocional:   ORANGE,
  Inspiracional: "#A855F7",
  Interactivo:   "#10B981",
  Storytelling:  "#F59E0B",
};

function BubbleBot({
  text,
  time,
  typing,
}: {
  text?: string;
  time?: string;
  typing?: boolean;
}) {
  const formatText = (t: string) =>
    t.split(/(\*[^*]+\*)/g).map((p, i) =>
      p.startsWith("*") && p.endsWith("*") ? (
        <strong key={i} style={{ color: WA_TEXT }}>
          {p.slice(1, -1)}
        </strong>
      ) : (
        <span key={i}>{p}</span>
      )
    );

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "flex-end" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: `linear-gradient(135deg, ${ORANGE}, #D06010)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, flexShrink: 0,
      }}>🤖</div>
      <div style={{
        background: WA_BUBBLE_L, borderRadius: "0 8px 8px 8px",
        padding: "8px 12px 6px", maxWidth: "78%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}>
        {typing ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center", height: 16 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%", background: WA_MUTED,
                animation: `typing-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        ) : (
          <>
            <p style={{
              margin: 0, fontSize: 13.5, color: WA_TEXT, lineHeight: 1.5,
              whiteSpace: "pre-wrap", wordBreak: "break-word",
            }}>
              {text && formatText(text)}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
              <span style={{ fontSize: 10, color: WA_TIME }}>{time}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BubbleUser({ text, time }: { text: string; time: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
      <div style={{
        background: WA_BUBBLE_R, borderRadius: "8px 0 8px 8px",
        padding: "8px 12px 6px", maxWidth: "72%",
        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }}>
        <p style={{ margin: 0, fontSize: 13.5, color: WA_TEXT, lineHeight: 1.5, wordBreak: "break-word" }}>
          {text}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
          <span style={{ fontSize: 10, color: WA_TIME }}>{time}</span>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const txt = `${post.texto}\n\n${post.hashtags.join(" ")}`;
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: "#0D1117",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10, padding: "14px 16px", marginBottom: 10,
      animation: `fadeUp 0.4s ease ${index * 0.08}s both`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: TIPO_COLOR[post.tipo] || ORANGE,
            background: `${TIPO_COLOR[post.tipo] || ORANGE}18`,
            padding: "3px 8px", borderRadius: 4,
          }}>{post.tipo}</span>
          <span style={{ fontSize: 11, color: WA_MUTED }}>
            Sem {post.semana} · {post.dia}
          </span>
        </div>
        <button onClick={copy} style={{
          background: copied ? "#10B98120" : "rgba(255,255,255,0.05)",
          border: `1px solid ${copied ? "#10B981" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 4, padding: "4px 10px",
          color: copied ? "#10B981" : WA_MUTED,
          fontSize: 10, cursor: "pointer",
        }}>
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
      <p style={{ margin: "0 0 10px", fontSize: 12.5, color: WA_TEXT, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
        {post.texto}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5 }}>
        {post.hashtags.map((h, i) => (
          <span key={i} style={{
            fontSize: 11, color: "#539BF5",
            background: "rgba(83,155,245,0.1)",
            padding: "2px 7px", borderRadius: 4,
          }}>{h}</span>
        ))}
      </div>
    </div>
  );
}

export default function AgenteContenido() {
  const [messages, setMessages]         = useState<Message[]>([]);
  const [stepIdx, setStepIdx]           = useState(0);
  const [inputVal, setInputVal]         = useState("");
  const [waiting, setWaiting]           = useState(false);
  const [respuestas, setRespuestas]     = useState<Record<string, string>>({});
  const [calendario, setCalendario]     = useState<Post[] | null>(null);
  const [semanaActiva, setSemanaActiva] = useState(1);
  const [showCal, setShowCal]           = useState(false);
  const [altMode, setAltMode]           = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const scroll = () =>
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

  useEffect(() => {
    setTimeout(() => addBotMsg(STEPS[0].bot as string), 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBotMsg = (text: string) => {
    setMessages((prev) => [...prev, { type: "bot", text, time: nowTime(), id: Date.now() + Math.random() }]);
    scroll();
  };

  const addUserMsg = (text: string) => {
    setMessages((prev) => [...prev, { type: "user", text, time: nowTime(), id: Date.now() + Math.random() }]);
    scroll();
  };

  const showTyping = (): Promise<void> =>
    new Promise((res) => {
      const id = Date.now() + Math.random();
      setMessages((prev) => [...prev, { type: "typing", id }]);
      scroll();
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        res();
      }, 1200 + Math.random() * 600);
    });

  const avanzar = async (respuesta: string, stepOverride?: number) => {
    const idx  = stepOverride ?? stepIdx;
    const step = STEPS[idx];

    addUserMsg(respuesta);
    setWaiting(true);
    await showTyping();

    const newResp = { ...respuestas, [step.id]: respuesta };
    setRespuestas(newResp);

    if (step.id === "bienvenida" && respuesta === "¿Cómo funciona?" && !altMode) {
      setAltMode(true);
      addBotMsg(step.respuestaAlternativa!);
      setWaiting(false);
      return;
    }

    const next = idx + 1;
    if (next >= STEPS.length) return;

    const nextStep = STEPS[next];
    const botText =
      typeof nextStep.bot === "function"
        ? nextStep.bot(newResp.nombre, newResp.rubro)
        : nextStep.bot;

    addBotMsg(botText);
    setStepIdx(next);
    setWaiting(false);

    if (nextStep.tipo === "loading") {
      setTimeout(async () => {
        try {
          const res = await fetch("/api/generar-posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre:   newResp.nombre,
              rubro:    newResp.rubro,
              tono:     newResp.tono,
              objetivo: newResp.objetivo,
            }),
          });

          const data = await res.json();
          await showTyping();

          if (data?.posts?.length) {
            setCalendario(data.posts);
            addBotMsg(
              `¡Listo, ${newResp.nombre}! 🎉\n\nGeneré *${data.posts.length} publicaciones* personalizadas para *${newResp.nombre}* — distribuidas en 4 semanas.\n\nTenés contenido para todo el mes. ✅ Tocá "Copiar" en cada post para usarlo directamente.`
            );
            setTimeout(() => { setShowCal(true); scroll(); }, 400);
          } else {
            addBotMsg("Hubo un error generando el contenido. Intentá de nuevo 🔄");
          }
        } catch {
          addBotMsg("Hubo un error de conexión. Verificá tu internet e intentá de nuevo 🔄");
        }
        setWaiting(false);
      }, 800);
    }

    if (nextStep.tipo === "texto") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const handleEnviar = () => {
    if (!inputVal.trim() || waiting) return;
    const val = inputVal.trim();
    setInputVal("");
    avanzar(val);
  };

  const currentStep = STEPS[stepIdx];
  const postsFiltrados = calendario?.filter((p) => p.semana === semanaActiva) || [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111B21",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 460, minHeight: "100vh",
        background: WA_BG, display: "flex", flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{
          background: WA_HEADER, padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)", flexShrink: 0,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: `linear-gradient(135deg, ${ORANGE}, #D06010)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: WA_TEXT }}>AutoPost</div>
            <div style={{ fontSize: 11, color: WA_GREEN }}>cosa$anta · en línea</div>
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "12px 12px 8px", background: WA_BG,
        }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{
              fontSize: 11, color: WA_TIME,
              background: "rgba(17,27,33,0.7)",
              padding: "4px 10px", borderRadius: 8,
            }}>HOY</span>
          </div>

          {messages.map((msg) => {
            if (msg.type === "typing") return <BubbleBot key={msg.id} typing />;
            if (msg.type === "bot")    return <BubbleBot key={msg.id} text={msg.text} time={msg.time} />;
            if (msg.type === "user")   return <BubbleUser key={msg.id} text={msg.text!} time={msg.time!} />;
            return null;
          })}

          {/* Opciones */}
          {!waiting && currentStep?.tipo === "opciones" && !showCal && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 4px" }}>
              {(altMode && currentStep.id === "bienvenida"
                ? ["¡Sí, empecemos! 🔥"]
                : currentStep.opciones ?? []
              ).map((op) => (
                <button key={op} onClick={() => avanzar(op)} style={{
                  background: "rgba(0,168,132,0.1)",
                  border: `1px solid ${WA_GREEN}44`,
                  borderRadius: 20, padding: "10px 16px",
                  color: WA_GREEN, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", textAlign: "left",
                }}>{op}</button>
              ))}
            </div>
          )}

          {/* Calendario de posts */}
          {showCal && calendario && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                {[1, 2, 3, 4].map((s) => (
                  <button key={s} onClick={() => setSemanaActiva(s)} style={{
                    flex: 1, padding: "8px 4px",
                    background: semanaActiva === s ? WA_GREEN : "rgba(255,255,255,0.05)",
                    border: `1px solid ${semanaActiva === s ? WA_GREEN : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 6,
                    color: semanaActiva === s ? "#000" : WA_MUTED,
                    fontSize: 11, fontWeight: semanaActiva === s ? 700 : 400,
                    cursor: "pointer",
                  }}>Sem {s}</button>
                ))}
              </div>

              {postsFiltrados.map((post, i) => (
                <PostCard key={i} post={post} index={i} />
              ))}

              <div style={{
                background: "linear-gradient(135deg, rgba(240,116,40,0.15), rgba(240,116,40,0.05))",
                border: "1px solid rgba(240,116,40,0.25)",
                borderRadius: 10, padding: 16, marginTop: 8, textAlign: "center",
              }}>
                <div style={{ fontSize: 13, color: WA_TEXT, fontWeight: 600, marginBottom: 4 }}>
                  ¿Querés que AutoPost publique por vos? 🚀
                </div>
                <div style={{ fontSize: 11, color: WA_MUTED, marginBottom: 12 }}>
                  Automatizá la publicación en todas tus redes desde USD 29/mes
                </div>
                <a href="https://cosasanta.com/#contacto" style={{
                  display: "inline-block",
                  background: `linear-gradient(135deg, ${ORANGE}, #D06010)`,
                  border: "none", borderRadius: 6,
                  padding: "10px 24px", color: "#fff",
                  fontSize: 13, fontWeight: 600, textDecoration: "none",
                }}>
                  Quiero el plan completo →
                </a>
              </div>
            </div>
          )}

          <div ref={bottomRef} style={{ height: 8 }} />
        </div>

        {/* Input de texto */}
        {!showCal && currentStep?.tipo === "texto" && (
          <div style={{
            padding: "8px 12px", background: "#0B141A",
            display: "flex", gap: 8, alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0,
          }}>
            <div style={{
              flex: 1, background: WA_HEADER,
              borderRadius: 20, padding: "10px 16px",
            }}>
              <input
                ref={inputRef}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
                placeholder={currentStep.placeholder}
                disabled={waiting}
                style={{
                  width: "100%", background: "none", border: "none", outline: "none",
                  color: WA_TEXT, fontSize: 14, fontFamily: "inherit",
                }}
              />
            </div>
            <button onClick={handleEnviar} disabled={!inputVal.trim() || waiting} style={{
              width: 44, height: 44, borderRadius: "50%",
              background: inputVal.trim() ? WA_GREEN : "rgba(255,255,255,0.1)",
              border: "none",
              cursor: inputVal.trim() ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>
              {waiting ? "⏳" : "➤"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes typing-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
    </div>
  );
}
