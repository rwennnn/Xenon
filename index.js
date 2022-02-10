const { Client, Intents, Permissions } = require("discord.js");
const db = require("quick.db");
const cfg = require("./config.json");
const util = require("util");
const fs = require("fs");
const client =
new Client({ allowedMentions: { 
    parse: [
        'users',
        'roles'
    ] 
},
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES
    ]
});

client.Commands = new Map();
client.Aliases = new Map();

fs.readdir('./Commands/', (err, files, komutlar = []) => {
    if (err) return console.err(err.message);
    console.warn('Komutlar yükleniyor.');
    console.warn('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');
    console.log(files.length + ' komut yüklenecek.');
    files.filter(file => file.endsWith('.js')).forEach(f => {
        let prop = require(`./Commands/${f}`);
        if (!prop.command || !prop.command.name || !prop.command.onCommand) return console.warn(f + ' klasöründe komutu çalıştıracak bir isim ya da fonksiyon olmadığı için komut yüklenemedi.');
        client.Commands.set(prop.command.name, prop);
        prop.command.alias.forEach(a => {
            client.Aliases.set(a, prop.command.name);
        });
    });
    for (var value of client.Commands.values()) komutlar.push(value.command.name);
    console.log('[  \n  ' + komutlar.join(', ') + '\n]\n' + ' isimli komut(lar) yüklendi.');
    console.warn('▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬');
});

client.on('ready', () =>  {
    client.user.setStatus('idle');
    console.log(
        client.user.username +
        ' adlı isimle ' +
        client.guilds.cache.get(cfg.sunucu).name +
        ' adlı sunucuda ' +
        new Date().toLocaleString('tr-TR', { timeZone: "Asia/Istanbul" })
        + ' tarihinde giriş yaptım.'
    );
});

client.deleteableMessage = function (message, channel, time) {
    channel.send(message).then(m => setTimeout(() => m.delete().catch(() => { }), time*1000));
};

client.sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

client.embed = function (channel, object, time) {
    if (time) channel.send(object).then(embed => setTimeout(() => embed.delete(), 1000*time));
    else channel.send(object);
};

client.clean = (text) => {
    if (typeof text !== 'string') text = util.inspect(text, { depth: 0 });
    text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    return text;
};

client.favoriRenkler = ['#1f0524', '#0b0067', '#4a0038', '#07052a', '#FFDF00', '#00FFFF', '#0091CC', '#0047AB', '#384B77', '#ffffff', '#000000', '#04031a', '#f9ffba'];

client.on("messageCreate", (msg) => {
    if (msg.author.bot || msg.channel.type === "dm" || !cfg.owners.some(x => msg.author.id === x)) return;
    const prefMention = new RegExp(`^<@!?${client.user.id}> `);
    const prefix = msg.content.match(prefMention) ? msg.content.match(prefMention)[0] : cfg.prefix.toLowerCase();
    if (!msg.content.startsWith(prefix)) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let cmd;
    if (client.Commands.has(command)) {
        cmd = client.Commands.get(command);
    } else if (client.Aliases.has(command)) {
        cmd = client.Commands.get(client.Aliases.get(command));
    };
    if (cmd) {
        try {
          cmd.command.onCommand({ client: client, msg: msg, args: args, db: db, cfg: cfg, Permissions });
        } catch (e) { 
            msg.channel.send(`**${msg.content} komutunda bir hata**:\n \`${e.message}\``);
        };
    };
});

process.on('uncaughtException', e => console.log(e.message));
process.on('unhandledRejection', r => console.log(r.toString()));
process.on('exit', () => console.log(new Date().toLocaleDateString("tr-TR", { timeZone: "Asia/Istanbul"}) + " bot bağlantısı kesildi." ));

client.login(cfg.token);
