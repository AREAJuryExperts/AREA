FROM node:19-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm i --silent
COPY . ./

FROM node:19-alpine
WORKDIR /app
COPY --from=build /app .
RUN npm install pm2 -g
EXPOSE 8080
CMD ["pm2-runtime", "index.js"]
