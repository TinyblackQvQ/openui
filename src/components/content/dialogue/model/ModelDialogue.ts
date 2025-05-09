abstract class ModelDialogue {
  constructor() {
    this.history = []
  }
  history: Array<{ isUser: boolean; content: string }>
  abstract send(content: string): Promise<string>
}

export { ModelDialogue }
