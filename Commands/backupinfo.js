module.exports.command = {
    name: "backupinfo",
    alias: ["bi", "backups"],
    onCommand: ({ msg, client, db, Permissions }) => {
        if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return;
        const data = db.get(`backup_${msg.author.id}`);
        //if (!data) return client.deleteableEmbed(msg.channel, { embeds: [{ description: `**Herhangi bir backup bulunamadı.**`, color: client.favoriRenkler[3] }]}, 5);
        console.log(data);
    }
}