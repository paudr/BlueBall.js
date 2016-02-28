BlueBall.Gui = function (level) {
    this.game = level.game;
    this.level = level;

    this.layer = this.game.add.group(this.level.layers);
    this.layer.fixedToCamera = true;

    this.eggCounter = new BlueBall.Panel(this.game, 0, 0, level.tileSize.width + 20, (level.tileSize.height * 2) + 10);
    this.eggCounter.alpha = 0.75
    this.layer.add(this.eggCounter);

    this.eggCounterImage = this.eggCounter.addChild(this.game.make.sprite(this.eggCounter.width / 2, 5, 'eggSprites', "shootHorizontal"));
    this.eggCounterImage.width = level.tileSize.width;
    this.eggCounterImage.height = level.tileSize.height;
    this.eggCounterImage.anchor.set(0.5, 0);

    this.eggCounterText = this.eggCounter.addChild(this.game.make.text(this.eggCounter.width / 2, level.tileSize.height + 5, '0', {
        'font': level.tileSize.width + 'px Arial',
        'fill': '#ffffff',
        'align': 'center'
    }));
    this.eggCounterText.setShadow(2, 0, '#666666');
    this.eggCounterText.anchor.set(0.5, 0);

    this.powers = new BlueBall.Panel(this.game, 0, 0, level.tileSize.width + 20, (level.tileSize.height * 3) + 10);
    this.layer.add(this.powers);
    [
        { property: 'powerArrowImage', key: 'powerArrow' },
        { property: 'powerBridgeImage', key: 'powerBridge' },
        { property: 'powerHammerImage', key: 'powerHammer' }
    ].forEach((function(element, index, array) {
        var y = (index === 0) ? 5 : this[array[index - 1].property].y + this[array[index - 1].property].height;
        var sprite = this.powers.addChild(this.game.make.sprite(10, y, 'tileSprites', element.key));
        sprite.width = level.tileSize.width;
        sprite.height = level.tileSize.height;
        sprite.visible = false;
        this[element.property] = sprite;
    }).bind(this));

    [
        { property: 'powerArrowEmptyImage', parent: 'powerArrowImage' },
        { property: 'powerBridgeEmptyImage', parent: 'powerBridgeImage' },
        { property: 'powerHammerEmptyImage', parent: 'powerHammerImage' }
    ].forEach((function(element) {
        var sprite = this.powers.addChild(this.game.make.sprite(this[element.parent].x, this[element.parent].y, 'tileSprites', 'powerEmpty'));
        sprite.width = this[element.parent].width;
        sprite.height = this[element.parent].height;
        sprite.visible = false;
        this[element.property] = sprite;
    }).bind(this));

    this.resize(this.game.width, this.game.height);
    this.showAvailablePowers();
};

BlueBall.Gui.prototype = Object.create(null);
BlueBall.Gui.prototype.constructor = BlueBall.Gui;

BlueBall.Gui.prototype.resize = function (width, height) {
    var x = this.level.layers.x > 0 ? (
        (this.level.map.width * this.level.map.tileWidth) + 25
    ) : (
        width - (this.level.tileSize.width + 50)
    );
    this.eggCounter.x = x;
    this.powers.x = x;

    if (this.level.layers.y > 0) {
        this.eggCounter.y = 25;
        this.powers.y =  (this.level.map.height * this.level.map.tileHeight) - (this.powers.height + 25);
    } else {
        this.eggCounter.y = this.level.layers.y + 100;
        this.powers.y = height - ((this.level.tileSize.height * 3) +  200);
    }
};

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

    this.powers.visible = [
        'powerArrowImage',
        'powerBridgeImage',
        'powerHammerImage',
        'powerArrowEmptyImage',
        'powerBridgeEmptyImage',
        'powerHammerEmptyImage' ].some((function(element) {
            return this[element].visible;
        }).bind(this));
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
