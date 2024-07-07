FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install serve -g
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["serve", "-l", "3000", "-s", "dist"]