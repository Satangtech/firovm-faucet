FROM node:18
RUN yarn global add @nestjs/cli
WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]
