module.exports.command = {
    name: 'yedekle',
    alias: ['backupdownload'],
    onCommand: async ({ msg, db, Permissions, client }, Discord = require("discord.js")) => {
        if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return;
        
        await db.set(`backups_${msg.author.id}_${msg.guild.id}_roles`, []);
        await db.set(`backups_${msg.author.id}_${msg.guild.id}_channels`, []);
        
        msg.guild.bans.fetch().then(bans => {
            const banList = bans.map(u => {
                return {
                    uId: u.user.id,
                    reason: u.reason
                };
            });
            db.set(`backups_${msg.author.id}_${msg.guild.id}_infos`, {
                guildName: msg.guild.name,
                guildPhoto: msg.guild.iconURL(),
                banList
            });
        });

        msg.guild.roles.cache.filter(x => x.name !== "@everyone" && x.editable).sort((a, b) => b.rawPosition - a.rawPosition).forEach(r => {
            db.push(`backups_${msg.author.id}_${msg.guild.id}_roles`, {
                roleName: r.name,
                roleColor: r.hexColor,
                rolePosition: r.rawPosition,
                roleMentionable: r.mentionable,
                rolePermissions: r.permissions,
                roleHoist: r.hoist,
                members: r.members.map(gmember => gmember.id)
            });
        });

        await msg.guild.channels.cache.sort((a, b) => a.rawPosition - b.rawPosition).map(c => {
            const permissionOverwrites = c.permissionOverwrites.cache.map(_permission => {
                if (_permission.type === "role") {
                    return {
                        name: msg.guild.roles.cache.get(_permission.id).name,
                        allows: new Discord.Permissions(_permission.allow.bitfield).toArray(),
                        denys: new Discord.Permissions(_permission.deny.bitfield).toArray()
                    };
                };
            });
            if (c.parentId !== null) {
                db.push(`backups_${msg.author.id}_${msg.guild.id}_channels`, {
                    type: c.type,
                    name: c.name,
                    position: c.rawPosition,
                    parentName: msg.guild.channels.cache.get(c.parentId).name,
                    limit: c.userLimit,
                    permissionOverwrites
                });
            } else {
                db.push(`backups_${msg.author.id}_${msg.guild.id}_channels`, {
                    type: c.type,
                    name: c.name,
                    position: c.rawPosition,
                    permissionOverwrites
                });
            };
        });
        
        client.deleteableEmbed(msg.channel, { 
            embeds: [
                {
                    description: `**Başarıyla (\`${msg.guild.name}\`) adlı sunucunun (\`Rolleri, Rol Üyeleri, Kanalları, Kanal İzinleri, Yasaklı Listesi\`) kopyalandı.**`, 
                    color: client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)],
                    timestamp: new Date(),
                    author: {
                        name: msg.guild.name,
                        icon_url: msg.guild.iconURL({dynamic:true})
                    }
                }
            ]
        }, 5);
    }
}