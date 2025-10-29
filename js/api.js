// API handling
class API {
    constructor(config) {
        this.config = config;
        this.currentKeyIndex = 0;
    }

    getCurrentApiKey() {
        return this.config.KEYS[this.currentKeyIndex];
    }

    rotateApiKey() {
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.config.KEYS.length;
    }

    async sendMessage(message, context = []) {
        const API_KEY = this.getCurrentApiKey();
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.GEMINI_MODEL}:generateContent?key=${API_KEY}`;

        const payload = {
            contents: [
                {
                    parts: [
                        {
                            text: this.config.PERSONA + "\n\nUser: " + message
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: this.config.TEMPERATURE,
                maxOutputTokens: this.config.MAX_TOKENS,
            }
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429) {
                    this.rotateApiKey();
                    return this.sendMessage(message, context); // Retry with new key
                }
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error:', error);
            this.rotateApiKey();
            throw error;
        }
    }
}

export default API;