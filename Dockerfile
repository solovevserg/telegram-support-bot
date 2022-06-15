FROM node:16-slim as build

WORKDIR /bot

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile

COPY . /bot
RUN yarn build

FROM node:16-slim as prod

WORKDIR /bot
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile --production

COPY --from=build /bot/dist ./dist

CMD [ "yarn", "start"]