const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content.startsWith('!gb ')) {
        if (!(message.author.dmChannel)) {
            message.author.createDM();
        }
        client.guilds.cache.forEach(server => {
            if (server.member(message.author).roles.highest.permissions.any(['ADMINISTRATOR', 'BAN_MEMBERS'])) {
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
                        })
                        .catch(err => {
                            message.author.send(`I was unable to ban the member from ${server.name}, make sure I have the correct role permissions.`);
                            console.error(err);
                        });    
                    }
                } else {
                    message.author.send('You didn\'t @mention the user to ban.');
                }
            }
        });
    }
    else if (message.content.startsWith('!gk ')) {
        if (!(message.author.dmChannel)) {
            message.author.createDM();
        }
        client.guilds.cache.forEach(server => {
            if (server.member(message.author).roles.highest.permissions.any(['ADMINISTRATOR', 'KICK_MEMBERS'])) {
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
                        })
                        .catch(err => {
                            message.author.send(`I was unable to kick the member from ${server.name}, make sure I have the correct role permissions.`);
                            console.error(err);
                        });    
                    }
                } else {
                    message.author.send('You didn\'t @mention the user to kick.');
                }
            }
        });
    }
});

client.login(config.token);
