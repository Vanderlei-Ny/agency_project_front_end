import { useState, useEffect, useRef } from "react";

/*
 * Omnify Marketing — Tela de Mensagens
 * Usar DENTRO do <Layout>:
 *   <Layout><Messages /></Layout>
 *
 * Painel esquerdo: lista de conversas por projeto
 * Painel direito: thread de mensagens com input
 */

const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap";
if (!document.querySelector(`link[href="${FONTS}"]`)) {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = FONTS;
  document.head.appendChild(l);
}

const C = {
  cream:      "#EDDCC9",
  creamLight: "#F5EDE2",
  creamPale:  "#FBF6F0",
  sand:       "#E0CCAF",
  blue:       "#8AAFC4",
  blueDark:   "#6A92A8",
  blueDeep:   "#4E7A92",
  blueLight:  "#8AAFC420",
  blueBubble: "#8AAFC418",
  text:       "#3D3D3D",
  textMuted:  "#8C8578",
  white:      "#FFFFFF",
  border:     "#E5D8C8",
  borderLight:"#EDE4D8",
  success:    "#7EB89A",
  warning:    "#D4A857",
  danger:     "#C47E7E",
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Outfit', system-ui, sans-serif";

/* ── Ícones ── */
const Icons = {
  send: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  attach: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  doubleCheck: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 6 9 17 4 12" />
      <polyline points="22 6 13 17" />
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
};

/* ── Mock data ── */
const mockConversations = [
  {
    id: 1,
    project: "Campanha Instagram — Maio",
    service: "Social Media",
    agencyUser: "Ana Beatriz",
    agencyRole: "Designer",
    agencyInitial: "A",
    lastMessage: "Segue a versão final dos 8 posts! Dá uma olhada e me diz o que acha.",
    lastTime: "14:32",
    unread: 2,
    online: true,
    messages: [
      { id: 1, from: "agency", text: "Oi Vanderlei! Comecei a trabalhar nos posts da campanha de maio.", time: "10:15", read: true },
      { id: 2, from: "client", text: "Ótimo! Lembra de usar as cores da nova paleta que aprovamos semana passada.", time: "10:22", read: true },
      { id: 3, from: "agency", text: "Sim, já estou usando! Vou mandar os primeiros rascunhos até amanhã.", time: "10:25", read: true },
      { id: 4, from: "client", text: "Perfeito, fico no aguardo.", time: "10:28", read: true },
      { id: 5, from: "agency", text: "Vanderlei, terminei os 4 primeiros posts. Vou anexar aqui pra você ver.", time: "13:40", read: true },
      { id: 6, from: "agency", text: "📎 posts_maio_v1.pdf (2.4 MB)", time: "13:41", read: true, isFile: true },
      { id: 7, from: "client", text: "Ficaram incríveis! Só ajusta o texto do post 3, tá um pouco longo pro Instagram.", time: "14:05", read: true },
      { id: 8, from: "agency", text: "Feito! Ajustei o texto e também melhorei o contraste no post 4.", time: "14:28", read: false },
      { id: 9, from: "agency", text: "Segue a versão final dos 8 posts! Dá uma olhada e me diz o que acha.", time: "14:32", read: false },
    ],
  },
  {
    id: 2,
    project: "Redesign Logo Secundária",
    service: "Branding",
    agencyUser: "Carlos Eduardo",
    agencyRole: "Diretor de Arte",
    agencyInitial: "C",
    lastMessage: "Enviei 3 opções de logo simplificado no briefing.",
    lastTime: "Ontem",
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: "agency", text: "Oi! Vi o briefing do logo secundário. Vou preparar algumas opções.", time: "09:00", read: true },
      { id: 2, from: "client", text: "Boa! Preciso de algo que funcione bem em tamanho pequeno, tipo favicon e ícone de app.", time: "09:15", read: true },
      { id: 3, from: "agency", text: "Entendi. Vou focar em versões minimalistas que mantenham a essência do O estilizado.", time: "09:20", read: true },
      { id: 4, from: "agency", text: "Enviei 3 opções de logo simplificado no briefing.", time: "16:45", read: true },
    ],
  },
  {
    id: 3,
    project: "Landing Page — Produto Novo",
    service: "Web Design",
    agencyUser: "Fernanda Lima",
    agencyRole: "UI/UX Designer",
    agencyInitial: "F",
    lastMessage: "Pode me mandar mais detalhes sobre o produto XZ-200?",
    lastTime: "Ontem",
    unread: 1,
    online: true,
    messages: [
      { id: 1, from: "agency", text: "Oi Vanderlei! Vi o briefing da landing page. O conceito ficou bem claro.", time: "11:00", read: true },
      { id: 2, from: "agency", text: "Antes de começar o wireframe, preciso de algumas infos adicionais.", time: "11:02", read: true },
      { id: 3, from: "agency", text: "Pode me mandar mais detalhes sobre o produto XZ-200?", time: "11:03", read: false },
    ],
  },
  {
    id: 4,
    project: "Vídeo Institucional 60s",
    service: "Conteúdo",
    agencyUser: "Pedro Henrique",
    agencyRole: "Editor de Vídeo",
    agencyInitial: "P",
    lastMessage: "Entendi o feedback, vou refazer o storyboard com as alterações.",
    lastTime: "12 Abr",
    unread: 0,
    online: false,
    messages: [
      { id: 1, from: "agency", text: "Vanderlei, preparei o roteiro e storyboard do vídeo institucional.", time: "15:00", read: true },
      { id: 2, from: "client", text: "Vi sim. Achei que o tom ficou muito formal pro nosso público. A gente quer algo mais descontraído.", time: "15:30", read: true },
      { id: 3, from: "client", text: "Também queria trocar a cena do escritório por algo mais dinâmico, tipo o time trabalhando junto.", time: "15:32", read: true },
      { id: 4, from: "agency", text: "Entendi o feedback, vou refazer o storyboard com as alterações.", time: "16:00", read: true },
    ],
  },
];

/* ── Componente: Lista de conversas ── */
function ConversationList({ conversations, activeId, onSelect, searchQuery, onSearchChange }) {
  return (
    <div style={{
      width: 340, height: "100%",
      borderRight: `1px solid ${C.borderLight}`,
      display: "flex", flexDirection: "column",
      background: C.white,
      borderRadius: "14px 0 0 14px",
    }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 16px" }}>
        <h2 style={{
          fontFamily: serif, fontSize: 24, fontWeight: 600,
          color: C.text, marginBottom: 16,
        }}>Mensagens</h2>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: C.creamPale, borderRadius: 10,
          padding: "10px 14px",
          border: `1px solid ${C.borderLight}`,
        }}>
          <span style={{ color: C.textMuted, display: "flex" }}>{Icons.search}</span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar conversa..."
            style={{
              border: "none", outline: "none", background: "transparent",
              fontFamily: sans, fontSize: 13, color: C.text, width: "100%",
            }}
          />
        </div>
      </div>

      {/* Lista */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
        {conversations.map((conv) => {
          const isActive = activeId === conv.id;
          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              style={{
                width: "100%", display: "flex", gap: 14,
                padding: "14px 12px", borderRadius: 12,
                border: "none", cursor: "pointer",
                background: isActive ? C.blueLight : "transparent",
                transition: "all 0.15s ease",
                textAlign: "left", marginBottom: 2,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = C.creamPale;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: isActive
                    ? `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`
                    : `linear-gradient(135deg, ${C.sand}, ${C.cream})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isActive ? C.white : C.textMuted,
                  fontFamily: serif, fontSize: 17, fontWeight: 600,
                  transition: "all 0.2s",
                }}>{conv.agencyInitial}</div>
                {conv.online && (
                  <div style={{
                    position: "absolute", bottom: 1, right: 1,
                    width: 10, height: 10, borderRadius: "50%",
                    background: C.success, border: `2px solid ${C.white}`,
                  }} />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{
                    fontFamily: sans, fontSize: 13.5, fontWeight: 600,
                    color: C.text,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{conv.agencyUser}</span>
                  <span style={{
                    fontFamily: sans, fontSize: 11,
                    color: conv.unread > 0 ? C.blue : C.textMuted,
                    fontWeight: conv.unread > 0 ? 600 : 400,
                    flexShrink: 0,
                  }}>{conv.lastTime}</span>
                </div>

                <div style={{
                  fontFamily: sans, fontSize: 11, color: C.blue,
                  letterSpacing: "1px", textTransform: "uppercase",
                  marginBottom: 4, fontWeight: 500,
                }}>{conv.service}</div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    fontFamily: sans, fontSize: 12.5, color: C.textMuted,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    flex: 1, lineHeight: 1.3,
                  }}>{conv.lastMessage}</span>

                  {conv.unread > 0 && (
                    <span style={{
                      minWidth: 20, height: 20, borderRadius: 10,
                      background: C.blue, color: C.white,
                      fontSize: 10, fontWeight: 700, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "0 6px", marginLeft: 8,
                    }}>{conv.unread}</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Componente: Thread de chat ── */
function ChatThread({ conversation, onSend, onBack }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 16, color: C.textMuted,
      }}>
        <div style={{ fontSize: 48, opacity: 0.3 }}>💬</div>
        <p style={{ fontFamily: sans, fontSize: 15 }}>Selecione uma conversa para começar</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(conversation.id, input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column", height: "100%",
      borderRadius: "0 14px 14px 0", overflow: "hidden",
    }}>
      {/* Header do chat */}
      <div style={{
        padding: "18px 28px",
        background: C.white,
        borderBottom: `1px solid ${C.borderLight}`,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        {/* Botão voltar (mobile) */}
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          color: C.textMuted, display: "none", padding: 4,
        }}>{Icons.back}</button>

        <div style={{ position: "relative" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.white, fontFamily: serif, fontSize: 16, fontWeight: 600,
          }}>{conversation.agencyInitial}</div>
          {conversation.online && (
            <div style={{
              position: "absolute", bottom: 0, right: 0,
              width: 10, height: 10, borderRadius: "50%",
              background: C.success, border: `2px solid ${C.white}`,
            }} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: sans, fontSize: 14, fontWeight: 600, color: C.text,
          }}>{conversation.agencyUser}</div>
          <div style={{
            fontFamily: sans, fontSize: 12, color: C.textMuted,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>{conversation.agencyRole}</span>
            <span style={{ color: C.border }}>·</span>
            <span style={{ color: C.blue, fontWeight: 500 }}>{conversation.project}</span>
          </div>
        </div>

        {/* Status badge */}
        <div style={{
          padding: "6px 14px", borderRadius: 20,
          background: conversation.online ? C.success + "15" : C.border + "30",
          fontFamily: sans, fontSize: 11, fontWeight: 500,
          color: conversation.online ? C.success : C.textMuted,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: conversation.online ? C.success : C.textMuted,
          }} />
          {conversation.online ? "Online" : "Offline"}
        </div>
      </div>

      {/* Área de mensagens */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "24px 28px",
        background: C.creamPale,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        {/* Project context banner */}
        <div style={{
          textAlign: "center", marginBottom: 20,
          padding: "12px 20px", borderRadius: 12,
          background: C.white, border: `1px solid ${C.borderLight}`,
          alignSelf: "center",
        }}>
          <span style={{
            fontFamily: sans, fontSize: 11, color: C.textMuted,
            letterSpacing: "1px", textTransform: "uppercase",
          }}>
            Projeto: <span style={{ color: C.blue, fontWeight: 600 }}>{conversation.project}</span>
          </span>
        </div>

        {conversation.messages.map((msg, i) => {
          const isClient = msg.from === "client";
          const showAvatar = !isClient && (i === 0 || conversation.messages[i - 1]?.from === "client");

          return (
            <div key={msg.id} style={{
              display: "flex",
              justifyContent: isClient ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              gap: 8,
              marginTop: i > 0 && conversation.messages[i - 1]?.from !== msg.from ? 12 : 2,
            }}>
              {/* Avatar da agência */}
              {!isClient && (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.white, fontFamily: serif, fontSize: 11, fontWeight: 600,
                  flexShrink: 0,
                  visibility: showAvatar ? "visible" : "hidden",
                }}>{conversation.agencyInitial}</div>
              )}

              {/* Bolha */}
              <div style={{
                maxWidth: "65%",
                padding: msg.isFile ? "12px 16px" : "11px 18px",
                borderRadius: isClient
                  ? "16px 16px 4px 16px"
                  : "16px 16px 16px 4px",
                background: isClient ? C.blue : C.white,
                color: isClient ? C.white : C.text,
                fontFamily: sans, fontSize: 14, lineHeight: 1.55,
                border: isClient ? "none" : `1px solid ${C.borderLight}`,
                boxShadow: `0 1px 3px rgba(0,0,0,0.04)`,
                position: "relative",
              }}>
                {msg.isFile ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "pointer",
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: isClient ? "rgba(255,255,255,0.2)" : C.creamPale,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{Icons.attach}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{msg.text.replace("📎 ", "").split(" (")[0]}</div>
                      <div style={{ fontSize: 11, opacity: 0.7 }}>{msg.text.match(/\(.*\)/)?.[0]}</div>
                    </div>
                  </div>
                ) : (
                  <span>{msg.text}</span>
                )}

                {/* Hora + check */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "flex-end",
                  gap: 4, marginTop: 4,
                }}>
                  <span style={{
                    fontSize: 10,
                    color: isClient ? "rgba(255,255,255,0.6)" : C.textMuted,
                  }}>{msg.time}</span>
                  {isClient && (
                    <span style={{ color: msg.read ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", display: "flex" }}>
                      {msg.read ? Icons.doubleCheck : Icons.check}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: "16px 24px",
        background: C.white,
        borderTop: `1px solid ${C.borderLight}`,
        display: "flex", alignItems: "flex-end", gap: 12,
      }}>
        {/* Botão anexo */}
        <button style={{
          width: 40, height: 40, borderRadius: 10,
          background: C.creamPale, border: `1px solid ${C.borderLight}`,
          cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: C.textMuted, transition: "all 0.2s", flexShrink: 0,
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.blue;
            e.currentTarget.style.color = C.blue;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.borderLight;
            e.currentTarget.style.color = C.textMuted;
          }}
          title="Anexar arquivo"
        >{Icons.attach}</button>

        {/* Botão imagem */}
        <button style={{
          width: 40, height: 40, borderRadius: 10,
          background: C.creamPale, border: `1px solid ${C.borderLight}`,
          cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          color: C.textMuted, transition: "all 0.2s", flexShrink: 0,
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.blue;
            e.currentTarget.style.color = C.blue;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.borderLight;
            e.currentTarget.style.color = C.textMuted;
          }}
          title="Enviar imagem"
        >{Icons.image}</button>

        {/* Input texto */}
        <div style={{
          flex: 1, background: C.creamPale,
          borderRadius: 12, border: `1px solid ${C.borderLight}`,
          padding: "0 16px",
          transition: "border-color 0.2s",
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva sua mensagem..."
            rows={1}
            style={{
              width: "100%", border: "none", outline: "none",
              background: "transparent", fontFamily: sans,
              fontSize: 14, color: C.text, resize: "none",
              padding: "12px 0", lineHeight: 1.4,
              minHeight: 20, maxHeight: 100,
            }}
          />
        </div>

        {/* Botão enviar */}
        <button
          onClick={handleSend}
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: input.trim() ? C.blue : C.borderLight,
            border: "none", cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: input.trim() ? C.white : C.textMuted,
            transition: "all 0.2s", flexShrink: 0,
            transform: input.trim() ? "scale(1)" : "scale(0.95)",
          }}
        >{Icons.send}</button>
      </div>
    </div>
  );
}

/* ── Componente principal ── */
export default function Messages() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filtered = conversations.filter((c) =>
    c.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.agencyUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversation = conversations.find((c) => c.id === activeId);

  const handleSend = (convId, text) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage: text,
              lastTime: timeStr,
              messages: [
                ...c.messages,
                {
                  id: c.messages.length + 1,
                  from: "client",
                  text,
                  time: timeStr,
                  read: false,
                },
              ],
            }
          : c
      )
    );
  };

  return (
    <div style={{
      height: "calc(100vh - 160px)",
      display: "flex",
      background: C.white,
      borderRadius: 14,
      border: `1px solid ${C.borderLight}`,
      overflow: "hidden",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(10px)",
      transition: "all 0.5s ease",
    }}>
      <ConversationList
        conversations={filtered}
        activeId={activeId}
        onSelect={setActiveId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ChatThread
        conversation={activeConversation}
        onSend={handleSend}
        onBack={() => setActiveId(null)}
      />

      <style>{`
        textarea::placeholder { color: ${C.textMuted}; opacity: 0.6; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}