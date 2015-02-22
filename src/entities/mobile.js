/*global Phaser, BlueBall */

BlueBall.Mobile = function (game, x, y, key, frame, options) {

    BlueBall.Entity.call(this, game, x, y, key, frame, options);

    /**
     * @property {array} collideIndexes - Lista de indices de tipos de tiles con los que colisiona Mob
     */
    this.collideIndexes = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 22 ];

    /**
     * @property {array} slowdownIndexes - Lista de indices de tipos de tiles que relentizan a Mob
     */
    this.slowdownIndexes = [];

    /**
     * @property {array} pushIndexes - Lista de indices de tipos de entities a las que puede empujar Mob
     */
    this.pushIndexes = [];

    /**
     * @property {array} bridgeIndexes - Lista de indices de tipos de entities a las que puede hacer de puente a Mob
     */
    this.bridgeIndexes = [];

    this.speed = { // Velocidad a la que se mueve Mobile por el mapa (en pixels por milisegundo)
        'x': BlueBall.Config.gameSpeed * BlueBall.Config.cellSize.width * 2 / Phaser.Timer.SECOND,
        'y': BlueBall.Config.gameSpeed * BlueBall.Config.cellSize.height * 2 / Phaser.Timer.SECOND
    };

    this.isMoving = false; // True si Mobile se esta moviendo, false en caso contrario
    this.wasPushed = false; // True si Mobile esta siendo empujado, false en caso contrario
    this._pushing = []; // Entities que se estan empujando
    this._movingTo = null; // Direccion en la que se esta moviendo la Mobile
    this._destPosition = null; // Coordenadas de la posición (en pixels) a la que se dirige Mobile

};

BlueBall.Mobile.prototype = Object.create(BlueBall.Entity.prototype);

BlueBall.Mobile.prototype.isMapColliding = function (direction, entities1, entities2) {

    var positions = this.cellsAt(direction),
        tile1 = this.level.map.getTile(positions[0].x >> 1, positions[0].y >> 1, 'environment', true),
        tile2 = this.level.map.getTile(positions[1].x >> 1, positions[1].y >> 1, 'environment', true);

    if (this.collideIndexes.indexOf(tile1.index) > -1) {

        entities1 = BlueBall.Entity.getEntitiesFromIndexArray(this.bridgeIndexes, entities1);

        if (entities1.length === 0) {

            return true;

        }

    }

    if (this.collideIndexes.indexOf(tile2.index) > -1) {

        entities2 = BlueBall.Entity.getEntitiesFromIndexArray(this.bridgeIndexes, entities2);

        if (entities2.length === 0) {

            return true;

        }

    }

    return false;

};

BlueBall.Mobile.prototype.isEntitiesColliding = function (entities1, entities2) {

    entities1 = BlueBall.Entity.getEntitiesFromIndexArray(this.collideIndexes, entities1);

    if (entities1.length > 0) {

        return true;

    }

    entities2 = BlueBall.Entity.getEntitiesFromIndexArray(this.collideIndexes, entities2);

    if (entities2.length > 0) {

        return true;

    }

    return false;

};

BlueBall.Mobile.prototype.canMoveTo = function (direction) {

    if (!this.isMoving) {

        var positions = this.cellsAt(direction),
            entities1 = this.level.getEntitesAt(positions[0].x, positions[0].y),
            entities2 = this.level.getEntitesAt(positions[1].x, positions[1].y);

        if (!this.isMapColliding(direction, entities1, entities2)) {

            if (!this.isEntitiesColliding(entities1, entities2)) {

                var pushing1 = BlueBall.Entity.getEntitiesFromIndexArray(this.pushIndexes, entities1),
                    pushing2 = BlueBall.Entity.getEntitiesFromIndexArray(this.pushIndexes, entities2),
                    i,
                    length;

                if (pushing1.length === pushing2.length) {

                    if (pushing1.length === 0) {

                        return true;

                    }

                    pushing1 = BlueBall.Helper.intersection(pushing1, pushing2);

                    if (pushing1.length > 0 && pushing1.length === pushing2.length) {

                        for (i = 0, length = pushing1.length; i < length; i++) {

                            if (!pushing1[i].canBePushed || !pushing1[i].canMoveTo(direction)) {

                                return false;

                            }

                        }

                    }

                    return true;

                }

            }

        }

    }

    return false;

};

BlueBall.Mobile.prototype.moveTo = function (direction) {

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

    if (this.canMoveTo(direction)) {

        var positions = this.cellsAt(direction),
            i,
            length;

        if (this.pushIndexes.length > 0) {

            this._pushing = BlueBall.Entity.getEntitiesFromIndexArray(this.pushIndexes, this.level.getEntitesAt(positions[0].x, positions[0].y));

        }

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

        this.isMoving = true;
        this._movingTo = direction;
        this._destPosition = BlueBall.Entity.getCellPosition(this.cellPosition.x, this.cellPosition.y);

        for (i = 0, length = this._pushing.length; i < length; i++) {

            this._pushing[i].isMoving = true;
            this._pushing[i].wasPushed = true;
            switch (direction) {
            case Phaser.Tilemap.NORTH:
                this._pushing[i].cellPosition.y--;
                break;
            case Phaser.Tilemap.EAST:
                this._pushing[i].cellPosition.x++;
                break;
            case Phaser.Tilemap.SOUTH:
                this._pushing[i].cellPosition.y++;
                break;
            case Phaser.Tilemap.WEST:
                this._pushing[i].cellPosition.x--;
                break;
            }

        }

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
    }
    else if (diffX === 1 && diffY === 2) {
        return 2; // Partial touch
    }
    else if (diffX === 2) {
        if (diffY === 0) {
            return 1; // Full touch
        }
        else if (diffY === 1) {
            return 2; // Partial touch
        }
    }
    else {
        return 0; // No touch
    }

};

BlueBall.Mobile.prototype.fired = function (shoot) {

    if (shoot instanceof BlueBall.ProjectileEgg && this.canBeCaptured) {

        new BlueBall.Egg(this);

    }

};

BlueBall.Mobile.prototype.update = function () {

    if (this.isMoving === true && this.wasPushed === false) {

        var slowdownTile = this.slowdownIndexes.indexOf(this.level.map.getTile(this.cellPosition.x >> 1, this.cellPosition.y >> 1, 'environment', true).index || 0) > -1,
            incX = this.game.time.elapsed * (slowdownTile ? this.speed.x * 0.5 : this.speed.x),
            incY = this.game.time.elapsed * (slowdownTile ? this.speed.y * 0.5 : this.speed.y),
            direction = this._movingTo,
            x = 0,
            y = 0,
            lastMovement = false,
            i,
            length,
            item;

        switch (direction) {
        case Phaser.Tilemap.NORTH:
            y -= incY;
            if (this.y + y <= this._destPosition.y) {
                y = this._destPosition.y - this.y;
                lastMovement = true;
            }
            break;
        case Phaser.Tilemap.EAST:
            x += incX;
            if (this.x + x >= this._destPosition.x) {
                x = this._destPosition.x - this.x;
                lastMovement = true;
            }
            break;
        case Phaser.Tilemap.SOUTH:
            y += incY;
            if (this.y + y >= this._destPosition.y) {
                y = this._destPosition.y - this.y;
                lastMovement = true;
            }
            break;
        case Phaser.Tilemap.WEST:
            x -= incX;
            if (this.x + x <= this._destPosition.x) {
                x = this._destPosition.x - this.x;
                lastMovement = true;
            }
            break;
        default:
            return;
        }

        for (i = 0, length = this._pushing.length; i < length; i++) {

            item = this._pushing[i];
            item.x += x;
            item.y += y;

            if (lastMovement) {

                item.isMoving = false;
                item.wasPushed = false;

            }

        }

        this.x += x;
        this.y += y;

        if (lastMovement) {

            this.isMoving = false;
            this._movingTo = null;

            this.nextAction();

        }

    }
    else {

        this.nextAction();

    }

};

BlueBall.Mobile.prototype.nextAction = function () {};