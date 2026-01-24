export class DatetimeProvider {
    static now(): number {
        return Math.floor(Date.now() / 1000);
    }
    
    static nowInMilliseconds(): number {
        return Date.now();
    }

    static fromMilliseconds(milliseconds: number): number {
        return Math.floor(milliseconds / 1000);
    }
}