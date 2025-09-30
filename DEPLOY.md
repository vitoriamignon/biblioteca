# 🚀 Guia de Deploy - BookShelf

Este guia te ajudará a fazer o deploy do BookShelf em diferentes plataformas.

## 📋 **Pré-requisitos:**
- Projeto funcionando localmente ✅
- Build sem erros ✅
- Conta no GitHub ✅

## 🔗 **1. Preparar Repositório GitHub**

### 1.1 Verificar arquivos importantes:
```bash
# Verificar se existem
.gitignore
README.md
package.json
vercel.json
```

### 1.2 Fazer commit e push:
```bash
git add .
git commit -m "feat: projeto completo com SQLite + Prisma"
git push origin main
```

## ⭐ **2. Deploy na Vercel (Recomendado)**

### Por que Vercel?
✅ Criadores do Next.js  
✅ Deploy automático  
✅ HTTPS gratuito  
✅ Domínio gratuito  
✅ Zero configuração  

### 2.1 Passos:
1. **Acesse:** [vercel.com](https://vercel.com)
2. **Login** com GitHub
3. **Import Project** → Selecione o repositório `biblioteca`
4. **Configure variáveis de ambiente:**
   ```env
   DATABASE_URL=file:./prod.db
   ```
5. **Deploy** 🚀

### 2.2 Resultado:
- URL automática: `https://biblioteca-seunome.vercel.app`
- Deploy automático a cada push
- HTTPS automático

## 🚂 **3. Deploy no Railway**

### Por que Railway?
✅ Suporte nativo a SQLite  
✅ Fácil configuração  
✅ Plano gratuito generoso  

### 3.1 Passos:
1. **Acesse:** [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub repo
3. **Selecione** o repositório
4. **Adicione variáveis:**
   ```env
   DATABASE_URL=file:./prod.db
   ```
5. **Deploy automático** 🎯

## 🎨 **4. Deploy no Render**

### 4.1 Configurações:
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Environment:**
  ```env
  DATABASE_URL=file:./prod.db
  ```

## 🔧 **5. Configurações Avançadas**

### 5.1 Para banco externo (PostgreSQL):
```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

### 5.2 Script de migração para produção:
```bash
npm run db:migrate:deploy
```

## ⚡ **6. Deploy Rápido - Vercel CLI**

### 6.1 Instalar Vercel CLI:
```bash
npm i -g vercel
```

### 6.2 Deploy direto:
```bash
cd biblioteca
vercel --prod
```

## 🔒 **7. Variáveis de Ambiente**

### Necessárias:
```env
DATABASE_URL="file:./prod.db"
```

### Opcionais:
```env
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
NEXT_PUBLIC_ANALYTICS_ID="sua-analytics-id"
```

## 🛠️ **8. Troubleshooting**

### Build falha?
```bash
# Limpar cache e tentar novamente
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Banco não funciona?
- Verificar `DATABASE_URL`
- Executar `npm run db:migrate:deploy`
- Verificar logs da plataforma

### Prisma Client error?
```bash
# Regenerar cliente
npm run db:generate
```

## 🎉 **9. Resultado Final**

Após o deploy, você terá:
- ✅ **Site funcionando** na internet
- ✅ **HTTPS automático**
- ✅ **Domínio gratuito**
- ✅ **Deploy automático** a cada push
- ✅ **Banco SQLite persistente**

## 📱 **10. Compartilhar**

Após o deploy, você pode:
- Compartilhar a URL com amigos
- Adicionar ao seu portfólio
- Usar como projeto de demonstração

---

## 🏆 **Plataforma Recomendada: Vercel**

Para este projeto Next.js, a **Vercel** é a melhor opção:
- Deploy em menos de 2 minutos
- Zero configuração necessária
- Suporte oficial do Next.js
- Plano gratuito muito generoso

**Quer fazer o deploy agora? Posso te guiar passo a passo! 🚀**