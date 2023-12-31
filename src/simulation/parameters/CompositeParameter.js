import Parameter from './Parameter';
import ParameterFactory from './ParameterFactory.js';

export default class CompositeParameter extends Parameter {

    get parameters() {
        return this.value;
    }

    get children() {
        return Object.values(this.parameters);
    }

    update() {
        this.forEach(parameter => parameter.update());
    }

    randomize() {
        this.forEach(parameter => parameter.randomize());
    }

    setParameterValue(path, newValue) {
        let parameter = this.getParameter(path);

        if (parameter) {
            parameter.value = newValue;
        }
    }

    getParameterValue(path) {
        let parameter = this.getParameter(path);

        return parameter?.value;
    }

    getParameter(path) {
        const parameterNames = path.split('.');
        const lastParameterName = parameterNames.pop();

        let currentParameters = this.parameters;

        for (const parameterName of parameterNames) {
            currentParameters = currentParameters[parameterName]?.value;

            if (!currentParameters) {
                return null;
            }
        }

        return currentParameters[lastParameterName];
    }

    forEach(callback) {
        for (const [parameterPath, parameter] of Object.entries(this.parameters)) {
            callback(parameter, parameterPath);
        }
    }

    forEachRecursive(callback) {
        this.forEach((parameter, parameterPath) => {
            if (parameter instanceof CompositeParameter) {
                parameter.forEachRecursive((child, childName) => {
                    callback(child, parameterPath + '.' + childName);
                });
            } else {
                callback(parameter, parameterPath);
            }
        });
    }

    map(callback) {
        let mapped = [];

        this.forEach((parameter, parameterPath) => mapped.push(callback(parameter, parameterPath)))

        return mapped;
    }

    mapRecursive(callback) {
        let mapped = [];

        this.forEachRecursive((parameter, parameterPath) => mapped.push(callback(parameter, parameterPath)))

        return mapped;
    }

    isInNormalRange() {
        return this.children.every(p => p.isInNormalRange());
    }

    isInViableRange() {
        return this.children.every(p => p.isInViableRange());
    }

    getDiscomfortLevel() {
        let discomfortLevels = this.map(p => p.getDiscomfortLevel());

        return this.multiplyChances(discomfortLevels);
    }

    getLethalityLevel() {
        let lethalityLevels = this.map(p => p.getLethalityLevel());

        return this.multiplyChances(lethalityLevels);
    }

    multiplyChances(chances) {
        let totalChance = 1;

        for (const chance of chances) {
            totalChance *= 1 - chance;
        }

        return 1 - totalChance;
    }

    toJson() {
        return {
            ...super.toJson(),
            value: CompositeParameter.#parametersToJson(this.parameters),
        };
    }

    static #parametersToJson(parameters) {
        let json = {};

        for (const [parameterName, parameter] of Object.entries(parameters)) {
            json[parameterName] = parameter.toJson();
        }

        return json;
    }

    static fromJson(json) {
        return new CompositeParameter({
            ...json,
            value: this.#jsonToParameters(json.value),
        });
    }

    static #jsonToParameters(parameterJsons) {
        let parameters = {};

        for (const [parameterName, parameterJson] of Object.entries(parameterJsons)) {
            parameters[parameterName] = ParameterFactory.getType(parameterJson.className).fromJson(parameterJson);
        }

        return parameters;
    }
}