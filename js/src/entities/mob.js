/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Mob = function (game, x, y, key, frame) {

    BlueBall.Entity.call(this, game, x, y, key, frame);

    this.collideIndexes = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 22];
    this.pushIndexes = [];

};

BlueBall.Mob.prototype = Object.create(BlueBall.Entity.prototype);
BlueBall.Mob.prototype.constructor = BlueBall.Mob;

/**
 * @property {array} collideIndexes - Lista de indices de tipos de tiles con los que colisiona la Mob
 */
BlueBall.Mob.prototype.collideIndexes = null;

/**
 * @property {array} pushIndexes - Lista de indices de tipos de entities a las que puede empujar la Mob
 */
BlueBall.Mob.prototype.pushIndexes = null;

/**
 * @property {number} velocity - Velocidad a la que se mueve la Mob por el mapa (en pixels por milisegundo)
 */
BlueBall.Mob.prototype.velocity = 64 / 1000;

/**
 * @property {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} _movingTo - Direccion en la que se esta moviendo la Mob
 * @private
 */
BlueBall.Mob.prototype._movingTo = null;

/**
 * @property {object} _destPosition - Posicion (en pixels) de destino de la Mob
 * @private
 */
BlueBall.Mob.prototype._destPosition = null;

/**
 * @name BlueBall.Mob#isMoving
 * @property {boolean} isMoving - True si la Mob se esta moviendo, false en caso contrario
 * @readonly
 */
Object.defineProperty(BlueBall.Mob.prototype, "isMoving", {

    get: function () {

        return this._movingTo !== null;

    }

});

/**
 * Indica si la Mob se puede mover en una direccion concreta
 * @method BlueBall.Mob#canMoveTo
 * @memberof BlueBall.Mob
 * @param {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se quiere saber si el movimiento es posible
 * @return {boolean} True si el movimiento esta permitido, false en caso contrario
 */
BlueBall.Mob.prototype.canMoveTo = function (direction) {

    if (this._movingTo !== null) {

        // Si ya se esta moviendo, no se puede volver a mover
        return false;

    }

    var pos,
        tile1,
        tile2,
        i,
        current;

    pos = this.cellsAt(direction);

    tile1 = this.level.map.getTile(parseInt((pos[0].x) / 2, 10), parseInt((pos[0].y) / 2, 10), 'environment', true);
    tile2 = this.level.map.getTile(parseInt((pos[1].x) / 2, 10), parseInt((pos[1].y) / 2, 10), 'environment', true);

    if (this.collideIndexes.indexOf(tile1.index) > -1 || this.collideIndexes.indexOf(tile2.index) > -1) {

        return false;

    } else {

        for (i = 0; i < this.level.entities.length; i++) {

            current = this.level.entities.getAt(i);

            if (current.occupy(pos[0].x, pos[0].y) || current.occupy(pos[1].x, pos[1].y)) {

                if (this.collideIndexes.indexOf(current.gid) > -1) {

                    return false;

                }

            }

        }

        return true;

    }

};

/**
 * Indica si la Mob ha de empujar a otra Mob para moverse en una direccion
 * @method BlueBall.Mob#isPushing
 * @memberof BlueBall.Mob
 * @param {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se quiere saber si el movimiento es posible
 * @return {BlueBall.Mob} Mob a la que se empujara o null si no hay ninguna Mob a la que empujar
 */
BlueBall.Mob.prototype.isPushing = function (direcion) {

    var pos,
        i,
        current;

    if (this.pushIndexes.length > 0) {

        pos = this.cellsAt(direcion);

        for (i = 0; i < this.level.entities.length; i++) {

            current = this.level.entities.getAt(i);

            if (current.occupy(pos[0].x, pos[0].y) || current.occupy(pos[1].x, pos[1].y)) {

                if (this.pushIndexes.indexOf(current.gid) > -1) {

                    return current;

                }

            }

        }

    }

    return null;

};

/**
 * Indica si la Mob puede empujar a otra Mob concreta en una direccion
 * @method BlueBall.Mob#isPushing
 * @memberof BlueBall.Mob
 * @param {BlueBall.Mob} other - Mob a empujar
 * @param {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se quiere saber si el movimiento es posible
 * @return {boolean} True si se puede empujar a la Mob, false en caso contrario
 */
BlueBall.Mob.prototype.canPush = function (other, direction) {

    if (other === null) {

        return true;

    }

    if (((direction === Phaser.Tilemap.NORTH || direction === Phaser.Tilemap.SOUTH) && this.cellPosition.x != other.cellPosition.x) ||
        ((direction === Phaser.Tilemap.EAST || direction === Phaser.Tilemap.WEST) && this.cellPosition.y != other.cellPosition.y)) {

        return false;

    }

    return other.canMoveTo(direction);

};

/**
 * Inicia el movimiento de la Mob en una direccion
 * @method BlueBall.Mob#moveTo
 * @memberof BlueBall.Mob
 * @param {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se moverá la Mob
 * @return {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST|null} La dirección en la que se mueve la Mob o null
 */
BlueBall.Mob.prototype.moveTo = function (direction) {

    if (this.canMoveTo(direction)) {

        var pushed = this.isPushing(direction);

        if (this.canPush(pushed, direction)) {

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

            this._movingTo = direction;
            this._destPosition = BlueBall.Entity.getCellPosition(this.cellPosition.x, this.cellPosition.y);

            if (pushed) {

                pushed.moveTo(direction);

            }

            return this._movingTo;

        }

    }

    return this._movingTo;

};

/**
 * Sobreescribir esta funcion para controlar las acciones a realizar cuando se ha finalizado un movimiento
 * @method BlueBall.Mob#onMoved
 * @memberof BlueBall.Mob
 * @param {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se ha movido la Mob
 */
BlueBall.Mob.prototype.onMoved = function () {};

BlueBall.Mob.prototype.update = function () {

    if (this._movingTo !== null) {

        var inc = this.game.time.elapsed * this.velocity;

        switch (this._movingTo) {
        case Phaser.Tilemap.NORTH:
            this.y -= inc;
            if (this.y <= this._destPosition.y) {
                this.y = this._destPosition.y;
                this._movingTo = null;
                this.onMoved(Phaser.Tilemap.NORTH);
            }
            break;
        case Phaser.Tilemap.EAST:
            this.x += inc;
            if (this.x >= this._destPosition.x) {
                this.x = this._destPosition.x;
                this._movingTo = null;
                this.onMoved(Phaser.Tilemap.EAST);
            }
            break;
        case Phaser.Tilemap.SOUTH:
            this.y += inc;
            if (this.y >= this._destPosition.y) {
                this.y = this._destPosition.y;
                this._movingTo = null;
                this.onMoved(Phaser.Tilemap.SOUTH);
            }
            break;
        case Phaser.Tilemap.WEST:
            this.x -= inc;
            if (this.x <= this._destPosition.x) {
                this.x = this._destPosition.x;
                this._movingTo = null;
                this.onMoved(Phaser.Tilemap.WEST);
            }
            break;
        default:
            return;
        }

    }

};
