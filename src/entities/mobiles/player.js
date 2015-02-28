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
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spacebar.onDown.add(this.checkShoot, this);

    this.suicideKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.suicideKeyPressed = null;

    this.eggs = 0;
    this.lookingAt = Phaser.Tilemap.SOUTH;

    this.lastCellPosition = { x: this.cellPosition.x, y: this.cellPosition.y };

    this.projectile = null;

};

BlueBall.Player.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Player.prototype.collideIndexes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 22, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 73, 77, 81, 85, 89, 93, 97, 98, 99 ];

BlueBall.Player.prototype.slowdownIndexes = [ 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52 ];

BlueBall.Player.prototype.pushIndexes = [ 29, 100 ];

BlueBall.Player.prototype.bridgeIndexes = [ 16 ];

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
        this.level.eggCounterText.text = value.toString();
    }

});

BlueBall.Player.prototype.update = function () {

    if (this.suicideKey.isDown) {

        if (this.suicideKeyPressed === null) {

            this.suicideKeyPressed = this.game.time.time;

        }

    }
    else {

        if (this.suicideKeyPressed !== null) {

            this.suicideKeyPressed = null;

        }

    }

    if(this.suicideKeyPressed !== null && this.game.time.elapsedSecondsSince(this.suicideKeyPressed) >= 3) {

        this.die();

    }

    BlueBall.Mobile.prototype.update.call(this);

};

BlueBall.Player.prototype.destroy = function () {

    this.spacebar.onDown.remove(this.checkShoot, this);
    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};
