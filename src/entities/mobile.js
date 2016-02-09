BlueBall.Mobile = function (game, x, y, key, frame, options) {
    BlueBall.Entity.call(this, game, x, y, key, frame, options);

    this.movementDuration = Phaser.Timer.SECOND / BlueBall.Config.gameSpeed;

    this.isMoving = false; // True si Mobile se esta moviendo, false en caso contrario
    this.wasPushed = false; // True si Mobile esta siendo empujado, false en caso contrario

    this.animationNames = {};
    this.animationNames[Phaser.Tilemap.NORTH] = 'Top';
    this.animationNames[Phaser.Tilemap.EAST] = 'Right';
    this.animationNames[Phaser.Tilemap.SOUTH] = 'Down';
    this.animationNames[Phaser.Tilemap.WEST] = 'Left';
};

BlueBall.Mobile.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Mobile.prototype.constructor = BlueBall.Mobile;

BlueBall.Mobile.prototype.tilesThatCollide = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Grass');
BlueBall.Mobile.prototype.entitiesThatCollide = BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 'Medusa', 'Player', 'Rocky', 'Skull', 'Snakey', 'Chest', 'DoorClosed', 'DoorOpened', 'Heart');
BlueBall.Mobile.prototype.tilesThatSlowdown = BlueBall.Helper.getTileIds('Sand');
BlueBall.Mobile.prototype.entitiesThatCanPush = [];
BlueBall.Mobile.prototype.entitiesThatBridge = [];
BlueBall.Mobile.prototype.tilesThatArrow = [];

BlueBall.Mobile.prototype.canMoveTo = function (direction) {
    if (!this.isMoving) {
        var positions = this.cellsAt(direction);
        if (positions.length === 0) {
            return false;
        }

        var entities1 = this.level.getEntitesAt(positions[0].x, positions[0].y);
        var entities2 = this.level.getEntitesAt(positions[1].x, positions[1].y);
        var tile1 = this.level.map.getTile(positions[0].x >> 1, positions[0].y >> 1, 'environment', true);
        var tile2 = this.level.map.getTile(positions[1].x >> 1, positions[1].y >> 1, 'environment', true);

        if (
            (
                this.tilesThatCollide.indexOf(tile1.index) === -1 || BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatBridge, entities1).length > 0
            ) && (
                this.tilesThatCollide.indexOf(tile2.index) === -1 || BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatBridge, entities2).length > 0
            ) && (
                this.tilesThatArrow.indexOf(tile1.index) === -1 || tile1.properties.direction !== direction
            ) && (
                this.tilesThatArrow.indexOf(tile2.index) === -1 || tile2.properties.direction !== direction
            ) && (
                BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatCollide, entities1).length === 0
            ) && (
                BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatCollide, entities2).length === 0
            )
        ) {

            var pushing1 = BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatCanPush, entities1);
            var pushing2 = BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatCanPush, entities2);

            if (pushing1.length === pushing2.length) {
                if (pushing1.length === 0) {
                    return true;
                }

                pushing1 = BlueBall.Helper.intersection(pushing1, pushing2);
                if (pushing1.length !== pushing2.length) {
                    return false;
                }

                if (pushing1.length > 0) {
                    for (var i = 0; i < pushing1.length; i++) {
                        if (!pushing1[i].canBePushed || !pushing1[i].canMoveTo(direction)) {
                            return false;
                        }
                    }
                }

                return true;
            }
        }
    }

    return false;
};

BlueBall.Mobile.prototype.moveTo = function (direction, wasPushed, movementDuration) {
    if (!wasPushed) {
        this.animations.play(this.animationNames[direction]);
    }

    if (wasPushed === true || this.canMoveTo(direction)) {
        var positions = this.cellsAt(direction);

        switch (direction) {
        case Phaser.Tilemap.NORTH:
            this.cellPosition.y--;
            break;
        case Phaser.Tilemap.EAST:
            this.cellPosition.x++;
            break;
        case Phaser.Tilemap.SOUTH:
            this.cellPosition.y++;
            break;
        case Phaser.Tilemap.WEST:
            this.cellPosition.x--;
            break;
        }

        var destPosition = BlueBall.Helper.getCellPosition(this.cellPosition.x, this.cellPosition.y);
        var pushedEntities = BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatCanPush, this.level.getEntitesAt(positions[0].x, positions[0].y));

        var slowdown = (this.tilesThatSlowdown.indexOf(this.level.map.getTile(positions[0].x >> 1, positions[0].y >> 1, 'environment', true).index || 0) > -1) ||
            (this.tilesThatSlowdown.indexOf(this.level.map.getTile(positions[1].x >> 1, positions[1].y >> 1, 'environment', true).index || 0) > -1);

        var duration = this.movementDuration;
        if (wasPushed === true) {
            duration = movementDuration;
        } else if (slowdown === true) {
            duration *= 2;
        }

        this.isMoving = true;
        this.wasPushed = wasPushed === true;

        for (var i = 0; i < pushedEntities.length; i++) {
            pushedEntities[i].moveTo(direction, true, duration);
        }

        var tween = this.game.add.tween(this);
        tween.onComplete.add(function () {
            tween.game.tweens.remove(tween);
            this.isMoving = false;
            this.wasPushed = false;
            if (this.exists) {
                this.nextAction();
            }
        }, this);
        tween.to(destPosition, duration, Phaser.Easing.Linear.None, true);

        return true;
    }

    return false;
};

BlueBall.Mobile.prototype.canTouch = function (entity) {
    var diffX = Math.abs(this.cellPosition.x - entity.cellPosition.x),
        diffY = Math.abs(this.cellPosition.y - entity.cellPosition.y);

    if (diffX > 2 || diffY > 2) {
        return 0; // No touch
    }

    if (diffX < 2 && diffY < 2) {
        return -1; // Overlap
    }

    if (diffX === 0 && diffY === 2) {
        return 1; // Full touch
    } else if (diffX === 1 && diffY === 2) {
        return 2; // Partial touch
    } else if (diffX === 2) {
        if (diffY === 0) {
            return 1; // Full touch
        } else if (diffY === 1) {
            return 2; // Partial touch
        }
    } else {
        return 0; // No touch
    }
};

BlueBall.Mobile.prototype.update = function () {
    if (this.isMoving === false) {
        this.nextAction();
    }
};

BlueBall.Mobile.prototype.nextAction = function () {};
