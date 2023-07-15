// noinspection NpmUsedModulesInstalled
import { stringify, parse } from 'zipson';

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

        if (typeof value === 'number') {
            return +Math.round(value * 1e6) / 1e6;
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

        return jsonText ? this.parse(jsonText) : defaultValue;
    }

    static parse(jsonText) {
        return JSON.parse(JSON.stringify(parse(jsonText)), this.#parser);
    }

    static setItem(key, json) {
        if (!json) {
            localStorage.removeItem(key);
            return;
        }

        localStorage.setItem(key, this.stringify(json));
    }

    static stringify(json) {
        return stringify(JSON.parse(JSON.stringify(json, this.#stringifier)));
    }
}

export default class SaveManager {

    static #allSaveInfos;

    static getAllSaveInfos() {
        this.#allSaveInfos = JsonLocalStorage.getItem('saves', []);

        return this.#allSaveInfos;
    }

    static addSave(save) {
        save.saveId = Date.now();
        save.savedAt = Date.now();

        this.#allSaveInfos.push(this.createSaveInfo(save));

        JsonLocalStorage.setItem('saves', this.#allSaveInfos);
        JsonLocalStorage.setItem('save_' + save.saveId, save);
    }

    static createSaveInfo(save) {
        return {
            title: save.title,
            saveId: save.saveId,
            savedAt: save.savedAt,
            startedAt: save.startedAt,
            currentDay: save.currentDay,
            totalHumans: save.world.humans.length,
            aliveHumans: save.world.humans.filter(h => h.isAlive).length,
        };
    }

    static getSave(saveId) {
        return JsonLocalStorage.getItem('save_' + saveId);
    }

    static removeSave(save) {
        let index = this.#allSaveInfos.findIndex(s => s.saveId === save.saveId);

        if (index !== -1) {
            this.removeSaveByIndex(index);
        }
    }

    static removeSaveByIndex(index) {
        let saveInfo = this.#allSaveInfos[index];
        this.#allSaveInfos.splice(index, 1);

        JsonLocalStorage.setItem('saves', this.#allSaveInfos);
        JsonLocalStorage.setItem('save_' + saveInfo.saveId, null);
    }

    static clearSaves() {
        for (let i = this.#allSaveInfos.length - 1; i >= 0; i++) {
            this.removeSaveByIndex(i);
        }
    }
}
