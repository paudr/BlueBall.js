/*global Phaser, BlueBall */

BlueBall.Entity = function (game, x, y, key, frame, options) {

    options = options || {};

    var pos = BlueBall.Helper.getCellPosition(x, y);

    Phaser.Sprite.call(this, game, pos.x, pos.y, key, frame);

    this.anchor.set(0.5, 0.5);

    this.level = this.game.state.getCurrentState(); // Instancia del Level actual
    this.spawnPosition = { 'x': x, 'y': y }; // Numero de columna y fila de celda en la que aparece Entity
    this.cellPosition = { 'x': x, 'y': y }; // Numero de columna y fila de celda en la que se encuentra la Entity
    this.toDestroy = false; // Indica si Entity ha de ser destruido

    this.gid = typeof options.gid === 'number' ? options.gid : -1; // Identificador del tipo de Entity

    this.canBePushed = typeof options.canBePushed === 'boolean' ? options.canBePushed : true;
    this.canBeCaptured = typeof options.canBeCaptured === 'boolean' ? options.canBeCaptured : true;

};

BlueBall.Entity.prototype = Object.create(Phaser.Sprite.prototype);

BlueBall.Entity.prototype.preventSpawn = BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leper', 'Medusa', 'Rocky', 'Skull', 'Snakey', 'Chest', 'DoorClosed', 'DoorOpened', 'Heart');

BlueBall.Entity.getEntitiesFromIndexArray = function (indexArray, entities) {

    var selected = [],
        i,
        length;

    if (indexArray.length > 0) {

        length = entities.length;

        for (i = 0; i < length; i++) {

            if (indexArray.indexOf(entities[i].gid) > -1) {

                selected.push(entities[i]);

            }

        }

    }

    return selected;

};

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

BlueBall.Entity.prototype.setPosition = function (x, y) {

    var pos = BlueBall.Helper.getCellPosition(x, y);

    this.cellPosition.x = x;
    this.cellPosition.y = y;
    this.x = pos.x;
    this.y = pos.y;

};

BlueBall.Entity.prototype.canRespawnAtPosition = function (position) {

    var entities = [
        this.level.getEntitesAt(position.x, position.y),
        this.level.getEntitesAt(position.x, position.y + 1),
        this.level.getEntitesAt(position.x + 1, position.y),
        this.level.getEntitesAt(position.x + 1, position.y + 1)
    ];

    for (var i = 0; i < entities.length; i++) {
        if (BlueBall.Entity.getEntitiesFromIndexArray(this.preventSpawn, entities[i]).length > 0) {
            return false;
        }
    }

    return true;

}

BlueBall.Entity.prototype.respawn = function () {

    if (this.canRespawnAtPosition(this.spawnPosition)) {

        this.setPosition(this.spawnPosition.x, this.spawnPosition.y);
        this.revive();

    } else if (this.level.map.properties.spawns) {

        for (var i = 0; i < this.level.map.properties.spawns.length; i++) {

            if (this.canRespawnAtPosition(this.level.map.properties.spawns[i])) {

                this.setPosition(this.level.map.properties.spawns[i].x, this.level.map.properties.spawns[i].y);
                this.revive();
                break;

            }

        }

    }

    if (!this.alive) {

        // TODO: Indicar que la entity ha muerto

    }

};

BlueBall.Entity.prototype.canMoveTo = function() { return false; };
