module.exports.command = {
    name: "backupdelete",
    alias: ["backupd", "bd", "yedeksil", "yedek-sil", "deletebackup"],
    onCommand: ({ msg, args, client, db, Permissions }) => {
        if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return;
        if (!args[0]) return client.deleteableMessage("**Geçerli bir backup idsi girmelisin.**", msg.channel, 5);
        const sunucuId = args[0];
        if (!db.get(`backups_${msg.author.id}`) || !db.get(`backups_${msg.author.id}.${sunucuId}`)) client.deleteableMessage("**Geçerli bir backup bulunamadı.**", msg.channel, 5);
        
        const data = db.get(`backups_${msg.author.id}`);
        delete data[sunucuId];
        
        db.set(`backups_${msg.author.id}`, data);

        client.embed(msg.channel, {
            embeds: [
                {
                    description: `**Başarıyla \`(${sunucuId})\` idli sunucu yedeği silindi. **`,
                    timestamp: new Date(),
                    author: {
                        name: msg.author.username,
                        icon_url: msg.author.avatarURL({ dynamic: true })
                    },
                    color: client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)],
                }
            ]
        });
    }
}