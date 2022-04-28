FROM node:14.18-slim as build

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:14.18-slim as release
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/node_modules ./node_modules
EXPOSE 3000
CMD [ "node", "dist/src/server.js" ]