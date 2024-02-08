document.addEventListener('DOMContentLoaded', function() {

    // Send a manual chat message using the enter key
    const messageInput = document.getElementById('user-input');

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const message = event.target.value;
            event.target.value = '';
            submitChatMessage(message);
        }
    });

    const sendButton = document.getElementById('send-btn');

    sendButton.addEventListener('click', (event) => {
        event.preventDefault();
        const message = messageInput.value;
        messageInput.value = '';
        submitChatMessage(message);
    });

    function submitChatMessage(message) {
        if (message.trim() !== '') {
            displayMessage(message, 'user', 'text');

            fetch('http://127.0.0.1:5002/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                displayMessage(data.response, 'PP', 'text');
            })
            .catch(error => console.error('Error:', error));
        }
    }

function displayMessage(content, sender, type) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    const headerDiv = document.createElement('div'); // Div to hold username and icon
    const contentDiv = document.createElement('div'); // Div to hold the actual message
    const userName = document.createElement('span');
    userName.classList.add('username');

    if (type === 'text') {
        const userIcon = document.createElement('img');
        userIcon.classList.add(sender === 'user' ? 'user-icon' : 'pp-icon');
        userIcon.style.width = '40px';
        userIcon.style.height = '40px';
        userIcon.style.marginRight = '5px';

        if (sender === 'user') {
            messageDiv.classList.add('user', 'msg');
            userIcon.src = 'user.png'; // Update with correct path
            userName.appendChild(userIcon);
            userName.append(' Proactive Parent:');
            headerDiv.appendChild(userName);
            messageDiv.appendChild(headerDiv);
            contentDiv.textContent = content;
            messageDiv.appendChild(contentDiv);
        } else {
            messageDiv.classList.add('parentpilot', 'msg');
            userIcon.src = 'parentpilot.png'; // Update with correct path
            userName.appendChild(userIcon);
            userName.append('Parent Pilot:');
            headerDiv.appendChild(userName);
            messageDiv.appendChild(headerDiv);
            contentDiv.textContent = content;
            messageDiv.appendChild(contentDiv);
        }
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}


});
