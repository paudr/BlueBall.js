/*global Phaser, BlueBall */

BlueBall.ProjectileMedusa = function (shooter, direction) {

    BlueBall.Projectile.call(this, shooter, direction, 'mobSprites', 8);

    switch (direction) {
    case Phaser.Tilemap.NORTH:
        this.frameName = 'projectileMedusa1';
        this.angle = 0;
        break;
    case Phaser.Tilemap.EAST:
        this.frameName = 'projectileMedusa2';
        this.angle = 0;
        break;
    case Phaser.Tilemap.SOUTH:
        this.frameName = 'projectileMedusa1';
        this.angle = 180;
        break;
    case Phaser.Tilemap.WEST:
        this.frameName = 'projectileMedusa2';
        this.angle = 180;
        break;
    }

    this.animations.play('anim');

};

BlueBall.ProjectileMedusa.prototype = Object.create(BlueBall.Projectile.prototype);

BlueBall.ProjectileMedusa.canTarget = function (shooter, target) {

    var cellsToCheck = [];
    var direction;
    var sidePosition, firstPosition, lastPosition, i;
    var tile;

    if (shooter.cellPosition.x === target.cellPosition.x) {

        sidePosition = shooter.cellPosition.x + 1;

        if (shooter.cellPosition.y >= target.cellPosition.y) {
            direction = Phaser.Tilemap.NORTH;
            firstPosition = target.cellPosition.y + 2;
            lastPosition = shooter.cellPosition.y - 1;
        }
        else {
            direction = Phaser.Tilemap.SOUTH;
            firstPosition = shooter.cellPosition.y + 2;
            lastPosition = target.cellPosition.y - 1;
        }

        for (i = firstPosition; i <= lastPosition; i++) {
            cellsToCheck.push({ 'x': shooter.cellPosition.x, 'y': i }, { 'x': sidePosition, 'y': i });
        }

    }
    else if (shooter.cellPosition.y === target.cellPosition.y) {

        sidePosition = shooter.cellPosition.y + 1;

        if (shooter.cellPosition.x >= target.cellPosition.x) {
            direction = Phaser.Tilemap.WEST;
            firstPosition = target.cellPosition.x + 2;
            lastPosition = shooter.cellPosition.x - 1;
        }
        else {
            direction = Phaser.Tilemap.EAST;
            firstPosition = shooter.cellPosition.x + 2;
            lastPosition = target.cellPosition.x - 1;
        }

        for (i = firstPosition; i <= lastPosition; i++) {
            cellsToCheck.push({ 'x': i, 'y': shooter.cellPosition.y }, { 'x': i, 'y': sidePosition });
        }

    }
    else {

        return -1;

    }

    for (i = 0; i < cellsToCheck.length; i++) {

        if (BlueBall.ProjectileMedusa.prototype.collideIndexes.indexOf(shooter.level.map.getTile(cellsToCheck[i].x >> 1, cellsToCheck[i].y >> 1, 'environment', true).index) >= 0 ||
           BlueBall.Entity.getEntitiesFromIndexArray(BlueBall.ProjectileMedusa.prototype.collideIndexes, shooter.level.getEntitesAt(cellsToCheck[i].x, cellsToCheck[i].y)).length > 0) {

            return -1;

        }

    }

    return direction;

};

BlueBall.ProjectileMedusa.shootTo = function (shooter, target) {

    var direction = BlueBall.ProjectileMedusa.canTarget(shooter, target);

    if (direction >= 0) {

        target.alive = false;
        target.animations.stop();
        target.frameName = 'playerDie1';

        return new BlueBall.ProjectileMedusa(shooter, direction);

    }

    return null;

};

BlueBall.ProjectileMedusa.prototype.impact = function (target) {

    if (target instanceof BlueBall.Player) {

        target.die();

    }

};