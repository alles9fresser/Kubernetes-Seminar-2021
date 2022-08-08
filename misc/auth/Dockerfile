FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
RUN npm install typescript 
RUN npm install ts-node-dev express @types/express
COPY . .

CMD ["npm", "start"]
