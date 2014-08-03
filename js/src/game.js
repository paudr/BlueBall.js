/*global jQuery, Phaser, BlueBall */

jQuery(function () {

    var game;
    game = new Phaser.Game(516, 548, Phaser.AUTO);

    game.state.add('boot', new BlueBall.Boot());
    game.state.add('level1-1', new BlueBall.Level('level1-1'));
    game.state.add('level1-2', new BlueBall.Level('level1-2'));
    game.state.add('level1-3', new BlueBall.Level('level1-3'));

    game.state.start('boot');

});