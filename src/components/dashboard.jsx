import { useState, useEffect } from "react";

/*
 * Omnify Marketing — Dashboard (conteúdo apenas)
 * Este componente deve ser usado DENTRO do <Layout>
 * A sidebar e a topbar vêm do Layout.jsx
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
  text:       "#3D3D3D",
  textMuted:  "#8C8578",
  white:      "#FFFFFF",
  border:     "#E5D8C8",
  borderLight:"#EDE4D8",
  success:    "#7EB89A",
  warning:    "#D4A857",
  danger:     "#C47E7E",
  pending:    "#8AAFC4",
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Outfit', system-ui, sans-serif";

/* ── mock data ── */
const mockProjects = [
  { id: 1, title: "Campanha Instagram — Maio", service: "Social Media", status: "approved", date: "12 Abr 2026", preview: "Série de 8 posts para feed + 4 stories com identidade visual atualizada.", comments: 2 },
  { id: 2, title: "Redesign Logo Secundária", service: "Branding", status: "pending", date: "10 Abr 2026", preview: "Versão simplificada do logo para uso em ícones e favicon.", comments: 0 },
  { id: 3, title: "Landing Page — Produto Novo", service: "Web Design", status: "revision", date: "08 Abr 2026", preview: "Página de captura para lançamento do produto XZ-200.", comments: 5 },
  { id: 4, title: "Vídeo Institucional 60s", service: "Conteúdo", status: "rejected", date: "05 Abr 2026", preview: "Roteiro e storyboard do vídeo para o canal do YouTube.", comments: 3 },
  { id: 5, title: "Kit Mídia Digital Q2", service: "Criação", status: "approved", date: "01 Abr 2026", preview: "Banners, thumbnails e capas para todas as plataformas.", comments: 1 },
  { id: 6, title: "E-mail Marketing — Newsletter", service: "Conteúdo", status: "pending", date: "14 Abr 2026", preview: "Template e conteúdo da newsletter mensal de abril.", comments: 0 },
];

const statusConfig = {
  approved:  { label: "Aprovado",   color: C.success, bg: C.success + "18" },
  pending:   { label: "Pendente",   color: C.pending, bg: C.pending + "18" },
  revision:  { label: "Em revisão", color: C.warning, bg: C.warning + "18" },
  rejected:  { label: "Reprovado",  color: C.danger,  bg: C.danger  + "18" },
};

const stats = [
  { label: "Total de projetos",  value: "12", icon: "📁" },
  { label: "Aguardando revisão", value: "3",  icon: "⏳" },
  { label: "Aprovados este mês", value: "7",  icon: "✓"  },
  { label: "Comentários",        value: "18", icon: "💬" },
];

/* ── subcomponentes ── */

function StatCard({ stat, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 180, padding: "28px 24px",
        background: C.white, borderRadius: 14,
        border: `1px solid ${hovered ? C.blue + "40" : C.borderLight}`,
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 24px ${C.blue}12` : "none",
        animation: `fadeUp 0.5s ease ${index * 0.08}s both`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            fontFamily: sans, fontSize: 11, fontWeight: 500,
            color: C.textMuted, textTransform: "uppercase",
            letterSpacing: "1.5px", marginBottom: 10,
          }}>{stat.label}</div>
          <div style={{
            fontFamily: serif, fontSize: 36, fontWeight: 600,
            color: C.text, lineHeight: 1,
          }}>{stat.value}</div>
        </div>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: C.creamPale, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: stat.icon === "✓" ? 18 : 16,
          color: stat.icon === "✓" ? C.success : C.text,
          fontWeight: stat.icon === "✓" ? 700 : 400,
        }}>{stat.icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 14px", borderRadius: 20,
      background: cfg.bg, color: cfg.color,
      fontFamily: sans, fontSize: 12, fontWeight: 600,
      letterSpacing: "0.3px",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: cfg.color,
      }} />
      {cfg.label}
    </span>
  );
}

function ProjectCard({ project, index, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, borderRadius: 14, padding: "24px 28px",
        border: `1px solid ${hovered ? C.blue + "50" : C.borderLight}`,
        cursor: "pointer", transition: "all 0.3s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 6px 20px ${C.blue}10` : "none",
        animation: `fadeUp 0.45s ease ${index * 0.06}s both`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: sans, fontSize: 10, fontWeight: 600,
            color: C.blue, textTransform: "uppercase",
            letterSpacing: "2px", marginBottom: 6,
          }}>{project.service}</div>
          <h3 style={{
            fontFamily: serif, fontSize: 20, fontWeight: 600,
            color: C.text, lineHeight: 1.3, margin: 0,
          }}>{project.title}</h3>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <p style={{
        fontFamily: sans, fontSize: 13, color: C.textMuted,
        lineHeight: 1.6, marginBottom: 18,
      }}>{project.preview}</p>

      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 14, borderTop: `1px solid ${C.borderLight}`,
      }}>
        <span style={{ fontFamily: sans, fontSize: 12, color: C.textMuted }}>{project.date}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13 }}>💬</span>
          <span style={{ fontFamily: sans, fontSize: 12, color: C.textMuted }}>{project.comments}</span>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, onAction }) {
  if (!project) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.25s ease",
    }} onClick={onClose}>
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(61,61,61,0.35)", backdropFilter: "blur(6px)",
      }} />
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "relative", background: C.creamPale,
        borderRadius: 18, width: "90%", maxWidth: 560,
        padding: "36px 40px", animation: "slideUp 0.35s ease",
        boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 18, right: 20,
          background: "none", border: "none", cursor: "pointer",
          fontSize: 22, color: C.textMuted, fontFamily: sans,
          width: 36, height: 36, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>

        <div style={{
          fontFamily: sans, fontSize: 10, fontWeight: 600,
          color: C.blue, textTransform: "uppercase",
          letterSpacing: "2.5px", marginBottom: 8,
        }}>{project.service}</div>

        <h2 style={{
          fontFamily: serif, fontSize: 28, fontWeight: 600,
          color: C.text, marginBottom: 6, lineHeight: 1.2,
        }}>{project.title}</h2>

        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 24,
        }}>
          <StatusBadge status={project.status} />
          <span style={{ fontFamily: sans, fontSize: 12, color: C.textMuted }}>{project.date}</span>
        </div>

        <div style={{
          background: C.white, borderRadius: 12, padding: "20px 24px",
          border: `1px solid ${C.borderLight}`, marginBottom: 24,
        }}>
          <div style={{
            fontFamily: sans, fontSize: 11, fontWeight: 600,
            color: C.textMuted, textTransform: "uppercase",
            letterSpacing: "1.5px", marginBottom: 10,
          }}>Descrição</div>
          <p style={{
            fontFamily: sans, fontSize: 14, color: C.text,
            lineHeight: 1.7, margin: 0,
          }}>{project.preview}</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: sans, fontSize: 11, fontWeight: 600,
            color: C.textMuted, textTransform: "uppercase",
            letterSpacing: "1.5px", marginBottom: 10,
          }}>Adicionar comentário</div>
          <textarea
            placeholder="Escreva seu feedback sobre este conteúdo..."
            rows={3}
            style={{
              width: "100%", padding: "14px 16px",
              background: C.white, border: `1.5px solid ${C.border}`,
              borderRadius: 10, fontFamily: sans, fontSize: 13,
              color: C.text, resize: "vertical", outline: "none",
              transition: "border-color 0.2s", boxSizing: "border-box",
            }}
            onFocus={(e) => e.target.style.borderColor = C.blue}
            onBlur={(e) => e.target.style.borderColor = C.border}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onAction(project.id, "approved")} style={{
            flex: 1, padding: "14px", background: C.success, color: C.white,
            border: "none", borderRadius: 10, fontFamily: sans, fontSize: 14,
            fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s",
          }}>✓  Aprovar</button>

          <button onClick={() => onAction(project.id, "revision")} style={{
            flex: 1, padding: "14px", background: C.warning + "20", color: C.warning,
            border: `1.5px solid ${C.warning}40`, borderRadius: 10,
            fontFamily: sans, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>↻  Pedir ajuste</button>

          <button onClick={() => onAction(project.id, "rejected")} style={{
            flex: 1, padding: "14px", background: C.danger + "15", color: C.danger,
            border: `1.5px solid ${C.danger}30`, borderRadius: 10,
            fontFamily: sans, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>✕  Reprovar</button>
        </div>
      </div>
    </div>
  );
}

/* ── Dashboard principal ── */
export default function Dashboard() {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter((p) => p.status === filter);

  const handleAction = (id, newStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    setSelectedProject(null);
  };

  const filters = [
    { key: "all",      label: "Todos" },
    { key: "pending",  label: "Pendentes" },
    { key: "revision", label: "Em revisão" },
    { key: "approved", label: "Aprovados" },
    { key: "rejected", label: "Reprovados" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 36,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(10px)",
        transition: "all 0.5s ease",
      }}>
        <div>
          <h1 style={{
            fontFamily: serif, fontSize: 34, fontWeight: 600,
            color: C.text, marginBottom: 6, letterSpacing: "-0.5px",
          }}>
            Bom dia, <span style={{ fontStyle: "italic", color: C.blue }}>Vera</span>
          </h1>
          <p style={{ fontFamily: sans, fontSize: 14, color: C.textMuted }}>
            Acompanhe seus projetos e aprove conteúdos em um só lugar.
          </p>
        </div>

        <button style={{
          padding: "12px 28px", background: C.blue,
          color: C.white, border: "none", borderRadius: 10,
          fontFamily: sans, fontSize: 13, fontWeight: 600,
          cursor: "pointer", transition: "all 0.2s",
          letterSpacing: "0.3px",
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.blueDark;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.blue;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >+ Novo Briefing</button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
        {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
      </div>

      {/* Projetos */}
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12,
        }}>
          <h2 style={{
            fontFamily: serif, fontSize: 24, fontWeight: 600, color: C.text,
          }}>Seus Projetos</h2>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {filters.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "8px 18px", borderRadius: 20,
                border: `1.5px solid ${filter === f.key ? C.blue : C.border}`,
                background: filter === f.key ? C.blue + "12" : "transparent",
                color: filter === f.key ? C.blueDeep : C.textMuted,
                fontFamily: sans, fontSize: 12, fontWeight: filter === f.key ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s",
              }}>{f.label}</button>
            ))}
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 18,
        }}>
          {filteredProjects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onSelect={setSelectedProject} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div style={{
            textAlign: "center", padding: "64px 0", color: C.textMuted,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>◫</div>
            <p style={{ fontFamily: sans, fontSize: 15 }}>Nenhum projeto com esse filtro.</p>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onAction={handleAction}
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}