import { useState, useEffect, createContext, useContext } from "react";

/*
 * Omnify Marketing — Layout Compartilhado
 * 
 * Como usar no App.tsx:
 *   import Layout from "./components/Layout"
 *   import Dashboard from "./components/dashboard"
 * 
 *   function App() {
 *     return (
 *       <Layout>
 *         <Dashboard />   ← ou qualquer outra tela
 *       </Layout>
 *     )
 *   }
 */

const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap";
if (!document.querySelector(`link[href="${FONTS}"]`)) {
  const l = document.createElement("link");
  l.rel = "stylesheet";
  l.href = FONTS;
  document.head.appendChild(l);
}

/* ── Paleta Omnify ── */
const C = {
  cream:      "#EDDCC9",
  creamLight: "#F5EDE2",
  creamPale:  "#FBF6F0",
  sand:       "#E0CCAF",
  blue:       "#8AAFC4",
  blueDark:   "#6A92A8",
  blueDeep:   "#4E7A92",
  blueLight:  "#8AAFC420",
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

/* ── Contexto de navegação ── */
const NavContext = createContext();

export function useNav() {
  return useContext(NavContext);
}

/* ── Ícones SVG inline ── */
const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  projects: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  briefing: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  messages: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const navItems = [
  { id: "dashboard",  label: "Painel",        icon: Icons.dashboard },
  { id: "projects",   label: "Projetos",      icon: Icons.projects },
  { id: "briefings",  label: "Briefings",     icon: Icons.briefing },
  { id: "messages",   label: "Mensagens",     icon: Icons.messages, badge: 3 },
  { id: "settings",   label: "Configurações", icon: Icons.settings },
];

const mockNotifications = [
  { id: 1, text: "Campanha Instagram foi aprovada", time: "2 min atrás", unread: true },
  { id: 2, text: "Novo comentário no Redesign Logo", time: "1h atrás", unread: true },
  { id: 3, text: "Briefing recebido: Landing Page", time: "3h atrás", unread: false },
];

/* ── Sidebar ── */
function Sidebar({ active, onNav, mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(3px)", zIndex: 49,
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      <aside style={{
        width: 250, minHeight: "100vh", background: C.white,
        borderRight: `1px solid ${C.borderLight}`,
        display: "flex", flexDirection: "column",
        position: "fixed", left: mobileOpen ? 0 : undefined,
        top: 0, bottom: 0, zIndex: 50,
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        ...(typeof window !== "undefined" && window.innerWidth <= 768
          ? { transform: mobileOpen ? "translateX(0)" : "translateX(-100%)" }
          : {}),
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
              <span style={{
                fontFamily: serif, fontSize: 30, fontWeight: 300,
                color: C.blue, letterSpacing: "-0.5px",
              }}>O</span>
              <span style={{
                fontFamily: serif, fontSize: 16, fontWeight: 500,
                color: C.blue, letterSpacing: "2.5px", textTransform: "uppercase",
              }}>mnify</span>
              <span style={{
                fontFamily: serif, fontSize: 20, color: C.blue, fontWeight: 300, marginLeft: -1,
              }}>.</span>
            </div>

            {/* Botão fechar mobile */}
            <button
              onClick={onCloseMobile}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.textMuted, padding: 4, display: "none",
                ...(typeof window !== "undefined" && window.innerWidth <= 768
                  ? { display: "block" } : {}),
              }}
            >{Icons.close}</button>
          </div>
          <div style={{
            fontFamily: sans, fontSize: 9, color: C.textMuted,
            letterSpacing: "3px", textTransform: "uppercase", marginTop: 1, marginLeft: 1,
          }}>Marketing</div>
        </div>

        {/* Navegação */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          <div style={{
            fontFamily: sans, fontSize: 10, fontWeight: 600,
            color: C.textMuted, letterSpacing: "2px",
            textTransform: "uppercase", padding: "0 14px",
            marginBottom: 12,
          }}>Menu</div>

          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNav(item.id); onCloseMobile(); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: 12, padding: "11px 14px", borderRadius: 9,
                  border: "none", cursor: "pointer", marginBottom: 2,
                  transition: "all 0.2s ease", position: "relative",
                  background: isActive ? C.blueLight : "transparent",
                  fontFamily: sans, fontSize: 13.5,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.blueDeep : C.textMuted,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = C.creamPale;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Indicador ativo */}
                {isActive && <div style={{
                  position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: 3, height: 20, borderRadius: "0 3px 3px 0",
                  background: C.blue,
                }} />}

                <span style={{ opacity: isActive ? 1 : 0.55, display: "flex" }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>

                {/* Badge de notificação */}
                {item.badge && (
                  <span style={{
                    minWidth: 20, height: 20, borderRadius: 10,
                    background: C.danger, color: C.white,
                    fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 6px",
                  }}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Usuário */}
        <div style={{
          padding: "16px 20px", margin: "8px 12px 16px",
          borderTop: `1px solid ${C.borderLight}`,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.white, fontFamily: serif, fontSize: 15, fontWeight: 600,
              flexShrink: 0,
            }}>V</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: sans, fontSize: 13, fontWeight: 600,
                color: C.text, whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis",
              }}>Vera</div>
              <div style={{ fontFamily: sans, fontSize: 11, color: C.textMuted }}>Cliente</div>
            </div>
          </div>

          <button style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: 8, padding: "9px 12px", borderRadius: 8,
            border: `1px solid ${C.borderLight}`, background: "transparent",
            fontFamily: sans, fontSize: 12, color: C.textMuted,
            cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.danger + "10";
              e.currentTarget.style.color = C.danger;
              e.currentTarget.style.borderColor = C.danger + "30";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = C.textMuted;
              e.currentTarget.style.borderColor = C.borderLight;
            }}
          >
            {Icons.logout}
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Topbar ── */
function Topbar({ currentPage, onMenuClick }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unreadCount = mockNotifications.filter(n => n.unread).length;
  const pageLabel = navItems.find(n => n.id === currentPage)?.label || "Painel";

  return (
    <header style={{
      height: 64, background: `${C.creamPale}ee`,
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.borderLight}`,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 32px",
      position: "sticky", top: 0, zIndex: 40,
    }}>
      {/* Esquerda: menu mobile + breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={onMenuClick}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: C.text, padding: 4, display: "none",
            ...(typeof window !== "undefined" && window.innerWidth <= 768
              ? { display: "flex" } : {}),
          }}
        >{Icons.menu}</button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: sans, fontSize: 12, color: C.textMuted,
          }}>Omnify</span>
          <span style={{ color: C.border, fontSize: 12 }}>/</span>
          <span style={{
            fontFamily: sans, fontSize: 13, fontWeight: 600,
            color: C.text,
          }}>{pageLabel}</span>
        </div>
      </div>

      {/* Direita: busca + notificações */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Barra de busca */}
        <div style={{
          display: "flex", alignItems: "center",
          background: C.white, borderRadius: 9,
          border: `1px solid ${showSearch ? C.blue + "60" : C.borderLight}`,
          padding: "0 12px", transition: "all 0.3s ease",
          width: showSearch ? 240 : 38, height: 38,
          overflow: "hidden", cursor: "pointer",
        }}
          onClick={() => !showSearch && setShowSearch(true)}
        >
          <span style={{ display: "flex", color: C.textMuted, flexShrink: 0 }}>
            {Icons.search}
          </span>
          {showSearch && (
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setShowSearch(false); }}
              placeholder="Buscar projetos..."
              style={{
                border: "none", outline: "none", background: "transparent",
                fontFamily: sans, fontSize: 13, color: C.text,
                marginLeft: 8, width: "100%",
              }}
            />
          )}
        </div>

        {/* Notificações */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            style={{
              width: 38, height: 38, borderRadius: 9,
              border: `1px solid ${C.borderLight}`,
              background: showNotif ? C.blueLight : C.white,
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: C.text, position: "relative",
              transition: "all 0.2s",
            }}
          >
            {Icons.bell}
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 8, height: 8, borderRadius: "50%",
                background: C.danger, border: `2px solid ${C.white}`,
              }} />
            )}
          </button>

          {/* Dropdown notificações */}
          {showNotif && (
            <div style={{
              position: "absolute", top: 46, right: 0,
              width: 320, background: C.white,
              borderRadius: 14, border: `1px solid ${C.borderLight}`,
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              animation: "slideDown 0.2s ease",
              overflow: "hidden", zIndex: 100,
            }}>
              <div style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${C.borderLight}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{
                  fontFamily: sans, fontSize: 14, fontWeight: 600, color: C.text,
                }}>Notificações</span>
                <span style={{
                  fontFamily: sans, fontSize: 11, color: C.blue,
                  cursor: "pointer", fontWeight: 500,
                }}>Marcar como lidas</span>
              </div>

              {mockNotifications.map((n) => (
                <div key={n.id} style={{
                  padding: "14px 20px",
                  borderBottom: `1px solid ${C.borderLight}`,
                  background: n.unread ? C.creamPale : "transparent",
                  cursor: "pointer", transition: "background 0.15s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.creamLight}
                  onMouseLeave={(e) => e.currentTarget.style.background = n.unread ? C.creamPale : "transparent"}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    {n.unread && (
                      <span style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: C.blue, marginTop: 5, flexShrink: 0,
                      }} />
                    )}
                    <div>
                      <p style={{
                        fontFamily: sans, fontSize: 13, color: C.text,
                        lineHeight: 1.4, margin: 0,
                      }}>{n.text}</p>
                      <span style={{
                        fontFamily: sans, fontSize: 11, color: C.textMuted,
                        marginTop: 4, display: "block",
                      }}>{n.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{
                padding: "12px 20px", textAlign: "center",
              }}>
                <span style={{
                  fontFamily: sans, fontSize: 12, color: C.blue,
                  cursor: "pointer", fontWeight: 500,
                }}>Ver todas as notificações</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ── Layout Principal ── */
export default function Layout({ children }) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { setReady(true); }, []);

  return (
    <NavContext.Provider value={{ activeNav, setActiveNav }}>
      <div style={{
        minHeight: "100vh",
        background: C.creamPale,
        fontFamily: sans,
        color: C.text,
      }}>
        {/* Sidebar */}
        <Sidebar
          active={activeNav}
          onNav={setActiveNav}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Área principal */}
        <div style={{ marginLeft: 250 }}>
          <Topbar
            currentPage={activeNav}
            onMenuClick={() => setMobileOpen(true)}
          />

          <main style={{
            padding: "32px 40px",
            minHeight: "calc(100vh - 64px)",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(8px)",
            transition: "all 0.4s ease",
          }}>
            {children}
          </main>

          {/* Footer */}
          <footer style={{
            padding: "20px 40px",
            borderTop: `1px solid ${C.borderLight}`,
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <span style={{
              fontFamily: sans, fontSize: 12, color: C.textMuted,
            }}>© 2026 Omnify Marketing. Todos os direitos reservados.</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Termos de Uso", "Privacidade", "Suporte"].map((t) => (
                <span key={t} style={{
                  fontFamily: sans, fontSize: 12, color: C.textMuted,
                  cursor: "pointer", transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.color = C.blue}
                  onMouseLeave={(e) => e.currentTarget.style.color = C.textMuted}
                >{t}</span>
              ))}
            </div>
          </footer>
        </div>

        {/* Estilos globais */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${C.creamPale}; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }

          @media (max-width: 768px) {
            main { padding: 20px 16px !important; }
            [data-layout-main] { margin-left: 0 !important; }
          }
        `}</style>
      </div>
    </NavContext.Provider>
  );
}