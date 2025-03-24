FROM node:20-alpine

# กำหนด working directory
WORKDIR /usr/src/app

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . .

# สั่ง build NestJS (ถ้ามี TypeScript)
RUN npm run build

# Expose port 3000
EXPOSE 3000

# สั่งให้ container รัน NestJS
CMD ["node", "dist/main"]
