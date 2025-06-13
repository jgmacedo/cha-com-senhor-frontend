# Memorial do Projeto: Chá com o Senhor

## Identificação do Projeto

**Nome:** Chá com o Senhor  
**Descrição:** Sistema web completo de devocionais diários com arquitetura full-stack  
**Objetivo:** Proporcionar momentos de reflexão espiritual através de devocionais diários baseados em versículos bíblicos  

**Arquitetura Técnica:**
- **Frontend:** Next.js 15.2.4 com React 18.3.1 e TypeScript
- **Backend:** Java Spring Boot com Spring Security
- **Banco de Dados:** PostgreSQL/MySQL (inferido pela estrutura das APIs)
- **Autenticação:** JWT (JSON Web Tokens)
- **Deploy:** Frontend na Vercel, Backend em servidor dedicado
- **LLMs utilizadas::** Gemini, Claude, OpenAI GPT-4, Vercel v0 para prototipação, OpenRouter para criação de devocionais


---

## Personas e Justificativas de Design

### Persona 1: Joana Mendes (Persona Primária) 🧕
**Perfil:**
- 28 anos, São Paulo, SP
- Coordenadora de jovens na igreja
- Graduada em Teologia
- Renda: R$ 4.000,00
- Ativa espiritualmente, participa de retiros, escreve reflexões, mora sozinha
- Usuária experiente e crítica de tecnologia, usa apps que agregam valor espiritual

**Necessidades:**
- Fortalecer a fé com devocionais diários
- Compartilhar conteúdo espiritual com o grupo de jovens
- Acompanhar progresso com métricas e histórico
- Acesso a biblioteca rica de conteúdo espiritual

**Desafios:**
- Dificuldade em equilibrar trabalho ministerial e vida espiritual pessoal
- Frustração com apps superficiais que não oferecem profundidade
- Necessidade de acesso offline para momentos de retiro

**Como o site atende:**
- Sistema de devocionais estruturados com reflexões profundas
- Interface para administradores criarem e gerenciarem conteúdo
- Histórico completo de devocionais acessados via calendário
- Design inspirador que facilita momentos de reflexão espiritual

### Persona 2: Carlos Ribeiro (Persona Secundária) 👨‍💼
**Perfil:**
- 42 anos, Curitiba, PR
- Engenheiro civil com pós-graduação em Gestão de Projetos
- Renda: R$ 12.000,00
- Casado, dois filhos pequenos, trabalha viajando quinzenalmente
- Prefere apps simples e diretos, usa no trajeto e em pausas no trabalho

**Necessidades:**
- Realizar devocionais curtos sem perder a prática
- Integrar fé à rotina corrida de trabalho
- Receber lembretes discretos para momentos devocionais
- Interface simplificada e objetiva

**Desafios:**
- Pouco tempo livre para atividades espirituais extensas
- Desinteresse por conteúdos longos ou complexos
- Necessidade de acesso rápido e prático durante o dia

**Como o site atende:**
- Design responsivo otimizado para acesso móvel rápido
- Estrutura clara e navegação intuitiva (poucos cliques)
- Devocionais organizados por data com acesso direto
- Interface limpa sem elementos desnecessários que distraem

### Justificativas de Design Baseadas nas Personas

**1. Paleta de Cores Terrosas:**
Escolhida para transmitir acolhimento e espiritualidade, atendendo a **Joana** que busca um ambiente inspirador para reflexões profundas, e a **Carlos** que precisa de uma interface calma que não gere ansiedade durante pausas rápidas no trabalho.

**2. Tipografia Hierárquica Clara:**
Sistema de headings bem definido permite que **Joana** navegue facilmente entre diferentes seções administrativas e conteúdos, enquanto **Carlos** pode localizar rapidamente o devocional do dia sem perder tempo.

**3. Sistema de Autenticação com Roles:**
Desenvolvido pensando em **Joana** como coordenadora que precisa de acesso administrativo para gerenciar conteúdo, mantendo simplicidade para usuários como **Carlos** que apenas consomem o conteúdo.

**4. Design Responsivo Mobile-First:**
Priorização do uso móvel considerando que **Carlos** frequentemente acessa durante deslocamentos e pausas no trabalho, enquanto **Joana** pode usar tanto em momentos pessoais quanto preparando conteúdo para o ministério.

**5. Modo Escuro/Claro:**
**Joana**, como usuária crítica de tecnologia, valoriza funcionalidades modernas e pode usar o modo escuro durante estudos noturnos. **Carlos** se beneficia da flexibilidade para diferentes ambientes de trabalho e iluminação.

**6. Calendário Interativo:**
Atende **Joana** que quer acompanhar progresso e histórico de devocionais, funcionando como métrica de engajamento. Para **Carlos**, oferece acesso direto às datas sem navegação complexa.

**7. Interface Administrativa Separada:**
**Joana** pode criar e gerenciar versículos e devocionais através do painel admin, enquanto **Carlos** tem uma experiência simplificada focada apenas no consumo de conteúdo.

---

## 1. Elementos Essenciais (2,0 pontos)

### 1.1 Tipografia

O projeto implementa uma tipografia bem estruturada e hierárquica:

**Fonte Principal:**
- Utilizei a fonte **Inter** do Google Fonts, configurada no `layout.tsx`:
```typescript
const inter = Inter({ subsets: ["latin"] })
```

**Hierarquia Tipográfica Implementada:**
- **H1:** Título principal da aplicação
- **H2:** Títulos de seções (`text-4xl font-bold`)
- **H3/H4:** Subtítulos em cards (`CardTitle`)
- **Body:** Texto padrão (`text-sm`, `text-lg`)
- **Small:** Textos auxiliares (`text-xs`)

**Classes Tailwind para Tipografia:**
- `text-4xl font-bold` para headings principais
- `text-lg` para descrições importantes
- `text-sm font-medium` para labels e botões
- `text-xs` para textos de apoio

### 1.2 Teoria das Cores

Implementei um sistema de cores completo e consistente baseado em variáveis CSS customizadas:

**Paleta de Cores Principais:**
```css
:root {
  --primary: 30 24% 72%;        /* Tons terrosos suaves */
  --primary-foreground: 27 47% 20%;
  --accent: 33 27% 54%;         /* Tons de âmbar/dourado */
  --accent-foreground: 0 0% 98%;
  --background: 43 38% 92%;     /* Bege claro */
  --foreground: 0 0% 30%;       /* Cinza escuro */
}
```

**Modo Escuro (Dark Mode):**
```css
.dark {
  --background: 27 15% 15%;     /* Marrom escuro */
  --foreground: 43 38% 92%;     /* Bege claro */
  --primary: 30 24% 64%;        /* Ajustes para contraste */
}
```

**Aplicação Prática:**
- **Cores Primárias:** Utilizadas em botões principais e elementos de destaque
- **Cores de Acento:** Aplicadas em ícones e elementos interativos
- **Cores Semânticas:** Verde para sucesso, vermelho para erro (`destructive`)
- **Gradientes:** Implementados para botões e backgrounds (`gradient-accent`, `gradient-bg`)

### 1.3 Responsividade

O projeto foi desenvolvido com abordagem "mobile-first" utilizando breakpoints do Tailwind CSS:

**Breakpoints Utilizados:**
- **sm:** 640px (smartphones)
- **md:** 768px (tablets)
- **lg:** 1024px (laptops)
- **xl:** 1280px (desktops)
- **2xl:** 1400px (telas grandes)

**Técnicas Implementadas:**
```typescript
// Hook personalizado para detecção mobile
const MOBILE_BREAKPOINT = 768
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  // Lógica de detecção responsiva
}
```

**Exemplos de Classes Responsivas:**
- `grid md:grid-cols-3 gap-8` - Grid responsivo
- `flex flex-col sm:flex-row` - Layout flexível
- `text-center sm:text-left` - Alinhamento adaptativo
- `px-4 py-12` com variações por breakpoint

### 1.4 Usabilidade

Implementei diversos princípios de usabilidade para garantir uma experiência intuitiva:

**Feedback Visual:**
- Estados de hover em botões (`hover:shadow-lg`)
- Transições suaves (`transition-all duration-300`)
- Loading states com spinners (`Loader2` component)
- Toast notifications para feedback de ações

**Navegação Clara:**
- Header fixo com navegação principal
- Breadcrumbs em páginas internas
- Links com estados visuais distintos

**Consistência Visual:**
- Sistema de componentes reutilizáveis (shadcn/ui)
- Padrões visuais consistentes em toda aplicação
- Nomenclatura padronizada para classes CSS

### 1.5 Ergonomia

O projeto considera aspectos ergonômicos para reduzir fadiga do usuário:

**Áreas de Toque:**
- Botões com tamanho mínimo adequado (`h-10 px-4 py-2`)
- Espaçamento adequado entre elementos (`space-y-4`, `gap-8`)
- Aumentei área de toque em mobile (`after:absolute after:-inset-2 after:md:hidden`)

**Contraste e Legibilidade:**
- Alto contraste entre texto e fundo
- Tamanhos de fonte adequados para leitura
- Espaçamento entre linhas otimizado

**Modo Escuro:**
- Implementação completa para reduzir fadiga ocular
- Transições suaves entre modos (`theme-transition`)

### 1.6 Acessibilidade

Implementei diversas práticas de acessibilidade web:

**ARIA e Semântica:**
```typescript
// Labels apropriados
<Label htmlFor="login" className="text-text-100">
  Nome de usuário
</Label>

// Roles semânticos
<div role="alert" className={cn(alertVariants({ variant }), className)}>

// Screen reader support
<span className="sr-only">Close</span>
<span className="sr-only">Next slide</span>
```

**Navegação por Teclado:**
```typescript
const handleKeyDown = React.useCallback(
  (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  },
  [scrollPrev, scrollNext]
)
```

**Focus Management:**
- Estados de foco visíveis (`focus-visible:ring-2`)
- Ordem de tabulação lógica
- Skip links implementados

**Atributos de Acessibilidade:**
- `aria-label` em botões de ação
- `aria-describedby` para relacionar elementos
- `aria-invalid` para validação de formulários

---

## 2. Normas e Modelos (2,0 pontos)

### 2.1 eMAG (Modelo de Acessibilidade em Governo Eletrônico)

Embora não seja um site governamental, apliquei princípios do eMAG:

**Marcação Semântica:**
- Uso correto de elementos HTML5 (`<main>`, `<section>`, `<header>`)
- Estrutura hierárquica de headings
- Labels associados aos controles de formulário

**Navegação Consistente:**
- Menu principal sempre no mesmo local
- Padrões de navegação mantidos em todas as páginas
- Breadcrumbs para orientação do usuário

**Contraste e Cores:**
- Paleta de cores com contraste adequado
- Informações não dependem apenas de cor
- Modo escuro para diferentes necessidades visuais

### 2.2 ISO 9241 (Usabilidade)

Implementei os princípios da ISO 9241 para ergonomia de software:

**Adequação à Tarefa:**
- Interface focada nas tarefas principais (ler devocionais)
- Fluxos simplificados para registro e login
- Painel administrativo separado para diferentes tipos de usuário

**Autodescrição:**
- Mensagens de erro claras e específicas
- Placeholders descritivos em campos de entrada
- Tooltips explicativos onde necessário

**Controlabilidade:**
- Usuário controla o tema (claro/escuro)
- Navegação livre entre seções
- Confirmações antes de ações destrutivas

**Conformidade com Expectativas:**
- Padrões visuais familiares (botões, formulários)
- Comportamentos esperados (hover, focus)
- Estrutura de navegação convencional

**Tolerância a Erros:**
```typescript
// Validação de formulários
if (password !== confirmPassword) {
  toast({
    title: "As senhas não coincidem",
    description: "Por favor, verifique se as senhas são iguais",
    variant: "destructive",
  });
  return;
}
```

**Individualização:**
- Perfis de usuário personalizáveis
- Diferentes níveis de acesso (usuário/admin)
- Configurações de tema por usuário

---

## 3. Técnicas de Desenvolvimento (2,0 pontos)

### 3.1 Interfaces Gráficas

**Componentes Reutilizáveis:**
Utilizei a biblioteca shadcn/ui com componentes altamente customizáveis:

```typescript
// Exemplo: Button component com variantes
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground",
        // ... mais variantes
      },
    }
  }
)
```

**Sistema de Design Consistente:**
- Cards padronizados para conteúdo
- Formulários com validação visual
- Modais e dialogs responsivos
- Loading states e skeletons

### 3.2 Frameworks

**Next.js 15.2.4:**
- App Router para roteamento moderno
- Server Components e Client Components
- Otimizações automáticas de performance
- TypeScript nativo

**React 18.3.1:**
- Hooks modernos (useState, useEffect, useContext)
- Context API para gerenciamento de estado
- Componentes funcionais com TypeScript

**Tailwind CSS:**
- Utility-first CSS framework
- Configuração customizada no `tailwind.config.ts`
- Integração com variáveis CSS customizadas

**Bibliotecas Complementares:**
```json
{
  "@radix-ui/react-*": "Componentes primitivos acessíveis",
  "lucide-react": "Ícones consistentes",
  "next-themes": "Gerenciamento de temas",
  "react-hook-form": "Gerenciamento de formulários",
  "zod": "Validação de schemas"
}
```

### 3.3 Prototipação

**Estrutura de Componentes:**
Organizei os componentes em uma hierarquia clara:

```
components/
├── ui/                 # Componentes base reutilizáveis
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── admin/              # Componentes específicos do admin
│   ├── create-bible-verse-form.tsx
│   ├── devotionals-list.tsx
│   └── ...
└── dashboard-layout.tsx # Layouts específicos
```

**Padrões de Design:**
- Atomic Design principles
- Composition over inheritance
- Props typing com TypeScript
- Consistent naming conventions

---

## 4. Conceitos de UX/UI (2,0 pontos)

### 4.1 Experiência do Usuário (UX)

**Jornada do Usuário:**

1. **Landing Page:** Apresentação clara do propósito
2. **Registro/Login:** Fluxo simplificado com validações
3. **Dashboard:** Acesso rápido aos devocionais
4. **Perfil:** Personalização da conta

**Arquitetura da Informação:**
- Hierarquia visual clara
- Navegação intuitiva
- Agrupamento lógico de funcionalidades
- Breadcrumbs para orientação

**Feedback e Comunicação:**
```typescript
// Sistema de Toast notifications
const { toast } = useToast();

toast({
  title: "Sucesso",
  description: "Devocional criado com sucesso",
});
```

### 4.2 Interface do Usuário (UI)

**Design Visual:**
- Paleta de cores inspirada em tons terrosos e acolhedores
- Tipografia legível e hierárquica
- Espaçamentos consistentes
- Elementos visuais minimalistas

**Estados Interativos:**
```typescript
// Estados visuais em botões
className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
```

**Micro-interações:**
- Animações sutis em hover
- Transições suaves entre estados
- Loading states informativos
- Feedback visual imediato

**Design Responsivo:**
- Grid layouts adaptativos
- Componentes que se reorganizam por breakpoint
- Touch-friendly em dispositivos móveis

### 4.3 Acessibilidade UX

**Navegação Inclusiva:**
- Suporte completo a navegação por teclado
- Screen reader compatibility
- Focus indicators visíveis
- Alt texts em imagens

**Flexibilidade Visual:**
- Modo escuro/claro
- Contraste adequado
- Tamanhos de fonte escaláveis

---

## 5. Linguagens de Programação (2,0 pontos)

### 5.1 Backend: Java Spring Boot

**Arquitetura do Backend:**
O projeto utiliza Java Spring Boot como backend, oferecendo uma API RESTful robusta e escalável:

```java
// Exemplo da estrutura de endpoints inferida pelo frontend:
@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request);
    
    @PostMapping("/register") 
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request);
}

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getUsers();
    
    @PostMapping("/create_bible_verse")
    public ResponseEntity<ApiResponse> createBibleVerse(@RequestBody BibleVerse verse);
    
    @PostMapping("/create_devotional")
    public ResponseEntity<ApiResponse<DevotionalCreatorDTO>> createDevotional(
        @RequestHeader("verse-id") String verseId,
        @RequestHeader("devotional-date") String date
    );
}
```

**Tecnologias Spring Utilizadas:**
- **Spring Security:** Para autenticação JWT e autorização baseada em roles
- **Spring Data JPA:** Para persistência e operações de banco de dados
- **Spring Web:** Para criação da API REST
- **Spring Boot Actuator:** Para monitoramento e métricas

**Sistema de Autenticação:**
```java
// Configuração de segurança inferida
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}
```

**Modelo de Dados:**
O backend gerencia entidades como:
- **User:** Com roles (USER, ADMIN)
- **BibleVerse:** Versículos bíblicos com referência e texto
- **Devotional:** Devocionais com data, reflexão, oração e aplicação prática

### 5.2 Frontend: TypeScript/React

**Tipagem Forte:**
```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { username: string; roles: string[] } | null;
  isAdmin: boolean;
  login: (login: string, password: string) => Promise<void>;
  register: (name: string, login: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

**Props Interface:**
```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

### 5.3 Integração Frontend-Backend

**Cliente HTTP Configurado:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para autenticação automática
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Gerenciamento de Estado:**
```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username: string; roles: string[] } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verificação de roles para acesso admin
  const isAdmin = user?.roles.some((role) => role === "ROLE_ADMIN") ?? false;
}
```

### 5.4 Comunicação API

**Endpoints Principais Utilizados:**
- `POST /auth/login` - Autenticação de usuários
- `POST /auth/register` - Registro de novos usuários
- `GET /admin/users` - Listagem de usuários (admin)
- `GET /admin/get_all_bible_verses` - Busca versículos
- `POST /admin/create_devotional` - Criação de devocionais
- `GET /devotionals/check_date?date=YYYY-MM-DD` - Devocional por data

**Tratamento de Erros:**
```typescript
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    switch (error.response?.status) {
      case 401:
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        break;
      case 403:
        console.error("Permission denied");
        break;
    }
    return Promise.reject(error);
  }
);
```

### 5.5 Segurança Implementada

**Frontend:**
- Proteção de rotas baseada em autenticação
- Verificação de roles para páginas administrativas
- Sanitização de inputs em formulários
- Armazenamento seguro de tokens no localStorage

**Backend (Inferido):**
- Autenticação JWT com Spring Security
- Autorização baseada em roles (@PreAuthorize)
- Criptografia de senhas com BCrypt
- Validação de dados de entrada
- CORS configurado adequadamente

---

## Conclusão

O projeto "Chá com o Senhor" demonstra a aplicação abrangente de princípios modernos de desenvolvimento web full-stack, combinando técnicas avançadas de UX/UI com implementação técnica robusta tanto no frontend quanto no backend. A arquitetura baseada em componentes reutilizáveis, o sistema de design consistente e a atenção à acessibilidade resultam em uma aplicação escalável e inclusiva.

### Arquitetura Full-Stack

**Frontend (Next.js + TypeScript):**
- Interface moderna e responsiva
- Sistema de autenticação baseado em JWT
- Gerenciamento de estado com Context API
- Componentes acessíveis e reutilizáveis

**Backend (Java Spring Boot):**
- API RESTful com Spring Security
- Autenticação JWT e autorização por roles
- Persistência de dados com Spring Data JPA
- Arquitetura em camadas bem definida

### Personas e Design Centrado no Usuário

O desenvolvimento foi orientado por duas personas principais baseadas no método Alan Cooper:
1. **Joana Mendes (Primária):** Coordenadora engajada que busca profundidade e recursos de liderança espiritual
2. **Carlos Ribeiro (Secundária):** Profissional ocupado que prioriza praticidade e acessibilidade

Cada decisão de design foi justificada pelas necessidades específicas desses grupos comportamentais: usuários engajados focados em conteúdo profundo (Grupo 1) e usuários ocupados que valorizam praticidade (Grupo 2).

### Impacto das Personas no Design

O projeto exemplifica como o método Alan Cooper de criação de personas orientou decisões técnicas e de design:

**Para Joana (Usuária Engajada):**
- Painel administrativo robusto para gestão de conteúdo
- Sistema de autenticação com roles diferenciados
- Calendário interativo para acompanhamento de progresso
- Interface moderna que atende expectativas de usuários críticos de tecnologia

**Para Carlos (Usuário Prático):**
- Design responsivo mobile-first para acesso em movimento
- Interface simplificada com navegação direta
- Loading states e feedback imediato para experiência fluida
- Estrutura clara que reduz tempo de localização do conteúdo

### Grupos Comportamentais Atendidos

**Grupo 1 - Usuários Engajados (Joana):**
- Funcionalidades avançadas de administração
- Biblioteca rica de conteúdo espiritual
- Recursos de personalização e acompanhamento
- Interface que suporta uso prolongado

**Grupo 2 - Usuários Ocupados (Carlos):**
- Acesso rápido e objetivo ao conteúdo
- Interface otimizada para sessões curtas
- Design que não sobrecarrega cognitivamente
- Funcionalidades essenciais priorizadas

As decisões técnicas, desde a escolha do Next.js para o frontend até a implementação de um sistema de temas dinâmico, refletem boas práticas da indústria e preocupação com a experiência específica de cada grupo de usuários. O projeto serve como um exemplo prático de como integrar pesquisa de usuário, teoria de design e tecnologias modernas em uma solução coesa e funcional.

**Tecnologias Principais:**
- **Frontend:** Next.js 15.2.4 + React 18.3.1 + TypeScript
- **Backend:** Java Spring Boot + Spring Security + JPA
- **Estilização:** Tailwind CSS com sistema de design customizado
- **Componentes:** shadcn/ui + Radix UI para acessibilidade
- **Autenticação:** JWT com roles (USER/ADMIN)

**Aspectos Destacados:**
- Sistema de cores consistente com modo escuro
- Componentes totalmente acessíveis (WCAG compliance)
- Responsividade completa mobile-first
- Arquitetura full-stack escalável
- Segurança implementada em todas as camadas
- Design orientado por personas reais

### Valor Educacional

Este projeto exemplifica a aplicação prática de conceitos acadêmicos em um contexto real, demonstrando como teoria e prática se complementam no desenvolvimento de software moderno. A documentação detalhada de cada aspecto técnico serve como referência para futuros projetos e demonstra o domínio dos conceitos fundamentais de engenharia de software, design de interfaces e experiência do usuário.
