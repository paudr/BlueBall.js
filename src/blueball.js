/*global Phaser */
/*exported BlueBall */

var BlueBall = {

    'init': function() {

        var game = new Phaser.Game(516, 548, Phaser.AUTO);

        game.state.add('boot', new BlueBall.Loader());
        game.state.add('level1-1', new BlueBall.Level('level1-1'));
        game.state.add('level1-2', new BlueBall.Level('level1-2'));
        game.state.add('level1-3', new BlueBall.Level('level1-3'));
        game.state.add('level1-4', new BlueBall.Level('level1-4'));
        game.state.add('level1-5', new BlueBall.Level('level1-5'));

        game.state.start('boot');

    },

    'Helper': {

        'intersection': function (array1, array2) {

            var result = [],
                i,
                length,
                item;

            for (i = 0, length = array1.length; i < length; i++) {

                item = array1[i];

                if (array2.indexOf(item) > -1) {

                    result.push(item);

                }

            }

            return result;

        },

        'union': function (array1, array2) {

            var result = array1.slice(),
                i,
                length,
                item;

            for (i = 0, length = array2.length; i < length; i++) {

                item = array2[i];

                if (result.indexOf(item) < 0) {

                    result.push(item);

                }

            }

            return result;

        }

    }

};