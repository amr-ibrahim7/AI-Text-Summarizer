const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());


const HF_TOKEN = process.env.HF_TOKEN;
const HF_API_URL = process.env.HF_API_URL || "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn";


if (!HF_TOKEN) {
    console.error('ERROR: HF_TOKEN is not set in environment variables');
    process.exit(1);
}


app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'AI Summarizer Backend is running!',
        timestamp: new Date().toISOString()
    });
});


app.post('/summarize', async (req, res) => {
    try {
        const { inputs, parameters } = req.body;

    
        if (!inputs || inputs.length < 50) {
            return res.status(400).json({ 
                error: 'Text must be at least 50 characters' 
            });
        }

        console.log(`Summarizing text (${inputs.length} characters)...`);

        //  prompt for summaries
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
                message: 'Please wait and try again'
            });
        }

        
        if (result.error) {
            console.error('HF API Error:', result.error);
            return res.status(500).json({
                error: result.error,
                message: 'Failed to generate summary'
            });
        }

        console.log('Summary generated successfully');

        res.json(result);

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ 
            error: "Internal Server Error",
            message: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});