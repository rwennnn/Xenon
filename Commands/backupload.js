module.exports.command = {
    name: 'yükle',
    alias: ['backupload'],
    onCommand: async ({ client, msg, args, db, Permissions }) => {
        if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return;
        if (!args[0] || isNaN(args[0])) return client.deleteableMessage("**Geçerli bir sunucu IDsi girmelisin.**", msg.channel, 5);
        const sunucuId = args[0];

        const data = await db.get(`backups_${msg.author.id}.${sunucuId}.roles`);
        const data2 = await db.get(`backups_${msg.author.id}.${sunucuId}.channels`);
        const data3 = await db.get(`backups_${msg.author.id}.${sunucuId}.infos`);

        if (!data || !data2 || !data3) return client.deleteableMessage("**Geçerli bir backup bulunamadı.**", msg.channel, 5);

        const roles = Array.from(msg.guild.roles.cache.filter(r => r.editable).values());
        const channels = Array.from(msg.guild.channels.cache.values());

        for (let i = 0; i < roles.length; i++) {
            roles[i].delete().catch(() => { });
        };

        for (let i = 0; i < channels.length; i++) {
            channels[i].delete().catch(() => { });
        };

        await client.sleep(3000);

        for (let i = 0; i < data.length; i++) {
            msg.guild.roles.create({
                    name: data[i].roleName,
                    color: data[i].roleColor,
                    mentionable: data[i].roleMentionable,
                    permissions: data[i].rolePermissions,
                    hoist: data[i].roleHoist,
                    reason: "Ren Backup"
            }).then(_newRole => {
                const uyeler = data[i].members.filter(id => msg.guild.members.cache.get(id));
                for (let j = 0; j < uyeler.length; j++) {
                    msg.guild.members.cache.get(uyeler[j]).roles.add(_newRole.id);
                };
            });
        };

        await client.sleep(data.length * 500);

        const CATEGORIES = await data2.filter(c => c.type === 'GUILD_CATEGORY');
        const CHANNELS = data2.filter(c => c.type !== 'GUILD_CATEGORY');

        for (let i = 0; i < CATEGORIES.length; i++) {
            msg.guild.channels.create(CATEGORIES[i].name, {
                type: CATEGORIES[i].type,
            }).then(_parent => {
                CHANNELS[i].permissionOverwrites.forEach(_permission => {
                    const role = msg.guild.roles.cache.find(r => r.name === _permission.name);
                    const rolId = role.name == '@everyone' ? msg.guild.id : role.id;
                    _permission.allows.forEach(allow => {
                        const Obj = {};
                        Obj[allow] = true;
                        _parent.permissionOverwrites.create(rolId, Obj);
                    });
                    _permission.denys.forEach(deny => {
                        const Obj = {};
                        Obj[deny] = false;
                        _parent.permissionOverwrites.create(rolId, Obj);
                    });
                });
            });
        };

        for (let i = 0; i < CHANNELS.length; i++) {
            msg.guild.channels.create(CHANNELS[i].name, {
                type: CHANNELS[i].type,
                userLimit: CHANNELS[i].limit,
            }).then(ch => {
                const parent = msg.guild.channels.cache.filter(channel => channel.type === 'GUILD_CATEGORY').find(channel => channel.name === CHANNELS[i].parentName);
                if (CHANNELS[i].parentName !== null && parent !== undefined) ch.setParent(parent.id);
                CHANNELS[i].permissionOverwrites.forEach(_permission => {
                    if (_permission !== null && _permission.name) {
                        const role = msg.guild.roles.cache.find(r => r.name === _permission.name);
                        if (!role || !role.name) return;
                        const rolId = role.name == '@everyone' ? msg.guild.id : role.id;
                        _permission.allows.forEach(allow => {
                            const Obj = {};
                            Obj[allow] = true;
                            ch.permissionOverwrites.create(rolId, Obj);
                        });
                        _permission.denys.forEach(deny => {
                            const Obj = {};
                            Obj[deny] = false;
                            ch.permissionOverwrites.create(rolId, Obj);
                        });
                    };
                });
            });
        };

        for (let k = 0; k < data3.banList.length; k++) 
            msg.guild.members.ban(data3.banList[k].uId, { reason: data3.banList[k].reason }).catch();

        msg.guild.setName(data3.guildName);
        msg.guild.setIcon(data3.guildPhoto);
    }
}