var Editor = {
    init: function () {
        Editor.preload(Editor.createComponents);
    },
    createComponents: function () {
        var tileset = new Editor.Tileset({}, document.getElementById('tileset'));
        var tilemap = new Editor.Tilemap({
            onClick: function(tilemap, button, position) {
                if (button === 'left') {
                    var selected = tileset.getSelected();
                    if (selected) {
                        if (selected.type === 'tile') {
                            tilemap.setTile(position.x, position.y, selected.tileId);
                        } else if (selected.type === 'object') {
                            tilemap.addObject(Editor.Helper.extend({
                                x: position.x,
                                y: position.y
                            }, selected));
                        }
                    }
                } else if (button === 'right') {
                    tilemap.removeObjects(position.x, position.y);
                }
            }
        }, document.getElementById('tilemap'));
        new Editor.Data({
            onLoad: function(data) {
                tilemap.setData(data);
            },
            onSave: function() {
                return tilemap.getData();
            }
        }, document.getElementById('data'));

        function onChangeSize(event) {
            var width = tilemap.options.width;
            var height = tilemap.options.height;

            if (isNaN(event.target.value)) {
                document.getElementById('widthSelector').value = width.toString();
                document.getElementById('heightSelector').value = width.toString();
            } else {
                if (event.target.id === 'widthSelector') {
                    width = parseInt(event.target.value, 10);
                } else if (event.target.id === 'heightSelector') {
                    height = parseInt(event.target.value, 10);
                }
                tilemap.setSize(width, height);
            }
        }

        Array.prototype.forEach.call(document.querySelectorAll('#widthSelector, #heightSelector'), function (element) {
            element.addEventListener('change', onChangeSize, false);
        });
    },
    preload: function(callback) {
        var img = new Image();
        img.onload = function() {
            callback();
        }
        img.src = 'assets/aol3.png';
    },
    Helper: {
        extend: function (base) {
            Array.prototype.slice.call(arguments, 1).forEach(function (current) {
                Object.getOwnPropertyNames(current).forEach(function (name) {
                    base[name] = current[name];
                })
            });
            return base;
        },
        getPositionFromCoords: function(element, coords, tileSize) {
            var getNumericStyleProperty = function (style, prop) {
                return parseInt(style.getPropertyValue(prop), 10);
            };
            var element_position = function (element) {
                    var x = 0,
                        y = 0;
                    var inner = true;
                    while (element) {
                        x += element.offsetLeft;
                        y += element.offsetTop;
                        var style = getComputedStyle(element, null);
                        var borderTop = getNumericStyleProperty(style, "border-top-width");
                        var borderLeft = getNumericStyleProperty(style, "border-left-width");
                        y += borderTop;
                        x += borderLeft;
                        if (inner) {
                            var paddingTop = getNumericStyleProperty(style, "padding-top");
                            var paddingLeft = getNumericStyleProperty(style, "padding-left");
                            y += paddingTop;
                            x += paddingLeft;
                        }
                        inner = false;
                        element = element.offsetParent;
                    }
                    return { x: x, y: y };
            };
            var container = element_position(element);
            return {
                x: Math.floor((coords.x - container.x) / tileSize.width),
                y: Math.floor((coords.y - container.y) / tileSize.height)
            };
        }
    }
};
