FROM node:20.15-alpine

WORKDIR /app/frontend
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --include=dev
COPY src /app/frontend/src
COPY *.* /app/frontend/
ENTRYPOINT ["npm", "run", "dev", "--", "--host"]