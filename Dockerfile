FROM node:16
WORKDIR /app
COPY app/. .
RUN npm install && npx tsc
EXPOSE 8123
CMD ["npm", "run", "start"]
