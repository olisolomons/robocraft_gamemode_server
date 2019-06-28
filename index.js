const Discord = require("discord.js");
const express = require('express');
const http = require('http');
const sqlite3 = require('sqlite3-promise');
const bodyParser = require('body-parser');
const { Buffer } = require('buffer');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.raw({
    inflate: true,
    limit: '100mb',
    type: 'application/octet-stream'
}));

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

app.post('/notify-stop', async (req, res) => {
    let { username, discriminator } = req.body;
    if (!username || !discriminator) {
        res.status(400).text('Bad request');
        return;
    }

    let user = await client.users.find(c =>
        c.username == 'DreamMorpheus' && c.discriminator == '4707'
    );

    await user.send('I\'m getting hungry for screenshots! Moar!')
    res.end();
});

app.post('/broadcast', async (req, res) => {
    await broadcast(req.body.msg);
    res.end();
});

app.post('/broadcast-image', async (req, res) => {
    console.log(req.body);
    console.log(Buffer.from(req.body));
    let channels = await db.allAsync('SELECT * FROM channels');
    for (let channel_id of channels) {
        let channel = client.channels.get(channel_id.id);
        await channel.send('', {
            file: new Discord.Attachment(req.body, 'game-mode.jpg')
        });
    }

    res.end();
});

client.login(process.env.TOKEN);