const Discord = require('discord.js');

module.exports = async bot => {
    bot.user.setActivity('you', {type:'WATCHING'});
    console.log(`${bot.user.username} online`);
};