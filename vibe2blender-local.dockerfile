# Stage 1: Build the React app
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
# Copy the built Vite assets to Nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose the port Cloud Run expects
EXPOSE 8080
# Update Nginx to listen on port 8080 instead of 80
RUN sed -i 's/listen  *80;/listen 8080;/g' /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]