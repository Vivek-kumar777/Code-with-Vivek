// Note: API key should be handled server-side for security
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-message');
const typingIndicator = document.getElementById('typing-indicator');
const aiChatBubble = document.getElementById('ai-chat-bubble');
const aiChatWindow = document.getElementById('ai-chat-window');
const minimizeBtn = document.getElementById('minimize-chat');

// Toggle chat window visibility
aiChatBubble.addEventListener('click', () => {
    aiChatWindow.classList.toggle('active');
    if (aiChatWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

// Minimize chat window
minimizeBtn.addEventListener('click', () => {
    aiChatWindow.classList.remove('active');
});

// Enable/disable send button based on input
chatInput.addEventListener('input', () => {
    if (!chatInput.disabled) {
        sendButton.disabled = !chatInput.value.trim();
    }
});

chatInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        await sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Disable input while AI is responding
    chatInput.disabled = true;
    sendButton.disabled = true;
    chatInput.placeholder = 'Jarvis is thinking...';

    // Remove the bottom typing indicator
    // showTyping(true);

    try {
        // Add loading message
        const loadingMsg = addLoadingMessage();
        
        // Call the selected AI API
        const response = await simulateAIResponse(message);
        
        // Remove loading and add response normally
        removeLoadingMessage();
        addMessage(response, 'bot');
    } catch (error) {
        console.error('Chat error:', error);
        removeLoadingMessage();
        addMessage('Sorry, I encountered an error. Please try again.', 'bot');
    } finally {
        // Re-enable input after AI responds
        // showTyping(false);
        chatInput.disabled = false;
        chatInput.placeholder = 'Ask me anything...';
        chatInput.focus();
    }
}

function addMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = `<p>${escapeHtml(message)}</p>`;
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping(show) {
    typingIndicator.style.display = show ? 'flex' : 'none';
    if (show) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function addLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message loading-message';
    messageDiv.id = 'loading-msg';
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = '<p>Jarvis is thinking<span class="loading-dots"><span></span><span></span><span></span></span></p>';
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

function removeLoadingMessage() {
    const loadingMsg = document.getElementById('loading-msg');
    if (loadingMsg) {
        loadingMsg.remove();
    }
}

function typeMessage(text, messageElement) {
    const messageContent = messageElement.querySelector('.message-content p');
    messageContent.innerHTML = '';
    let i = 0;
    
    function typeChar() {
        if (i < text.length) {
            messageContent.innerHTML += text.charAt(i);
            messageContent.innerHTML += '<span class="typing-text"></span>';
            i++;
            setTimeout(typeChar, 30);
        } else {
            messageContent.innerHTML = escapeHtml(text);
        }
    }
    
    typeChar();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// API Configuration - Choose one of these options:
const API_CONFIG = {
    // Option 1: OpenAI GPT (Most popular)
    openai: {
        url: 'https://api.openai.com/v1/chat/completions',
        key: 'YOUR_OPENAI_API_KEY', // Get from https://platform.openai.com/api-keys
        model: 'gpt-3.5-turbo'
    },
    // Option 2: Google Gemini (Free tier available)
    gemini: {
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        key: 'YOUR_GEMINI_API_KEY' // Get from https://makersuite.google.com/app/apikey
    },
    // Option 3: Hugging Face (Free)
    huggingface: {
        url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        key: 'YOUR_HF_TOKEN' // Get from https://huggingface.co/settings/tokens
    }
};

// Choose your API (change this to 'openai', 'gemini', or 'huggingface')
const SELECTED_API = 'openai';

async function simulateAIResponse(message) {
    try {
        // Use OpenRouter client
        const client = new OpenRouterClient();
        return await client.sendMessage(message);
    } catch (error) {
        console.error('API Error:', error);
        return "I'm having trouble connecting right now. Please try again later.";
    }
}

// OpenAI API call
async function callOpenAI(message) {
    const response = await fetch(API_CONFIG.openai.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.openai.key}`
        },
        body: JSON.stringify({
            model: API_CONFIG.openai.model,
            messages: [{
                role: 'system',
                content: 'You are Jarvis, an AI assistant for Vivek, a Python developer and web designer. Be helpful, friendly, and knowledgeable about programming, web design, and general topics.'
            }, {
                role: 'user',
                content: message
            }],
            max_tokens: 150,
            temperature: 0.7
        })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Google Gemini API call
async function callGemini(message) {
    const response = await fetch(`${API_CONFIG.gemini.url}?key=${API_CONFIG.gemini.key}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `You are Jarvis, an AI assistant for Vivek, a Python developer and web designer. User asks: ${message}`
                }]
            }]
        })
    });
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Hugging Face API call
async function callHuggingFace(message) {
    const response = await fetch(API_CONFIG.huggingface.url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_CONFIG.huggingface.key}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: message,
            parameters: {
                max_length: 100,
                temperature: 0.7
            }
        })
    });
    
    const data = await response.json();
    return data[0].generated_text || "I'm still learning. Could you rephrase that?";
}

// Close chat when clicking outside
document.addEventListener('click', (e) => {
    if (!aiChatWindow.contains(e.target) && !aiChatBubble.contains(e.target)) {
        aiChatWindow.classList.remove('active');
    }
});