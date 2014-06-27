/*global jQuery, Phaser */

jQuery(function () {

    var game;

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameLayer', {

        'preload': function () {

            game.load.image('AdventuresOfLolo3', 'assets/tilemaps/tiles/AdventuresOfLolo3.png');
            game.load.tilemap('blank', 'assets/tilemaps/maps/blank.json', null, Phaser.Tilemap.TILED_JSON);

        },

        'create': function () {

            var map = game.add.tilemap('blank'),
                layers = game.add.group();

            layers.x = 50;
            layers.y = 50;

            map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

            map.createLayer('environment', undefined, undefined, layers);

        },

        'update': function () {}

    });

});