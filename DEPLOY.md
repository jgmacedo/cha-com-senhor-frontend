# Deploy no Vercel - Chá com o Senhor

## 🚀 Instruções para Deploy

### 1. Preparação do Projeto

Certifique-se de que todas as dependências estão instaladas:

```bash
npm install
# ou
pnpm install
```

### 2. Configuração de Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Configure a URL da API no `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://sua-api-backend.herokuapp.com
```

### 3. Deploy Automático no Vercel

#### Opção A: Via GitHub (Recomendado)

1. **Faça push do código para o GitHub:**
```bash
git add .
git commit -m "feat: adiciona configuração para deploy no Vercel"
git push origin main
```

2. **No Vercel Dashboard:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub
   - Configure a variável de ambiente:
     - `NEXT_PUBLIC_API_URL` = URL do seu backend

3. **Deploy será automático!**

#### Opção B: Via Vercel CLI

1. **Instale a CLI do Vercel:**
```bash
npm i -g vercel
```

2. **Faça login:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Para produção:**
```bash
vercel --prod
```

### 4. Configuração de Variáveis de Ambiente no Vercel

No dashboard do Vercel:

1. Vá para **Settings** → **Environment Variables**
2. Adicione:
   - **Name:** `NEXT_PUBLIC_API_URL`
   - **Value:** URL do seu backend
   - **Environments:** Production, Preview, Development

### 5. Domínio Personalizado (Opcional)

1. No Vercel Dashboard, vá para **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções

## 📋 Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Backend deployado e funcionando
- [ ] Teste local funcionando (`npm run build`)
- [ ] Deploy no Vercel realizado
- [ ] Teste da aplicação em produção

## 🔧 Troubleshooting

### Erro de Build

Se houver erro no build, verifique:

```bash
# Teste o build localmente
npm run build

# Verifique tipos TypeScript
npm run type-check
```

### Erro de API

Certifique-se de que:
- A variável `NEXT_PUBLIC_API_URL` está configurada
- O backend está acessível publicamente
- CORS está configurado no backend para aceitar requisições do domínio Vercel

### Build Timeout

Se o build demorar muito, configure no `vercel.json`:

```json
{
  "functions": {
    "app/**": {
      "maxDuration": 60
    }
  }
}
```

## 📱 URLs de Produção

Após o deploy, você terá:
- **URL Principal:** `https://cha-com-senhor.vercel.app`
- **URLs de Preview:** Para cada branch/PR

## 🔄 Deploy Contínuo

O Vercel automaticamente:
- Faz deploy da branch `main` para produção
- Cria previews para PRs
- Executa builds otimizados
- Configura CDN global
- Gerencia cache automático

Qualquer push para o repositório irá triggerar um novo deploy automaticamente!
