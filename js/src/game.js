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

            smallLolo = new BlueBall.Entity(game, 2, 12, 'smallLolo', 10);
            smallLolo.gid = 99;
            smallLolo.map = map;
            smallLolo.entities = entities;
            smallLolo.collideIndexes.push(1, 2);
            smallLolo.pushIndexes.push(29);
            entities.add(smallLolo);

            smallLolo.animations.add('Top', Phaser.Animation.generateFrameNames('loloTop', 0, 4, '', 4), 5, true);
            smallLolo.animations.add('Right', Phaser.Animation.generateFrameNames('loloRight', 0, 4, '', 4), 5, true);
            smallLolo.animations.add('Down', Phaser.Animation.generateFrameNames('loloDown', 0, 4, '', 4), 5, true);
            smallLolo.animations.add('Left', Phaser.Animation.generateFrameNames('loloLeft', 0, 4, '', 4), 5, true);

            smallLolo.scale.set(32 / 17);

            var block = new BlueBall.Entity(game, 6, 12, 'tileSprites', 0);
            block.gid = 29;
            block.map = map;
            block.entities = entities;
            block.collideIndexes.push(1, 2);
            entities.add(block);

            layers.bringToTop(entities);

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