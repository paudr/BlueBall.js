Editor.Data = (function () {
    function Data(options, container) {
        this.options = Editor.Helper.extend({
            onLoad: function() {},
            onSave: function() {}
        }, options);

        this.readFile = document.createElement('input');
        this.readFile.type = "file";
        container.appendChild(this.readFile);

        this.loadButton = document.createElement('button');
        this.loadButton.textContent = 'Load';
        this.loadButton.addEventListener('click', Data.prototype.loadData.bind(this), true)
        container.appendChild(this.loadButton);

        this.saveButton = document.createElement('button');
        this.saveButton.textContent = 'Save';
        this.saveButton.addEventListener('click', Data.prototype.saveData.bind(this), true)
        container.appendChild(this.saveButton);
    }

    Data.prototype = Object.create(Object.prototype);
    Data.prototype.constructor = Data;

    Data.prototype.loadData = function() {
        if (this.readFile.files.length > 0) {
            var reader = new FileReader();
            reader.addEventListener('load', function(event) {
                this.options.onLoad(JSON.parse(event.target.result));
            }.bind(this));
            reader.readAsText(this.readFile.files[0]);
        } else {
            alert('No se ha seleccionado ningun archivo.');
        }
    };

    Data.prototype.saveData = function() {
    };

    return Data;
})();
