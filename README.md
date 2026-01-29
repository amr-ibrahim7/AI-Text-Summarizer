# 🤖 AI Text Summarizer

A modern web application that uses AI to generate concise summaries of long texts. Built with Firebase, Vercel, and Hugging Face's BART model.

## 🌟 Live Demo

**Frontend:** [https://summarizer-task.web.app](https://summarizer-task.web.app)  
**Backend API:** [https://ai-text-summarizer-wheat.vercel.app](https://ai-text-summarizer-wheat.vercel.app)

Try it now! 🚀

## 📸 Screenshots

<img width="1271" height="613" alt="sum1" src="https://github.com/user-attachments/assets/de86453f-a636-4cad-9577-c88dfb59abcd" />

<br/>
<br/>

<img width="1278" height="572" alt="sum2" src="https://github.com/user-attachments/assets/8dc2b9e6-ec44-4727-8f0e-524ce500865c" />

## ✨ Features

- 📝 **AI-Powered Summarization**: Uses Facebook's BART-large-CNN model via Hugging Face with optimized parameters
- 💾 **Dual Storage**: 
  - Firebase Firestore for persistent, cross-device access
  - LocalStorage for offline support and instant loading
- 🎨 **Modern UI**: Clean, professional design with smooth animations
- 🔔 **Toast Notifications**: Non-intrusive feedback messages (no alerts!)
- 📊 **Compression Stats**: See how much your text was compressed
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- 📜 **Smart History**: View your last 10-15 summaries with timestamps
- ⚡ **Optimized Performance**: Prevents duplicate API calls and caches results
- 🛡️ **Error Recovery**: Automatic fallback to localStorage if Firebase is unavailable
- 💰 **Free Tier Optimized**: Character limit (3,000) set to work within free API constraints

## 🛠️ Technologies Used

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Firebase Hosting
- Firebase Firestore

### Backend
- Vercel Serverless Functions
- Node.js
- Hugging Face Inference API
- CORS enabled

### AI Model
- **Model**: `facebook/bart-large-cnn`
- **Provider**: Hugging Face
- **Task**: Text summarization

## 📋 Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- [Vercel CLI](https://vercel.com/docs/cli) (`npm install -g vercel`) - Optional
- A [Hugging Face](https://huggingface.co/) account and API token
- A Firebase project with Firestore enabled
- A Vercel account (free tier works perfectly)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/amr-ibrahim7/AI-Text-Summarizer
cd AI-Text-Summarizer
```

### 2. Backend Setup (Vercel)

The backend uses Vercel Serverless Functions for deployment.

**Project Structure:**
```
├── api/
│   ├── index.js          # Health check endpoint
│   └── summarize.js      # Summarization endpoint
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

**Deploy to Vercel:**

```bash
# Option 1: Deploy via Vercel CLI
npm install -g vercel
vercel login
vercel --prod

# Option 2: Deploy via GitHub
# Connect your repo to Vercel Dashboard
# It will auto-deploy on every push
```

**Add Environment Variables in Vercel:**
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add: `HF_TOKEN` = `your_huggingface_token_here`
4. Redeploy the project

**Test Backend:**
```bash
curl https://your-vercel-app.vercel.app/
# Should return: {"status": "OK", "message": "AI Summarizer Backend is running!"}
```

### 3. Frontend Setup (Firebase)

```bash
# Navigate to frontend directory
cd public

# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
# Select: Firestore, Hosting

# Update app.js with your Vercel backend URL
# const BACKEND_URL = 'https://your-vercel-app.vercel.app/summarize';
```

**Deploy to Firebase:**
```bash
firebase deploy --only hosting
```

### 4. Run Locally

**Backend (Vercel Dev):**
```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server
vercel dev
# Backend runs on http://localhost:3000
```

**Frontend (Firebase):**
```bash
firebase serve
# Frontend runs on http://localhost:5000
```

**Note:** Update `app.js` to use `http://localhost:3000/summarize` when testing locally.

## 📖 How to Use

1. **Enter Text**: Paste or type between 50 and 3,000 characters of text
2. **Click "Summarize"**: The AI will process your text
3. **View Summary**: Results appear instantly with compression stats
4. **Check History**: Your last 15 summaries are saved automatically

### Character Limits

- **Minimum**: 50 characters (to ensure meaningful summaries)
- **Maximum**: 3,000 characters (to optimize API token usage on free tier)

💡 **Note**: The 3,000 character limit is set to conserve Hugging Face API tokens on the free tier. This is the optimal balance between functionality and resource management for a demo application.

### First-Time Model Loading

⚠️ **Important**: The first API call may take 20-30 seconds as the Hugging Face model "warms up" (cold start). Subsequent requests are much faster (3-5 seconds).

## 🔒 Security Notes

- ✅ API keys stored in environment variables (never committed to Git)
- ✅ `.env` added to `.gitignore`
- ✅ Firestore rules set with time-based expiry (update before Feb 27, 2026)
- ✅ CORS enabled for all origins (sufficient for this demo)
- ✅ Input validation on both frontend and backend

### API Rate Limits & Cost Optimization

This project uses **free tier services** for all components:

- **Hugging Face API**: Free inference API with token limits
  - Character limit: 3,000 characters per request
  - Rationale: Optimizes token usage while maintaining functionality
  
- **Vercel**: Free tier serverless functions
  - 100GB bandwidth/month
  - 100 hours execution time/month
  
- **Firebase**: Free Spark Plan
  - 1GB storage
  - 10GB/month bandwidth
  - 50,000 reads/day, 20,000 writes/day

💡 **Why 3,000 characters?** This limit ensures the app remains functional within free tier constraints while demonstrating full capability. For production use, this could be increased with a paid plan.

### Recommended Firestore Rules for Production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /summaries/{summaryId} {
      // Allow anyone to read
      allow read: if true;
      // Allow authenticated writes only (optional)
      allow write: if request.auth != null;
    }
  }
}
```

## 🧪 Testing

### Manual Testing Checklist

- [x] Enter < 50 characters → Shows error toast
- [x] Enter valid text → Summary generated successfully
- [x] Summary saved to Firestore
- [x] Summary appears in history
- [x] Click history item → Shows full summary details
- [x] Refresh page → History persists
- [x] Test with internet off → LocalStorage fallback works
- [x] Mobile responsive → Works on all devices

### Example Test Texts

**Short Article (for testing):**
```
Artificial intelligence is transforming how we work and live. Machine learning algorithms can now process vast amounts of data, recognize patterns, and make predictions with remarkable accuracy. From healthcare diagnostics to self-driving cars, AI is becoming an integral part of modern society. However, ethical considerations around privacy, bias, and job displacement remain important challenges that need careful attention.
```

**Test via curl:**
```bash
curl -X POST https://ai-text-summarizer-wheat.vercel.app/summarize \
  -H "Content-Type: application/json" \
  -d '{"inputs":"Artificial intelligence is transforming how we work and live. Machine learning algorithms can now process vast amounts of data, recognize patterns, and make predictions with remarkable accuracy."}'
```

## 📁 Project Structure

```
AI-Text-Summarizer/
├── api/                        # Vercel serverless functions
│   ├── index.js                # Health check endpoint
│   └── summarize.js            # Summarization endpoint
├── public/                     # Frontend files
│   ├── index.html              # Main HTML file
│   ├── style.css               # Styles
│   └── app.js                  # Frontend JavaScript
├── vercel.json                 # Vercel configuration
├── firebase.json               # Firebase configuration
├── firestore.rules             # Database security rules
├── firestore.indexes.json      # Database indexes
├── .firebaserc                 # Firebase project config
├── .gitignore                  # Git ignore rules
├── package.json                # Backend dependencies
└── README.md                   # This file
```

## 🔮 Future Improvements

If I had more time, I would add:

### High Priority
- [ ] **User Authentication**: Firebase Auth for personal history
- [ ] **Better Error Handling**: More detailed error messages with suggestions
- [ ] **Rate Limiting**: Prevent API abuse on backend
- [ ] **Text Length Indicator**: Real-time character counter with visual feedback
- [ ] **Copy to Clipboard**: One-click summary copying button

### Medium Priority
- [ ] **Export Options**: Download summaries as PDF/TXT/Markdown
- [ ] **Multiple Languages**: Support non-English text summarization
- [ ] **Adjustable Summary Length**: Let users choose summary size (short/medium/long)
- [ ] **Dark Mode**: Theme toggle with system preference detection
- [ ] **Loading Animation**: Better visual feedback during processing

### Low Priority
- [ ] **Analytics Dashboard**: Track usage patterns and popular topics
- [ ] **Social Sharing**: Share summaries on social media platforms
- [ ] **Keyboard Shortcuts**: Ctrl+Enter to summarize, Esc to clear
- [ ] **Progressive Web App**: Full offline functionality with service workers
- [ ] **Comparison View**: Side-by-side original vs summary
- [ ] **Summary Quality Rating**: Let users rate the quality of summaries
- [ ] **Batch Processing**: Summarize multiple texts at once

## 🐛 Known Issues & Limitations

- **First API call cold start**: May take 20-30 seconds due to Hugging Face model initialization
- **Character limit**: Maximum 3,000 characters to optimize free tier API token usage (best practice for demo apps)
- **Firestore rules expiry**: Rules expire on Feb 27, 2026 (needs manual update)
- **No user authentication**: Anyone can view all summaries in Firestore (acceptable for demo/assignment)
- **Free tier constraints**: Using free tiers of Hugging Face, Vercel, and Firebase for cost optimization

## 🚀 Deployment URLs

- **Live App**: https://summarizer-task.web.app
- **API Endpoint**: https://ai-text-summarizer-wheat.vercel.app
- **GitHub Repository**: https://github.com/amr-ibrahim7/AI-Text-Summarizer

## 👨‍💻 Author

**Amr Ibrahim**
- GitHub: [@amr-ibrahim7](https://github.com/amr-ibrahim7)
- LinkedIn: [Amr Ibrahim](http://www.linkedin.com/in/amribrahimwebdev/)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the AI model and inference API
- [Firebase](https://firebase.google.com/) for hosting and real-time database
- [Vercel](https://vercel.com/) for serverless backend hosting
- [Facebook AI](https://ai.facebook.com/) for the BART-large-CNN model


