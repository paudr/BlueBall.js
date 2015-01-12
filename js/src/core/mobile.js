/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Mobile = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    /**
     * @property {array} collideIndexes - Lista de indices de tipos de tiles con los que colisiona Mob
     */
    this.collideIndexes = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 22];

    /**
     * @property {array} pushIndexes - Lista de indices de tipos de entities a las que puede empujar Mob
     */
    this.pushIndexes = [];

    /**
     * @property {array} bridgeIndexes - Lista de indices de tipos de entities a las que puede hacer de puente a Mob
     */
    this.bridgeIndexes = [];

    /**
     * @property {number} speed - Velocidad a la que se mueve Mob por el mapa (en pixels por milisegundo)
     */
    this.speed = {
        'x': BlueBall.Config.gameSpeed * BlueBall.Config.cellSize.width * 2 / Phaser.Timer.SECOND,
        'y': BlueBall.Config.gameSpeed * BlueBall.Config.cellSize.height * 2 / Phaser.Timer.SECOND
    };

    /**
     * @property {boolean} isMoving - True si Mob se esta moviendo, false en caso contrario
     */
    this.isMoving = false;

    /**
     * @property {boolean} wasPushed - True si Mob esta siendo empujado, false en caso contrario
     */
    this.wasPushed = false;

    /**
     * @property {array} _pushing - Entities que se estan empujando
     */
    this._pushing = [];

    /**
     * @property {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} _movingTo - Direccion en la que se esta moviendo la Mob
     */
    this._movingTo = null;

    /**
     * @property {object} _destPosition - Coordenadas de la posición (en pixels) a la que se dirige Mob
     */
    this._destPosition = null;

};

BlueBall.Mobile.prototype = Object.create(BlueBall.Entity.prototype);

BlueBall.Mobile.prototype.getPositionAt = function (direction) {

    var position = {
        'x': this.cellPosition.x,
        'y': this.cellPosition.y
    };

    switch (direction) {
    case Phaser.Tilemap.NORTH:
        position.y--;
        break;
    case Phaser.Tilemap.EAST:
        position.x++;
        break;
    case Phaser.Tilemap.SOUTH:
        position.y++;
        break;
    case Phaser.Tilemap.WEST:
        position.x--;
        break;
    }

    return position;

};

BlueBall.Mobile.prototype.getCollidingEntities = function (entities) {

    return BlueBall.Entity.getEntitiesFromIndexArray(this.collideIndexes, entities);

};

BlueBall.Mobile.prototype.getPushingEntities = function (entities) {

    return BlueBall.Entity.getEntitiesFromIndexArray(this.pushIndexes, entities);

};

BlueBall.Mobile.prototype.getBridgingEntities = function (entities) {

    return BlueBall.Entity.getEntitiesFromIndexArray(this.bridgeIndexes, entities);

};

BlueBall.Mobile.prototype.isMapColliding = function (direction, entities1, entities2) {

    var positions = this.cellsAt(direction),
        tile1 = this.level.map.getTile(positions[0].x >> 1, positions[0].y >> 1, 'environment', true),
        tile2 = this.level.map.getTile(positions[1].x >> 1, positions[1].y >> 1, 'environment', true);

    if (this.collideIndexes.indexOf(tile1.index) > -1) {

        entities1 = this.getBridgingEntities(entities1);

        if (entities1.length === 0) {

            return true;

        }

    } else if (this.collideIndexes.indexOf(tile2.index) > -1) {

        entities2 = this.getBridgingEntities(entities2);

        if (entities2.length === 0) {

            return true;

        }

    }

    return false;

};

BlueBall.Mobile.prototype.isEntitiesColliding = function (entities1, entities2) {

    entities1 = this.getCollidingEntities(entities1);

    if (entities1.length > 0) {

        return true;

    }

    entities2 = this.getCollidingEntities(entities2);

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

                var pushing1 = this.getPushingEntities(entities1),
                    pushing2 = this.getPushingEntities(entities2),
                    i,
                    length;

                if (pushing1.length === pushing2.length) {

                    if (pushing1.length === 0) {

                        return true;

                    }

                    pushing1 = BlueBall.Helper.intersection(pushing1, pushing2);

                    if (pushing1.length > 0 && pushing1.length === pushing2.length) {

                        for (i = 0, length = pushing1.length; i < length; i++) {

                            if (!pushing1[i].canMoveTo(direction)) {

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

    if (this.canMoveTo(direction)) {

        var positions = this.cellsAt(direction),
            i,
            length;

        if (this.pushIndexes.length > 0) {

            this._pushing = this.getPushingEntities(this.level.getEntitesAt(positions[0].x, positions[0].y));

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

/**
 * Sobreescribir esta funcion para controlar las acciones a realizar cuando se ha finalizado un movimiento
 * @method BlueBall.Mobile#onMoved
 * @memberof BlueBall.Mobile
 * @param {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se ha movido la Mob
 */
BlueBall.Mobile.prototype.onMoved = function () {};

BlueBall.Mobile.prototype._updateMovement = function () {

    if (this.isMoving === true && this.wasPushed === false) {

        var incX = this.game.time.elapsed * this.speed.x,
            incY = this.game.time.elapsed * this.speed.y,
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
            this.onMoved(direction);

        }

    }

};

BlueBall.Mobile.prototype.update = function () {

    this._updateMovement();

};