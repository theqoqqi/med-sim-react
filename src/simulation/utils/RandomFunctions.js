
export default class RandomFunctions {

    static LINEAR = 'linear';

    static GAUSSIAN = 'gaussian';

    static linear(min, max) {
        return min + Math.random() * (max - min);
    }

    static gaussian(mean = 0, deviation = 1) {
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

        return z * deviation + mean;
    }

    static randomInRange(range, randomType = 'linear', options = {}) {
        if (randomType === this.LINEAR) {
            return this.linear(range.min, range.max);
        }

        if (randomType === this.GAUSSIAN) {
            const meanOrigin = options?.meanOrigin ?? 0.5;
            const deviationFactor = options?.deviationFactor ?? 1;
            const { mean, deviation } = this.getMeanDev(range, meanOrigin);

            return this.gaussian(mean, deviation * deviationFactor);
        }

        throw new Error('Unsupported random type: ' + randomType);
    }

    static getMeanDev(range, meanOrigin = 0.5) {
        const min = range.min;
        const max = range.max;
        const mean = min + (max - min) * meanOrigin;
        const deviationFactor = 1 + Math.abs(meanOrigin - 0.5) * 2;
        const deviation = (max - min) / 6 * deviationFactor;

        return { mean, deviation };
    }
}