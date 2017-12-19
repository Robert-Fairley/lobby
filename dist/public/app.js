const connOpen = document.querySelector('#openBtn');
const connClose = document.querySelector('#closeBtn');
const connClear = document.querySelector('#clearBtn');
const connInput = document.querySelector('#chatbox');
const connSend = document.querySelector('#sendBtn');
const connLabel = document.querySelector('#connLabel');
const connOutput = document.querySelector('#output');

let app = undefined;
let CONN = 0;

class Utility {
  updateScroll(_el) {
    if (_el instanceof Element) {
      _el.scrollTop = _el.scrollHeight;
    }
  }
  
  resetInput(_event) {
    connInput.value = '';
    this.updateScroll(connOutput);
  }
}

let Lobby = (function (_props) {
  let socket = new WebSocket('ws://localhost:8999');

  console.log('Connecting...');

  socket.onopen = event => {
    console.log('Connected.');
    CONN = WebSocket.OPEN;
    connLabel.classList.remove('disconnected')
    connLabel.classList.add('connected');
  };

  socket.onmessage = message => {
    connOutput.innerHTML += serverMessage(message.data);
    utility.updateScroll(connOutput);
  };

  socket.onclose = message => {
    console.log('Connection closed.');
    connLabel.classList.remove('connected')
    connLabel.classList.add('disconnected');
    connOutput.innerHTML += serverMessage('Connection closed.');
    utility.updateScroll(connOutput);
  };

  socket.onerror = event => {
    let error = JSON.stringify(event) || 'Undefined Error';
    console.error('Connection error. Reason: ', error);
    connLabel.classList.remove('connected')
    connLabel.classList.add('disconnected');
  };

  function sendMessage(event) {
    let message = connInput.value;
    let messageData = { message };
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      connOutput.innerHTML += userMessage(message);
      utility.resetInput(event);
      utility.updateScroll(connOutput);
    }
  };

  function serverMessage(_msg) {
    let _d = new Date();
    let recDate = _d.toLocaleString();
    return `<span class="message__server"><strong>Server [${recDate}]: ${_msg}</strong></span><br/>`;
  }

  function userMessage(_msg) {
    let _d = new Date();
    let sendDate = _d.toLocaleString();
    return `<span class="message__user">You [${sendDate}]: ${_msg}</span><br/>`
  }

  function clearMessages(event) {
    connOutput.innerHTML = '';
    if (socket.readyState === WebSocket.OPEN) {
      serverMessage('Connected.');
    }
    else {
      serverMessage('Disconnected.');
    }
  }

  this.closeConnection = event => {
    console.log('Closing connection...');
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
      CONN = 0;
    }
    else {
      console.error('Connection not present.');
    }
  }

  connSend.addEventListener('click', sendMessage);

  connClose.addEventListener('click', this.closeConnection);

  connClear.addEventListener('click', clearMessages);
  
  window.addEventListener('keydown', event => {
    if (event.keyCode == 13) {
      connSend.click();
      utility.resetInput(event);
      utility.updateScroll(connOutput);
    }
  });

  window.onunload = event => {
    socket.close();
  };
});

const utility = new Utility();

connOpen.addEventListener('click', e => {
  if (CONN == 0) {
    app = new Lobby();
  }
  else {
    console.error('Connection already made.');
  }
});

window.closeit = () => {
  app.closeConnection();
}