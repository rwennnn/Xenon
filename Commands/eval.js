module.exports.command = {
    name: 'eval',
    alias: ['ex'],
    onCommand: async ({ client, msg, args, db, cfg, Permissions }) => {
        if (!cfg.owners.includes(msg.author.id)) return;
        if (!args[0]) return;
        if (args.some(arg => arg === "cfg")) return null;
        let code = args.join(' ');
        try {
            const evaled = client.clean(await eval(code));
            const RegEx = new RegExp(`${client.token}`);
            const message = "?";
            if (evaled.match(RegEx)) evaled.replace('token', message).replace(cfg.token, message);
            msg.channel.send(`\`\`\`js\n${evaled.replace(cfg.token, message)}\`\`\``);
        } catch (error) {
            msg.channel.send('```js\n' + error + '```');
        };
    }
};
