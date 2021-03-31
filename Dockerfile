FROM node:11.13.0-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

RUN npm config set unsafe-perm true
RUN npm install --global typescript@latest

COPY package*.json tsconfig.json tslint.json .env /app/
RUN npm install\
        && npm install tsc -g

COPY src /app/src/
RUN npm run build
EXPOSE 8081

CMD [ "npm", "start" ]