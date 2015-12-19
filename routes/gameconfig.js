/**
 * Created by Abar on 12-Dec-15.
 */
/*
    1 - You
    2 - Ally
    3 - Citizen
    4 - Enemy
    5 - Unknown
    6 - Neutral
*/
function random(a) {
    return Math.floor(Math.random() * a);
}

function planetAtm(type, isData) {
    if(!isData) return "unknown";
    else if(type == "asteroids") return "asteroids";
    else return ["ammonia", "gasgiant", "helium", "methane", "oxygen", "rainbow", "vacuum"][random(7)];
}

var game = {
    planetMetaInfo: function(planet) {
        //console.log(this.buildings[0]);
        if (random(5) <= 2) return planet;
        var player = (!planet.data) ? this.players[random(5) + 1] : this.players[random(6)];
        planet.player = player.name;
        planet.alliance = player.alliance;
        var secret = {};
        if(planet.player == this.players[0].name) {
            secret.cities = random(planet.data.mass * 2) + 1;
            secret.freespace = 12 * secret.cities;
            secret.freepopulation = secret.cities * 6000;
            secret.population = secret.cities * 6000;
            secret.buildings = [];
            var i, max = random(16) + 10, buildings = [11];
            for(i = 0; i < max && secret.freespace > 0 && secret.freepopulation > 0; i++) {
                var r = 12;
                while(((r = random(26)) &&  buildings.indexOf(r) != -1));
                var count = (this.buildings[r].unique) ? -1 : random(7);
                secret.buildings.push({type: r + 1, count: count});
                secret.freespace -= (this.buildings[r].resources.place) ? Math.abs(this.buildings[r].resources.place) : 0;
                secret.freepopulation -= this.buildings[r].resources.population;
                buildings.push(r);
            }
        } else if(planet.data) {
            var i, max = random(26), buildings = [11];
            secret.buildings = [];
            for(i = 0; i < max; i++) {
                var r = 0;
                while((r = random(27)) &&  buildings.indexOf(r) != -1);
                secret.buildings.push({type: r + 1});
                buildings.push(r);
            }
        }
        return {
            id: planet.id,
            x: planet.x,
            y: planet.y,
            type: planet.type,
            player: planet.player,
            alliance: planet.alliance,
            atm: planetAtm(planet.type, planet.data),
            data: (planet.data)? {
                mass: planet.data.mass,
                carbon: planet.data.carbon,
                silicon: planet.data.silicon,
                ore: planet.data.ore,
                bean: planet.data.bean,
                radiation: planet.data.radiation
            } : undefined,
            secret: secret
        }
    },
    resources: ["Углерод", "Кремний", "Руда", "Био", "Радиоактивность", "Энергия", "Иридий", "Наука", "Население", "Территория"],
    players: [
        {name: "The Player",    alliance: 1, rating:  78649, population: 256318},
        {name: "The Neutral",   alliance: 6, rating: 328768, population: 483459},
        {name: "The Unknown",   alliance: 5, rating:  90621, population: 283368},
        {name: "The Enemy",     alliance: 4, rating:  70356, population: 178710},
        {name: "The Citizen",   alliance: 3, rating:  70356, population: 178710},
        {name: "The Ally",      alliance: 2, rating:  57036, population: 233482}
    ],
    buildings: [
        {
            name: "Песчаный карьер",
            duration: 3,
            resources: {
                ore: 300,
                carbon: 250,
                population: 900,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, {
            name: "Нефтяная вышка",
            duration: 3,
            resources: {
                ore: 300,
                silicon: 250,
                population: 900,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, {
            name: "Рудник",
            duration: 3,
            resources: {
                silicon: 300,
                carbon: 250,
                population: 900,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, {
            name: "Таможня",
            duration: 6,
            unique: true,
            resources: {
                ore: 300,
                silicon: 500,
                carbon: 250,
                iridium: 1,
                population: 900,
                place: 1
            },
            requirements: {science: [], buildings: [{num: 12, count: 4}]}
        }, {
            name: "Биржа",
            duration: 12,
            unique: true,
            resources: {
                ore: 300,
                carbon: 250,
                iridium: 1,
                population: 900,
                place: 1
            },
            requirements: {science: [], buildings: [{num: 12, count: 6}, {num: 4, count: 1}]}
        }, {
            name: "Склад",
            duration: 5,
            unique: true,
            resources: {
                ore: 300,
                carbon: 250,
                population: 900,
                place: 1
            },
            requirements: {science: [], buildings: [{num: 12, count: 2}]}
        }, {
            name: "Фабрика",
            duration: 12,
            resources: {
                ore: 300,
                carbon: 250,
                silicon: 2500,
                population: 1500,
                place: 6
            },
            requirements: {science: [], buildings: [{num: 8, count: 1}]}
        }, { // 8
            name: "Завод",
            duration: 25,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 8
            },
            requirements: {science: [], buildings: []}
        }, { // 9
            name: "Лаборатория",
            duration: 10,
            unique: true,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 5
            },
            requirements: {science: [], buildings: [{num: 8, count: 1}]}
        }, { // 10
            name: "Сколько, блин, можно?",
            duration: 3,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                radiation: 15,
                place: 8
            },
            requirements: {science: [], buildings: []}
        }, { // 11
            name: "Еще одно",
            duration: 3,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 8
            },
            requirements: {science: [], buildings: []}
        }, { // 12
            name: "Город",
            duration: 100,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500
            },
            requirements: {science: [], buildings: []}
        }, { // 13
            name: "Резиденция",
            duration: 150,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 8
            },
            requirements: {science: [], buildings: []}
        }, { // 14
            name: "Тушка",
            duration: 150,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 15
            name: "Greenhouse",
            duration: 150,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 16
            name: "Радар",
            duration: 150,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 17
            name: "Казармы",
            duration: 150,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 3
            },
            requirements: {science: [], buildings: []}
        }, { // 18
            name: "Ферма",
            duration: 3,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 19
            name: "Реактор",
            duration: 300,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 20
            name: "Урановые копи",
            duration: 300,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                radiation: 5,
                iridium: 1,
                place: 5
            },
            requirements: {science: [], buildings: []}
        }, { // 21
            name: "Диспечерская",
            duration: 9000,
            unique: true,
            resources: {
                ore: 9001,
                carbon: 9001,
                silicon: 9001,
                population: 1500,
                place: 12
            },
            requirements: {science: [], buildings: []}
        }, { // 22
            name: "Ангар",
            duration: 90,
            unique: true,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 5
            },
            requirements: {science: [], buildings: []}
        }, { // 23
            name: "Центр проектирования",
            duration: 90,
            unique: true,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 24
            name: "Подземная парковка",
            duration: 90,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 25
            name: "Красный вертолетик",
            duration: 90,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 26
            name: "Голубой жирафик",
            duration: 90,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }, { // 27
            name: "Стильные грабли",
            duration: 90,
            resources: {
                ore: 3000,
                carbon: 2500,
                silicon: 2500,
                population: 1500,
                place: 1
            },
            requirements: {science: [], buildings: []}
        }
    ]
};

module.exports = game;