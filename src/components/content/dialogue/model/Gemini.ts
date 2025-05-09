import { GoogleGenAI } from "@google/genai";
import { IModel } from "./IModel";
import type { ModelDialogue } from "./ModelDialogue";
const ai = new GoogleGenAI({ apiKey: "GEMINI_API_KEY" });


class Gemini extends IModel {
  constructor(id: string, apiKey: string | null = null) {
    super(id, apiKey);
  }
  create(): ModelDialogue {

  }
}
