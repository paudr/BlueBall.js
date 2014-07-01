/*global jQuery, Phaser, BlueBall */

jQuery(function () {

    var game,
        cursors,
        smallLolo;

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameLayer', {

        'preload': function () {

            game.load.image('AdventuresOfLolo3', 'assets/tilemaps/tiles/AdventuresOfLolo3.png');
            game.load.tilemap('blank', 'assets/tilemaps/maps/blank.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap('level1-1', 'assets/tilemaps/maps/level1-1.json', null, Phaser.Tilemap.TILED_JSON);

            game.load.atlas('smallLolo', 'assets/sprites/smallLolo.png', 'assets/sprites/smallLolo.json');
            game.load.atlas('tileSprites', 'assets/tilemaps/tiles/AdventuresOfLolo3.png', 'assets/sprites/tileSprites.json');

        },

        'create': function () {

            var map = game.add.tilemap('level1-1'),
                layers = game.add.group(),
                entities = game.add.group(layers);

            layers.x = 50;
            layers.y = 50;

            map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

            map.createLayer('environment', undefined, undefined, layers);

            cursors = game.input.keyboard.createCursorKeys();

            smallLolo = new BlueBall.Lolo(game, 2, 12, 'smallLolo', 10);
            smallLolo.map = map;
            smallLolo.entities = entities;
            entities.add(smallLolo);

            var block = new BlueBall.Block(game, 6, 12, 'tileSprites', 0);
            block.map = map;
            block.entities = entities;
            entities.add(block);

            layers.bringToTop(entities);

        },

        'update': function () {
        }

    });

});