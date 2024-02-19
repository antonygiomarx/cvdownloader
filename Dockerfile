# Install dependencies only when needed
FROM node:alpine3.17 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app
COPY package.json ./
RUN apk add g++ make py3-pip
RUN npm install --frozen-lockfile
RUN npx playwright install

# Build the app with cache dependencies
FROM node:alpine3.17 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build


# Production image, copy all the local and run next
FROM node:alpine3.17 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json ./

RUN apk add g++ make py3-pip

RUN npm install --frozen-lockfile

COPY --from=builder /app/dist ./dist

# # Copiar el directorio y su contenido
RUN mkdir -p ./cvdownloader

COPY --from=builder ./app/dist/ ./app

# Copiar las variables de entorno
COPY --from=builder ./app/.env ./app

# Dar permiso para ejecutar la applicación
RUN adduser --disabled-password cvdownloader
RUN chown -R cvdownloader:cvdownloader ./cvdownloader
USER cvdownloader

# Expose the listening port of your app
EXPOSE 3000

# Run the app
CMD [ "node","dist/main" ]