# Build 
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Produção
FROM node:20-alpine AS runner

WORKDIR /app

# Criando usuário comum(não é o superusuário)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia os módulos node que foram instalados e copia o código fonte do app 
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# transfere a posse dos arqquivos para o usuário comum
RUN chown -R appuser:appgroup /app
USER appuser

# expõe a porta 3000(só para documentação)
EXPOSE 3000

CMD ["node", "server.js"]