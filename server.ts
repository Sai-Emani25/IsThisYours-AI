import express from 'express';
import path from 'path';
import 'dotenv/config';
import { runCitationEngine, SYSTEM_INSTRUCTION_DEFAULT } from './src/server/citationService';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.get('/api/system-instruction', (req, res) => {
  res.json({ systemInstruction: SYSTEM_INSTRUCTION_DEFAULT });
});

app.post('/api/analyze-citations', async (req, res) => {
  try {
    const { textChunk, ragSources, citationStyle, customInstruction } = req.body;
    
    if (!textChunk || typeof textChunk !== 'string') {
      return res.status(400).json({ error: 'textChunk string is required' });
    }

    const result = await runCitationEngine(
      textChunk,
      ragSources || [],
      citationStyle || 'apa',
      customInstruction
    );

    res.json(result);
  } catch (err: unknown) {
    console.error('Server error in /api/analyze-citations:', err);
    res.status(500).json({ error: (err as Error)?.message || 'Internal server error' });
  }
});

// In production, serve static assets built into dist
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Citation Engine production server listening on port ${port}`);
});
