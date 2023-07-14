
class JsonLocalStorage {

    static #stringifier = (key, value) => {
        if (value !== value) {
            return 'NaN';
        }

        if (value === Infinity) {
            return 'Infinity';
        }

        if (value === -Infinity) {
            return '-Infinity';
        }

        return value;
    };

    static #parser = (key, value) => {
        if (value === 'NaN') {
            return NaN;
        }

        if (value === 'Infinity') {
            return Infinity;
        }

        if (value === '-Infinity') {
            return -Infinity;
        }

        return value;
    };

    static getItem(key, defaultValue = null) {
        let jsonText = localStorage.getItem(key) ?? null;

        return jsonText ? JSON.parse(jsonText, this.#parser) : defaultValue;
    }

    static setItem(key, json) {
        if (!json) {
            localStorage.removeItem(key);
            return;
        }

        localStorage.setItem(key, JSON.stringify(json, this.#stringifier));
    }
}

export default class SaveManager {

    static getAllSaves() {
        return JsonLocalStorage.getItem('saves', []);
    }

    static addSave(saveJson) {
        let saves = this.getAllSaves();

        saveJson.saveId = Date.now();
        saveJson.savedAt = Date.now();
        saves.push(saveJson);

        JsonLocalStorage.setItem('saves', saves);
    }

    static removeSave(save) {
        let saves = this.getAllSaves();
        let index = saves.findIndex(s => s.saveId === save.saveId);

        if (index !== -1) {
            this.removeSaveByIndex(index);
        }
    }

    static removeSaveByIndex(index) {
        let saves = this.getAllSaves();

        saves.splice(index, 1);

        JsonLocalStorage.setItem('saves', saves);
    }

    static clearSaves() {
        JsonLocalStorage.setItem('saves', null);
    }
}
