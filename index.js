const Discord = require("discord.js");
const express = require('express');
const http = require('http');

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

client.login(process.env.TOKEN);