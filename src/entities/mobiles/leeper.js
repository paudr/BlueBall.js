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

BlueBall.Leeper.prototype.getFirstDirectionAvalible = function (directionToLolo) {

    var directions = [Phaser.Tilemap.NORTH, Phaser.Tilemap.EAST, Phaser.Tilemap.SOUTH, Phaser.Tilemap.WEST],
        orderedDirections = [],
        turnBack = null,
        rotation,
        index,
        i,
        current;

    var inc = function (value) { return value + 1; };
    var dec = function (value) { return value - 1; };

    index = directions.indexOf(directionToLolo.principal);

    if (directionToLolo.secondDirection === Phaser.Tilemap.SOUTH || Phaser.Tilemap.EAST) {
        rotation = inc;
    }
    else {
        rotation = dec;
    }

    if (this.lastDirection !== null) {
        turnBack = (this.lastDirection + 2) % 4;
    }

    for (i = 0; i < 4; i = rotation(i)) {
        current = directions[(i + index) % 4];
        if (current !== turnBack) {
            orderedDirections.push(current);
        }
    }

    orderedDirections.push(turnBack);

    for (i = 0; i < 4; i = rotation(i)) {
        current = orderedDirections[i];
        if (this.canMoveTo(current)) {
            return current;
        }
    }

};

BlueBall.Leeper.prototype.nextAction = function () {

    var directionToLolo = this.getDirectionToLolo(),
        direction,
        turnBack;

    if (this.lastDirection === null) {
        direction = this.getFirstDirectionAvalible(directionToLolo);
        if (direction !== directionToLolo.principal) {
            this.lastDirection = direction;
        }
        this.moveTo(direction);
    }
    else {
        turnBack = (this.lastDirection + 2) % 4;

        if (directionToLolo.principal !== turnBack && this.canMoveTo(directionToLolo.principal)) {
            this.lastDirection = null;
            this.moveTo(directionToLolo.principal);
        }
        else if (directionToLolo.secondary !== turnBack && this.canMoveTo(directionToLolo.secondary)) {
            this.lastDirection = directionToLolo.secondary;
            this.moveTo(directionToLolo.secondary);
        }
        else if (directionToLolo.principal === this.lastDirection && this.canMoveTo(directionToLolo.principal)) {
            this.lastDirection = null;
            this.moveTo(directionToLolo.principal);
        }
        else if (directionToLolo.secondary === this.lastDirection && this.canMoveTo(directionToLolo.secondary)) {
            this.moveTo(directionToLolo.secondary);
        }
        else if (this.canMoveTo(this.lastDirection)) {
            this.moveTo(this.lastDirection);
        }
        else {
            this.lastDirection = this.getFirstDirectionAvalible(directionToLolo);
            this.moveTo(this.lastDirection);
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