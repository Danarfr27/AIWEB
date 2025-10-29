// Main application logic
import CONFIG from './config.js';
import API from './api.js';
import UI from './ui.js';

class App {
    constructor() {
        this.api = new API(CONFIG);
        this.ui = new UI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const sendMessage = async () => {
            const message = this.ui.userInput.value.trim();
            if (!message) return;

            // Add user message
            this.ui.addMessage(message, true);
            this.ui.clearInput();

            // Show typing indicator
            const indicator = this.ui.addTypingIndicator();

            try {
                // Get AI response
                const response = await this.api.sendMessage(message);
                
                // Remove typing indicator and add AI response
                this.ui.removeTypingIndicator(indicator);
                this.ui.addMessage(response);
            } catch (error) {
                this.ui.removeTypingIndicator(indicator);
                this.ui.addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.");
                console.error('Error:', error);
            }
        };

        // Send button click
        this.ui.sendButton.addEventListener('click', sendMessage);

        // Enter key press
        this.ui.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new App();
});