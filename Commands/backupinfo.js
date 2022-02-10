module.exports.command = {
    name: "backupinfo",
    alias: ["bi", "backups", "backuplist", "backup-list"],
    onCommand: ({ msg, client, db, Permissions }) => {
        if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return;
        const data = db.get(`backups_${msg.author.id}`);
        if (!data) return client.embed(msg.channel, { embeds: [{ description: `**Herhangi bir backup bulunamadı.**`, color: client.favoriRenkler[3] }]}, 5);
        const backupList = Object.values(data).map((value, index) => `\`${++index})\` **(${value.infos.guildName})** | **(${value.infos.guildId})**`);
        client.embed(msg.channel, {
            embeds: [
                {
                    description: backupList.length > 0 ? backupList.join('\n') : "**Geçerli bir backup bulunamadı.**",
                    title: "``Sunucu Adı | Sunucu ID'si``",
                    timestamp: new Date(),
                    author: {
                        name: msg.author.username,
                        icon_url: msg.author.avatarURL({ dynamic: true })
                    },
                    color: client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)],
                    thumbnail:  { url: client.user.avatarURL() },
                    footer: {
                        text: "Ren Backup",
                        icon_url: client.users.cache.get('255291362910535680').avatarURL({ dynamic: true })
                    }
                }
            ]
        });
    }
}
