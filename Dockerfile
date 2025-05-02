FROM node:20-alpine

WORKDIR /usr/src/app

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
