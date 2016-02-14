BlueBall.Entity = function (game, x, y, key, frame, options) {
    options = options || {};

    var level = game.state.getCurrentState();
    var pos = level.getCellPosition(x, y);

    Phaser.Sprite.call(this, game, pos.x, pos.y, key, frame);

    this.anchor.set(0.5, 0.5);

    this.width = level.tileSize.width;
    this.height = level.tileSize.height;

    this.level = level;
    this.spawnPosition = {
        'x': x,
        'y': y
    };
    this.cellPosition = {
        'x': x,
        'y': y
    };
    this.toDestroy = false;

    this.gid = typeof options.gid === 'number' ? options.gid : -1;

    this.canBePushed = typeof options.canBePushed === 'boolean' ? options.canBePushed : true;
    this.canBeCaptured = typeof options.canBeCaptured === 'boolean' ? options.canBeCaptured : true;
};

BlueBall.Entity.prototype = Object.create(Phaser.Sprite.prototype);
BlueBall.Entity.prototype.constructor = BlueBall.Entity;

BlueBall.Entity.prototype.tilesThatPreventSpawn = BlueBall.Helper.getTileIds('Rock', 'Bush', 'Lava', 'Wall', 'Water', 'Bridge', 'Arrow', 'LavaBridge', 'Grass');
BlueBall.Entity.prototype.entitiesThatPreventSpawn = BlueBall.Helper.getEntityIds('Alma', 'Block', 'DonMedusa', 'Egg', 'Gol', 'Leeper', 'Medusa', 'Rocky', 'Skull', 'Snakey', 'Chest', 'DoorClosed', 'DoorOpened', 'Heart');

BlueBall.Entity.prototype.occupy = function (x, y) {
    return (this.cellPosition.x === x || this.cellPosition.x + 1 === x) && (this.cellPosition.y === y || this.cellPosition.y + 1 === y);
};

BlueBall.Entity.prototype.cellsAt = function (direction) {
    var posX = this.cellPosition.x;
    var posY = this.cellPosition.y;
    var offsetX = 0;
    var offsetY = 0;
    var altX = 0;
    var altY = 0;

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

    return [{
        'x': posX + offsetX,
        'y': posY + offsetY
    }, {
        'x': posX + altX + offsetX,
        'y': posY + altY + offsetY
    }];
};

BlueBall.Entity.prototype.setCellPosition = function (x, y) {
    var pos = this.level.getCellPosition(x, y);

    this.cellPosition.x = x;
    this.cellPosition.y = y;
    this.x = pos.x;
    this.y = pos.y;
};

BlueBall.Entity.prototype.canRespawnAtPosition = function (position) {
    var posx = position.x >> 1;
    var posy = position.y >> 1;

    var tiles = [
        this.level.map.getTile(posx, posy, 'environment', true),
        this.level.map.getTile(posx, posy + 1, 'environment', true),
        this.level.map.getTile(posx + 1, posy, 'environment', true),
        this.level.map.getTile(posx + 1, posy + 1, 'environment', true)
    ];

    var entities = [
        this.level.getEntitesAt(position.x, position.y),
        this.level.getEntitesAt(position.x, position.y + 1),
        this.level.getEntitesAt(position.x + 1, position.y),
        this.level.getEntitesAt(position.x + 1, position.y + 1)
    ];

    for (var i = 0; i < 4; i++) {
        if (
            BlueBall.Helper.getTilesFromIndexArray(this.tilesThatPreventSpawn, tiles[i]).length > 0 ||
            BlueBall.Helper.getEntitiesFromIndexArray(this.entitiesThatPreventSpawn, entities[i]).length > 0
        ) {
            return false;
        }
    }

    return true;
}

BlueBall.Entity.prototype.respawn = function () {
    if (this.canRespawnAtPosition(this.spawnPosition)) {
        this.setCellPosition(this.spawnPosition.x, this.spawnPosition.y);
        this.revive();
    } else if (this.level.map.properties.spawns) {
        for (var i = 0; i < this.level.map.properties.spawns.length; i++) {
            if (this.canRespawnAtPosition(this.level.map.properties.spawns[i])) {
                this.setCellPosition(this.level.map.properties.spawns[i].x, this.level.map.properties.spawns[i].y);
                this.revive();
                break;
            }
        }
    }

    if (!this.alive) {
        // TODO: Indicar que la entity ha muerto
    }
};

BlueBall.Entity.prototype.canMoveTo = function () {
    return false;
};
