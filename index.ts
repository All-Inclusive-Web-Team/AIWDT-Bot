import { config } from 'dotenv'
import { BaseInteraction, Client, GatewayIntentBits, MembershipScreeningFieldType, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'

config();

let testing: boolean = true
let TOKEN: string
let CLIENT_ID: string
let GUILD_ID: string

if (testing === true) {
  TOKEN= process.env.TEST_TOKEN
  CLIENT_ID= process.env.TEST_CLIENT_ID
  GUILD_ID= process.env.TEST_GUILD_ID
} else {
  TOKEN = process.env.TOKEN;
  CLIENT_ID = process.env.CLIENT_ID
  GUILD_ID = process.env.GUILD_ID
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const rest = new REST({ version: '10' }).setToken(TOKEN)

client.on('ready', () => {
  if (client.user != null) {
    console.log(`Hacked into the mainframe as ${client.user.username.toUpperCase()}.`)
  }
});

client.on('messageCreate', message => {
  console.log(message.content);
  console.log(message.author.tag);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {

    switch (interaction.commandName) {

      case 'ping':
        await interaction.reply('Pong');        
        break;

      case 'create-role':
        let role_string: string = interaction.options.getString('role', true);
        await interaction.reply('Created role: ' + role_string);
        await interaction.guild?.roles.create({
          name: role_string,
          color: 'Fuchsia',
        });
        break;

      case 'get-roles':
        const user = interaction.options.getUser(interaction.member?.user?.username?);
        console.log(user);
        if (user) {
          const member = 
          interaction.guild?.members.cache.get(user.id) 
          || await interaction.guild?.members.fetch(user.id).catch(err => { });
          
          const roles_string: string = interaction.options.getString('roles', true);
          const roles_array: string[] = roles_string.split(' ');
          for (role_string in roles_array) {
            role_string = capitalizeFirstLetter(role_string);
            let role = interaction.guild?.roles.cache.find(r => r.name === role_string);
            if (role) {
              member?.roles.add(role)
            } else {
              interaction.reply(`${role_string} not found.`)
            };
          };
        }
        break;
      default:
        break;
      };
    };
    console.log(interaction.user.id)
  });


async function main() {
  const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'create-role',
    description: 'Admins only; creates a role.',
    options: [
      {
        name: 'role',
        description: 'Name of the role to be created.',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'get-roles',
    description: 'Gives you roles',
    options: [
      {
        name: 'roles',
        description: 'Format: /get-roles role1 role2 ...',
        type: 3,
        required: true,
      },
    ],
  },
];
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(CLIENT_ID), {body: commands,});
    console.log('Successfully reloaded application (/) commands.');
  } catch (err) {
    console.log(err);
  };
};

function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
};

client.login(TOKEN);
main();