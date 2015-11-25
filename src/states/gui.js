/*global Phaser, BlueBall */

BlueBall.Gui = function(level) {

    this.game = level.game;
    this.level = level;

    this.eggCounterImage = this.game.add.sprite(420, 128, 'eggSprites', "shootHorizontal", this.level.layers);
    this.eggCounterImage.scale.set(2);

    this.eggCounterText = this.game.add.text(426, 156, '0', {
        'font': '32px Arial',
        'fill': '#ffffff',
        'align': 'center'
    }, this.level.layers);
    this.eggCounterText.setShadow(2, 0, '#666666');

    this.powerArrowImage = this.game.add.sprite(420, 288, 'tileSprites', 'powerArrow', this.level.layers);
    this.powerBridgeImage = this.game.add.sprite(420, 320, 'tileSprites', 'powerBridge', this.level.layers);
    this.powerHammerImage = this.game.add.sprite(420, 352, 'tileSprites', 'powerHammer', this.level.layers);
    this.setCurrentPower();

};

BlueBall.Gui.prototype = Object.create(null);

BlueBall.Gui.prototype.setEggCount = function(count) {

    this.eggCounterText.text = count.toString();

};

BlueBall.Gui.prototype.setCurrentPower = function(power) {

    this.powerArrowImage.visible = false;
    this.powerBridgeImage.visible = false;
    this.powerHammerImage.visible = false;

    switch (power) {
        case 'arrow':
            this.powerArrowImage.visible = true;
            break;
        case 'bridge':
            this.powerBridgeImage.visible = true;
            break;
        case 'hammer':
            this.powerHammerImage.visible = true;
            break;
    }

};