const { Message, MessageEmbed } = require('discord.js');
const Bot = require('../../../Bot');
const { Red } = require('../../../colors.json') ;
const { jaidenServerID, suggestionsChannel } = require('../../../config.json');

module.exports = {
    name: 'deny',
    helpName: 'Deny Suggestion',
    aliases: ['reject', 'deny-suggestion', 'denysuggestion'],
    usage: 'deny [suggestion id]',
    description: 'Denies a suggestion based on its ID',
    staffOnly: true,
    cooldown: 60,

    /**
    * @param {Bot} bot
    * @param {Message} message
    * @param {string[]} args
    */
    run: async(bot, message, args) => {
        const id = parseInt(args[0]);
        if (!args[0] || isNaN(id)) return message.channel.send('Please specify a valid suggestion ID.');
        const reason = args.slice(1).join(' ');

        // Gets the suggestion data by its ID
        let suggestion = await bot.suggestions.findOne({ where: { id } });
        if (!suggestion) return message.channel.send(`There's no suggestion with the ID \`${id}\``);
        // Changes its status
        let newData = { status: 'Denied' };
        if (reason) newData.reason = reason;
        await suggestion.update(newData);

        // Message and user data
        const msg = await bot.channels.cache.get(suggestionsChannel).messages.fetch(suggestion.message_id);
        const user = await bot.users.fetch(suggestion.user_id);

        // Edits the suggestion embed
        const embed = new MessageEmbed()
            .setColor(Red)
            .setAuthor(user.tag, user.displayAvatarURL())
            .setTitle(`Suggestion #${suggestion.id}`)
            .setDescription(suggestion.content)
            .setFooter(suggestion.status)
            .setTimestamp(suggestion.createdAt)
            .addField('Reason', suggestion.reason);
        msg.edit({ embeds: [embed] });

        // DMs the user that their suggestion was approved, error message if unable
        const dmEmbed = new MessageEmbed()
            .setColor(Red)
            .setDescription(`Your suggestion [(#${suggestion.id})](https://discord.com/channels/${jaidenServerID}/${suggestionsChannel}/${suggestion.message_id}) has been denied.`);
        user.send({ embeds: [dmEmbed] })
            .catch(() => message.channel.send(`Couldn't send an information message to **${user.tag}**!`));
        
        if (message.deletable) message.delete();
    }
};