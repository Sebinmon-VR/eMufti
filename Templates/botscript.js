// Global Variables
let chatHistory = [];
let currentTheme = 'light';
let currentLanguage = 'en';
let messageCount = 0;
let chatSessions = [];

// Language Translations
const translations = {
    en: {
        greeting: "Hello! I'm your AI assistant. How can I help you today?",
        placeholder: "Type your message...",
        send: "Send",
        clear: "Clear chat",
        suggestions: "Suggestions",
        voice: "Voice",
        messages: "messages",
        chatHistory: "Chat History",
        menu: "Menu",
        settings: "Settings",
        profile: "Profile",
        home: "Home",
        savedChats: "Saved Chats",
        exportData: "Export Data",
        helpSupport: "Help & Support"
    }
};

// Sample AI Responses
const aiResponses = {
    en: [
        "I'm analyzing your request now...",
        "That's an interesting question. Here's what I found...",
        "Based on my knowledge...",
        "There are a few aspects to consider about that...",
        "I recommend the following approach...",
        "Great question! The answer is...",
        "According to my data...",
        "Let me help you with that...",
        "I understand your concern. Here's my suggestion...",
        "That's a thoughtful question. Let me explain..."
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSavedData();
    updateLanguage();
});

// Initialize Application
function initializeApp() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Focus input field
    messageInput.focus();
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Set initial language
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    
    // Update message count
    updateMessageCount();
    
    // Show initial greeting
    showInitialGreeting();
}

// Setup Event Listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('message-form').addEventListener('submit', handleFormSubmit);
    
    // Button clicks
    document.getElementById('clear-btn').addEventListener('click', clearChat);
    document.getElementById('suggest-btn').addEventListener('click', showSuggestions);
    document.getElementById('voice-btn').addEventListener('click', handleVoiceInput);
    
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Language selector
    document.getElementById('language-selector').addEventListener('change', handleLanguageChange);
    
    // Navigation buttons
    document.getElementById('menu-btn').addEventListener('click', toggleMenu);
    document.getElementById('history-btn').addEventListener('click', toggleHistory);
    document.getElementById('settings-btn').addEventListener('click', handleSettings);
    document.getElementById('profile-btn').addEventListener('click', handleProfile);
    
    // Panel close buttons
    document.getElementById('close-menu').addEventListener('click', closeMenu);
    document.getElementById('close-history').addEventListener('click', closeHistory);
    
    // Overlay click
    document.getElementById('overlay').addEventListener('click', closeAllPanels);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    sendMessage();
}

// Send Message Function
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    messageInput.value = '';
    
    // Save to history
    saveMessageToHistory(message, 'user');
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        removeTypingIndicator(typingId);
        const response = getAIResponse();
        addMessage(response, 'ai');
        saveMessageToHistory(response, 'ai');
    }, 1000 + Math.random() * 2000);
}

// Add Message to Chat
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('flex', 'space-x-2', 'max-w-4xl', 'message-bounce', 'fade-in');
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
if (sender === 'user') {
    messageElement.className = 'flex w-full justify-end';  // Ensure full width and alignment
    messageElement.innerHTML = `
        <div class="flex items-end space-x-2 max-w-4xl">
            <div class="flex flex-col items-end space-y-1">
                <div class="message-user rounded-xl rounded-tr-none px-4 py-3 max-w-xs md:max-w-md">
                    <div class="text-white">${escapeHtml(text)}</div>
                </div>
                <div class="text-xs text-gray-500">${timestamp}</div>
            </div>
            <div class="flex-shrink-0">
                <img src="https://placehold.co/32x32/6b7280/FFFFFF?text=U" alt="User avatar" class="w-8 h-8 rounded-full" />
            </div>
        </div>
    `;
} else {
    messageElement.className = 'flex w-full justify-start';  // Ensure full width and left align
    messageElement.innerHTML = `
        <div class="flex items-start space-x-2 max-w-4xl">
            <div class="flex-shrink-0">
                <img src="https://placehold.co/32x32/3f37c9/FFFFFF?text=EM" alt="AI avatar" class="w-8 h-8 rounded-full" />
            </div>
            <div class="message-ai rounded-xl rounded-tl-none px-4 py-3 max-w-xs md:max-w-md">
                <div class="font-medium">${escapeHtml(text)}</div>
                <div class="text-xs text-gray-500 mt-1">${timestamp}</div>
            </div>
        </div>
    `;
}

    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Update message count
    messageCount++;
    updateMessageCount();
    
    // Add to chat history
    const chatItem = {
        text: text,
        sender: sender,
        timestamp: new Date().toISOString()
    };
    chatHistory.push(chatItem);
    saveChatHistory();
}

// Show Typing Indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingId = 'typing-' + Date.now();
    const typingElement = document.createElement('div');
    typingElement.id = typingId;
    typingElement.classList.add('flex', 'space-x-2', 'max-w-4xl', 'fade-in');
    typingElement.innerHTML = `
        <div class="flex-shrink-0">
            <img src="https://placehold.co/32x32/3f37c9/FFFFFF?text=EM" alt="AI avatar" class="w-8 h-8 rounded-full" />
        </div>
        <div class="message-ai rounded-xl rounded-tl-none px-4 py-3">
            <div class="typing-indicator flex space-x-1">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingId;
}

// Remove Typing Indicator
function removeTypingIndicator(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

// Get AI Response
function getAIResponse() {
    const responses = aiResponses[currentLanguage] || aiResponses.en;
    return responses[Math.floor(Math.random() * responses.length)];
}

// Clear Chat
function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
    messageCount = 0;
    updateMessageCount();
    showInitialGreeting();
    
    // Save current chat to history before clearing
    if (chatHistory.length > 0) {
        saveChatSession();
        chatHistory = [];
    }
}

// Show Suggestions
function showSuggestions() {
    const suggestions = {
        en: [
            "What's the weather like today?",
            "How do I reset my password?",
            "Explain quantum computing",
            "Best practices for remote work",
            "Tips for improving productivity",
            "What are the latest tech trends?",
            "How to learn a new language?",
            "Healthy meal planning ideas"
        ]
    };
    
    const currentSuggestions = suggestions[currentLanguage] || suggestions.en;
    const randomSuggestion = currentSuggestions[Math.floor(Math.random() * currentSuggestions.length)];
    
    const messageInput = document.getElementById('message-input');
    messageInput.value = randomSuggestion;
    messageInput.focus();
}

// Handle Voice Input
function handleVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'en' ? 'en-US' : 
                        
        
        recognition.onstart = function() {
            document.getElementById('voice-btn').innerHTML = '<i class="fas fa-stop mr-1"></i> Stop';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('message-input').value = transcript;
        };
        
        recognition.onend = function() {
            document.getElementById('voice-btn').innerHTML = '<i class="fas fa-microphone mr-1"></i> Voice';
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            alert('Speech recognition error: ' + event.error);
        };
        
        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser');
    }
}

// Theme Management
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('#theme-toggle i');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
    
    localStorage.setItem('theme', theme);
}

// Language Management
function handleLanguageChange(e) {
    const language = e.target.value;
    setLanguage(language);
}

function setLanguage(language) {
    currentLanguage = language;
    document.getElementById('language-selector').value = language;
    localStorage.setItem('language', language);
    updateLanguage();
}

function updateLanguage() {
    const t = translations[currentLanguage] || translations.en;
    
    // Update placeholders and text
    document.getElementById('message-input').placeholder = t.placeholder;
    document.querySelector('#send-btn span').textContent = t.send;
    document.querySelector('#clear-btn').innerHTML = `<i class="fas fa-trash-alt mr-1"></i> ${t.clear}`;
    document.querySelector('#suggest-btn').innerHTML = `<i class="fas fa-lightbulb mr-1"></i> ${t.suggestions}`;
    document.querySelector('#voice-btn').innerHTML = `<i class="fas fa-microphone mr-1"></i> ${t.voice}`;
    
    // Update navigation
    document.querySelector('#history-panel h3').textContent = t.chatHistory;
    document.querySelector('#menu-panel h3').textContent = t.menu;
    
    // Update menu items
    const menuItems = document.querySelectorAll('#menu-panel nav a span');
    const menuTexts = [t.home, t.savedChats, t.exportData, t.helpSupport];
    menuItems.forEach((item, index) => {
        if (menuTexts[index]) {
            item.textContent = menuTexts[index];
        }
    });
    
    // Update initial greeting
    showInitialGreeting();
}

// Show Initial Greeting
function showInitialGreeting() {
    const chatMessages = document.getElementById('chat-messages');
    const t = translations[currentLanguage] || translations.en;
    
    chatMessages.innerHTML = `
        <div class="flex justify-start">
            <div class="flex space-x-2 max-w-4xl">
                <div class="flex-shrink-0">
                    <img src="https://placehold.co/32x32/3f37c9/FFFFFF?text=EM" alt="EM avatar" class="w-8 h-8 rounded-full" />
                </div>
                <div class="message-ai rounded-xl rounded-tl-none px-4 py-3">
                    <div class="font-medium">${t.greeting}</div>
                    <div class="text-xs text-gray-500 mt-1">Just now</div>
                </div>
            </div>
        </div>
    `;
}

// Panel Management
function toggleMenu() {
    const panel = document.getElementById('menu-panel');
    const overlay = document.getElementById('overlay');

    if (!panel || !overlay) return; // <== ✅ Add this line

    if (panel.classList.contains('panel-open')) {
        closeMenu();
    } else {
        closeAllPanels();
        panel.classList.add('panel-open');
        overlay.classList.add('show');
    }
}

function toggleHistory() {
    const panel = document.getElementById('history-panel');
    const overlay = document.getElementById('overlay');

    if (!panel || !overlay) return; // <== ✅ Add this line

    if (panel.classList.contains('panel-open')) {
        closeHistory();
    } else {
        closeAllPanels();
        panel.classList.add('panel-open');
        overlay.classList.add('show');
        loadChatHistory();
    }
}


function closeMenu() {
    document.getElementById('menu-panel').classList.remove('panel-open');
    document.getElementById('overlay').classList.remove('show');
}

function closeHistory() {
    document.getElementById('history-panel').classList.remove('panel-open');
    document.getElementById('overlay').classList.remove('show');
}

function closeAllPanels() {
    closeMenu();
    closeHistory();
}

// Settings and Profile Handlers
function handleSettings() {
    alert('Settings panel would open here in a full implementation');
}

function handleProfile() {
    alert('Profile panel would open here in a full implementation');
}

// Chat History Management
function saveMessageToHistory(message, sender) {
    const timestamp = new Date().toISOString();
    const historyItem = {
        message: message,
        sender: sender,
        timestamp: timestamp
    };
    
    chatHistory.push(historyItem);
    saveChatHistory();
}

function saveChatSession() {
    if (chatHistory.length === 0) return;
    
    const session = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        messages: [...chatHistory],
        messageCount: chatHistory.length,
        language: currentLanguage
    };
    
    chatSessions.push(session);
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
}

function loadChatHistory() {
    const historyList = document.getElementById('history-list');
    
    if (chatSessions.length === 0) {
        historyList.innerHTML = '<p class="text-gray-500 text-center py-8">No chat history yet</p>';
        return;
    }
    
    historyList.innerHTML = chatSessions.map(session => {
        const date = new Date(session.timestamp).toLocaleDateString();
        const time = new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const preview = session.messages.find(m => m.sender === 'user')?.message || 'Chat session';
        
        return `
            <div class="history-item" data-session-id="${session.id}">
                <div class="history-date">${date} at ${time}</div>
                <div class="history-preview">${escapeHtml(preview)}</div>
                <div class="text-xs text-gray-400 mt-1">${session.messageCount} messages</div>
            </div>
        `;
    }).join('');
    
    // Add click listeners to history items
    document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', function() {
            const sessionId = this.getAttribute('data-session-id');
            loadChatSession(sessionId);
        });
    });
}

function loadChatSession(sessionId) {
    const session = chatSessions.find(s => s.id == sessionId);
    if (!session) return;
    
    // Clear current chat
    document.getElementById('chat-messages').innerHTML = '';
    
    // Load session messages
    session.messages.forEach(msg => {
        addMessage(msg.message, msg.sender);
    });
    
    closeHistory();
}

// Data Management
function saveChatHistory() {
    localStorage.setItem('currentChatHistory', JSON.stringify(chatHistory));
}

function loadSavedData() {
    // Load chat sessions
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
        chatSessions = JSON.parse(savedSessions);
    }
    
    // Load current chat history
    const savedHistory = localStorage.getItem('currentChatHistory');
    if (savedHistory) {
        chatHistory = JSON.parse(savedHistory);
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateMessageCount() {
    const counter = document.getElementById('message-count');
    const t = translations[currentLanguage] || translations.en;
    counter.textContent = messageCount;
    counter.nextSibling.textContent = ` ${t.messages}`;
}

// Keyboard Shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter to send message
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
    
    // Escape to close panels
    if (e.key === 'Escape') {
        closeAllPanels();
    }
    
    // Ctrl/Cmd + K to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearChat();
    }
    
    // Ctrl/Cmd + H to toggle history
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        toggleHistory();
    }
}

// Export Functions (for potential future use)
function exportChatHistory() {
    const data = {
        chatSessions: chatSessions,
        currentChat: chatHistory,
        exportDate: new Date().toISOString(),
        language: currentLanguage,
        theme: currentTheme
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize Auto-save
setInterval(() => {
    if (chatHistory.length > 0) {
        saveChatHistory();
    }
}, 30000); // Save every 30 seconds