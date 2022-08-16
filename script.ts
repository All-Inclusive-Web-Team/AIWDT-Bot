import DiscordJS, {GatewayIntentBits} from 'discord.js';
import { config } from "dotenv";
config()
const client: DiscordJS.Client = new DiscordJS.Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.on('ready', () => {
  console.log("Bot logged in.");
});

console.log("process.env.DISCORD_TOKEN")
client.login(process.env.DISCORD_TOKEN)