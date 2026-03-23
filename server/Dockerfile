# Usar a versão do Node recomendada no README (ou uma versão LTS recente)
FROM node:24-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos de dependências e instalar
COPY package*.json ./
RUN npm install

# Copiar o restante do código fonte
COPY . .

# Expor a porta que a aplicação usa (padrão 3000 no index.js)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "index.js"]