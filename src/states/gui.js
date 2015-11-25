/*global Phaser, BlueBall */

BlueBall.Gui = function(level) {

    this.game = level.game;
    this.level = level;

    this.eggCounterImage = this.game.add.sprite(420, 128, 'eggSprites', 1, this.level.layers);
    this.eggCounterImage.scale.set(2);

    this.eggCounterText = this.game.add.text(426, 156, '0', {
        'font': '32px Arial',
        'fill': '#ffffff',
        'align': 'center'
    }, this.level.layers);
    this.eggCounterText.setShadow(2, 0, '#666666');

};

BlueBall.Gui.prototype = Object.create(null);

BlueBall.Gui.prototype.setEggCount = function(count) {

    this.eggCounterText.text = count.toString();

};