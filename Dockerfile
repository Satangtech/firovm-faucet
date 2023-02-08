FROM node:18

RUN useradd -ms /bin/bash faucet
USER faucet

WORKDIR /app
RUN chown -R faucet:faucet /app

COPY --chown=faucet:faucet package.json yarn.lock ./
RUN yarn install

COPY --chown=faucet:faucet . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]
