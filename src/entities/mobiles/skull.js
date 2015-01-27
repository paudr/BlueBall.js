/*global Phaser, BlueBall */

BlueBall.Skull = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame);

    this.frameName = 'skullDown1';

    this.gid = 93;

    this.collideIndexes.push(1, 2, 97, 81, 30, 117);

    this.destroyOnExitOpen = true;

    this.animations.add('Top', Phaser.Animation.generateFrameNames('skullUp', 1, 2, '', 1), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('skullRight', 1, 2, '', 1), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('skullDown', 1, 2, '', 1), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('skullLeft', 1, 2, '', 1), 5, true);

    this.level.onPhaseChanged.add(this.phaseChanged, this);

};

BlueBall.Skull.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Skull.prototype.moveTo = function (direction) {

    if (BlueBall.Mobile.prototype.moveTo.call(this, direction)) {
        switch (direction) {
        case Phaser.Tilemap.NORTH:
            this.animations.play('Top');
            break;
        case Phaser.Tilemap.EAST:
            this.animations.play('Right');
            break;
        case Phaser.Tilemap.SOUTH:
            this.animations.play('Down');
            break;
        case Phaser.Tilemap.WEST:
            this.animations.play('Left');
            break;
        }
    }

};

BlueBall.Skull.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Skull.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
        this.toDestroy = true;
        break;

    }

};

BlueBall.Skull.prototype.fired = function (projectile) {

    if (projectile instanceof BlueBall.ProjectileEgg) {

        new BlueBall.Egg(this);

    }

};