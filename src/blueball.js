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
            var result = [];
            var item;

            for (var i = 0; i < array1.length; i++) {
                item = array1[i];
                if (array2.indexOf(item) > -1) {
                    result.push(item);
                }
            }

            return result;
        },

        'union': function (array1, array2) {
            var result = array1.slice();
            var item;

            for (var i = 0; i < array2.length; i++) {
                item = array2[i];
                if (result.indexOf(item) < 0) {
                    result.push(item);
                }
            }

            return result;
        },

        'getEntitiesFromIndexArray': function (indexArray, entities) {
            var selected = [];

            if (indexArray.length > 0) {
                for (var i = 0; i < entities.length; i++) {
                    if (indexArray.indexOf(entities[i].gid) > -1) {
                        selected.push(entities[i]);
                    }
                }
            }

            return selected;
        },

        'getTilesFromIndexArray': function (indexArray, tiles) {
            var selected = [];

            if (indexArray.length > 0) {
                for (var i = 0; i < tiles.length; i++) {
                    if (indexArray.indexOf(tiles[i].index) > -1) {
                        selected.push(tiles[i]);
                    }
                }
            }

            return selected;
        },

        'getCellPosition': function (x, y) {
            return {
                "x": (x + 1) * BlueBall.Config.cellSize.width,
                "y": (y + 1) * BlueBall.Config.cellSize.height
            };
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
            var result = [];

            for (var i = 0; i < arguments.length; i++) {
                Array.prototype.push.apply(result, BlueBall.Global.Tiles[arguments[i]]);
            }

            return result;
        },

        'getEntityIds': function () {
            var result = [];

            for (var i = 0; i < arguments.length; i++) {
                result.push(BlueBall.Global.Entities[arguments[i]]);
            }

            return result;
        },

        'destroyEntity': function (entity) {
            entity.destroy(true);
        },

        'openEntity': function (entity) {
            entity.open();
        }

    }

};
