import os

import discord
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

intents = discord.Intents.default()
intents.members = True


class MyClient(discord.Client):
    async def on_ready(self):
        print('Logged on as', self.user)

    async def on_message(self, message):
        # don't respond to ourselves
        if message.author == self.user:
            return

        if message.content == 'ping':
            await message.channel.send('pong')


client = MyClient(intents=intents)


@client.event
async def on_member_join(member):
    dir(member)
    channel = member.guild.system_channel
    if channel is not None:
        await channel.send(f"Welcome to the server {member.mention}!")
    return


@client.event
async def on_ready():
    print(f'{client.user} has connected to Discord!')


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.startswith('hello'):
        await message.channel.send('Hello!')

    if message.content.startswith('give me a role'):
        member = message.author
        guild = message.guild
        role = discord.utils.get(guild.roles, name="student")
        await member.add_roles(role)

client.run(TOKEN)
