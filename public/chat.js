const chatHeaderName = document.getElementById('chatHeaderName');
const chatMessages = document.getElementById('chatMessages');
const params = new URLSearchParams(window.location.search);
const currentUser = params.get('user');
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(
    `${protocol}//${window.location.host}/ws?user=${encodeURIComponent(currentUser || '')}`
);
socket.addEventListener("open", () => { console.log("Forbundet til hono WebSocket!") })
socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    console.log('Besked modtaget i browser:', data);
    const message = document.createElement('p');
    message.textContent = data.message;
    if (data.from !== activeUser) return;
    message.className = 'bg-gray-200 text-black p-3 rounded-xl w-fit self-start'
    chatMessages.appendChild(message)
})

async function loadMessages() {
    const response = await fetch(
        `/messages/${currentUser}/${activeUser}`
    );
    if (!response.ok) {
        console.error('Kunne ikke hente beskeder');
        return
    }
    const messages = await response.json();
    chatMessages.innerHTML = '';
    messages.forEach((data) => {
        const message = document.createElement('p');
        message.textContent = data.message;

        message.className = data.sender === currentUser
            ? 'bg-[#2563EB] text-white p-3 rounded-xl w-fit self-end'
            : 'bg-gray-200 text-black p-3 rounded-xl w-fit self-start';
        chatMessages.appendChild(message);
    });
}

const chatUsers = document.querySelectorAll('.chat-user');
let activeUser = currentUser === 'fatih' ? 'sarah' : 'fatih';
chatUsers.forEach((user => {
    user.addEventListener('click', () => {
        activeUser = user.dataset.user;
        chatHeaderName.textContent = users.get(activeUser);
        chatUsers.forEach((item) => {
            item.classList.remove('bg-purple-100')
        });
        user.classList.add('bg-purple-100');
        loadMessages();
        if (window.innerWidth < 768) {
            openMobileChat();
        }


        console.log('Aktiv samtale:', activeUser);
    });
}));
const button = document.getElementById('sendButton');
const input = document.getElementById('messageInput');
const users = new Map();


users.set('fatih', 'Fatih Demir');
users.set('adam', 'Adem Demir');
users.set('sarah', 'Sarah Miller');
users.set('development', 'Development Team');
users.set('vlad', 'Vlad');
console.log(users.get('fatih'))
chatHeaderName.textContent = users.get(activeUser);
chatUsers.forEach((user) => {
    user.classList.toggle(
        'bg-purple-100',
        user.dataset.user === activeUser
    );
});
loadMessages();

function sendMessage() {
    const message = input.value;
    if (!message) return;

    if (socket.readyState === WebSocket.OPEN) {
        const data =
        {
            from: currentUser,
            to: activeUser,
            message: input.value
        };
        socket.send(JSON.stringify(data));
        const messageElement = document.createElement('p');
        messageElement.textContent = data.message;
        messageElement.className =
            'bg-purple-500 text-white p-3 rounded-xl w-fit self-end';
        chatMessages.appendChild(messageElement);
        input.value = '';
    }
}

document.getElementById('backButton').addEventListener('click', () => {
    backToContacts
})


messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }

});

sendButton.addEventListener('click', sendMessage)

const sidebar = document.getElementById('sidebar');
const chatPanel = document.getElementById('chatPanel');
const chatView = document.getElementById('chatView')

function openMobileChat() {
    if (window.innerWidth >= 768) return;
    sidebar.classList.add('hidden');
    chatView.classList.remove('hidden')
    chatView.classList.add('grid')
}


function backToContacts() {
    if (window.innerWidth >= 768) return

    sidebar.classList.remove('hidden');
    chatView.classList.add('hidden');
    chatView.classList.remove('grid');
}

const searchInput = document.getElementById('searchConversations');

searchInput.addEventListener('input', function () {

    const searchValue = searchInput.value.toLowerCase().trim();

    chatUsers.forEach(function (user) {

        const userName = user.textContent.toLowerCase();

        if (userName.includes(searchValue)) {
            user.classList.remove('hidden');
        } else {
            user.classList.add('hidden');
        }

    });

});