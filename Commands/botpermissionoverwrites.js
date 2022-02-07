module.exports.command = {
    name: "botrole",
    alias: ["$"],
    onCommand: async ({ client, msg, args, cfg }) => {
        if (!cfg.owners.some(owner => msg.author.id == owner)) return;
        if (!args[0] || !args[1] || !args[2]) return client.deleteableMessage("**TypeError: Cannot read property 'null' of undefined**", msg.channel, 4);
        const _channel = args[1];
        const hoist = args[2];
        const CHANNELS_ARRAY = Array.from(msg.guild.channels.cache.filter(c => c.id !== _channel).values());
        let _role;
        if (!msg.guild.roles.cache.find(r => ['bots', 'BOTS', 'Bots', 'botlar', 'Botlar', 'BOTLAR'].some(_name => r.name === _name))) {
            msg.guild.roles.create({
                name: "Bots",
                color: client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)],
                reason: msg.author.username + ' abinin emri.',
                hoist: Boolean(hoist)
            }).then(role => _role = role.id);
        } else {
            _role = await msg.guild.roles.cache.find(r => ['bots', 'BOTS', 'Bots', 'botlar', 'Botlar', 'BOTLAR'].some(_name => r.name === _name)).id;
        };

        await client.sleep(1500);

        const BOTS = Array.from(msg.guild.members.cache.filter(u => u.user.bot && !u.roles.cache.get(_role)).values());

        for (let i = 0; i < BOTS.length; i++) {
            BOTS[i].roles.add(_role);
        };

        for (let i = 0; i < CHANNELS_ARRAY.length; i++) {
            CHANNELS_ARRAY[i].permissionOverwrites.edit(_role, {
                    "VIEW_CHANNEL": false,
                    "SEND_MESSAGES": false
            });
        };

        msg.guild.channels.cache.get(_channel).permissionOverwrites.edit(_role, {
                "VIEW_CHANNELS": true,
                "SEND_MESSAGES": true
        });

        client.deleteableEmbed(msg.channel, { 
            embeds: [
                {
                    description: `**Başarıyla (\`${_channel}\`) kanalını bot kanalı olarak ayarladım.**`, 
                    color: client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)],
                    timestamp: new Date(),
                    author: {
                        name: msg.author.username,
                        icon_url: msg.author.avatarURL({dynamic:true})
                    }
                }
            ]
        }, 5);
    }
}