import { useState, useEffect, useRef } from "react";

/*
 * Omnify Marketing — Landing Page
 * Página pública, NÃO usa o <Layout> (não tem sidebar/topbar)
 * Estética: editorial de luxo, suave, com a paleta creme + azul da Omnify
 */

const FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=swap";
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
  text:       "#3D3D3D",
  textMuted:  "#8C8578",
  white:      "#FFFFFF",
  border:     "#E5D8C8",
  borderLight:"#EDE4D8",
};

const serif = "'Cormorant Garamond', Georgia, serif";
const sans  = "'Outfit', system-ui, sans-serif";

/* ── Hook: animar ao scroll ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Serviços", "Como funciona", "Sobre", "Contato"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "14px 48px" : "22px 48px",
      background: scrolled ? `${C.creamPale}ee` : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}40` : "none",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      transition: "all 0.35s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <span style={{
          fontFamily: serif, fontSize: 28, fontWeight: 300,
          color: C.blue, letterSpacing: "-0.5px",
        }}>O</span>
        <span style={{
          fontFamily: serif, fontSize: 15, fontWeight: 500,
          color: C.blue, letterSpacing: "2.5px", textTransform: "uppercase",
        }}>mnify</span>
        <span style={{
          fontFamily: serif, fontSize: 18, color: C.blue, fontWeight: 300, marginLeft: -1,
        }}>.</span>
      </div>

      {/* Links desktop */}
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        {links.map((link) => (
          <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} style={{
            fontFamily: sans, fontSize: 13, fontWeight: 400,
            color: C.text, textDecoration: "none",
            transition: "color 0.2s", letterSpacing: "0.3px",
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = C.blue}
            onMouseLeave={(e) => e.currentTarget.style.color = C.text}
          >{link}</a>
        ))}

        <a href="/login" style={{
          fontFamily: sans, fontSize: 13, fontWeight: 600,
          color: C.white, textDecoration: "none",
          background: C.blue, padding: "10px 28px",
          borderRadius: 8, transition: "all 0.2s",
          letterSpacing: "0.3px",
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = C.blueDark}
          onMouseLeave={(e) => e.currentTarget.style.background = C.blue}
        >Entrar</a>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", textAlign: "center",
      padding: "120px 24px 80px",
      background: `linear-gradient(180deg, ${C.creamPale} 0%, ${C.creamLight} 60%, ${C.cream}50 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      {/* Círculos decorativos */}
      <div style={{
        position: "absolute", top: "8%", right: "12%",
        width: 300, height: 300, borderRadius: "50%",
        border: `1px solid ${C.blue}15`,
        animation: "floatSlow 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", left: "8%",
        width: 200, height: 200, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.blue}08 0%, transparent 70%)`,
        animation: "floatSlow 10s ease-in-out infinite reverse",
      }} />
      <div style={{
        position: "absolute", top: "30%", left: "15%",
        width: 100, height: 100, borderRadius: "50%",
        border: `1px solid ${C.sand}40`,
        animation: "floatSlow 8s ease-in-out infinite",
      }} />

      <div style={{
        maxWidth: 780, position: "relative", zIndex: 1,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{
          fontFamily: sans, fontSize: 11, fontWeight: 600,
          color: C.blue, letterSpacing: "4px", textTransform: "uppercase",
          marginBottom: 28,
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
        }}>Omnify Marketing</div>

        <h1 style={{
          fontFamily: serif, fontSize: "clamp(40px, 6vw, 68px)",
          fontWeight: 400, color: C.text, lineHeight: 1.1,
          marginBottom: 28, letterSpacing: "-1px",
        }}>
          Toda a sua comunicação
          <br />
          criativa em{" "}
          <span style={{
            fontStyle: "italic", color: C.blue, fontWeight: 500,
          }}>um só lugar</span>
        </h1>

        <p style={{
          fontFamily: sans, fontSize: 17, color: C.textMuted,
          lineHeight: 1.7, maxWidth: 520, margin: "0 auto 44px",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}>
          Conecte sua marca à agência. Envie briefings, acompanhe projetos
          e aprove conteúdos — tudo em tempo real, sem perder nada no WhatsApp.
        </p>

        <div style={{
          display: "flex", gap: 16, justifyContent: "center",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease 0.7s",
        }}>
          <a href="/signup" style={{
            fontFamily: sans, fontSize: 15, fontWeight: 600,
            color: C.white, textDecoration: "none",
            background: C.blue, padding: "16px 40px",
            borderRadius: 10, transition: "all 0.25s",
            boxShadow: `0 4px 20px ${C.blue}30`,
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = C.blueDark;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 30px ${C.blue}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.blue;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 20px ${C.blue}30`;
            }}
          >Comece agora — é grátis</a>

          <a href="#como-funciona" style={{
            fontFamily: sans, fontSize: 15, fontWeight: 500,
            color: C.text, textDecoration: "none",
            padding: "16px 36px", borderRadius: 10,
            border: `1.5px solid ${C.border}`,
            transition: "all 0.25s",
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.blue;
              e.currentTarget.style.color = C.blueDeep;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.color = C.text;
            }}
          >Como funciona</a>
        </div>
      </div>
    </section>
  );
}

/* ── Serviços ── */
const servicesData = [
  {
    icon: "✦", title: "Criação de Conteúdo",
    desc: "Posts, stories, reels e textos para todas as suas redes sociais com identidade visual consistente.",
  },
  {
    icon: "◎", title: "Branding & Logo",
    desc: "Identidade visual completa que traduz a essência da sua marca de forma memorável.",
  },
  {
    icon: "⬡", title: "Social Media",
    desc: "Gestão completa das redes sociais, do planejamento de pauta à publicação e monitoramento.",
  },
  {
    icon: "△", title: "Tráfego Pago",
    desc: "Campanhas estratégicas no Google, Meta e TikTok para alcançar o público certo.",
  },
  {
    icon: "◈", title: "Web Design",
    desc: "Landing pages e sites que convertem visitantes em clientes, com design que impressiona.",
  },
  {
    icon: "○", title: "Consultoria",
    desc: "Análise de marca, posicionamento e estratégia para levar seu negócio ao próximo nível.",
  },
];

function Services() {
  const [ref, visible] = useInView();
  return (
    <section id="serviços" ref={ref} style={{
      padding: "100px 48px", background: C.white,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          textAlign: "center", marginBottom: 64,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            fontFamily: sans, fontSize: 11, fontWeight: 600,
            color: C.blue, letterSpacing: "4px", textTransform: "uppercase",
            marginBottom: 16,
          }}>Nossos serviços</div>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(32px, 4vw, 46px)",
            fontWeight: 400, color: C.text, lineHeight: 1.15,
          }}>
            Tudo que sua marca precisa,<br />
            <span style={{ fontStyle: "italic", color: C.blue }}>em um só fluxo</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
          gap: 24,
        }}>
          {servicesData.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} parentVisible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index, parentVisible }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "36px 32px", borderRadius: 16,
        background: hovered ? C.creamPale : C.white,
        border: `1px solid ${hovered ? C.blue + "30" : C.borderLight}`,
        transition: "all 0.35s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 32px ${C.blue}10` : "none",
        opacity: parentVisible ? 1 : 0,
        animation: parentVisible ? `fadeUp 0.5s ease ${index * 0.08}s both` : "none",
      }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: 12,
        background: `linear-gradient(135deg, ${C.blue}15, ${C.blue}08)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color: C.blue, marginBottom: 20,
        border: `1px solid ${C.blue}20`,
      }}>{service.icon}</div>

      <h3 style={{
        fontFamily: serif, fontSize: 22, fontWeight: 600,
        color: C.text, marginBottom: 10,
      }}>{service.title}</h3>

      <p style={{
        fontFamily: sans, fontSize: 14, color: C.textMuted,
        lineHeight: 1.7,
      }}>{service.desc}</p>
    </div>
  );
}

/* ── Como funciona ── */
const steps = [
  { num: "01", title: "Escolha o serviço", desc: "Selecione o que sua marca precisa — conteúdo, logo, social media, tráfego pago ou consultoria." },
  { num: "02", title: "Preencha o briefing", desc: "Conte sobre o seu negócio, público-alvo, referências e objetivos num formulário simples e direto." },
  { num: "03", title: "Acompanhe a criação", desc: "A equipe da agência recebe seu briefing e começa a trabalhar. Você acompanha tudo em tempo real." },
  { num: "04", title: "Aprove ou peça ajustes", desc: "Revise cada conteúdo na sua área. Aprove, reprove ou solicite alterações com comentários." },
];

function HowItWorks() {
  const [ref, visible] = useInView();
  return (
    <section id="como-funciona" ref={ref} style={{
      padding: "100px 48px",
      background: `linear-gradient(180deg, ${C.creamPale} 0%, ${C.creamLight} 100%)`,
    }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{
          textAlign: "center", marginBottom: 72,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            fontFamily: sans, fontSize: 11, fontWeight: 600,
            color: C.blue, letterSpacing: "4px", textTransform: "uppercase",
            marginBottom: 16,
          }}>Como funciona</div>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(32px, 4vw, 46px)",
            fontWeight: 400, color: C.text, lineHeight: 1.15,
          }}>
            Simples como deveria ser,<br />
            <span style={{ fontStyle: "italic", color: C.blue }}>desde o início</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{
              display: "flex", gap: 36, alignItems: "flex-start",
              padding: "36px 0",
              borderBottom: i < steps.length - 1 ? `1px solid ${C.border}40` : "none",
              opacity: visible ? 1 : 0,
              animation: visible ? `fadeUp 0.5s ease ${i * 0.12}s both` : "none",
            }}>
              <div style={{
                fontFamily: serif, fontSize: 48, fontWeight: 300,
                color: C.blue, lineHeight: 1, minWidth: 70,
                opacity: 0.6,
              }}>{step.num}</div>
              <div>
                <h3 style={{
                  fontFamily: serif, fontSize: 24, fontWeight: 600,
                  color: C.text, marginBottom: 8,
                }}>{step.title}</h3>
                <p style={{
                  fontFamily: sans, fontSize: 15, color: C.textMuted,
                  lineHeight: 1.7, maxWidth: 500,
                }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Números / Social Proof ── */
function Stats() {
  const [ref, visible] = useInView();
  const data = [
    { value: "250+", label: "Clientes ativos" },
    { value: "1.200", label: "Projetos entregues" },
    { value: "98%", label: "Taxa de aprovação" },
    { value: "24h", label: "Tempo médio de resposta" },
  ];

  return (
    <section id="sobre" ref={ref} style={{
      padding: "80px 48px", background: C.blueDeep,
    }}>
      <div style={{
        maxWidth: 1000, margin: "0 auto",
        display: "flex", justifyContent: "space-around",
        flexWrap: "wrap", gap: 40,
      }}>
        {data.map((d, i) => (
          <div key={d.label} style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            animation: visible ? `fadeUp 0.5s ease ${i * 0.1}s both` : "none",
          }}>
            <div style={{
              fontFamily: serif, fontSize: 48, fontWeight: 600,
              color: C.white, lineHeight: 1, marginBottom: 8,
            }}>{d.value}</div>
            <div style={{
              fontFamily: sans, fontSize: 12, color: `${C.cream}cc`,
              letterSpacing: "2px", textTransform: "uppercase",
            }}>{d.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Depoimentos ── */
const testimonials = [
  {
    quote: "Antes a gente perdia conteúdo no WhatsApp toda semana. Agora está tudo organizado, fácil de aprovar e sem retrabalho.",
    name: "Mariana Costa", role: "CEO, Studio Bella",
  },
  {
    quote: "A equipe da Omnify entregou nossa identidade visual em tempo recorde. O processo de feedback pelo sistema é incrível.",
    name: "Rafael Mendes", role: "Fundador, TechNova",
  },
  {
    quote: "Consigo acompanhar todos os projetos num lugar só. Não volto mais pra planilha e e-mail de jeito nenhum.",
    name: "Juliana Alves", role: "Diretora de Marketing, Grupo Elos",
  },
];

function Testimonials() {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{
      padding: "100px 48px", background: C.white,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          textAlign: "center", marginBottom: 64,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            fontFamily: sans, fontSize: 11, fontWeight: 600,
            color: C.blue, letterSpacing: "4px", textTransform: "uppercase",
            marginBottom: 16,
          }}>Depoimentos</div>
          <h2 style={{
            fontFamily: serif, fontSize: "clamp(32px, 4vw, 46px)",
            fontWeight: 400, color: C.text,
          }}>
            O que nossos clientes{" "}
            <span style={{ fontStyle: "italic", color: C.blue }}>dizem</span>
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} parentVisible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index, parentVisible }) {
  return (
    <div style={{
      padding: "36px 32px", borderRadius: 16,
      background: C.creamPale,
      border: `1px solid ${C.borderLight}`,
      opacity: parentVisible ? 1 : 0,
      animation: parentVisible ? `fadeUp 0.5s ease ${index * 0.1}s both` : "none",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div>
        <div style={{
          fontFamily: serif, fontSize: 36, color: C.blue,
          lineHeight: 1, marginBottom: 16, opacity: 0.4,
        }}>"</div>
        <p style={{
          fontFamily: sans, fontSize: 15, color: C.text,
          lineHeight: 1.7, marginBottom: 28, fontStyle: "italic",
        }}>{testimonial.quote}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.white, fontFamily: serif, fontSize: 16, fontWeight: 600,
        }}>{testimonial.name[0]}</div>
        <div>
          <div style={{
            fontFamily: sans, fontSize: 14, fontWeight: 600, color: C.text,
          }}>{testimonial.name}</div>
          <div style={{
            fontFamily: sans, fontSize: 12, color: C.textMuted,
          }}>{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ── CTA Final ── */
function FinalCTA() {
  const [ref, visible] = useInView();
  return (
    <section ref={ref} style={{
      padding: "100px 48px",
      background: `linear-gradient(180deg, ${C.creamLight} 0%, ${C.cream} 100%)`,
      textAlign: "center",
    }}>
      <div style={{
        maxWidth: 600, margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease",
      }}>
        <h2 style={{
          fontFamily: serif, fontSize: "clamp(32px, 4.5vw, 50px)",
          fontWeight: 400, color: C.text, lineHeight: 1.15,
          marginBottom: 20,
        }}>
          Pronto para organizar
          <br />
          <span style={{ fontStyle: "italic", color: C.blue }}>sua comunicação?</span>
        </h2>
        <p style={{
          fontFamily: sans, fontSize: 16, color: C.textMuted,
          lineHeight: 1.7, marginBottom: 40,
        }}>
          Crie sua conta gratuitamente e comece a gerenciar seus projetos
          criativos de forma simples e profissional.
        </p>
        <a href="/signup" style={{
          display: "inline-block",
          fontFamily: sans, fontSize: 16, fontWeight: 600,
          color: C.white, textDecoration: "none",
          background: C.blue, padding: "18px 52px",
          borderRadius: 12, transition: "all 0.25s",
          boxShadow: `0 6px 24px ${C.blue}30`,
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.blueDark;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 10px 36px ${C.blue}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.blue;
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = `0 6px 24px ${C.blue}30`;
          }}
        >Criar conta grátis</a>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer id="contato" style={{
      padding: "60px 48px 40px", background: C.text,
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        flexWrap: "wrap", gap: 48, marginBottom: 48,
      }}>
        {/* Logo & desc */}
        <div style={{ maxWidth: 280 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 1, marginBottom: 16 }}>
            <span style={{ fontFamily: serif, fontSize: 26, fontWeight: 300, color: C.blue }}>O</span>
            <span style={{
              fontFamily: serif, fontSize: 14, fontWeight: 500,
              color: C.blue, letterSpacing: "2.5px", textTransform: "uppercase",
            }}>mnify</span>
            <span style={{ fontFamily: serif, fontSize: 17, color: C.blue, fontWeight: 300, marginLeft: -1 }}>.</span>
          </div>
          <p style={{
            fontFamily: sans, fontSize: 13, color: `${C.cream}88`,
            lineHeight: 1.7,
          }}>
            Plataforma que conecta marcas e agências para uma comunicação
            criativa organizada e eficiente.
          </p>
        </div>

        {/* Links */}
        {[
          { title: "Plataforma", links: ["Serviços", "Como funciona", "Preços", "FAQ"] },
          { title: "Empresa", links: ["Sobre", "Blog", "Carreiras", "Contato"] },
          { title: "Legal", links: ["Termos de Uso", "Privacidade", "Cookies"] },
        ].map((col) => (
          <div key={col.title}>
            <div style={{
              fontFamily: sans, fontSize: 11, fontWeight: 600,
              color: C.cream, letterSpacing: "2px", textTransform: "uppercase",
              marginBottom: 20,
            }}>{col.title}</div>
            {col.links.map((link) => (
              <a key={link} href="#" style={{
                display: "block", fontFamily: sans, fontSize: 13,
                color: `${C.cream}77`, textDecoration: "none",
                marginBottom: 12, transition: "color 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = C.blue}
                onMouseLeave={(e) => e.currentTarget.style.color = `${C.cream}77`}
              >{link}</a>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div style={{
        borderTop: `1px solid ${C.cream}15`,
        paddingTop: 28,
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{
          fontFamily: sans, fontSize: 12, color: `${C.cream}55`,
        }}>© 2026 Omnify Marketing. Todos os direitos reservados.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Instagram", "LinkedIn", "Twitter"].map((s) => (
            <a key={s} href="#" style={{
              fontFamily: sans, fontSize: 12, color: `${C.cream}55`,
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = C.blue}
              onMouseLeave={(e) => e.currentTarget.style.color = `${C.cream}55`}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ── Página principal ── */
export default function LandingPage() {
  return (
    <div style={{ fontFamily: sans, color: C.text }}>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <FinalCTA />
      <Footer />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.creamPale}; }
        a { text-decoration: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(15px, -20px); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.creamPale}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}