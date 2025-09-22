#Stage 1: Build the app
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

#Stage 2: Serve the app
FROM nginx:stable-alpine

#Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

#Copy built app
COPY --from=builder /app/dist/front/browser /usr/share/nginx/html 

#Copy nginx config
COPY --from=builder /app/config/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

