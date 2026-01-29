
export default async function handler(req, res) {
 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed. Please use POST.' 
      });
    }
 
    try {
      const { inputs } = req.body;
  
      
      if (!inputs || inputs.length < 50) {
        return res.status(400).json({ 
          error: 'Text must be at least 50 characters' 
        });
      }
  
   
      if (inputs.length > 10000) {
        return res.status(400).json({ 
          error: 'Text is too long. Maximum 10,000 characters.' 
        });
      }
  
      console.log(`Summarizing text (${inputs.length} characters)...`);
  

      const HF_TOKEN = process.env.HF_TOKEN;
      const HF_API_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn";
  
      if (!HF_TOKEN) {
        return res.status(500).json({ 
          error: 'Server configuration error. HF_TOKEN not set.' 
        });
      }
  
      const enhancedInput = `Summarize the following text concisely, capturing the main points and key ideas:\n\n${inputs}`;
   
      const response = await fetch(HF_API_URL, {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ 
          inputs: enhancedInput,
          parameters: {
            max_length: 200,
            min_length: 60,
            length_penalty: 2.0,
            num_beams: 4,
            early_stopping: true,
            do_sample: false
          }
        }),
      });
  
      const result = await response.json();
  
    
      if (result.error && result.error.includes("loading")) {
        console.log('Model is loading...');
        return res.status(503).json({
          error: 'Model is loading',
          estimated_time: result.estimated_time || 20,
          message: 'The AI model is warming up. Please wait 20-30 seconds and try again.'
        });
      }
  

      if (result.error) {
        console.error('HF API Error:', result.error);
        return res.status(500).json({
          error: result.error,
          message: 'Failed to generate summary. Please try again.'
        });
      }
  
    
      console.log('Summary generated successfully');
      return res.status(200).json(result);
  
    } catch (error) {
   
      console.error("Unexpected Error:", error);
      return res.status(500).json({ 
        error: "Internal Server Error",
        message: error.message,
        details: 'An unexpected error occurred. Please try again later.'
      });
    }
  }