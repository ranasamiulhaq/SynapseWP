(function() {
    const chatToggle = document.getElementById('faqbot-chat-toggle');
    const chatWindow = document.getElementById('faqbot-chat-window');
    const sendButton = document.getElementById('faqbot-send-btn');
    const userInput = document.getElementById('faqbot-user-input');
    const chatBody = document.getElementById('faqbot-chat-body');
    const chatBodyScroll = document.getElementById('faqbot-chat-body-scroll');
    const chatStorageKey = 'faqbotSessionChatHistory'; // Key for sessionStorage

    // Function to save chat history to sessionStorage
    function saveChatHistory() {
        const messages = Array.from(chatBody.children).map(messageDiv => {
            return {
                sender: messageDiv.classList.contains('user-message') ? 'user' : 'bot',
                text: messageDiv.textContent,
                className: messageDiv.className // Save classes for styling
            };
        });
        sessionStorage.setItem(chatStorageKey, JSON.stringify(messages));
    }

    // Function to load chat history from sessionStorage
    function loadChatHistory() {
        const storedHistory = sessionStorage.getItem(chatStorageKey);
        if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            parsedHistory.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = message.className;
                messageDiv.textContent = message.text;
                chatBody.appendChild(messageDiv);
            });
            scrollToBottom();
        }
    }

    // Load chat history on initialization
    loadChatHistory();

    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        });
    }

    if (sendButton && userInput ) {
        sendButton.addEventListener('click', () => {
            const message = userInput.value.trim();
            if (message !== '') {
                // Display user message
                const userMessageDiv = document.createElement('div');
                userMessageDiv.classList.add('user-message');
                userMessageDiv.textContent = message;
                chatBody.appendChild(userMessageDiv);
                userInput.value = '';
                scrollToBottom();
                saveChatHistory(); // Save after user message

                // Prepare chat history to send
                const chatHistoryElements = Array.from(chatBody.children);
                const chatHistory = chatHistoryElements.map(el => ({
                    sender: el.classList.contains('user-message') ? 'user' : 'bot',
                    text: el.textContent
                }));

                // Display loading animation
                const botMessageDiv = document.createElement('div');
                botMessageDiv.classList.add('bot-message', 'loading'); // Add 'loading' class
                botMessageDiv.textContent = ''; // Empty text initially
                chatBody.appendChild(botMessageDiv);
                scrollToBottom();

                // Send message to backend with chat history
                fetch('http://localhost:8000/plugin/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        site_id: faqbotData.site_id,
                        message: message,
                        chat_history: chatHistory // Include the chat history
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Remove loading animation
                    const loadingDiv = chatBody.querySelector('.bot-message.loading');
                    if (loadingDiv) {
                        chatBody.removeChild(loadingDiv);
                    }

                    // Display bot response with HTML rendering
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.classList.add('bot-message');
                    botMessageDiv.innerHTML = data.response || "No response received."; // Changed to innerHTML
                    chatBody.appendChild(botMessageDiv);
                    scrollToBottom();
                    saveChatHistory(); // Save after bot response
                })
                .catch(error => {
                    console.error('Error sending message to backend:', error);
                    // Remove loading animation in case of error
                    const loadingDiv = chatBody.querySelector('.bot-message.loading');
                    if (loadingDiv) {
                        chatBody.removeChild(loadingDiv);
                    }

                    const botErrorMessageDiv = document.createElement('div');
                    botErrorMessageDiv.classList.add('bot-message', 'error');
                    botErrorMessageDiv.textContent = "Oops! Something went wrong. Please try again.";
                    chatBody.appendChild(botErrorMessageDiv);
                    scrollToBottom();
                    saveChatHistory(); // Save even on error to persist the error message
                });
            }
        });

        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendButton.click();
            }
        });
    } else {
        console.error('One or more chat elements or faqbotData not found.');
    }

    function scrollToBottom() {
        if (chatBodyScroll) {
            chatBodyScroll.scrollIntoView({ behavior: 'smooth' });
        } else {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
})();