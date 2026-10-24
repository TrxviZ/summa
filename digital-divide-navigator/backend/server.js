import express from 'express';
import cors from 'cors';
import { LocalAIProvider } from './ai/ollamaProvider.js';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const ai = new LocalAIProvider();

// Load Agent Skill Instructions
const skillInstructions = fs.readFileSync('../skills/digital-divide-navigator/instructions.md', 'utf-8');

app.post('/api/plan', async (req, res) => {
  const { goal } = req.body;
  const prompt = `Based on this goal: "${goal}", create a simple 3-step plan. Return ONLY JSON in this format: { "plan": ["step 1", "step 2", "step 3"] }`;
  
  try {
    const result = await ai.generateJSON(skillInstructions, prompt);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed', details: err.message });
  }
});

app.post('/api/explain', async (req, res) => {
  const { field } = req.body;
  const prompt = `Explain the form field "${field}" to an elderly person in one very simple sentence. Return ONLY JSON: { "explanation": "..." }`;
  
  try {
    const result = await ai.generateJSON(skillInstructions, prompt);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'AI processing failed' });
  }
});

app.listen(3001, () => console.log('Backend running securely on http://localhost:3001'));