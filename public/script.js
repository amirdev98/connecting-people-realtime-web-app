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