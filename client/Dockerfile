# 1. Usa a mesma versão do Node do servidor para manter o padrão
FROM node:24-alpine

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Copia apenas os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# 4. Instala as dependências
RUN npm install

# 5. Copia o restante dos arquivos do front-end
COPY . .

# 6. Exponha a porta padrão do Vite
EXPOSE 5173

# 7. Comando para rodar o modo desenvolvimento
# O "-- --host" é OBRIGATÓRIO para o Docker conseguir mapear a rede externa
CMD ["npm", "run", "dev", "--", "--host"]