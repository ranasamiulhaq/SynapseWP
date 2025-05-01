(function() {
    const chatToggle = document.getElementById('faqbot-chat-toggle');
    const chatWindow = document.getElementById('faqbot-chat-window');
    const sendButton = document.getElementById('faqbot-send-btn');
    const userInput = document.getElementById('faqbot-user-input');
    const chatBody = document.getElementById('faqbot-chat-body');
    const chatBodyScroll = document.getElementById('faqbot-chat-body-scroll'); // Ensure this exists in your HTML

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

                // Send message to backend
                fetch('http://localhost:8000/plugin/chat', { // Adjust the endpoint if needed
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: message
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Display bot response
                    const botMessageDiv = document.createElement('div');
                    botMessageDiv.classList.add('bot-message');
                    botMessageDiv.textContent = data.response || "No response received.";
                    chatBody.appendChild(botMessageDiv);
                    scrollToBottom();
                })
                .catch(error => {
                    console.error('Error sending message to backend:', error);
                    const botErrorMessageDiv = document.createElement('div');
                    botErrorMessageDiv.classList.add('bot-message', 'error'); // You can add a specific error class
                    botErrorMessageDiv.textContent = "Oops! Something went wrong. Please try again.";
                    chatBody.appendChild(botErrorMessageDiv);
                    scrollToBottom();
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