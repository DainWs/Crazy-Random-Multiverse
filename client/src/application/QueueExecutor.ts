type Task = () => Promise<void>;

class QueueExecutor {
  private readonly queue: Task[];
  private isActive: boolean;

  public constructor() {
    this.queue = [];
    this.isActive = false;
  }

  public enqueue(task: Task): void {
    const wrappedTask = async () => {
      try {
        this.isActive = true;
        await task();
      } catch (error) {
        console.log(error);
      } finally {
        this.isActive = false;
        this.processNext();
      }
    };

    this.queue.push(wrappedTask);
    this.processNext();
  }

  private processNext(): void {
    if (this.queue.length > 0 && !this.isActive) {
      const nextTask = this.queue.shift()!;
      nextTask();
    }
  }
}

export default QueueExecutor;