# Estrutura da Sidebar - Organização por Role

## 📋 Visão Geral

A sidebar foi completamente reestruturada para separar as telas **por role** (CLIENTE vs AGÊNCIA) com seções bem organizadas e sem gambiarras.

## 🏗️ Arquitetura

### 1. **app-routes.tsx** - Definição de Rotas com Seções

```typescript
export type SidebarSection = "principal" | "operacional" | "administrativo";

export type AppRouteItem = {
  path: string;
  label: string;
  icon: SidebarIconKey;
  element: ReactElement;
  section?: SidebarSection; // ← NOVO: Define a seção da rota
};
```

**Seções disponíveis:**

- `principal`: Rotas essenciais (Home, Dashboard)
- `operacional`: Operações do dia a dia (Solicitações, Projetos)
- `administrativo`: Gestão e configurações (Equipe, Financeiro)

### 2. **sidebar-new.tsx** - Novo Componente de Sidebar

Componente único que se adapta automaticamente ao role do usuário:

```typescript
// Obter rotas baseado no tipo de usuário
const userType = getUserType(); // "client" ou "agency"
const routes = userType === "client" ? clientRoutes : agencyRoutes;

// Obter seções disponíveis (filtra rotas que existem)
const availableSections = sections.filter(
  (section) => getRoutesBySection(routes, section).length > 0,
);
```

**Estrutura da sidebar desktop:**

```
┌─────────────────────────┐
│  LOGO + TIPO DE USUÁRIO │
│  (Cliente / Agência)    │
├─────────────────────────┤
│     🏠 PRINCIPAL        │
│  ├─ Home               │
│  ├─ Dashboard          │
│  └─ Agências           │
├─────────────────────────┤
│     📊 OPERACIONAL      │
│  ├─ Solicitações       │
│  ├─ Projetos           │
│  └─ Automações         │
├─────────────────────────┤
│    ⚙️ ADMINISTRATIVO    │
│  ├─ Equipe             │
│  └─ Financeiro         │
├─────────────────────────┤
│      🚪 LOGOUT         │
└─────────────────────────┘
```

### 3. **global-layout.tsx** - Integração

```typescript
<SidebarNew
  isMobileOpen={isMobileSidebarOpen}
  onOpenMobile={() => setIsMobileSidebarOpen(true)}
  onCloseMobile={() => setIsMobileSidebarOpen(false)}
/>
```

Também foi atualizado o padding do `<main>` para acomodar a sidebar maior:

- Desktop: `sm:pl-72` (antes: `sm:pl-24`)
- Tablet/Mobile: Sem mudanças

---

## 📍 Rotas por Role

### 🧑‍💼 CLIENTE - Minhas Solicitações

| Seção     | Rota                | Label               | Ícone   |
| --------- | ------------------- | ------------------- | ------- |
| Principal | `/app/home`         | Home                | compass |
| Principal | `/app/agencias`     | Escolher Agência    | grid    |
| Principal | `/app/solicitacoes` | Minhas Solicitações | chat    |

### 🏢 AGÊNCIA - Gestão Completa

| Seção              | Rota                | Label                    | Ícone   |
| ------------------ | ------------------- | ------------------------ | ------- |
| **Principal**      | `/app/home`         | Home                     | compass |
| **Principal**      | `/app/dashboard`    | Dashboard                | chart   |
| **Operacional**    | `/app/solicitacoes` | Solicitações de Clientes | chat    |
| **Operacional**    | `/app/projetos`     | Projetos                 | grid    |
| **Operacional**    | `/app/automacoes`   | Automações               | spark   |
| **Administrativo** | `/app/equipe`       | Equipe                   | users   |
| **Administrativo** | `/app/financeiro`   | Financeiro               | wallet  |

---

## 🔧 Como Adicionar Nova Rota?

### Passo 1: Definir na `app-routes.tsx`

```typescript
export const agencyRoutes: AppRouteItem[] = [
  // ... rotas existentes
  {
    path: "suporte",
    label: "Suporte",
    icon: "chat",
    element: <SupportPage />,
    section: "operacional",  // ← Define a seção
  },
];
```

### Passo 2: Pronto! ✅

Não precisa fazer mais nada! O componente `SidebarNew` vai:

1. Detectar a nova rota automaticamente
2. Agrupá-la na seção correta
3. Mostrar na sidebar com o ícone correto
4. Router vai renderizar na página

---

## 🎯 Separação por Role - Fluxos

### Para CLIENTE

```
Login → Home → Escolher Agência → Preencher Solicitação → Acompanhar Status
```

Sidebar mostra apenas: Home, Escolher Agência, Minhas Solicitações

### Para AGÊNCIA

```
Login → Dashboard → Ver Solicitações → Definir Orçamento → Entregar Projeto
```

Sidebar mostra: Home, Dashboard, Solicitações, Projetos, Automações, Equipe, Financeiro

---

## 📱 Responsividade

### Desktop (≥640px)

- Sidebar fixa à esquerda (w-64)
- Mostra com seções, ícones e labels
- Main com padding esquerdo (`pl-72`)

### Mobile (<640px)

- Botão hambúrguer fixo no canto
- Sidebar desliza de cima para baixo
- Menu compacto (apenas ícones)
- Overlay escuro ao fundo

---

## 💡 Benefícios da Nova Estrutura

| Aspecto             | Antes            | Depois                               |
| ------------------- | ---------------- | ------------------------------------ |
| **Organização**     | Menu plano       | Separado por seções                  |
| **Escalabilidade**  | Manual           | Automática (adiciona rota = aparece) |
| **Role Separation** | Gambiarrada      | Nativa no sistema                    |
| **Manutenção**      | Código duplicado | Single source of truth               |
| **UX**              | Confuso          | Claro e intuitivo                    |

---

## 🔒 Segurança

A sidebar é apenas **visual**. A segurança real vem de:

1. **RouteGuard.tsx** - Bloqueia acesso por role na rota
2. **PrivateRoute.tsx** - Verifica autenticação
3. **Backend** - Valida permissões em cada requisição

Uma pessoa não consegue navegar para uma rota que não tem permission, mesmo que tente manualmente.

---

## 📝 Referência de Ícones

```
compass  → Navegação / Home
grid     → Grade / Listagem
spark    → Automação / Destaque
chat     → Mensagens / Solicitações
chart    → Gráficos / Analytics
users    → Pessoas / Equipe
wallet   → Dinheiro / Financeiro
```

---

## 🚀 Próximos Passos

1. ✅ Sidebar estruturada por seções
2. ⏳ Adicionar ícone de perfil do usuário (nome, avatar)
3. ⏳ Menu suspenso de mais opções
4. ⏳ Dark mode toggle
5. ⏳ Expansão/colapso de seções
