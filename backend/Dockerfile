#stage 1: Build typescript
FROM node:24-alpine AS builder

WORKDIR /app

#Install dependencies
COPY package*.json ./
RUN npm ci

#Copy code and compile
COPY . .
RUN npm run build

#Stage 2: Run compiled app
FROM node:24-alpine

WORKDIR /app

#Only copy production dependencies
COPY package*.json ./
RUN npm ci --only=production

#Copy compiled output from builder
COPY --from=builder /app/dist ./dist 

EXPOSE 7000

CMD ["node", "dist/server.js"]



