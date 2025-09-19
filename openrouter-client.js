class OpenRouterClient {
    constructor() {
        this.apiKey = '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';
        this.baseUrl = 'https://openrouter.ai/api/v1';
        this.model = 'openrouter/sonoma-sky-alpha';
        this.conversationHistory = [];
    }

    async sendMessage(message) {
        try {
            // Add user message to history
            this.conversationHistory.push({ role: 'user', content: message });
            
            // Keep only last 5 messages to avoid token limits
            if (this.conversationHistory.length > 5) {
                this.conversationHistory = this.conversationHistory.slice(-5);
            }

            const messages = [
                {
                    role: 'system',
content: 'You are Jarvis, a friendly AI assistant. Read previous conversation to understand context and provide better responses. Match the user\'s communication style and language. Always use relevant emojis throughout your responses to make them interactive and engaging.\n\nFor greetings: "Hey! 😊 What\'s up?" or "Hello! 👋 How can I help?"\n\nFor profile questions: "Vivek is a Python developer 🐍 and web designer 🎨 with 1+ years experience 📈, 25+ Python projects 🚀, 15+ web designs 🌐"\n\nFor technical help: Use emojis like 💻🔧⚙️💡⚡🔥 with code explanations\n\nFor casual chat: Use emojis naturally - 😄😎🤔👍🎉✨💪🏆\n\nAnalyze previous messages to give contextual responses. Remember what user asked before and build on that conversation.'
                },
                ...this.conversationHistory
            ];

            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Vivek Portfolio - AI Assistant'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            
            // Add AI response to history
            this.conversationHistory.push({ role: 'assistant', content: aiResponse });
            
            return aiResponse;
        } catch (error) {
            console.error('OpenRouter API Error:', error);
            return 'Sorry, I\'m having trouble connecting right now. Please try again later.';
        }
    }
}

// Export for use in other files
window.OpenRouterClient = OpenRouterClient;