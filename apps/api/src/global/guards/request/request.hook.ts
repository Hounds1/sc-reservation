import { Injectable } from "@nestjs/common";

@Injectable()
export class RequestHook {

    private readonly processingRequests = new Set<string>();
    private readonly requestTimestamps = new Map<string, number>();

    tryAcquire(requestId: string): boolean {
        if (!requestId) return false;

        if (this.processingRequests.has(requestId)) return true;

        this.processingRequests.add(requestId);
        this.requestTimestamps.set(requestId, Date.now());

        return false;
    }

    release(requestId: string): void {
        if (requestId) {
            this.processingRequests.delete(requestId);
            this.requestTimestamps.delete(requestId);
        }
    }

    cleanup(maxAge: number = 60000): void {
        const now = Date.now();
        for (const [requestId, timestamp] of this.requestTimestamps.entries()) {
            if (now - timestamp > maxAge) {
                this.processingRequests.delete(requestId);
                this.requestTimestamps.delete(requestId);
            }
        }
    }
}