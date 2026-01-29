export default function handler(req, res) {
    res.status(200).json({ 
      status: 'OK', 
      message: 'AI Summarizer Backend is running on Vercel!',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/',
        summarize: '/summarize'
      }
    });
  }