/*global jQuery, Phaser, BlueBall */

jQuery(function () {

    var game;

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameLayer', {

        'preload': function () {

            game.load.image('AdventuresOfLolo3', 'assets/tilemaps/tiles/AdventuresOfLolo3.png');
            game.load.tilemap('blank', 'assets/tilemaps/maps/blank.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap('level1-1', 'assets/tilemaps/maps/level1-1.json', null, Phaser.Tilemap.TILED_JSON);

            game.load.atlas('smallLolo', 'assets/sprites/smallLolo.png', 'assets/sprites/smallLolo.json');
            game.load.atlas('tileSprites', 'assets/tilemaps/tiles/AdventuresOfLolo3.png', 'assets/sprites/tileSprites.json');
            game.load.atlas('chestSprites', 'assets/sprites/chestSprites.png', 'assets/sprites/chestSprites.json');

        },

        'create': function () {

            var map = game.add.tilemap('level1-1'),
                layers = game.add.group(),
                entities = game.add.group(layers);

            layers.x = 50;
            layers.y = 50;

            map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

            map.createLayer('environment', undefined, undefined, layers);

            map.createFromObjects('entities', 117, 'chestSprites', 0, true, false, entities, BlueBall.Chest, false);
            map.createFromObjects('entities', 30, 'tileSprites', 0, true, false, entities, BlueBall.Heart, false);
            map.createFromObjects('entities', 99, 'smallLolo', 10, true, false, entities, BlueBall.Lolo, false);

            entities.forEach(function(entity) {
                entity.map = map;
                entity.entities = entities;
            });

            layers.bringToTop(entities);

        },

        'update': function () {
        }

    });

});