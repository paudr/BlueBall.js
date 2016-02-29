var Editor = {
    init: function () {
        var tilemap = new Editor.Tilemap({}, document.getElementById('tilemap'));

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
    Helper: {
        extend: function (base) {
            Array.prototype.slice.call(arguments, 1).forEach(function (current) {
                Object.getOwnPropertyNames(current).forEach(function (name) {
                    base[name] = current[name];
                })
            });
            return base;
        }
    }
};
