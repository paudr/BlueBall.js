/*global Phaser, BlueBall */

BlueBall.Lolo = function (game, x, y, key, frame) {

    BlueBall.Shooter.call(this, game, x, y, key, frame, {
        gid: 99
    });

    this.gid = 99;

    this.collideIndexes.push(69, 81, 93, 97);
    this.pushIndexes.push(29, 100);
    this.bridgeIndexes.push(16);

    this.projectileClass = BlueBall.ProjectileEgg;

    this.animations.add('Top', Phaser.Animation.generateFrameNames('loloUp', 0, 6, '', 1), 10, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('loloRight', 0, 6, '', 1), 10, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('loloDown', 0, 6, '', 1), 10, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('loloLeft', 0, 6, '', 1), 10, true);

    this.scale.set(32 / 17);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spacebar.onDown.add(this.checkShoot, this);

    this._eggs = 0;
    this.lookingAt = Phaser.Tilemap.SOUTH;

};

BlueBall.Lolo.prototype = Object.create(BlueBall.Shooter.prototype);

BlueBall.Lolo.prototype.moveTo = function (direction) {

    this.lookingAt = direction;

    if (BlueBall.Shooter.prototype.moveTo.call(this, direction)) {

        this.level.onPlayerMovementStarted.dispatch(this, direction);

    }

};

BlueBall.Lolo.prototype.nextAction = function (direction) {

    this.level.onPlayerMovementEnded.dispatch(this, direction);

    if (this.cursors.up.isDown) {

        this.animations.play('Top');
        this.moveTo(Phaser.Tilemap.NORTH);

    } else if (this.cursors.right.isDown) {

        this.animations.play('Right');
        this.moveTo(Phaser.Tilemap.EAST);

    } else if (this.cursors.down.isDown) {

        this.animations.play('Down');
        this.moveTo(Phaser.Tilemap.SOUTH);

    } else if (this.cursors.left.isDown) {

        this.animations.play('Left');
        this.moveTo(Phaser.Tilemap.WEST);

    } else {

        this.stopAnimation(this.lookingAt);

    }

};

BlueBall.Lolo.prototype.checkShoot = function () {

    if (this._eggs > 0) {

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
    BlueBall.Shooter.prototype.destroy.apply(this, arguments);

};