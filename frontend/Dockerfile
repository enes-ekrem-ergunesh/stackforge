FROM node:22.14.0-alpine3.21 AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY angular.json tsconfig.json tsconfig.app.json ./
COPY src ./src

RUN npm run build

FROM node:22.14.0-alpine3.21 AS runtime

WORKDIR /app

RUN npm install -g http-server@14.1.1

COPY --from=build /app/dist/stackforge-frontend/browser ./dist

EXPOSE 4200

CMD ["http-server", "dist", "-p", "4200", "-a", "0.0.0.0"]
