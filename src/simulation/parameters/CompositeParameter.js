import Parameter from './Parameter';

export default class CompositeParameter extends Parameter {

    get parameters() {
        return this.value;
    }

    update() {
        this.forEachParameter((parameterName, parameter) => {
            parameter.update();
        });
    }

    randomize() {
        this.forEachParameter((parameterName, parameter) => {
            parameter.randomize();
        });
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

    forEachParameter(callback) {
        for (const [parameterName, parameter] of Object.entries(this.parameters)) {
            if (parameter instanceof CompositeParameter) {
                parameter.forEachParameter((childName, child) => {
                    callback(parameterName + '.' + childName, child);
                });
            } else {
                callback(parameterName, parameter);
            }
        }
    }

    isInNormalRange() {
        return Object.values(this.parameters)
            .every(param => param.isInNormalRange());
    }

    isInViableRange() {
        return Object.values(this.parameters)
            .every(param => param.isInViableRange());
    }

    copy() {
        let copiedParameters = {};

        for (const [parameterName, parameter] of Object.entries(this.parameters)) {
            copiedParameters[parameterName] = parameter.copy();
        }

        return new CompositeParameter(this.descriptor, copiedParameters);
    }
}