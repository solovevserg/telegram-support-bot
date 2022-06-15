# telegram-support-bot

Simple bot for getting help to your clients.
Inspired by [telegram-support-bot](https://github.com/bostrot/telegram-support-bot) by [Eric Trenkel](https://github.com/bostrot).

## Using

1. Create a bot via BotFather in telegram and save its token
2. Create a group for answering clients' questions
3. Add bot to the group and make it admin

⚠ Note: When a second admin is added the group is upgraded to supergroup and its id is changed!

### Docker

You can use [image on DockerHub](https://hub.docker.com/repository/docker/sdalbmstu/ridenow-support-bot)

```bash
    docker run -e BOT_SUPPORT_TOKEN=<your_token> -e BOT_SUPPORT_CHAT_ID=<your_support_staff_chat> -d sdalbmstu/ridenow-support-bot
```

```yaml
  bot-support:
    image: "sdalbmstu/ridenow-support-bot"
    restart: always
    environment:
      - BOT_SUPPORT_TOKEN=<your_token>
      - BOT_SUPPORT_CHAT_ID=<your_support_staff_chat>
```

### Source code

Ensure Node and Yarn are installed.

```bash
git clone https://github.com/solovevserg/telegram-support-bot.git
cd telegram-support-bot
yarn install --frozen-lcokfile

# for production
yarn build
yarn start

# or in development
yarn dev
```

Feel free to contribute! Just fork, make necessary changes and leave a PR.

## About the author

I am sergei Solovev, fullstack TS developer, data analyst and teacher. You can look at my works [here](https://sergsol.com/). For faster response get me on [telegram](https://t.me/sergsol).
