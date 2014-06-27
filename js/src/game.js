/*global jQuery, Phaser, BlueBall */

jQuery(function () {

    var game,
        cursors,
        smallLolo;

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameLayer', {

        'preload': function () {

            game.load.image('AdventuresOfLolo3', 'assets/tilemaps/tiles/AdventuresOfLolo3.png');
            game.load.tilemap('blank', 'assets/tilemaps/maps/blank.json', null, Phaser.Tilemap.TILED_JSON);

            game.load.atlas('smallLolo', 'assets/sprites/smallLolo.png', 'assets/sprites/smallLolo.json');

        },

        'create': function () {

            var map = game.add.tilemap('blank'),
                layers = game.add.group(),
                players = game.add.group(layers);

            players.classType = BlueBall.Entity;

            layers.x = 50;
            layers.y = 50;

            map.addTilesetImage('AdventuresOfLolo3', 'AdventuresOfLolo3');

            map.createLayer('environment', undefined, undefined, layers);

            cursors = game.input.keyboard.createCursorKeys();

            smallLolo = players.create(1, 6, 'smallLolo', 10);
            smallLolo.animations.add('Top', Phaser.Animation.generateFrameNames('loloTop', 0, 4, '', 4), 5, true);
            smallLolo.animations.add('Right', Phaser.Animation.generateFrameNames('loloRight', 0, 4, '', 4), 5, true);
            smallLolo.animations.add('Down', Phaser.Animation.generateFrameNames('loloDown', 0, 4, '', 4), 5, true);
            smallLolo.animations.add('Left', Phaser.Animation.generateFrameNames('loloLeft', 0, 4, '', 4), 5, true);

            smallLolo.scale.set(32 / 17);

            layers.bringToTop(players);

        },

        'update': function () {

            if (cursors.up.isDown) {

                smallLolo.animations.play('Top');
                smallLolo.moveTo(Phaser.Tilemap.NORTH);

            } else if (cursors.right.isDown) {

                smallLolo.animations.play('Right');
                smallLolo.moveTo(Phaser.Tilemap.EAST);

            } else if (cursors.down.isDown) {

                smallLolo.animations.play('Down');
                smallLolo.moveTo(Phaser.Tilemap.SOUTH);

            } else if (cursors.left.isDown) {

                smallLolo.animations.play('Left');
                smallLolo.moveTo(Phaser.Tilemap.WEST);

            } else {

                smallLolo.animations.stop();
                smallLolo.frame = 10;

            }

        }

    });

});