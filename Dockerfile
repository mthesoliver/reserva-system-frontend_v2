# Use a imagem base oficial do Node.js
FROM node:20 as build

# Define o diretório de trabalho no contêiner
WORKDIR /usr/local/app

# Copia o arquivo package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./
#COPY angular.json ./

# Instala as dependências da aplicação
RUN npm install

# Instala o Ionic CLI globalmente
RUN npm install -g @ionic/cli

# Copia todos os arquivos da aplicação para o diretório de trabalho
COPY . /usr/local/app

# Compila a aplicação Ionic (opcional, dependendo da configuração do seu projeto)
RUN ionic build --prod --engine=browser

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/www /usr/share/nginx/html

# Exponha a porta em que a aplicação vai rodar
EXPOSE 4200

# Comando para iniciar a aplicação
# CMD ["ionic", "serve", "--host", "0.0.0.0", "--port", "4200"]

# Comando para iniciar a aplicação
#CMD ["npm", "start", "--disableHostCheck"]