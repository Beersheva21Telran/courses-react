import { Observable } from "rxjs";
import { getRandomInteger } from "./utils/common/random";

export default class PublisherNumbers {
    numbers: Set<number> = new Set();
    getNumbers(): Observable<number[]> {
        return new Observable<number[]>(subscriber => {
            const interval = setInterval(() => {
                try {
                    const num: number = getRandomInteger(10, 15);
                    if (!this.numbers.has(num)) {
                        this.numbers.add(num);
                        subscriber.next(Array.from(this.numbers))
                        console.log("published with " + num)
                    }
                } catch (err) {
                    subscriber.error(err);
                    clearInterval(interval);
                }
            }, 2000);
            return () => clearInterval(interval)
        })
    }
}


