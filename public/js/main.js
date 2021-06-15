const numberInput = document.getElementById('number');
const messageInput = document.getElementById('message');
const button = document.getElementById('button');
const response = document.querySelector('.response');

button.addEventListener('click', sendMessage, false);

const socket = io();
socket.on('smsStatus', function(data) {
    response.innerHTML = '<h5>Text message sent to: ' + data.number + '</h5>';
})

function sendMessage() {
    const number = numberInput.value.replace(/\D/g, '');
    const message = messageInput.value;

    fetch('/', { 
        method: 'post', 
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify({ number: number, message: message })
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
}