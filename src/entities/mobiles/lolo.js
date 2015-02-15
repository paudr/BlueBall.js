/*global Phaser, BlueBall */

BlueBall.Lolo = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 99
    });

    this.collideIndexes.push(69, 81, 93, 97);
    this.pushIndexes.push(29, 100);
    this.bridgeIndexes.push(16);

    this.animations.add('Top', Phaser.Animation.generateFrameNames('loloUp', 1, 6, '', 1), 10, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('loloRight', 1, 6, '', 1), 10, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('loloDown', 1, 6, '', 1), 10, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('loloLeft', 1, 6, '', 1), 10, true);
    this.animations.add('Win', Phaser.Animation.generateFrameNames('loloWin', 1, 2, '', 1), 10, true);
    this.animations.add('Die', Phaser.Animation.generateFrameNames('loloDie', 1, 4, '', 1), 10, true);

    this.scale.set(32 / 17);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spacebar.onDown.add(this.checkShoot, this);

    this.eggs = 0;
    this.lookingAt = Phaser.Tilemap.SOUTH;

    this.lastCellPosition = { x: this.cellPosition.x, y: this.cellPosition.y };

    this.projectile = null;

};

BlueBall.Lolo.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Lolo.prototype.moveTo = function (direction) {

    this.lookingAt = direction;

    BlueBall.Mobile.prototype.moveTo.call(this, direction);

};

BlueBall.Lolo.prototype.nextAction = function (direction) {

    if (this.alive) {

        if (this.lastCellPosition.x !== this.cellPosition.x || this.lastCellPosition.y !== this.cellPosition.y) {
            this.lastCellPosition.x = this.cellPosition.x;
            this.lastCellPosition.y = this.cellPosition.y;
            this.level.onPlayerMoved.dispatch(this);
        }

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

BlueBall.Lolo.prototype.shoot = function (direction) {

    if (this.projectile === null) {

        this.projectile = new BlueBall.ProjectileEgg(this, direction);

        return true;

    }

    return false;

};

BlueBall.Lolo.prototype.checkShoot = function () {

    if (this.eggs > 0) {

        if (this.shoot(this.lookingAt)) {

            this.eggs--;

        }

    }

};

BlueBall.Lolo.prototype.stopAnimation = function (direction) {

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

BlueBall.Lolo.prototype.die = function () {

    this.alive = false;
    this.animations.play('Die');
    this.level.onPlayerDead.dispatch(this);

};

BlueBall.Lolo.prototype.fired = function (shoot) {

    if (shoot instanceof BlueBall.ProjectileGol) {

        this.die();

    }

};

Object.defineProperty(BlueBall.Mobile.prototype, "eggs", {

    get: function () {

        return this._eggs;

    },

    set: function (value) {

        this._eggs = value;
        this.level.eggCounterText.text = value.toString();
    }

});

BlueBall.Lolo.prototype.destroy = function () {

    this.spacebar.onDown.remove(this.checkShoot, this);
    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};