# Chá com o Senhor ☕

> Sistema web completo de devocionais diários para momentos de reflexão espiritual

## 📖 Sobre o Projeto

O "Chá com o Senhor" é uma aplicação web full-stack que proporciona momentos diários de reflexão espiritual através de devocionais baseados em versículos bíblicos. Desenvolvido com foco na experiência do usuário, o sistema oferece uma interface acolhedora e funcional para fortalecer a caminhada espiritual.

### 🎯 Objetivos
- Proporcionar devocionais diários estruturados
- Facilitar momentos de reflexão e oração
- Criar um ambiente digital acolhedor para a espiritualidade
- Oferecer ferramentas administrativas para gestão de conteúdo

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 15.2.4** - Framework React para produção
- **React 18.3.1** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes acessíveis e customizáveis

### Backend
- **Java Spring Boot** - Framework para API REST
- **Spring Security** - Autenticação e autorização
- **JWT** - Tokens para autenticação segura
- **Spring Data JPA** - Persistência de dados

### Design e UX
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones consistentes
- **next-themes** - Suporte a modo escuro/claro

## 🌟 Funcionalidades

### Para Usuários
- ✅ Acesso a devocionais diários organizados por data
- ✅ Interface responsiva (mobile-first)
- ✅ Modo escuro/claro
- ✅ Navegação por calendário
- ✅ Sistema de autenticação segura
- ✅ Perfil personalizável

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Criação e gerenciamento de versículos bíblicos
- ✅ Criação de devocionais automáticos
- ✅ Gestão de usuários
- ✅ Sistema de roles (USER/ADMIN)

## 🎨 Design Orientado por Personas

O projeto foi desenvolvido com base em duas personas principais:

- **Joana Mendes (28 anos)** - Coordenadora de jovens, busca profundidade e recursos administrativos
- **Carlos Ribeiro (42 anos)** - Profissional ocupado, prioriza praticidade e acesso rápido

## 🌐 Deploy e Demonstração

### 🔗 Links de Acesso
- **Frontend (Vercel):** [cha-com-senhor.vercel.app](https://cha-com-senhor.vercel.app)
- **Backend (Servidor):** Configurado para produção

### 👤 Contas de Teste

#### Usuário Administrador
```
Login: admin
Senha: admin123
```
*Acesso completo ao painel administrativo*

#### Usuário Regular
```
Login: usuario
Senha: user123
```
*Acesso aos devocionais e perfil*

### 🧪 Como Testar

1. **Acesse a aplicação** através do link do deploy
2. **Página Inicial:** Explore a landing page e funcionalidades
3. **Faça Login:** Use uma das contas de teste acima
4. **Dashboard:** Navegue pelo calendário e acesse devocionais
5. **Painel Admin:** (apenas com conta admin) Teste criação de conteúdo

#### Fluxo de Teste Sugerido

```
1. 🏠 Landing Page → Explorar apresentação
2. 🔐 Login → Usar conta de teste
3. 📅 Dashboard → Navegar pelo calendário
4. 📖 Devocional → Ler conteúdo do dia
5. ⚙️ Perfil → Explorar configurações
6. 👑 Admin (se admin) → Testar criação de conteúdo
```

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm/yarn/pnpm
- Java 17+ (para backend)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/cha-com-senhor.git
cd cha-com-senhor
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.local.example .env.local
```

4. **Execute o projeto**
```bash
npm run dev
# ou
pnpm dev
```

5. **Acesse a aplicação**
```
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
├── app/                 # Páginas e rotas (App Router)
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── admin/          # Componentes administrativos
├── contexts/           # Contextos React (auth, tema)
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
└── public/             # Assets estáticos
```

## 🎯 Características Técnicas

### Acessibilidade
- ♿ WCAG 2.1 AA compliance
- 🎯 ARIA labels e roles semânticos
- ⌨️ Navegação por teclado
- 🔍 Screen reader support

### Performance
- ⚡ Next.js otimizações automáticas
- 📱 Mobile-first responsive design
- 🎨 CSS-in-JS com Tailwind
- 💾 Gerenciamento eficiente de estado

### Segurança
- 🔐 Autenticação JWT
- 🛡️ Proteção de rotas
- 🔒 Validação de dados
- 👤 Sistema de roles

## 📧 Contato

**Desenvolvedor:** João Gabriel  
**Projeto Acadêmico:** 5º Semestre - Ciência da Computação

---

*Desenvolvido com ❤️ para momentos especiais de reflexão espiritual*