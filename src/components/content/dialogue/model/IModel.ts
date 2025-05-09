import type { ModelDialogue } from './ModelDialogue'

export abstract class IModel {
  constructor(id: string, apiKey: string | null = null) {
    this.id = id
    if (apiKey) {
      localStorage.setItem(`apikey-${id}`, apiKey)
    }
    this.apiKey = apiKey || localStorage.getItem(`apikey-${id}`) || ''

    if (this.apiKey.length === 0) {
      throw new Error(`API key is required for model ${id}, and it was not found in localStorage`)
    }
  }
  id: string
  apiKey: string
  abstract create(): ModelDialogue
}
