# Use a imagem base oficial do Node.js
FROM node:20

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o arquivo package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./
#COPY angular.json ./

# Instala as dependências da aplicação
RUN npm install

# Instala o Ionic CLI globalmente
RUN npm install -g @ionic/cli

# Copia todos os arquivos da aplicação para o diretório de trabalho
COPY . .

# Compila a aplicação Ionic (opcional, dependendo da configuração do seu projeto)
# RUN npm run build

# Exponha a porta em que a aplicação vai rodar
EXPOSE 4200

# Comando para iniciar a aplicação
CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "4200"]

# Comando para iniciar a aplicação
#CMD ["npm", "start", "--disableHostCheck"]