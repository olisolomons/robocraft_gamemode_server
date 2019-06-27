const Discord = require("discord.js");
const express = require('express');
const http = require('http');
const sqlite3 = require('sqlite3-promise');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('No page, this is a discord bot');
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const client = new Discord.Client();

client.on("ready", async () => {
    console.log("I am ready!");
});

client.on("message", async (message) => {
    if (message.content.startsWith("!enable_robocraft_gamemode")) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            await message.channel.send('You are not worthy of this permission!');
            return;
        }
        try {
            await db.runAsync('INSERT INTO channels VALUES (?)', message.channel.id);
            await message.channel.send('Enabled!');
        } catch (err) {
            await message.channel.send('It was already enabled!');
        }
    }
    if (message.content.startsWith("!disable_robocraft_gamemode")) {
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            await message.channel.send('You are not worthy of this permission!');
            return;
        }
        await db.runAsync('DELETE FROM channels WHERE id=?', message.channel.id);
        await message.channel.send('Disabled!');
    }
});

const db = new sqlite3.Database('./.data/sqlite.db');

async function broadcast(message) {
    let channels = await db.allAsync('SELECT * FROM channels');
    for (let channel_id of channels) {
        let channel = client.channels.get(channel_id.id);
        await channel.send(message);
    }
}

app.post('/broadcast', async (req, res) => {
    broadcast(req.body.msg);
    res.end();
});

client.login(process.env.TOKEN);