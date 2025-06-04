FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Copia os arquivos de configuração do projeto
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta que a aplicação Express utiliza
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "app.js"]
