FROM node:16
RUN yarn global add @nestjs/cli
WORKDIR /app
COPY . .
RUN yarn
EXPOSE 3000
CMD ["yarn", "start"]
