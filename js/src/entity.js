/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Entity = function (game, x, y, key, frame) {

    Phaser.Sprite.call(this, game, x * BlueBall.Entity.cellWidth, y * BlueBall.Entity.cellHeight, key, frame);

    this.cellX = x;
    this.cellY = y;

};

BlueBall.Entity.prototype = Object.create(Phaser.Sprite.prototype);
BlueBall.Entity.prototype.constructor = BlueBall.Entity;

/**
 * @property {number} cellWidth - Ancho (en pixels) de una celda de una casilla del mapa (cada casilla esta formada por 2x2 celdas)
 * @static
 */
BlueBall.Entity.cellWidth = 32 / 2;

/**
 * @property {number} cellHeight - Alto (en pixels) de una celda de una casilla del mapa (cada casilla esta formada por 2x2 celdas)
 * @static
 */
BlueBall.Entity.cellHeight = 32 / 2;

/**
 * Calcula la posicion (en pixels) de una celda del mapa (cada casilla esta formada por 2x2 celdas)
 * @method BlueBall.Entity#getCellPosition
 * @memberof BlueBall.Entity
 * @param {number} x - Numero de columna de la celda
 * @param {number} y - Numero de fila de la celda
 * @return {Object} - Posicion (en pixels) del extremo superior izquierdo de la celda
 * @static
 */
BlueBall.Entity.getCellPosition = function (x, y) {

    return {
        "x": x * BlueBall.Entity.cellWidth,
        "y": y * BlueBall.Entity.cellHeight
    };

};

/**
 * @property {Phaser.Tilemap} map - Instancia del Tilemap donde se mueve la Entity
 */
BlueBall.Entity.prototype.map = null;

/**
 * @property {array} collideIndexes - Lista de indices de tipos de tiles con los que colisiona la Entity
 */
BlueBall.Entity.prototype.collideIndexes = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

/**
 * @property {number} velocity - Velocidad a la que se mueve la Entity por el mapa (en pixels por milisegundo)
 */
BlueBall.Entity.prototype.velocity = 64 / 1000;

/**
 * @property {number} cellX - Numero de columna de celda en la que se encuentra la Entity
 * @static
 */
BlueBall.Entity.prototype.cellX = 0;

/**
 * @property {number} cellY - Numero de fila de celda en la que se encuentra la Entity
 * @static
 */
BlueBall.Entity.prototype.cellY = 0;

/**
 * @property {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} _movingTo - Direccion en la que se esta moviendo la Entity
 * @private
 */
BlueBall.Entity.prototype._movingTo = null;

/**
 * @property {object} _destPosition - Posicion (en pixels) de destino de la Entity
 * @private
 */
BlueBall.Entity.prototype._destPosition = null;

/**
 * @property {number} _lastMovementTime - Momento (en milisegundos) en el que se movio la Entity por ultima vez
 * @private
 */
BlueBall.Entity.prototype._lastMovementTime = null;

/**
 * Indica si la entity se puede mover en una direccion concreta
 * @method BlueBall.Entity#canMoveTo
 * @memberof BlueBall.Entity
 * @param  {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se quiere saber si el movimiento es posible
 * @return {boolean} True si el movimiento esta permitido, false en caso contrario
 */
BlueBall.Entity.prototype.canMoveTo = function (direction) {

    var posX = this.cellX,
        posY = this.cellY,
        offsetX = 0,
        offsetY = 0,
        altX = 0,
        altY = 0,
        tile1,
        tile2;

    switch (direction) {
    case Phaser.Tilemap.NORTH:
        posY--;
        altX = 1;
        break;
    case Phaser.Tilemap.EAST:
        posX++;
        offsetX = 1;
        altY = 1;
        break;
    case Phaser.Tilemap.SOUTH:
        posY++;
        offsetY = 1;
        altX = 1;
        break;
    case Phaser.Tilemap.WEST:
        posX--;
        altY = 1;
        break;
    default:
        return false;
    }

    tile1 = this.map.getTile(parseInt((posX + offsetX) / 2, 10), parseInt((posY + offsetY) / 2, 10), 'environment', true);
    tile2 = this.map.getTile(parseInt((posX + altX + offsetX) / 2, 10), parseInt((posY + altY + offsetY) / 2, 10), 'environment', true);

    if (this.collideIndexes.indexOf(tile1.index) > -1 || this.collideIndexes.indexOf(tile2.index) > -1) {

        return false;

    } else {

        return true;

    }

};

/**
 * Inicia el movimiento de la Entity en una direccion
 * @method BlueBall.Entity#moveTo
 * @memberof BlueBall.Entity
 * @param  {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se moverá la Entity
 * @return {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST|null} La dirección en la que se mueve la Entity o null
 */
BlueBall.Entity.prototype.moveTo = function (direction) {

    if (this._movingTo === null && this.canMoveTo(direction)) {

        switch (direction) {
        case Phaser.Tilemap.NORTH:
            this.cellY--;
            break;
        case Phaser.Tilemap.EAST:
            this.cellX++;
            break;
        case Phaser.Tilemap.SOUTH:
            this.cellY++;
            break;
        case Phaser.Tilemap.WEST:
            this.cellX--;
            break;
        }

        this._movingTo = direction;
        this._destPosition = BlueBall.Entity.getCellPosition(this.cellX, this.cellY);
        this._lastMovementTime = this.game.time.now;

        return this._movingTo;

    }

    return this._movingTo;

};

BlueBall.Entity.prototype.update = function () {

    if (this._movingTo !== null) {

        var inc = this.game.time.elapsedSince(this._lastMovementTime) * this.velocity;

        this._lastMovementTime = this.game.time.now;

        switch (this._movingTo) {
        case Phaser.Tilemap.NORTH:
            this.y -= inc;
            if (this.y <= this._destPosition.y) {
                this.y = this._destPosition.y;
                this._movingTo = null;
            }
            break;
        case Phaser.Tilemap.EAST:
            this.x += inc;
            if (this.x >= this._destPosition.x) {
                this.x = this._destPosition.x;
                this._movingTo = null;
            }
            break;
        case Phaser.Tilemap.SOUTH:
            this.y += inc;
            if (this.y >= this._destPosition.y) {
                this.y = this._destPosition.y;
                this._movingTo = null;
            }
            break;
        case Phaser.Tilemap.WEST:
            this.x -= inc;
            if (this.x <= this._destPosition.x) {
                this.x = this._destPosition.x;
                this._movingTo = null;
            }
            break;
        default:
            return;
        }

    }

};