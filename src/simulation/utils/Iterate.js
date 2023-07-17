
export default class Iterate {

    static flattenHierarchy({ root, isParent, getChildren, includeParents, startPath = null, mapper }) {
        mapper ??= child => child;

        let flattened = [];

        this.iterateHierarchy({
            root,
            isParent,
            getChildren,
            includeParents,
            startPath,
            callback: (child, childPath) => {
                flattened.push(mapper(child, childPath));
            },
        })

        return flattened;
    }

    static iterateHierarchy({ root, isParent, getChildren, includeParents, startPath = null, callback }) {

        let hasChildren = isParent(root, startPath);

        if (!hasChildren || includeParents) {
            callback(root, startPath);
        }

        if (!hasChildren) {
            return;
        }

        Object.entries(getChildren(root))
            .forEach(([childKey, child]) => {
                let fullPath = startPath
                    ? startPath + '.' + childKey
                    : childKey;

                this.iterateHierarchy({
                    root: child,
                    isParent,
                    getChildren,
                    includeParents,
                    startPath: fullPath,
                    callback,
                });
            });
    }
}