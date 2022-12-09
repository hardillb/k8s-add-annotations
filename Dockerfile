FROM node:16-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN mkdir ca
COPY ca/key.pem ca/key.pem
COPY ca/ingress.pem ca/ingress.pem
COPY index.js .

CMD [ "node", "index.js" ]