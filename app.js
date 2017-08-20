var d2gsi = require('dota2-gsi');
var server = new d2gsi();
var request = require('request');

var url = 'steven automation url'

server.events.on('newclient', function(client) {
    console.log("New client connection, IP address: " + client.ip + ", Auth token: " + client.auth);
    request(url+'lights/chill', function (error, response, body) {});

    client.on('player:activity', function(activity) {
        console.log("My activity" + activity);
        request(url+'party', function (error, response, body) {
                request(url+'lights/chill', function (error, response, body) {});
        });
    });
    client.on('hero:level', function(level) {
        console.log("Current hero level: " + level);
        request(url+'lights/with_level_up', function (error, response, body) {
                request(url+'lights/chill', function (error, response, body) {});
        });
    });
    client.on('player:kills', function(kills) {
        console.log("Current hero kills: " + kills);

        request(url+'lights/kitty', function (error, response, body) {
                request('https://56cd5017.ngrok.io/lights/chill', function (error, response, body) {});
        });
    });
    client.on('hero:alive', function(alive) {
         if (alive){
            console.log("I am alive: " + alive);
            request(url+'lights/blue_raspberry', function (error, response, body) {
                    request(url+'lights/chill', function (error, response, body) {});
            });
         }else{
            console.log("I am dead: " + alive);
            request(url+'lights/dota', function (error, response, body) {
                    request(url+'lights/chill', function (error, response, body) {});
            });
         }
    });
    // client.on('abilities:ability0:can_cast', function(can_cast) {
    //     if (can_cast) console.log("Ability0 off cooldown!");
    // });
    client.on('abilities:ability3:can_cast', function(can_cast) {
        if (can_cast){
            console.log('Ultimate is ready to go!')
            request(url+'lights/blaze', function (error, response, body) {
                    request(url+'lights/chill', function (error, response, body) {});
            });
        }
    });
});