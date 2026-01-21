export class RedisScript<T = unknown> {
  private sha: string | null = null;

  constructor(
    public readonly lua: string,
    public readonly numberOfKeys: number,
  ) {}

  getSha(): string | null {
    return this.sha;
  }

  setSha(sha: string): void {
    this.sha = sha;
  }

  isLoaded(): boolean {
    return this.sha !== null;
  }
}
