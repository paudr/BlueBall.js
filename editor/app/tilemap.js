Editor.Tilemap = (function () {
    function getEmptyMap(width, height) {
        var map = [];
        var x, y, row, tileId;

        for (y = 0; y < height; y++) {
            row = [];
            map.push(row);
            for (x = 0; x < width; x++) {
                if (x === 0 || x === width - 1) {
                    tileId = 7;
                } else {
                    if (y === 0 || y === height - 1) {
                        tileId = 5
                    } else if (y === 1) {
                        tileId = 9;
                    } else {
                        tileId = 36;
                    }
                }
                row.push({
                    x: x,
                    y: y,
                    tileId: tileId
                });
            }
        }
        map[0][0].tileId = 4;
        map[0][width - 1].tileId = 6;
        map[1][1].tileId = 8;
        map[height - 1][0].tileId = 11;
        map[height - 1][width - 1].tileId = 13;

        return map.reduce(function (previous, current) {
            return previous.concat(current)
        }, []);
    }

    function Tile(options, tilemap) {
        this.options = Editor.Helper.extend({
            tileId: 0,
            x: 0,
            y: 0,
            tileWidth: 32,
            tileHeight: 32,
            tileset: 'assets/aol3.png'
        }, options);

        this.tilemap = tilemap;

        this.domElement = document.createElement('div');
        this.domElement.style.position = 'absolute';
        this.domElement.style.overflow = 'hidden';
        this.domElement.style.left = (this.options.x * this.options.tileWidth) + 'px'
        this.domElement.style.top = (this.options.y * this.options.tileHeight) + 'px'
        this.domElement.style.width = this.options.tileWidth + 'px';
        this.domElement.style.height = this.options.tileHeight + 'px';

        this.tileset = document.createElement('img');
        this.tileset.src = this.options.tileset;

        var tilsetWidth = Math.floor(this.tileset.width / this.options.tileWidth);

        this.tileset.style.position = 'absolute';
        this.tileset.style.left = (-((this.options.tileId - 1) % tilsetWidth) * this.options.tileWidth) + 'px';
        this.tileset.style.top = (-Math.floor((this.options.tileId - 1) / tilsetWidth) * this.options.tileHeight) + 'px';

        this.domElement.appendChild(this.tileset);
        this.tilemap.domElement.appendChild(this.domElement);
    }

    Tile.prototype = Object.create(Object.prototype);
    Tile.prototype.constructor = Tile;

    Tile.prototype.destroy = function () {
        this.tilemap.domElement.removeChild(this.domElement);
    }

    function Tilemap(options, container) {
        this.options = Editor.Helper.extend({
            width: 13,
            height: 14,
            tileWidth: 32,
            tileHeight: 32,
            tileset: 'assets/aol3.png'
        }, options);

        this.domElement = document.createElement('div');
        this.domElement.style.position = 'static';
        this.domElement.style.width = (this.options.width * this.options.tileWidth) + 'px';
        this.domElement.style.height = (this.options.height * this.options.tileHeight) + 'px';
        this.domElement.style.backgroundColor = 'black';

        this.tiles = [];
        getEmptyMap(this.options.width, this.options.height).forEach(this.addTile, this);

        container.appendChild(this.domElement);
    }

    Tilemap.prototype = Object.create(Object.prototype);
    Tilemap.prototype.constructor = Tilemap;

    Tilemap.prototype.addTile = function (options) {
        var tile = new Tile(Editor.Helper.extend({
            tileWidth: this.options.tileWidth,
            tileHeight: this.options.tileHeight,
            tileset: this.options.tileset
        }, options), this);
        this.tiles.push(tile);
        return tile;
    };

    Tilemap.prototype.removeTile = function (tile) {
        var index = this.tiles.indexOf(tile);
        if (index >= 0) {
            this.tiles.splice(index, 1);
            tile.destroy();
        }
    };

    Tilemap.prototype.setSize = function (width, height) {
        if (this.options.width !== width || this.options.height !== height) {
            this.tiles.filter(function (tile) {
                return tile.options.x >= width || tile.options.y >= height;
            }).forEach(this.removeTile, this);

            getEmptyMap(width, height).filter(function (cell) {
                return cell.x >= this.options.width || cell.y >= this.options.height;
            }, this).forEach(this.addTile, this);

            this.options.width = width;
            this.options.height = height;

            this.domElement.style.width = (this.options.width * this.options.tileWidth) + 'px';
            this.domElement.style.height = (this.options.height * this.options.tileHeight) + 'px';
        }
    };

    return Tilemap;
})();
