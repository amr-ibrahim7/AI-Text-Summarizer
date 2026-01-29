const inputText = document.getElementById('inputText');
const summarizeBtn = document.getElementById('summarizeBtn');
const loader = document.getElementById('loader');
const resultContainer = document.getElementById('resultContainer');
const summaryResult = document.getElementById('summaryResult');
const historyList = document.getElementById('historyList');

let db;
let isProcessing = false;


window.addEventListener('DOMContentLoaded', () => {
    // console.log('Loading history from localStorage...');
    loadHistoryFromLocalStorage();
});


window.addEventListener('load', () => {
    try {
        db = firebase.firestore();
        console.log('Firebase connected');
        syncWithFirestore();
    } catch (error) {
        console.error('Firebase error:', error);
    }
});

async function syncWithFirestore() {
    try {
        if (!db) return;
        
        const snapshot = await db.collection('summaries')
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();
        
        if (!snapshot.empty) {
            console.log(`Synced ${snapshot.size} items from Firestore`);
        }
    } catch (error) {
        console.log('Firestore sync skipped:', error.message);
    }
}


summarizeBtn.addEventListener('click', async () => {
    if (isProcessing) {
        console.log('Already processing...');
        return;
    }
    
    const text = inputText.value.trim();
    
    if (!text) {
        showMessage('Please enter some text', 'warning');
        return;
    }
    
    if (text.length < 50) {
        showMessage('Please enter at least 50 characters', 'warning');
        return;
    }
    
    if (text.length > 10000) {
        showMessage('Text is too long. Maximum 10,000 characters.', 'warning');
        return;
    }
    
    await summarizeText(text);
});


async function summarizeText(text) {
    try {
        isProcessing = true;
        summarizeBtn.disabled = true;
        summarizeBtn.textContent = 'Summarizing...';
        loader.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        
        // console.log(`Sending ${text.length} characters for summarization...`);
        
        const summary = await callHuggingFaceAPI(text);
        
        // console.log('Summary received');
        
        summaryResult.textContent = summary;
        resultContainer.classList.remove('hidden');
        
        showMessage('Summary generated!', 'success');
        
        saveToLocalStorage(text, summary);
        loadHistoryFromLocalStorage();
        
        saveToFirestore(text, summary);
        
        inputText.value = '';
        
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Summarization Error:', error);
        
        if (error.message.includes('Model loading')) {
            showMessage('AI model is warming up. Please wait 20-30 seconds and try again.', 'info', 5000);
        } else if (error.message.includes('Failed to fetch')) {
            showMessage('Cannot connect to server. Make sure backend is running on http://localhost:3000', 'error');
        } else {
            showMessage('Failed to generate summary. Please try again.', 'error');
        }
    } finally {
        loader.classList.add('hidden');
        summarizeBtn.disabled = false;
        summarizeBtn.textContent = 'Summarize';
        isProcessing = false;
    }
}


async function callHuggingFaceAPI(text) {
    const BACKEND_URL = 'http://localhost:3000/summarize';
    
    const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            inputs: text
        })
    });

    const data = await response.json();

    if (response.status === 503 || (data.error && data.error.includes('loading'))) {
        const waitTime = data.estimated_time || 20;
        throw new Error(`Model loading (wait ${waitTime}s)`);
    }

    if (data.error) {
        throw new Error(data.error);
    }

    if (!data[0] || !data[0].summary_text) {
        throw new Error('Invalid response from AI model');
    }

    return data[0].summary_text;
}

// Save to Firestore
async function saveToFirestore(originalText, summary) {
    try {
        if (!db) {
            console.warn('Database not available, skipping Firestore save');
            return;
        }
        
        const doc = await db.collection('summaries').add({
            text: originalText.substring(0, 300),
            summary: summary,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            textLength: originalText.length,
            summaryLength: summary.length,
            compressionRatio: Math.round((summary.length / originalText.length) * 100)
        });
        
        console.log('Saved to Firestore with ID:', doc.id);
        return doc.id;
    } catch (error) {
        console.error('Firestore save error:', error);
        return null;
    }
}


function saveToLocalStorage(originalText, summary) {
    try {
        const storageKey = 'ai_summaries';
        let cache = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        cache.unshift({
            id: Date.now(),
            text: originalText.substring(0, 300),
            summary: summary,
            timestamp: new Date().toISOString(),
            textLength: originalText.length,
            summaryLength: summary.length
        });
        
        cache = cache.slice(0, 15);
        
        localStorage.setItem(storageKey, JSON.stringify(cache));
        // console.log(' Saved to localStorage');
        return true;
    } catch (error) {
        console.error('localStorage error:', error);
        return false;
    }
}


function loadHistoryFromLocalStorage() {
    try {
        const cache = JSON.parse(localStorage.getItem('ai_summaries') || '[]');
        
        historyList.innerHTML = '';
        
        if (cache.length === 0) {
            historyList.innerHTML = '<p style="color: #adb5bd; text-align: center; padding: 20px; font-size: 14px;">No summaries yet. Start by entering text above!</p>';
            return;
        }
        
        cache.forEach(item => {
            createHistoryItem(
                item.summary, 
                item.timestamp, 
                item.textLength, 
                item.summaryLength,
                item.text,
                item.id
            );
        });
        
        console.log(`Loaded ${cache.length} summaries from localStorage`);
    } catch (error) {
        console.error('❌ localStorage read error:', error);
        historyList.innerHTML = '<p style="color: #dc3545; text-align: center; padding: 20px; font-size: 14px;">Failed to load history</p>';
    }
}

function createHistoryItem(summaryText, timestamp, textLength, summaryLength, originalText, itemId) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.setAttribute('data-id', itemId || Date.now());
    

    let timeStr = '';
    if (timestamp) {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        timeStr = date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    
    const ratio = textLength && summaryLength 
        ? Math.round((summaryLength / textLength) * 100) 
        : null;
   
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; justify-content: space-between; align-items: start; gap: 10px;';
    
  
    const content = document.createElement('div');
    content.className = 'summary-content';
    content.style.cssText = 'flex: 1; cursor: pointer;';
    
    let contentHTML = '';
    if (timeStr) {
        contentHTML += `<div style="font-size: 12px; color: #adb5bd; margin-bottom: 6px;">${timeStr}`;
        if (ratio) {
            contentHTML += ` • ${ratio}% of original`;
        }
        contentHTML += '</div>';
    }
    contentHTML += `<div style="color: #495057; line-height: 1.5;">${summaryText}</div>`;
    content.innerHTML = contentHTML;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.setAttribute('aria-label', 'Delete summary');
    deleteBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" 
                  stroke="currentColor" 
                  stroke-width="1.5" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"/>
        </svg>
    `;
    
   
    content.addEventListener('click', () => {
        summaryResult.textContent = summaryText;
        resultContainer.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSummary(item.getAttribute('data-id'));
    });
    
    wrapper.appendChild(content);
    wrapper.appendChild(deleteBtn);
    item.appendChild(wrapper);
    historyList.appendChild(item);
}


function deleteSummary(itemId) {
    try {
        const storageKey = 'ai_summaries';
        let cache = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        const initialLength = cache.length;
        cache = cache.filter(item => item.id != itemId);
        
        if (cache.length < initialLength) {
            localStorage.setItem(storageKey, JSON.stringify(cache));
            loadHistoryFromLocalStorage();
            showMessage('Summary deleted', 'success', 2000);
            // console.log(`Deleted summary ID: ${itemId}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        showMessage('Failed to delete', 'error');
    }
}


function showMessage(message, type = 'info', duration = 3000) {
    const existing = document.getElementById('toast-message');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.id = 'toast-message';
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '!',
        info: 'i'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    toast.textContent = `${icons[type]} ${message}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}


const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('App loaded successfully');