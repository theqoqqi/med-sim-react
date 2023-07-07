import Parameter from './Parameter';

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

    copy() {
        let copiedParameters = {};

        for (const [parameterName, parameter] of Object.entries(this.parameters)) {
            copiedParameters[parameterName] = parameter.copy();
        }

        return new CompositeParameter(this.descriptor, copiedParameters);
    }
}