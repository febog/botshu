# BotShu

Chat bot for Mushu. Automated `!eng` command. If a chat message is not in Enlish it reminds the user to follow the chat rules. After 3 strikes the user is timed out.

## Commands

| Command                    | Description                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `!botshu on`               | Enable the bot.                                                                                   |
| `!botshu off`              | Disable the bot.                                                                                  |
| `!botshu reset all`        | Reset strikes for all users.                                                                      |
| `!botshu reset {username}` | Reset strings for the given user.                                                                 |
| `!botshu count {username}` | Returns the number of stringes for the given user. Show file differences that haven't been staged |
