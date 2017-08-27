var d2gsi = require('dota2-gsi');
var server = new d2gsi();
var request = require('request');

var url = 'https://56cd5017.ngrok.io/'
var live_health_mana_server = 'http://192.168.0.110/'

var last_health = 0;
var last_mana = 0;

var skill1_passive = false;
var skill2_passive = false;
var skill3_passive = false;
var skill4_passive = false;

var day_needs_checking = false;

base_scene = 'chill'
if(process.argv[2]){
    base_scene = process.argv[2];
}
server.events.on('newclient', function(client) {
    console.log("Dota detected, begin full experience...");
    request(url+'lights/'+base_scene, function (error, response, body) {});

    client.on('player:activity', function(activity) {
        console.log("My activity: " + activity);
        request(url+'party', function (error, response, body) {
                request(url+'lights/'+base_scene, function (error, response, body) {});
                request(live_health_mana_server+'game_start', function (error, response, body) {});
        });
        if(activity == 'playing' && client.gamestate.player.gpm == 0){
            console.log('Starting new game!')
            var skill1_passive = false;
            var skill2_passive = false;
            var skill3_passive = false;
            var skill4_passive = false;
        }
    });
    client.on('player:kill_streak', function(kill_streak) {
        console.log("Current kill_streak: " + kill_streak);
        // request(url+'party', function (error, response, body) {
        //         request(url+'lights/'+base_scene, function (error, response, body) {});
        // });
    });
    client.on('player:gpm', function(gpm) {
        // console.log("Current gpm: " + gpm);
        // request(url+'party', function (error, response, body) {
        //         request(url+'lights/'+base_scene, function (error, response, body) {});
        // });
    });
    client.on('player:xpm', function(xpm) {
        // console.log("Current xpm: " + xpm);
        // request(url+'party', function (error, response, body) {
        //         request(url+'lights/'+base_scene, function (error, response, body) {});
        // });
    });
    check_day = function(){
        if(day_needs_checking){
            if(client.gamestate.map.daytime){
                request(live_health_mana_server+'day', function (error, response, body) {});
                day_needs_checking = false;
            }else{
                request(live_health_mana_server+'night', function (error, response, body) {});
                day_needs_checking = false;
            }
        }
    };
    client.on('hero:silenced', function(effect) {
        if(effect){
            request(live_health_mana_server+'effect?r=100&g=1&b=160', function (error, response, body) {});
            day_needs_checking = true;
        }else{
            check_day();
        }
    });
    client.on('hero:muted', function(effect) {
        console.log("Hero muted: " + effect); //make this purple
        if(!client.gamestate.hero.hexed){
            if(effect){
                request(live_health_mana_server+'effect?r=100&g=1&b=160', function (error, response, body) {});
                day_needs_checking = true;
            }else{
                check_day();
            }
        }
    });
    client.on('hero:stunned', function(effect) {
        console.log("Hero stunned: " + effect); //make this red
        if(effect){
            request(live_health_mana_server+'effect?r=224&g=0&b=0', function (error, response, body) {});
            day_needs_checking = true;
        }else{
            check_day();
        }
    });
    client.on('hero:disarmed', function(effect) {
        console.log("Hero disarmed: " + effect); //make this orange
        if(!client.gamestate.hero.hexed){
            if(effect){
                request(live_health_mana_server+'effect?r=162&g=0&b=100', function (error, response, body) {});
                day_needs_checking = true;
            }else{
                check_day();
            }
        }
    });
    client.on('hero:break', function(effect) {
        console.log("Hero break: " + effect); //make this orange
        if(effect){
            request(live_health_mana_server+'effect?r=162&g=0&b=100', function (error, response, body) {});
            day_needs_checking = true;
        }else{
            check_day();
        }
    });
    client.on('hero:hexed', function(effect) {
        console.log("Hero hexed: " + effect); //make this red
        if(effect){
            request(live_health_mana_server+'effect?r=224&g=0&b=0', function (error, response, body) {});
            day_needs_checking = true;
        }else{
            check_day();
        }
    });
    client.on('hero:magicimmune', function(effect) {
        console.log("Hero magicimmune: " + effect); //make this red
        if(effect){
            request(live_health_mana_server+'effect?r=4&g=217&b=224', function (error, response, body) {});
            day_needs_checking = true;
        }else{
            check_day();
        }
    });
    client.on('map:win_team', function(win_team) {
        console.log("Winning Team: " + win_team);
        request(url+'party', function (error, response, body) {
                request(url+'lights/'+base_scene, function (error, response, body) {});
        });
        request(live_health_mana_server+'health/' + (Math.round(client.gamestate.player.gpm / 100) * 10), function (error, response, body) {
        request(live_health_mana_server+'mana/' + (Math.round(client.gamestate.player.xpm / 100) * 10), function (error, response, body) {
    });
    client.on('map:daytime', function(day) {
        console.log("Is it day?: " + day);
        if(day){
            request(live_health_mana_server+'day', function (error, response, body) {});
        }else{
            request(live_health_mana_server+'night', function (error, response, body) {});
        }
    });
    client.on('map:nightstalker_night', function(day) {
        console.log("Is it ns night?: " + day);
        if(!day){
            request(live_health_mana_server+'day', function (error, response, body) {});
        }else{
            request(live_health_mana_server+'night', function (error, response, body) {});
        }
    });
    client.on('hero:level', function(level) {
        console.log("Current hero level: " + level);
        request(url+'lights/with_level_up', function (error, response, body) {
                request(url+'lights/'+base_scene, function (error, response, body) {});
        });
    });
    client.on('player:kills', function(kills) {
        console.log("Current hero kills: " + kills);

        request(url+'lights/kitty', function (error, response, body) {
                request('https://56cd5017.ngrok.io/lights/'+base_scene, function (error, response, body) {});
        });
    });
    client.on('hero:alive', function(alive) {
        console.log("Am I alive: " + alive);
         if (alive){
            request(url+'lights/blue_raspberry', function (error, response, body) {
                    request(url+'lights/'+base_scene, function (error, response, body) {});
            });
         }else{
            request(url+'lights/dota', function (error, response, body) {
                    request(url+'lights/'+base_scene, function (error, response, body) {});
            });
         }
    });
    client.on('hero:mana_percent', function(mana) {
        if ((mana > last_mana + 10) || (mana < last_mana - 10)){
           last_mana = mana
            console.log('My mana is: ' + mana)
            request(live_health_mana_server+'mana/' + (Math.round(mana / 10) * 10), function (error, response, body) {
            });
            console.log('Passed to server: ' + live_health_mana_server+'mana/' + (Math.round(mana / 10) * 10))
        }
    });
    client.on('hero:health_percent', function(health) {
         if ((health > last_health + 10) || (health < last_health - 10)){
            last_health = health
            console.log('My health is: ' + health)
            request(live_health_mana_server+'health/' + (Math.round(health / 10) * 10), function (error, response, body) {
            });
            console.log('Passed to server: ' + live_health_mana_server+'health/' + (Math.round(health / 10) * 10))
         }
    });
    client.on('abilities:ability0:passive', function(passive) {
        if (passive){
            skill1_passive = true;
            console.log('skill 1 passive')
            request(live_health_mana_server+'skill/1/on', function (error, response, body) {
            });
        }else{
            skill1_passive = false;
        }
    });
    client.on('abilities:ability0:can_cast', function(can_cast) {
        if(skill1_passive != true){
            if (can_cast){
                console.log('q is ready to go!')
                request(live_health_mana_server+'skill/1/on', function (error, response, body) {
                });
            }else{
                request(live_health_mana_server+'skill/1/off', function (error, response, body) {
                });
            }
        }
    });
    client.on('abilities:ability1:passive', function(passive) {
        if (passive){
            skill2_passive = true;
            console.log('skill 2 passive')
            request(live_health_mana_server+'skill/2/on', function (error, response, body) {
            });
        }else{
            skill2_passive = false;
        }
    });
    client.on('abilities:ability1:can_cast', function(can_cast) {
        if(skill2_passive != true){
            if (can_cast){
                console.log('w is ready to go!')
                request(live_health_mana_server+'skill/2/on', function (error, response, body) {
                });
            }else{
                request(live_health_mana_server+'skill/2/off', function (error, response, body) {
                });
            }
        }
    });
    client.on('abilities:ability2:passive', function(passive) {
        if (passive){
            console.log('skill 3 passive')
            skill3_passive = true;
            request(live_health_mana_server+'skill/3/on', function (error, response, body) {
            });
        }else{
            skill3_passive = false;
        }
    });
    client.on('abilities:ability2:can_cast', function(can_cast) {
        if(skill3_passive != true){
            if (can_cast){
                console.log('e is ready to go!')
                request(live_health_mana_server+'skill/3/on', function (error, response, body) {
                });
            }else{
                request(live_health_mana_server+'skill/3/off', function (error, response, body) {
                });
            }
        }
    });
    client.on('abilities:ability3:passive', function(passive) {
        if (passive){
            skill4_passive = true;
            console.log('Ultimate is passive!')
            request(live_health_mana_server+'skill/4/on', function (error, response, body) {
            });
        }else{
            skill4_passive = false;
        }
    });
    client.on('abilities:ability3:can_cast', function(can_cast) {
        if(skill4_passive != true){
            if (can_cast){
                console.log('Ultimate is ready to go!')
                request(live_health_mana_server+'skill/4/on', function (error, response, body) {
                });
            }else{
                request(live_health_mana_server+'skill/4/off', function (error, response, body) {
                });
            }
        }
    });
});