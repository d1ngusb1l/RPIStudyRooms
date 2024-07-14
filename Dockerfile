FROM node:20.15-alpine as build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --include=dev

COPY src src

FROM node:20.15-alpine as prisma-gen

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

COPY prisma prisma
RUN npm ci --include=dev
RUN npx prisma generate

FROM node:20.15-alpine as dev

WORKDIR /app
COPY --from=build /app .
COPY --from=prisma-gen /app/node_modules/@prisma/client /app/node_modules/@prisma/client
COPY --from=prisma-gen /app/node_modules/.prisma/client /app/node_modules/.prisma/client

ENV NODE_ENV=development
CMD ["npm", "run", "start-server-dev"]

FROM node:20.15-alpine as prod-build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY --from=build /app/node_modules node_modules

ENV NODE_ENV=production
COPY tsconfig.json .
COPY src src
RUN ["npm", "run", "build-server-prod"]

FROM node:20.15-alpine as prod-deps
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --include=prod

FROM node:20.15-alpine as prod-frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm ci --include=dev
COPY frontend/src /app/frontend/src
COPY frontend/*.* /app/frontend/
RUN ["npm", "run", "build"]

FROM node:20.15-alpine as prod
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=prisma-gen /app/node_modules/@prisma/client /app/node_modules/@prisma/client
COPY --from=prisma-gen /app/node_modules/.prisma/client /app/node_modules/.prisma/client
COPY --from=prod-build /app/dist dist
COPY --from=prod-frontend /app/frontend/dist frontend/dist

ENV NODE_ENV=production
CMD ["node", "dist/app.js"]
