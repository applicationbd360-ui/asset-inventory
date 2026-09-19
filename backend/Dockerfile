FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/app.js"]
