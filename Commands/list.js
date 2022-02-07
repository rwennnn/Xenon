module.exports.command = {
    name: 'a',
    alias: ['b'],
    onCommand: async ({ client, msg, args, db, cfg }) => {
        msg.guild.bans.fetch().then(bans => {
            const banList = bans.map(u => {
                return {
                    userId: u.user.id,
                    reason: u.reason
                }
            });
            db.set(`backups_${msg.author.id}_${msg.guild.id}_infos`, {
                guildName: msg.guild.name,
                guildPhoto: msg.guild.iconURL(),
                banList
            });
        });

        setTimeout(() => {
            const data = db.get(`backups_${msg.author.id}_${msg.guild.id}_infos`);
            console.log(data);
        }, 1500);
    }
}