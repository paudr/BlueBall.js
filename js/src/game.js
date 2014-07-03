/*global jQuery, Phaser, BlueBall */

jQuery(function () {

    var game;
    game = new Phaser.Game(800, 600, Phaser.AUTO);

    game.state.add('boot', new BlueBall.Boot());
    game.state.add('level_1_1', new BlueBall.Level('level1-1'));

    game.state.start('boot');

});