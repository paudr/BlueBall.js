/*global Phaser */

var BlueBall = BlueBall || {};

BlueBall.Entity = function (game, x, y, key, frame) {

    var pos = BlueBall.Entity.getCellPosition(x, y);

    Phaser.Sprite.call(this, game, pos.x, pos.y, key, frame);

    this.level = this.game.state.getCurrentState();

    this.cellPosition = {
        'x': x,
        'y': y
    };

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
 * @property {BlueBall.Level} level - Instancia del Level actual
 */
BlueBall.Entity.prototype.level = null;


/**
 * @property {number} gid - Identificador del tipo de Entity
 */
BlueBall.Entity.prototype.gid = -1;

/**
 * @property {object} cellPosition - Numero de columna y fila de celda en la que se encuentra la Entity
 * @static
 */
BlueBall.Entity.prototype.cellPosition = null;

/**
 * Indica si la entity ocupa una posición en concreto
 * @method BlueBall.Entity#occupy
 * @memberof BlueBall.Entity
 * @param {number} x - Numero de columna de celda
 * @param {number} y - Numero de fila de celda
 * @return {boolean} True si la entity ocupa la celda concreta, false en caso contrario
 */
BlueBall.Entity.prototype.occupy = function (x, y) {

    return (this.cellPosition.x === x || this.cellPosition.x + 1 === x) && (this.cellPosition.y === y || this.cellPosition.y + 1 === y);

};

/**
 * Devuelve las posiciones de las celdas adyacentes a la entity en una direccion concreta
 * @method BlueBall.Entity#cellsAt
 * @memberof BlueBall.Entity
 * @param {Phaser.Tilemap.NORTH|Phaser.Tilemap.EAST|Phaser.Tilemap.SOUTH|Phaser.Tilemap.WEST} direction - Dirección en la que se encuentran las celdas adyacentes
 * @return {array} Objeto con las coordenadas de las celdas adyacentes
 */
BlueBall.Entity.prototype.cellsAt = function (direction) {

    var posX = this.cellPosition.x,
        posY = this.cellPosition.y,
        offsetX = 0,
        offsetY = 0,
        altX = 0,
        altY = 0;

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
        return [];
    }

    return [
        {
            'x': posX + offsetX,
            'y': posY + offsetY
        },
        {
            'x': posX + altX + offsetX,
            'y': posY + altY + offsetY
        }
    ];

};

