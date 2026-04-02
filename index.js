const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildVoiceStates,
GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent
]
});

const TOKEN = process.env.TOKEN;
const GAS_URL = process.env.GAS_URL;

// 通話参加検知
client.on('voiceStateUpdate', async (oldState, newState) => {
if (!oldState.channel && newState.channel) {
const name = newState.member.displayName;

console.log(`${name} が通話参加`);

await sendToSheet(name);
}
});

// 発言検知
client.on('messageCreate', async (message) => {
if (message.author.bot) return;

const name = message.member.displayName;

console.log(`${name} が発言`);

await sendToSheet(name);
});

// GAS送信処理
async function sendToSheet(name) {
try {
await axios.post(GAS_URL, {
name: name
});
} catch (e) {
console.error("送信エラー", e);
}
}

client.login(TOKEN);