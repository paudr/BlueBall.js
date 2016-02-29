Editor.Tileset = (function () {
    var validTileIds = [
        1, // Rock
        2, // Bush
        3, // Lava
        4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, // Wall
        18, 19, 20, 21, 22, // Water
        23, 24, // Bridge
        25, 26, 27, 28, // Arrow
        32, 33, 34, 35, // LavaBridge
        36, // Floor
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, // Sand
        53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68 // Grass
    ];
    var validObjectIds = [
        { tileId: 77 }, // Alma
        { tileId: 29 }, // Block
        { tileId: 85 }, // DonMedusa
        { tileId: 81, direction: 0 }, // Gol
        { tileId: 82, direction: 1 }, // Gol
        { tileId: 83, direction: 2 }, // Gol
        { tileId: 84, direction: 3 }, // Gol
        { tileId: 69 }, // Leeper
        { tileId: 98 }, // Medusa
        { tileId: 99 }, // Player
        { tileId: 73 }, // Rocky
        { tileId: 93 }, // Skull
        { tileId: 97 }, // Snakey
        { tileId: 117 }, // Chest
        { tileId: 15 }, // DoorClosed
        { tileId: 30 }, // Heart
        { tileId: 31, eggs: 2 } // Heart
    ];

    function Selector(options, tileset) {
        this.options = Editor.Helper.extend({
            tileWidth: 32,
            tileHeight: 32,
            x: 0,
            y: 0,
            visible: false
        }, options);

        this.tileset = tileset;

        this.domElement = document.createElement('div');
        this.domElement.style.position = 'absolute';
        this.domElement.style.width = this.options.tileWidth + 'px';
        this.domElement.style.height = this.options.tileHeight + 'px';
        this.domElement.style.border = '2px solid magenta';

        this.updatePosition();
        this.updateVisible();

        this.tileset.domElement.appendChild(this.domElement);
    }

    Selector.prototype = Object.create(Object.prototype);
    Selector.prototype.constructor = Selector;

    Selector.prototype.setVisible = function (visible) {
        this.options.visible = !!visible;
        this.updateVisible();
    }

    Selector.prototype.setPosition = function (x, y) {
        this.options.x = x;
        this.options.y = y;
        this.updatePosition();
    }

    Selector.prototype.inPosition = function (x, y) {
        return this.options.x === x && this.options.y === y;
    }

    Selector.prototype.updatePosition = function () {
        this.domElement.style.left = ((this.options.x * this.options.tileWidth) - 2) + 'px';
        this.domElement.style.top = ((this.options.y * this.options.tileHeight) - 2) + 'px';
    }

    Selector.prototype.updateVisible = function () {
        this.domElement.style.display = this.options.visible ? 'inline' : 'none';
    }

    function Tileset(options, container) {
        this.options = Editor.Helper.extend({
            tileWidth: 32,
            tileHeight: 32,
            tileset: 'assets/aol3.png'
        }, options);

        this.domElement = document.createElement('div');
        this.domElement.style.position = 'relative';

        var image = document.createElement('img');
        image.src = this.options.tileset;

        this.domElement.style.width = image.width + 'px';
        this.domElement.style.height = image.height + 'px';

        this.options.tilesetWidth = Math.floor(image.width / this.options.tileWidth);
        this.options.tilesetHeight = Math.floor(image.height / this.options.tileHeight);

        this.domElement.appendChild(image);

        this.selector = new Selector({
            tileWidth: this.options.tileWidth,
            tileHeight: this.options.tileHeight
        }, this)

        this.domElement.addEventListener('click', Tileset.prototype.handleClick.bind(this, 'left'), true);
        this.domElement.addEventListener('contextmenu', Tileset.prototype.handleClick.bind(this, 'right'), true);

        container.appendChild(this.domElement);
    }

    Tileset.prototype = Object.create(Object.prototype);
    Tileset.prototype.constructor = Tileset;

    Tileset.prototype.handleClick = function (button, event) {
        event.preventDefault();

        var pos = Editor.Helper.getPositionFromCoords(
            this.domElement, {
                x: event.clientX,
                y: event.clientY
            }, {
                width: this.options.tileWidth,
                height: this.options.tileHeight
            }
        );

        if (button === 'left') {
            this.selector.setPosition(pos.x, pos.y);
            this.selector.setVisible(true);
        } else if (button === 'right') {
            if (this.selector.inPosition(pos.x, pos.y)) {
                this.selector.setVisible(false);
            }
        }
    };

    Tileset.prototype.getSelected = function () {
        if (this.selector.options.visible) {
            var tileId = this.selector.options.x + (this.selector.options.y * this.options.tilesetWidth) + 1;
            if (validTileIds.indexOf(tileId) >= 0) {
                return {
                    type: 'tile',
                    tileId: tileId
                }
            }
            var object = validObjectIds.find(function(object) {
                return object.tileId === tileId;
            });
            if (object) {
                return Editor.Helper.extend({ type: 'object' }, object);
            }
        }
    }

    return Tileset;
})();
