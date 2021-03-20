const Discord = require('discord.js');
const colors = require('../../../colors.json');

module.exports = {
    name: 'say',
    helpName: 'Say',
    category: 'Utilities',
    aliases: ['echo'],
    usage: 'say [#channel] (embed) [message]',
    description: 'Echoes the given args',

    /** 
     * @param {Discord.Client} bot 
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(bot, message, args) => {
        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.find(c => c.id == args[0]) ||
        message.guild.channels.cache.find(c => c.name == args[0]);

        if (!channel) return message.channel.send('Couldn\'t find a channel with the arguments provided');
    
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return;

        if (message.deletable) message.delete();
        
        if (args[1] == 'embed') {
            if (!args.slice(2).join(' ')) {
                return message.reply('what the fuck do i send');
            }
            const embed = new Discord.MessageEmbed()
                .setColor(colors.ForestGreen)
                .setDescription(args.slice(2).join(' '));
            
            channel.send(embed);
        } else {
            if (!args.slice(2).join(' ')) {
                return message.reply('what the fuck do i send');
            }
            channel.send(args.slice(1).join(' '));
        }
    }
};