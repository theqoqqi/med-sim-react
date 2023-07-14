// noinspection NpmUsedModulesInstalled
import { stringify, parse } from 'zipson';

class JsonLocalStorage {

    static getItem(key, defaultValue = null) {
        let jsonText = localStorage.getItem(key) ?? null;

        return jsonText ? this.parse(jsonText) : defaultValue;
    }

    static parse(jsonText) {
        return parse(jsonText);
    }

    static setItem(key, json) {
        if (!json) {
            localStorage.removeItem(key);
            return;
        }

        localStorage.setItem(key, this.stringify(json));
    }

    static stringify(json) {
        return stringify(json);
    }
}

export default class SaveManager {

    static #allSaveInfos;

    static getAllSaveInfos() {
        if (!this.#allSaveInfos) {
            this.#allSaveInfos = JsonLocalStorage.getItem('saves', []);
        }

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
