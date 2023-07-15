// noinspection NpmUsedModulesInstalled
import { stringify, parse } from 'zipson';

class JsonLocalStorage {

    async getItem(key) {
        return parse(localStorage.getItem(key));
    }

    async setItem(key, value) {
        return localStorage.setItem(key, stringify(value));
    }

    async removeItem(key) {
        return localStorage.removeItem(key);
    }
}

class StorageWrapper {

    static #storage = new JsonLocalStorage();

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

    static async getItem(key, defaultValue = null) {
        let json = await this.#storage.getItem(key) ?? null;

        return json ? this.unpack(json) : defaultValue;
    }

    static unpack(json) {
        return JSON.parse(JSON.stringify(json), this.#parser);
    }

    static async setItem(key, json) {
        if (!json) {
            await this.#storage.removeItem(key);
            return;
        }

        await this.#storage.setItem(key, this.pack(json));
    }

    static pack(json) {
        return JSON.parse(JSON.stringify(json, this.#stringifier));
    }
}

export default class SaveManager {

    static #allSaveInfos;

    static async getAllSaveInfos() {
        this.#allSaveInfos = await StorageWrapper.getItem('saves', []);

        return this.#allSaveInfos;
    }

    static async addSave(save) {
        save.saveId = Date.now();
        save.savedAt = Date.now();

        this.#allSaveInfos.push(this.createSaveInfo(save));

        await StorageWrapper.setItem('saves', this.#allSaveInfos);
        await StorageWrapper.setItem('save_' + save.saveId, save);
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

    static async getSave(saveId) {
        return await StorageWrapper.getItem('save_' + saveId);
    }

    static async removeSave(save) {
        let index = this.#allSaveInfos.findIndex(s => s.saveId === save.saveId);

        if (index !== -1) {
            await this.removeSaveByIndex(index);
        }
    }

    static async removeSaveByIndex(index) {
        let saveInfo = this.#allSaveInfos[index];
        this.#allSaveInfos.splice(index, 1);

        await StorageWrapper.setItem('saves', this.#allSaveInfos);
        await StorageWrapper.setItem('save_' + saveInfo.saveId, null);
    }

    static async clearSaves() {
        for (let i = this.#allSaveInfos.length - 1; i >= 0; i++) {
            await this.removeSaveByIndex(i);
        }
    }
}
