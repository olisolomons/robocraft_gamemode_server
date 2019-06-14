const Discord = require("discord.js");
const express = require('express');
const http = require('http');
const sqlite3 = require('sqlite3-promise');

app = express();
app.get('/', (req, res) => {
    res.send('No page, this is a discord bot');
});
app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const client = new Discord.Client();

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
    if (message.content.startsWith("ping")) {
        message.channel.send("pong!");
    }
});

const db = new sqlite3.Database('./.data/sqlite.db');

async function init() {

    await db.runAsync('create table test(c int)');
    await db.runAsync('insert into test values (12)');
    await db.runAsync('insert into test values (123)');
    let res = await db.allAsync('select * from test');
    console.log(res);
}
init().catch(e => {
    console.error(e);
})

client.login(process.env.TOKEN);