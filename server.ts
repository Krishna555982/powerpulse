import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI Client successfully initialized.');
  } catch (err) {
    console.error('Failed to initialize Gemini AI Client:', err);
  }
} else {
  console.log('No valid GEMINI_API_KEY found. Chatbot running in high-fidelity simulation fallback mode.');
}

// Local Expert Solar Assistant Fallback Logic
function getFallbackResponse(message: string): string {
  const query = message.toLowerCase();
  
  if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
    return 'Hello! Welcome to Power Pulse Energy support. I can assist you with system sizing, cost estimates, ROI calculations, and booking a free technical consultation. How can I help you today?';
  }
  if (query.includes('cost') || query.includes('price') || query.includes('how much') || query.includes('expensive')) {
    return 'Our systems are custom engineered for maximum yield. Pre-incentive costs average $1,900/kW for commercial setups and $2,800/kW for residential installations. Note that a 30% Federal Investment Tax Credit (ITC) is immediately available, bringing your actual net cost down significantly!';
  }
  if (query.includes('save') || query.includes('saving') || query.includes('bill')) {
    return 'By switching to solar, most clients reduce or completely offset their monthly utility bills. For instance, a commercial user with a $4,500 monthly bill can save upwards of $48,600 annually! Try adjusting our interactive savings calculator above to see your exact projection.';
  }
  if (query.includes('payback') || query.includes('roi') || query.includes('return')) {
    return 'With the 30% Federal Investment Tax Credit (ITC) and local efficiency incentives, our clients see full payback on their investment in just 4.5 to 6 years, after which the electricity generated is 100% free profit.';
  }
  if (query.includes('roof') || query.includes('area') || query.includes('size')) {
    return 'We recommend approximately 66 sq ft of roof space per 1 kW of solar capacity. For example, a 12,000 sq ft roof can easily accommodate a high-performance 150 kW system!';
  }
  if (query.includes('about') || query.includes('philosophy') || query.includes('who are you')) {
    return 'Power Pulse Energy is the premier provider of enterprise-grade and high-end residential solar infrastructure. We combine engineering precision with premium aesthetics to deliver sustainable, scalable power. Our core values are Uncompromising Precision, Technological Transparency, and Structural Integrity.';
  }
  if (query.includes('consultation') || query.includes('quote') || query.includes('book') || query.includes('proposal')) {
    return 'Excellent! You can request a detailed engineering proposal and book a free professional consultation using our "Contact Us" or "Get Quote" tab above. Simply fill in your contact information and our engineering team will reach out with a custom system diagram.';
  }

  return 'I would be happy to help with that! As an expert advisor for Power Pulse Energy, I can answer questions about panel engineering, ROI timelines, tax credits (like the 30% ITC), or help you configure the savings calculator. What details can I clarify for you?';
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Secure Chat Proxy Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message parameter is required.' });
  }

  // If Gemini is initialized, use it!
  if (ai) {
    try {
      // Map history to Gemini API format if provided
      const contents = history ? history.map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      })) : [];
      
      // Append current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: 'You are a brilliant, polite, and expert AI engineering & sales consultant representing Power Pulse Energy. Your goal is to answer questions professionally about solar power systems, sizing, installation, payback timelines, and tax incentives (e.g. the 30% Investment Tax Credit). Encourage users to use our interactive savings calculator and book a free technical consultation via our Contact Form. Keep your answers concise, structured, friendly, and business-focused.',
          temperature: 0.7,
        },
      });

      const replyText = response.text || getFallbackResponse(message);
      return res.json({ reply: replyText });
    } catch (err) {
      console.error('Error calling Gemini API, switching to fallback:', err);
      // Fallback on error
      const replyText = getFallbackResponse(message);
      return res.json({ reply: replyText });
    }
  } else {
    // Return mock expert simulation instantly
    const replyText = getFallbackResponse(message);
    // Add artificial delay to simulate real network query
    setTimeout(() => {
      res.json({ reply: replyText });
    }, 400);
  }
});

// Setup Vite & static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware mounted successfully.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset serving configured.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully started and running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
