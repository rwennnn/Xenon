module.exports.command = {
    name: 'eval',
    alias: ['ex'],
    onCommand: async ({ client, msg, args, db, cfg, Permissions }) => {
        if (!cfg.owners.includes(msg.author.id)) return;
        if (!args[0]) return;
        if (args.some(arg => arg === 'token' || arg === 'cfg')) return client.message('Bırakın lan beni ibneler', msg.channel.id, 5000);
        let code = args.join(' ');
        try {
            let evaled = client.clean(await eval(code));
            if (evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace('token', 'NE_SANDIN_YARRAM').replace(cfg.token, 'NE_SANDIN_YARRAM');
            msg.channel.send(`\`\`\`js\n${evaled.replace(cfg.token, 'NE_SANDIN_YARRAM')}\`\`\``);
        } catch(e) {
            msg.channel.send('```js\n' + e + '```');
        };
    }
};