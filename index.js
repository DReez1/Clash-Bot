const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const yt = require('ytdl-core');


var opus = require('opusscript');

//client.on

client.on("ready", () => {

  console.log(`Klar til at hjælpe!`);

  client.user.setActivity(`C!Help`);
});

client.on("guildCreate", guild => {

  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {

  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildMemberAdd', member => {
    let channel = member.guild.channels.find('name', '🍩velkommen🍩');
    let memberavatar = member.user.avatarURL
        if (!channel) return;
        let embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setThumbnail(memberavatar)
        .addField(':bust_in_silhouette: | name : ', `${member}`)
        .addField(':microphone2: | Velkommen!', `Velkommen til Store_D! Det er en server hvor man chatter, snakker og hygger sig. Vi ses! :D, ${member}`)
        .addField(':id: | User :', "**[" + `${member.id}` + "]**")
        .addField(':family_mwgb: | Du er nummer', `${member.guild.memberCount} på serveren`)
        .addField("Navn", `<@` + `${member.id}` + `>`, true)
        .addField('Server', `${member.guild.name}`, true )
        .setFooter(`**${member.guild.name}**`)
        .setTimestamp()

        channel.sendEmbed(embed);
});


client.on("message", async message => {

  if(message.author.bot) return;


  if(message.content.indexOf(config.prefix) !== 0) return;


  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

//Commands

  if(command === "ping") {

    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  //if(command === "help") {
    //return message.reply("Listen over commands: 1. Kick|2. Ban|3. Ping|4. Say|5. Joke|6. Play|7. Add (Linket til sang)|8. Join|  |Alle commands her er til D_Bot. Har du brug for mere hjælp, så skriv D!Help. Der kommer flere og flere commands til, så listen vil følgene blive opdateret. :stuck_out_tongue:");

  }

  if(command === "joke") {
    message.channel.send("2 forpustede skraldemænd har fyraften.– Nu skal jeg hjem og ligge på sofaen med en kold øl, siger den ene. – Jeg vil hjem og flå min kones trusser af, siger den anden.– Orker du det?– Ja, de strammer af helvede til! ")
  }

  if(command === "say") {

    const sayMessage = args.join(" ");

    message.delete().catch(O_o=>{});

    message.channel.send(sayMessage);
  }

  if(command === "kick") {

    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");


    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable)
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");


    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";


    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }

  if(command === "ban") {

    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable)
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "clear") {

    const deleteCount = parseInt(args[0], 10);

    if(!message.member.hasPermission("MANAGE_MESSAGE")) return message.reply("oof");
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");


    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }


if (command === "setgame") {

  client.user.setActivity(args.join(" "));
}

});

//Music Script

let queue = {};

client.on('guildMemberAdd', (member) => {
    let guild = member.guild;
    member.sendMessage("Hi there! This is Bob-Music-Bot. A bot created by D_Reez. To find all of my commands, use *help.");
});

client.on('guildCreate', guild => {
    console.log('New guild added: ${guild.name}, owned by ${guild.owner.user.username}')

});

client.on('message', message => { // ALL commands should go in here.




    if (message.author.bot) return; // Removes the possibility of the bot replying to itself
    if (!message.content.startsWith(config.prefix)) return; // Only lets the bots read messages that start with *


    let command = message.content.split(' ')[0];
    command = command.slice(config.prefix.length);
    console.log(command); // Logs all Commands

    let args = message.content.split(' ').slice(1);


    if (command === 'help') {
        message.channel.sendMessage('__**Music Commands**__ \n ```' + config.prefix + 'join : Join Voice channel of message sender \n' + config.prefix + 'add : Add a valid youtube link to the queue \n' + config.prefix + 'queue : Shows the current queue, up to 15 songs shown. \n' + config.prefix + 'play : Play the music queue if already joined to a voice channel \n' + '' + 'the following commands only function while the play command is running: \n'.toUpperCase() + config.prefix + 'pause : pauses the music \n' + config.prefix + 'resume : "resumes the music \n' + config.prefix + 'skip : skips the playing song \n' + config.prefix + 'time : Shows the playtime of the song.' + 'volume+(+++) : increases volume by 2%/+' + 'volume-(---) : decreases volume by 2%/- \n' + '```')
    }

    if (command === 'play') {

        if (queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with ${config.prefix}add`); //Add some songs if the queue is empty.
        if (!message.guild.voiceConnection) return commands.join(message).then(() => commands.play(message));
        if (queue[message.guild.id].playing) return message.channel.send('Already Playing');
        let dispatcher;
        queue[message.guild.id].playing = true;

        console.log(queue);
        (function play(song) {
            console.log(song);
            if (song === undefined) return message.channel.send('Queue is empty').then(() => {
                queue[message.guild.id].playing = false;
                message.member.voiceChannel.leave();
            });
            message.channel.send(`Playing: **${song.title}** as requested by: **${song.requester}**`);
            dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: config.passes });
            let collector = message.channel.createCollector(m => m);
            collector.on('message', m => {
                if (m.content.startsWith(config.prefix + 'pause')) {
                    message.channel.send('paused').then(() => { dispatcher.pause(); });
                } else if (m.content.startsWith(config.prefix + 'resume')) {
                    message.channel.send('resumed').then(() => { dispatcher.resume(); });
                } else if (m.content.startsWith(config.prefix + 'skip')) {
                    message.channel.send('skipped').then(() => { dispatcher.end(); });
                } else if (m.content.startsWith('volume+')) {
                    if (Math.round(dispatcher.volume * 50) >= 100) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
                    dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (2 * (m.content.split('+').length - 1))) / 50, 2));
                    message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
                } else if (m.content.startsWith('volume-')) {
                    if (Math.round(dispatcher.volume * 50) <= 0) return message.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
                    dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (2 * (m.content.split('-').length - 1))) / 50, 0));
                    message.channel.send(`Volume: ${Math.round(dispatcher.volume * 50)}%`);
                } else if (m.content.startsWith(config.prefix + 'time')) {
                    message.channel.send(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000) / 1000) < 10 ? '0' + Math.floor((dispatcher.time % 60000) / 1000) : Math.floor((dispatcher.time % 60000) / 1000)}`);
                }
            });
            dispatcher.on('end', () => {
                collector.stop();
            });
            dispatcher.on('error', (err) => {
                return message.channel.send('error: ' + err).then(() => {
                    collector.stop();
                    play(queue[message.guild.id].songs.shift());
                });
            });
        })(queue[message.guild.id].songs[0]);
    }

    if (command === 'join') {
        return new Promise((resolve, reject) => {
            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
            voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
        });
    }

    if (command === 'add') {
        let url = message.content.split(' ')[1];
        if (url == '' || url === undefined) return message.channel.send(`You must add a url, or youtube video id after ${config.prefix}add`);
        yt.getInfo(url, (err, info) => {
            if (err) return message.channel.send('Invalid YouTube Link: ' + err);
            if (!queue.hasOwnProperty(message.guild.id)) queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
            queue[message.guild.id].songs.push({ url: url, title: info.title, requester: message.author.username });
            message.channel.send(`added **${info.title}** to the queue`);
        });
    }

    if (command === 'queue') {
        if (queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with ${config.prefix}add`);
        let tosend = [];
        queue[message.guild.id].songs.forEach((song, i) => { tosend.push(`${i + 1}. ${song.title} - Requested by: ${song.requester}`); });
        message.channel.send(`__**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0, 15).join('\n')}\`\`\``);
   }

   if (command === 'about') {
       message.channel.send("Hey im the main discord bot of this server, im made by [Ejer] D_Reez ")
   }






});

client.login(config.token);
