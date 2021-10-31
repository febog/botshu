# BotShu

Chat bot for Mushu. Automated `!eng` command. If a chat message is not in English it reminds the user to follow the chat rules. After 3 strikes the user is timed out.

## Commands

| Command                    | Description                             |
| -------------------------- | --------------------------------------- |
| `!botshu enable`           | Enable the bot.                         |
| `!botshu disable`          | Disable the bot.                        |
| `!botshu status`           | Returns the bot enabled/disabled state. |
| `!botshu reset all`        | Reset strikes for all users.            |
| `!botshu reset {username}` | Reset strikes for the given user.       |
| `!botshu count {username}` | See the number of strikes of the user.  |
| `!botshu golive`           | Set stream to live status.              |
| `!botshu gooffline`        | Set stream to offline status.           |
| `!botshu stream`           | Get the bot's stream status.            |
| `!botshu version`          | Prints bot version in chat.             |
