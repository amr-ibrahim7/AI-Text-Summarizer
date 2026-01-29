# 🤖 AI Text Summarizer

A modern web application that uses AI to generate concise summaries of long texts. Built with Firebase, Express.js, and Hugging Face's BART model.

## 🌟 Live Demo

**Hosted on Firebase:** [Firebase-URL-Here]

## 📸 Screenshots

![App Screenshot](<img width="1271" height="613" alt="sum1" src="https://github.com/user-attachments/assets/de86453f-a636-4cad-9577-c88dfb59abcd" />)


<br/>
<br/>

(<img width="1278" height="572" alt="sum2" src="https://github.com/user-attachments/assets/8dc2b9e6-ec44-4727-8f0e-524ce500865c" />)



## ✨ Features

- 📝 **AI-Powered Summarization**: Uses Facebook's BART-large-CNN model via Hugging Face with optimized parameters
- 💾 **Dual Storage**: 
  - Firebase Firestore for persistent, cross-device access
  - LocalStorage for offline support and instant loading
- 🎨 **Modern UI**: Clean, gradient-based design with smooth animations
- 🔔 **Toast Notifications**: Non-intrusive feedback messages (no alerts!)
- 📊 **Compression Stats**: See how much your text was compressed
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- 📜 **Smart History**: View your last 10-15 summaries with timestamps
- ⚡ **Optimized Performance**: Prevents duplicate API calls and caches results
- 🛡️ **Error Recovery**: Automatic fallback to localStorage if Firebase is unavailable

## 🛠️ Technologies Used

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Firebase Hosting
- Firebase Firestore

### Backend
- Node.js & Express.js
- Hugging Face Inference API
- CORS middleware

### AI Model
- **Model**: `facebook/bart-large-cnn`
- **Provider**: Hugging Face
- **Task**: Text summarization

## 📋 Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- A [Hugging Face](https://huggingface.co/) account and API token
- A Firebase project with Firestore enabled

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/amr-ibrahim7/AI-Text-Summarizer
cd ai-text-summarizer
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `.env` and add your Hugging Face token:

```env
HF_TOKEN=your_huggingface_token_here
HF_API_URL=https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn
PORT=3000
```

### 3. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Select:
# - Firestore
# - Hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

Update `public/app.js` with your Firebase config (already auto-injected by Firebase Hosting).

### 4. Run Locally

**Terminal 1 - Backend:**
```bash
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
firebase serve
# Frontend runs on http://localhost:5000
```

### 5. Deploy to Production

```bash
# Deploy everything
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

## 📖 How to Use

1. **Enter Text**: Paste or type at least 50 characters of text
2. **Click "Summarize Text"**: The AI will process your text
3. **View Summary**: Results appear below with original and summary lengths
4. **Check History**: Your last 10 summaries are saved and viewable

### First-Time Model Loading

⚠️ **Important**: The first API call may take 20-30 seconds as the Hugging Face model "warms up". Subsequent requests are much faster.

## 🔒 Security Notes

- ✅ API keys stored in `.env` (never committed to Git)
- ✅ `.env` added to `.gitignore`
- ✅ Firestore rules set with time-based expiry (update before Feb 27, 2026)
- ❌ Backend currently allows all CORS origins (consider restricting in production)

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

- [ ] Enter < 50 characters → Shows error
- [ ] Enter valid text → Summary generated
- [ ] Summary saved to Firestore
- [ ] Summary appears in history
- [ ] Click history item → Shows full summary
- [ ] Refresh page → History persists
- [ ] Test with internet off → LocalStorage fallback works

### Example Test Texts

**Short Article (for testing):**
```
Artificial intelligence is transforming how we work and live. Machine learning algorithms can now process vast amounts of data, recognize patterns, and make predictions with remarkable accuracy. From healthcare diagnostics to self-driving cars, AI is becoming an integral part of modern society. However, ethical considerations around privacy, bias, and job displacement remain important challenges that need careful attention.
```

## 📁 Project Structure

```
my-summarizer-app/
├── public/
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styles
│   └── app.js              # Frontend JavaScript
├── server.js               # Express backend
├── package.json            # Dependencies
├── .env                    # Environment variables (create this)
├── .gitignore              # Git ignore rules
├── firebase.json           # Firebase config
├── firestore.rules         # Database security rules
├── firestore.indexes.json  # Database indexes
└── README.md               # This file
```

## 🔮 Future Improvements

If I had more time, I would add:

### High Priority
- [ ] **User Authentication**: Firebase Auth for personal history
- [ ] **Better Error Handling**: More informative error messages
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **Text Length Indicator**: Real-time character counter
- [ ] **Copy to Clipboard**: One-click summary copying

### Medium Priority
- [ ] **Export Options**: Download summaries as PDF/TXT
- [ ] **Multiple Languages**: Support non-English text
- [ ] **Adjustable Summary Length**: Let users choose summary size
- [ ] **Dark Mode**: Theme toggle
- [ ] **Loading Animation**: Better visual feedback

### Low Priority
- [ ] **Analytics**: Track usage patterns
- [ ] **Social Sharing**: Share summaries on social media
- [ ] **Keyboard Shortcuts**: Ctrl+Enter to summarize
- [ ] **Progressive Web App**: Offline functionality
- [ ] **Comparison View**: Side-by-side original vs summary

## 🐛 Known Issues

- First API call may fail due to model cold start (~20 seconds)
- Firestore rules expire on Feb 27, 2026 (needs update)
- No user authentication (anyone can view all summaries)
- Backend URL hardcoded (should use environment variables)




- GitHub: [amr-ibrahim7]https://github.com/amr-ibrahim7
- LinkedIn: (http://www.linkedin.com/in/amribrahimwebdev/)

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the AI model
- [Firebase](https://firebase.google.com/) for hosting and database
- [Facebook AI](https://ai.facebook.com/) for the BART model
