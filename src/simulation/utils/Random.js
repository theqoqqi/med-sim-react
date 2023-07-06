
export default class Random {

    static nextInt(min, max) {
        return min + Math.floor(Math.random() * (max - min));
    }

    static fromList(list) {
        if (list.length === 0) {
            return null;
        }

        let randomIndex = this.nextInt(0, list.length);

        return list[randomIndex];
    }

    static weightedByField(items, fieldName) {
        let totalWeight = 0;

        for (const item of items) {
            totalWeight += item[fieldName];
        }

        const randomWeight = Math.random() * totalWeight;

        let accumulatedWeight = 0;

        for (const item of items) {
            accumulatedWeight += item[fieldName];

            if (randomWeight <= accumulatedWeight) {
                return item;
            }
        }

        return null;
    }
}