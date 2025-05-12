(function() {
    const chatToggle = document.getElementById('faqbot-chat-toggle');
    const chatWindow = document.getElementById('faqbot-chat-window');
    const sendButton = document.getElementById('faqbot-send-btn');
    const userInput = document.getElementById('faqbot-user-input');
    const chatBody = document.getElementById('faqbot-chat-body');
    const chatBodyScroll = document.getElementById('faqbot-chat-body-scroll');
    const chatStorageKey = 'faqbotSessionChatHistory';

    // Function to create a safe HTML rendering
function createSafeHTMLMessage(htmlContent) {
    // Sanitization function similar to React's approach
    function sanitizeHTML(dirty) {
        // Basic HTML sanitization
        const sanitizationMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };

        // Replace potentially dangerous characters
        const sanitizedStr = dirty.replace(/[&<>"']/g, char => sanitizationMap[char]);

        // Whitelist allowed tags and attributes
        const allowedTags = ['p', 'a', 'b', 'i', 'strong', 'em', 'br'];
        const allowedAttributes = ['href', 'target'];

        // Create a temporary div to parse and clean the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sanitizedStr;

        // Clean up the HTML
        const cleanedHTML = cleanNodes(tempDiv);

        return cleanedHTML;

        // Recursive function to clean nodes
        function cleanNodes(node) {
            // Create a document fragment to hold cleaned children
            const fragment = document.createDocumentFragment();

            // Process child nodes
            Array.from(node.childNodes).forEach(childNode => {
                if (childNode.nodeType === Node.ELEMENT_NODE) {
                    // Check if tag is allowed
                    if (allowedTags.includes(childNode.nodeName.toLowerCase())) {
                        const cleanedChild = document.createElement(childNode.nodeName);
                        
                        // Clean and copy attributes
                        Array.from(childNode.attributes).forEach(attr => {
                            if (allowedAttributes.includes(attr.name.toLowerCase())) {
                                cleanedChild.setAttribute(attr.name, attr.value);
                            }
                        });

                        // Recursively clean child nodes
                        const childFragment = cleanNodes(childNode);
                        cleanedChild.appendChild(childFragment);
                        fragment.appendChild(cleanedChild);
                    }
                } else if (childNode.nodeType === Node.TEXT_NODE) {
                    // Preserve text nodes
                    fragment.appendChild(childNode.cloneNode(false));
                }
            });

            return fragment;
        }
    }

    // Create message container
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('bot-message', 'html-message');

    // Ensure we're working with a string
    const content = Array.isArray(htmlContent) ? htmlContent[0] : htmlContent;

    try {
        // Sanitize the HTML content
        const sanitizedFragment = sanitizeHTML(content);

        // Clear any existing content
        messageDiv.innerHTML = '';
        
        // Append the sanitized fragment
        messageDiv.appendChild(sanitizedFragment);

        // Enhance links
        const links = messageDiv.getElementsByTagName('a');
        for (let link of links) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.style.color = '#0066cc';
            link.style.textDecoration = 'underline';
        }

        // Apply custom styling
        Object.assign(messageDiv.style, {
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '10px',
            margin: '5px 0',
            lineHeight: '1.6',
            fontSize: '14px'
        });

    } catch (error) {
        console.error('HTML Sanitization error:', error);
        messageDiv.textContent = content;
    }

    return messageDiv;
}

    // Debug logging function
    function debugLog(message, data = null) {
        console.log(`FAQBOT DEBUG: ${message}`, data);
    }

    // Function to save chat history to sessionStorage
    function saveChatHistory() {
        try {
            const messages = Array.from(chatBody.children).map(messageDiv => ({
                sender: messageDiv.classList.contains('user-message') ? 'user' : 'bot',
                text: messageDiv.innerHTML,
                className: messageDiv.className
            }));
            sessionStorage.setItem(chatStorageKey, JSON.stringify(messages));
            debugLog('Chat history saved', messages.length);
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    // Function to load chat history from sessionStorage
    function loadChatHistory() {
        try {
            const storedHistory = sessionStorage.getItem(chatStorageKey);
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                parsedHistory.forEach(message => {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = message.className;
                    messageDiv.innerHTML = message.text;
                    chatBody.appendChild(messageDiv);
                });
                scrollToBottom();
                debugLog('Chat history loaded', parsedHistory.length);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    // Main send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message !== '') {
            // Display user message
            const userMessageDiv = document.createElement('div');
            userMessageDiv.classList.add('user-message');
            userMessageDiv.textContent = message;
            chatBody.appendChild(userMessageDiv);
            userInput.value = '';
            scrollToBottom();
            saveChatHistory();

            // Prepare chat history
            const chatHistoryElements = Array.from(chatBody.children);
            const chatHistory = chatHistoryElements.map(el => ({
                sender: el.classList.contains('user-message') ? 'user' : 'bot',
                text: el.textContent
            }));

            // Display loading animation
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('bot-message', 'loading');
            loadingDiv.textContent = 'Typing...';
            chatBody.appendChild(loadingDiv);
            scrollToBottom();

            // Send message to backend
            fetch('http://localhost:8000/plugin/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    site_id: faqbotData.site_id,
                    message: message,
                    chat_history: chatHistory
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Changed to .json() to parse the array
            })
            .then(jsonResponse => {
                // Remove loading animation
                if (loadingDiv.parentNode) {
                    loadingDiv.parentNode.removeChild(loadingDiv);
                }

                // Log raw response for debugging
                debugLog('Raw JSON Response:', jsonResponse);

                // Create and append safe HTML message
                const botMessageDiv = createSafeHTMLMessage(jsonResponse);
                chatBody.appendChild(botMessageDiv);
                scrollToBottom();
                saveChatHistory();
            })
            .catch(error => {
                console.error('Error sending message:', error);
                
                // Remove loading animation
                if (loadingDiv.parentNode) {
                    loadingDiv.parentNode.removeChild(loadingDiv);
                }

                // Error message
                const errorMessageDiv = document.createElement('div');
                errorMessageDiv.classList.add('bot-message', 'error');
                errorMessageDiv.textContent = "Sorry, something went wrong. Please try again.";
                chatBody.appendChild(errorMessageDiv);
                scrollToBottom();
                saveChatHistory();
            });
        }
    }

    // Event Listeners
    if (sendButton && userInput) {
        sendButton.addEventListener('click', sendMessage);
        
        userInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Chat toggle functionality
    if (chatToggle && chatWindow) {
        chatToggle.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
        });
    }

    // Scroll to bottom function
    function scrollToBottom() {
        if (chatBodyScroll) {
            chatBodyScroll.scrollIntoView({ behavior: 'smooth' });
        } else {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    // Initialize chat history
    loadChatHistory();
})();