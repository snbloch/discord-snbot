const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

let configuredServers = [];
config.servers.forEach(server => {
    configuredServers.push(server.id);
});

client.once('ready', () => {
    client.guilds.cache.forEach(server => {
        console.log(`Connected to server ${server.name} with id ${server.id}`);
    });
    console.log('Ready!');
});

client.on('message', message => {
    if (!message || !message.content || !message.author || !message.guild) {
        return;
    }
    if (message.content.startsWith('!gb ')) {
        client.guilds.cache.forEach(server => {
            if (server.member(message.author).permissions.any(['ADMINISTRATOR', 'BAN_MEMBERS'])) {
                if (configuredServers.indexOf(message.guild.id) != -1) {
                    let serverConfig = {};
                    for (let i = 0; i < config.servers.length; i++) {
                        if (config.servers[i].id === message.guild.id) {
                            serverConfig.id = config.servers[i].id;
                            serverConfig.alias = config.servers[i].alias;
                            serverConfig.globalBanReply = config.servers[i].globalBanReply;
                            break;
                        }
                    }
                }
                user = message.mentions.users.first();
                if (user) {
                    member = server.member(user);
                    if (member) {
                        member.ban({
                            days: 1,
                            reason: `Global ban requested by ${message.author.tag}`
                        })
                        .then(() => {
                            message.author.send(`Successfully banned ${user.tag} from ${server.name}`);
                            console.log(`Banned ${user.tag} from ${server.name} at the request of ${message.author.tag}`);
                            if (serverConfig.globalBanReply) {
                                message.reply(serverConfig.globalBanReply);
                            }
                        })
                        .catch(err => {
                            message.author.send(`I was unable to ban the member from ${server.name}, make sure I have the correct role permissions.`);
                            console.error(err);
                        });    
                    } else {
                        console.log(`${user} is not a member of server ${server.name}`);
                    }
                } else {
                    message.author.send(`You didn't @mention the user to ban.`);
                }
            } else {
                console.log(`${message.author.tag} does not have permission to ban members on server ${server.name}`);
            }
        });
    }
    else if (message.content.startsWith('!gk ')) {
        client.guilds.cache.forEach(server => {
            if (server.member(message.author).permissions.any(['ADMINISTRATOR', 'KICK_MEMBERS'])) {
                if (configuredServers.indexOf(message.guild.id) != -1) {
                    let serverConfig = {};
                    for (let i = 0; i < config.servers.length; i++) {
                        if (config.servers[i].id === message.guild.id) {
                            serverConfig.id = config.servers[i].id;
                            serverConfig.alias = config.servers[i].alias;
                            serverConfig.globalKickReply = config.servers[i].globalKickReply;
                            break;
                        }
                    }
                }
                user = message.mentions.users.first();
                if (user) {
                    member = server.member(user);
                    if (member) {
                        member.kick({
                            reason: `Global kick requested by ${message.author.tag}`
                        })
                        .then(() => {
                            message.author.send(`Successfully kicked ${user.tag} from ${server.name}`);
                            console.log(`Kicked ${user.tag} from ${server.name} at the request of ${message.author.tag}`);
                            if (serverConfig.globalKickReply) {
                                message.reply(serverConfig.globalKickReply);
                            }
                        })
                        .catch(err => {
                            message.author.send(`I was unable to kick the member from ${server.name}, make sure I have the correct role permissions.`);
                            console.error(err);
                        });    
                    } else {
                        console.log(`${user} is not a member of server ${server.name}`);
                    }
                } else {
                    message.author.send(`You didn't @mention the user to kick.`);
                }
            } else {
                console.log(`${message.author.tag} does not have permission to ban members on server ${server.name}`);
            }
        });
    }
    else if (configuredServers.indexOf(message.guild.id) != -1) {
        let serverConfig = {};
        for (let i = 0; i < config.servers.length; i++) {
            if (config.servers[i].id === message.guild.id) {
                serverConfig.id = config.servers[i].id;
                serverConfig.alias = config.servers[i].alias;
                serverConfig.autoReactEnabled = config.servers[i].autoReactEnabled;
                serverConfig.autoReactPercentage = config.servers[i].autoReactPercentage;
                serverConfig.autoReactChannels = config.servers[i].autoReactChannels;
                serverConfig.autoReactEmojis = config.servers[i].autoReactEmojis;
                break;
            }
        }
        if (serverConfig.autoReactEnabled && serverConfig.autoReactPercentage && serverConfig.autoReactChannels && (serverConfig.autoReactChannels.indexOf(message.channel.name) != -1) && serverConfig.autoReactEmojis) {
            if (Math.floor(Math.random() * 100) < serverConfig.autoReactPercentage) {
                let emojis = [];
                message.guild.emojis.cache.forEach(emoji => {
                    if (serverConfig.autoReactEmojis.indexOf(emoji.name) != -1) {
                        emojis.push(emoji);
                    }
                });
                let emoji = emojis[Math.floor(Math.random() * emojis.length)];
                message.react(emoji)
                .then(() => {
                    console.log(`Reacted to message ${message.id} with emoji ${emoji.name}`);
                })
                .catch(err => {
                    console.error(err);
                });
            }
        }
    }
});

client.login(config.token);
