FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -f package-lock.json && npm install

COPY . .

EXPOSE 5173

# Jalankan Vite dev server dengan binding host 0.0.0.0 agar dapat diakses dari host OS
CMD ["npm", "run", "dev", "--", "--host"]
