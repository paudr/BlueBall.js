/*global Phaser, BlueBall */

BlueBall.Player = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 99
    });

    this.animations.add('Top', Phaser.Animation.generateFrameNames('playerUp', 1, 6, '', 1), 10, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('playerRight', 1, 6, '', 1), 10, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('playerDown', 1, 6, '', 1), 10, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('playerLeft', 1, 6, '', 1), 10, true);
    this.animations.add('Win', Phaser.Animation.generateFrameNames('playerWin', 1, 2, '', 1), 10, true);
    this.animations.add('Die', Phaser.Animation.generateFrameNames('playerDie', 1, 4, '', 1), 10, true);

    this.scale.set(32 / 17);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.keyShoot = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.keyShoot.onDown.add(this.checkShoot, this);

    this.keyPower = game.input.keyboard.addKey(Phaser.Keyboard.X);
    this.keyPower.onDown.add(this.checkPower, this);

    this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.restartKeyPressed = null;

    this.eggs = 0;
    this.hearts = 0;
    this.powers = {
        'arrow': 0,
        'bridge': 0,
        'hammer': 0
    };

    this.lookingAt = Phaser.Tilemap.SOUTH;

    this.lastCellPosition = { x: this.cellPosition.x, y: this.cellPosition.y };

    this.projectile = null;

};

BlueBall.Player.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Player.prototype.collideIndexes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99 ];

BlueBall.Player.prototype.slowdownIndexes = [ 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52 ];

BlueBall.Player.prototype.pushIndexes = [ 29, 100 ];

BlueBall.Player.prototype.bridgeIndexes = [ 101, 118 ];

BlueBall.Player.prototype.arrowIndexes = [ 25, 26, 27, 28 ];

BlueBall.Player.prototype.waterIndexes = [ 18, 19, 20, 21, 22 ];

BlueBall.Player.prototype.moveTo = function (direction) {

    this.lookingAt = direction;

    BlueBall.Mobile.prototype.moveTo.call(this, direction);

};

BlueBall.Player.prototype.nextAction = function (direction) {

    if (this.lastCellPosition.x !== this.cellPosition.x || this.lastCellPosition.y !== this.cellPosition.y) {
        this.lastCellPosition.x = this.cellPosition.x;
        this.lastCellPosition.y = this.cellPosition.y;
        this.level.onPlayerMoved.dispatch(this);
    }

    if (this.alive) {

        if (this.cursors.up.isDown) {

            this.moveTo(Phaser.Tilemap.NORTH);

        } else if (this.cursors.right.isDown) {

            this.moveTo(Phaser.Tilemap.EAST);

        } else if (this.cursors.down.isDown) {

            this.moveTo(Phaser.Tilemap.SOUTH);

        } else if (this.cursors.left.isDown) {

            this.moveTo(Phaser.Tilemap.WEST);

        } else {

            this.stopAnimation(this.lookingAt);

        }

    }

};

BlueBall.Player.prototype.shoot = function (direction) {

    if (this.projectile === null) {

        this.projectile = new BlueBall.ProjectileEgg(this, direction);

        return true;

    }

    return false;

};

BlueBall.Player.prototype.checkShoot = function () {

    if (this.eggs > 0) {

        if (this.shoot(this.lookingAt)) {

            this.eggs--;

        }

    }

};

BlueBall.Player.prototype.lookingAtTile = function() {

    if (this.cellPosition.x % 2 === 0 && this.cellPosition.y % 2 === 0) {

        var xTile = this.cellPosition.x >> 1;
        var yTile = this.cellPosition.y >> 1;

        switch (this.lookingAt) {
            case Phaser.Tilemap.NORTH:
                yTile -= 1;
                break;
            case Phaser.Tilemap.EAST:
                xTile += 1;
                break;
            case Phaser.Tilemap.SOUTH:
                yTile += 1;
                break;
            case Phaser.Tilemap.WEST:
                xTile -= 1;
                break;
        }

        return this.level.map.getTile(xTile, yTile, 'environment', true);

    }

};

BlueBall.Player.prototype.applyHammerPower = function(tile) {

    this.level.map.putTile(36, tile.x, tile.y);
    this.markPowerAsUsed('hammer');

}

BlueBall.Player.prototype.applyArrowPower = function(tile) {

    var direction = tile.properties.direction;
    var notChanged = true;
    var i;

    while (notChanged) {

        direction = (direction + 1) % 4;

        for (i = 0; i < this.arrowIndexes.length; i++) {

            if (this.level.map.tilesets[0].tileProperties[this.arrowIndexes[i] - 1].direction === direction) {

                this.level.map.putTile(null, tile.x, tile.y);
                this.level.map.putTile(this.arrowIndexes[i], tile.x, tile.y);
                this.markPowerAsUsed('arrow');
                notChanged = false;
                break;

            }

        }

    }

};

BlueBall.Player.prototype.applyBridgePower = function(tile) {

    if (this.lookingAt === Phaser.Tilemap.NORTH || this.lookingAt === Phaser.Tilemap.SOUTH) {

        this.level.map.putTile(23, tile.x, tile.y);

    } else {

        this.level.map.putTile(24, tile.x, tile.y);

    }

    this.markPowerAsUsed('bridge');

}

BlueBall.Player.prototype.markPowerAsUsed = function(power) {

    this.powers[power] -= 1;

    if (this.powers[power] <= 0) {

        this.level.gui.setPower(power, 'empty');

        counts = this.level.map.properties.powers[power];

        if (counts) {

            var next = counts.find((function(num) { return num > this.hearts}).bind(this));

            if (typeof next === 'undefined') {

                this.level.gui.setPower(power, 'empty');

            } else {

                this.level.gui.setPower(power, 'unavailable');

            }

        }

    }

}

BlueBall.Player.prototype.checkPower = function () {

    var tile = this.lookingAtTile();

    if(tile) {

        if (tile.index === 1 && this.powers.hammer > 0) {

            this.applyHammerPower(tile);

        } else if (this.arrowIndexes.indexOf(tile.index) > -1 && this.powers.arrow > 0) {

            this.applyArrowPower(tile);

        } else if (this.waterIndexes.indexOf(tile.index) > -1 && this.powers.bridge > 0) {

            this.applyBridgePower(tile);
        }

    }

};

BlueBall.Player.prototype.stopAnimation = function (direction) {

    this.animations.stop();

    switch (direction) {
    case Phaser.Tilemap.NORTH:
        this.frame = 0;
        break;
    case Phaser.Tilemap.EAST:
        this.frame = 8;
        break;
    case Phaser.Tilemap.SOUTH:
        this.frame = 16;
        break;
    case Phaser.Tilemap.WEST:
        this.frame = 24;
        break;
    default:
        this.frame = 10;
    }

};

BlueBall.Player.prototype.die = function () {

    this.alive = false;
    this.animations.play('Die');
    this.level.onPlayerDead.dispatch(this);

};

BlueBall.Player.prototype.win = function () {

    this.alive = false;
    this.animations.play('Win');

};

Object.defineProperty(BlueBall.Mobile.prototype, "eggs", {

    get: function () {

        return this._eggs;

    },

    set: function (value) {

        this._eggs = value;
        this.level.gui.setEggCount(value);

    }

});

BlueBall.Player.prototype.update = function () {

    if (this.restartKey.isDown) {

        if (this.restartKeyPressed === null) {

            this.restartKeyPressed = this.game.time.time;

        }

    }
    else {

        if (this.restartKeyPressed !== null) {

            this.restartKeyPressed = null;

        }

    }

    if(this.restartKeyPressed !== null && this.game.time.elapsedSecondsSince(this.restartKeyPressed) >= 3) {

        this.die();

    }

    BlueBall.Mobile.prototype.update.call(this);

};

BlueBall.Player.prototype.destroy = function () {

    this.keyShoot.onDown.remove(this.checkShoot, this);
    this.keyPower.onDown.remove(this.checkPower, this);
    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Player.prototype.incHearts = function() {

    var powers = Object.keys(this.powers);
    var i;
    var counts;

    this.hearts++;

    var nextHearts = this.hearts + 1;

    if (this.level.map.properties.powers) {

        for (i = 0; i < powers.length; i++) {

            counts = this.level.map.properties.powers[powers[i]];

            if (counts && counts.indexOf(this.hearts) > -1) {

                this.powers[powers[i]] += 1;
                this.level.gui.setPower(powers[i], 'available');

                this.level.blinkHearts(false);

            }

            if (counts && counts.indexOf(nextHearts) > -1) {

                this.level.blinkHearts(true);

            }

        }

    }

};
