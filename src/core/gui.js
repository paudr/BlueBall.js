BlueBall.Gui = function (level) {
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

    this.powerArrowImage.visible = false;
    this.powerBridgeImage.visible = false;
    this.powerHammerImage.visible = false;

    this.powerArrowEmptyImage = this.game.add.sprite(420, 288, 'tileSprites', 'powerEmpty', this.level.layers);
    this.powerBridgeEmptyImage = this.game.add.sprite(420, 320, 'tileSprites', 'powerEmpty', this.level.layers);
    this.powerHammerEmptyImage = this.game.add.sprite(420, 352, 'tileSprites', 'powerEmpty', this.level.layers);

    this.powerArrowEmptyImage.visible = false;
    this.powerBridgeEmptyImage.visible = false;
    this.powerHammerEmptyImage.visible = false;

    this.showAvailablePowers();
};

BlueBall.Gui.prototype = Object.create(null);
BlueBall.Gui.prototype.constructor = BlueBall.Gui;

BlueBall.Gui.prototype.setEggCount = function (count) {
    this.eggCounterText.text = count.toString();
};

BlueBall.Gui.prototype.setPower = function (power, status) {
    var sprite;
    var empty;

    switch (power) {
    case 'arrow':
        sprite = this.powerArrowImage;
        empty = this.powerArrowEmptyImage;
        break;
    case 'bridge':
        sprite = this.powerBridgeImage;
        empty = this.powerBridgeEmptyImage;
        break;
    case 'hammer':
        sprite = this.powerHammerImage;
        empty = this.powerHammerEmptyImage;
        break;
    }

    switch (status) {
    case 'available':
        sprite.visible = true;
        sprite.alpha = 1;
        empty.visible = false;
        break;
    case 'unavailable':
        sprite.visible = true;
        sprite.alpha = 0.5;
        empty.visible = false;
        break;
    case 'empty':
        sprite.visible = false;
        empty.visible = true;
        break;
    case 'hidden':
        sprite.visible = false;
        empty.visible = false;
        break;
    }
};

BlueBall.Gui.prototype.showAvailablePowers = function () {
    if (this.level.map.properties.powers) {
        var powers = Object.keys(this.level.map.properties.powers);

        for (var i = 0; i < powers.length; i++) {
            if (this.level.map.properties.powers[powers[i]] && this.level.map.properties.powers[powers[i]].length > 0) {
                this.setPower(powers[i], 'unavailable');
            }
        }
    }
};
