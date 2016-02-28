var BlueBall = {

    'init': function () {
        var game = new Phaser.Game(516, 548, Phaser.AUTO);

        game.state.add('boot', new BlueBall.Boot());
        game.state.add('loader', new BlueBall.Loader());
        game.state.add('menu', new BlueBall.Menu());

        game.state.start('boot');
    },

    'Helper': {

        'intersection': function (array1, array2) {
            return array1.filter(function(item) {
                return array2.indexOf(item) > -1;
            });
        },

        'union': function (array1, array2) {
            return array1.concat(array2.filter(function (item) {
                return array1.indexOf(item) < 0;
            }));
        },

        'getEntitiesFromIndexArray': function (indexArray, entities) {
            if (indexArray.length > 0) {
                return entities.filter(function(entity) {
                    return indexArray.indexOf(entity.gid) > -1;
                });
            } else {
                return [];
            }
        },

        'getTilesFromIndexArray': function (indexArray, tiles) {
            if (indexArray.length > 0) {
                return tiles.filter(function(tile) {
                    return indexArray.indexOf(tile.index) > -1;
                });
            } else {
                return [];
            }
        },

        'getDirectionTo': function (source, target) {
            var distanceX = target.cellPosition.x - source.cellPosition.x;
            var distanceY = target.cellPosition.y - source.cellPosition.y;
            var firstDirection;
            var secondDirection;

            if (Math.abs(distanceX) >= Math.abs(distanceY)) {

                if (distanceX >= 0) {
                    firstDirection = Phaser.Tilemap.EAST;
                } else {
                    firstDirection = Phaser.Tilemap.WEST;
                }

                if (distanceY >= 0) {
                    secondDirection = Phaser.Tilemap.SOUTH;
                } else {
                    secondDirection = Phaser.Tilemap.NORTH;
                }

            } else {

                if (distanceY >= 0) {
                    firstDirection = Phaser.Tilemap.SOUTH;
                } else {
                    firstDirection = Phaser.Tilemap.NORTH;
                }

                if (distanceX >= 0) {
                    secondDirection = Phaser.Tilemap.EAST;
                } else {
                    secondDirection = Phaser.Tilemap.WEST;
                }

            }

            return {
                'principal': firstDirection,
                'secondary': secondDirection
            };
        },

        'getTileIds': function () {
            return Array.prototype.reduce.call(arguments, function(accumulated, value) {
                Array.prototype.push.apply(accumulated, BlueBall.Global.Tiles[value]);
                return accumulated;
            }, []);
        },

        'getEntityIds': function () {
            return Array.prototype.map.call(arguments, function(value) {
                return BlueBall.Global.Entities[value];
            });
        },

        'destroyEntity': function (entity) {
            entity.destroy(true);
        },

        'openEntity': function (entity) {
            entity.open();
        }

    }

};
