# AI Chat API Setup Guide

## Quick Setup (Choose One Option)

### Option 1: OpenAI GPT (Recommended - Most Accurate)
1. Go to https://platform.openai.com/api-keys
2. Create account and get API key
3. In `ai-chat-advanced.js`, replace `YOUR_OPENAI_API_KEY` with your key
4. Set `SELECTED_API = 'openai'`

**Cost:** ~$0.002 per 1000 tokens (very cheap)

### Option 2: Google Gemini (Good & Free Tier)
1. Go to https://makersuite.google.com/app/apikey
2. Get free API key
3. In `ai-chat-advanced.js`, replace `YOUR_GEMINI_API_KEY` with your key
4. Set `SELECTED_API = 'gemini'`

**Cost:** Free up to 60 requests/minute

### Option 3: Hugging Face (Completely Free)
1. Go to https://huggingface.co/settings/tokens
2. Create account and get token
3. In `ai-chat-advanced.js`, replace `YOUR_HF_TOKEN` with your token
4. Set `SELECTED_API = 'huggingface'`

**Cost:** Completely free

## Example Configuration

```javascript
// In ai-chat-advanced.js, find this section and update:

const API_CONFIG = {
    openai: {
        key: 'sk-your-actual-key-here', // Your real API key
    },
    // ... other configs
};

const SELECTED_API = 'openai'; // Change to your chosen API
```

## Security Note
For production websites, move API keys to a backend server to keep them secure.