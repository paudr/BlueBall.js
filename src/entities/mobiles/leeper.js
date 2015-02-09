/*global Phaser, BlueBall */

BlueBall.Leeper = function (game, x, y, key, frame) {

    BlueBall.Mobile.call(this, game, x, y, key, frame, {
        gid: 69
    });

    this.collideIndexes.push(29, 30, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 81, 93, 97, 100, 117);

    this.animations.add('Top', Phaser.Animation.generateFrameNames('leeperUp', 1, 2, '', 1), 5, true);
    this.animations.add('Right', Phaser.Animation.generateFrameNames('leeperRight', 1, 2, '', 1), 5, true);
    this.animations.add('Down', Phaser.Animation.generateFrameNames('leeperDown', 1, 2, '', 1), 5, true);
    this.animations.add('Left', Phaser.Animation.generateFrameNames('leeperLeft', 1, 2, '', 1), 5, true);
    this.animations.add('Sleep', Phaser.Animation.generateFrameNames('leeperSleep', 1, 2, '', 1), 1, true);

    this.isSleeping = false;

    this.lastDirection = null;

    this.level.onPhaseChanged.add(this.phaseChanged, this);

    this.currentOptions = null;

};

BlueBall.Leeper.prototype = Object.create(BlueBall.Mobile.prototype);

BlueBall.Leeper.prototype.getDirectionToLolo = function () {

    var distanceX = this.level.player.cellPosition.x - this.cellPosition.x,
        distanceY = this.level.player.cellPosition.y - this.cellPosition.y,
        firstDirection,
        secondDirection;

    if (Math.abs(distanceX) >= Math.abs(distanceY)) {

        if (distanceX >= 0) {
            firstDirection = Phaser.Tilemap.EAST;
        }
        else {
            firstDirection = Phaser.Tilemap.WEST;
        }

        if(distanceY >= 0) {
            secondDirection = Phaser.Tilemap.SOUTH;
        }
        else {
            secondDirection = Phaser.Tilemap.NORTH;
        }

    }
    else {

        if (distanceY >= 0) {
            firstDirection = Phaser.Tilemap.SOUTH;
        }
        else {
            firstDirection = Phaser.Tilemap.NORTH;
        }

        if (distanceX >= 0) {
            secondDirection = Phaser.Tilemap.EAST;
        }
        else {
            secondDirection = Phaser.Tilemap.WEST;
        }

    }

    return {
        'principal': firstDirection,
        'secondary': secondDirection
    };

};


BlueBall.Leeper.prototype.performMovement = function(lolo_pos) {

    var turnback = (this.lastDirection + 2) % 4;


    if ( this.canMoveTo(lolo_pos.principal) && (lolo_pos.principal !== turnback)  )
    {
        this.lastDirection = lolo_pos.principal;
        this.moveTo(this.lastDirection);
        return;
    }

    if ( this.canMoveTo(lolo_pos.secondary) && (lolo_pos.secondary !== turnback)  )
    {
        this.lastDirection = lolo_pos.secondary;
        this.moveTo(this.lastDirection);
        return;
    }

    if ( this.canMoveTo(this.lastDirection)  )
    {
        this.moveTo(this.lastDirection);
        return;
    }

    var useddirs = [];

    if (useddirs.indexOf(this.lastDirection) === -1) useddirs.push(this.lastDirection);
    if (useddirs.indexOf(lolo_pos.principal) === -1) useddirs.push(lolo_pos.principal);
    if (useddirs.indexOf(lolo_pos.secondary) === -1) useddirs.push(lolo_pos.secondary);
    if (useddirs.indexOf(turnback) === -1) useddirs.push(turnback);

    var total = 0;
    useddirs.forEach(function(element, index, array) { total += element; });

    var tercera_via = Math.abs( total - 6 );


    if ( this.canMoveTo(tercera_via) ) {
        this.lastDirection = tercera_via;
        this.moveTo(this.lastDirection);
        return;

    }


    this.lastDirection = turnback;
    this.moveTo(this.lastDirection);


};

BlueBall.Leeper.prototype.nextAction = function () {


    if (!this.isSleeping) {
        if (this.canTouch(this.level.player) > 0) {

            this.isSleeping = true;
            this.canBeCaptured = false;
            this.animations.play('Sleep');

        }
        else {

            var directionToLolo = this.getDirectionToLolo();

            if (this.lastDirection === null) {

                this.lastDirection = directionToLolo.principal;
                this.performMovement(directionToLolo);

            }
            else {

                this.performMovement(directionToLolo);

            }

        }

    }

};

BlueBall.Leeper.prototype.destroy = function () {

    this.level.onPhaseChanged.remove(this.phaseChanged, this);

    BlueBall.Mobile.prototype.destroy.apply(this, arguments);

};

BlueBall.Leeper.prototype.phaseChanged = function () {

    switch (this.level.phase) {

    case BlueBall.Level.PHASE_EXITS:
        this.toDestroy = true;
        break;

    }

};