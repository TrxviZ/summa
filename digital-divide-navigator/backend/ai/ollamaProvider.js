import fetch from 'node-fetch';

// Abstraction layer for Open-Weight AI
export class LocalAIProvider {
  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
    this.model = process.env.MODEL_NAME || 'llama3'; // or mistral, phi3
  }

  async generateJSON(systemPrompt, userPrompt) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: `${systemPrompt}\n\nUser: ${userPrompt}`,
        format: 'json',
        stream: false,
      })
    });

    if (!response.ok) throw new Error('Failed to connect to local AI');
    const data = await response.json();
    try {
      return JSON.parse(data.response);
    } catch (e) {
      console.error("AI did not return valid JSON:", data.response);
      throw new Error("AI parsing error");
    }
  }
}