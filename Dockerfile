FROM node:18 as builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:18

RUN useradd -ms /bin/bash faucet
USER faucet

WORKDIR /app

COPY --from=builder --chown=faucet:faucet /app .

EXPOSE 3000
CMD ["yarn", "start:prod"]
