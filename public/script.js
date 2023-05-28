let chatCircle = document.getElementById('chat-circle');
let chatBox = document.querySelector('.chat-box');
let chatBoxClose = document.querySelector('.chat-box-toggle');
 console.log(chatCircle, chatBox, chatBoxClose)

chatCircle.addEventListener('click', hideCircle); 
chatBoxClose.addEventListener('click', chatBoxCl);


function hideCircle(evt) {
    evt.preventDefault();
    chatCircle.style.display = 'none';
    chatBox.style.display = 'block';
    chatBoxWelcome.style.display = 'block';
  }

  function chatBoxCl(evt) {
    evt.preventDefault();
    chatCircle.style.display = 'block';
    chatBox.style.display = 'none';
    chatBoxWelcome.style.display = 'none';
    chatWrapper.style.display = 'none';
  }








//Chatroom
let socket = io()
let messages = document.querySelector('section ul')
let input = document.querySelector('input')

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault()
  if (input.value) {
    socket.emit('message', input.value)
    input.value = ''
  }
})

socket.on('message', (message) => {
  addMessage(message)
})

socket.on('whatever', (message) => {
  addMessage(message)
})

socket.on('history', (history) => {
  history.forEach((message) => {
    addMessage(message)
  })
})

function addMessage(message) {
  messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
  messages.scrollTop = messages.scrollHeight
}
