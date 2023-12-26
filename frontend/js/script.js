const login = document.querySelector('.login');
const loginForm = document.querySelector('.login__form');
const loginInput = document.querySelector('.login__input');

const chat = document.querySelector('.chat');
const chatForm = document.querySelector('.chat__form');
const chatInput = document.querySelector('.chat__input');
const chatMessages = document.querySelector('.chat__messages');

const colors = [
  'cadetblue',
  'darkgoldenrod',
  'cornflowerblue',
  'darkkaki',
  'hotpink',
  'gold',
];

const user = {
  id: '',
  name: '',
  color: '',
};

let webSocket;

const createMessageElementSelf = (content) => {
  const div = document.createElement('div');

  div.classList.add('message--self');
  div.innerHTML = content;

  return div;
};

const createMessageElementOther = (content, sender, senderColor) => {
  const div = document.createElement('div');
  const span = document.createElement('span');

  div.classList.add('message--other');

  div.classList.add('message--self');
  span.classList.add('message--sender');
  span.style.color = senderColor;

  div.appendChild(span);

  span.innerHTML = sender;
  div.innerHTML += content;

  return div;
};

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: 'smooth',
  });
};

const processMessage = ({ data }) => {
  console.log(data);
  const { userId, userName, userColor, content } = JSON.parse(data);

  const message =
    userId === user.id
      ? createMessageElementSelf(content)
      : createMessageElementOther(content, userName, userColor);

  chatMessages.appendChild(message);
  scrollScreen();
};

const handleLogin = (e) => {
  e.preventDefault();

  user.id = crypto.randomUUID();
  user.name = loginInput.value;
  user.color = getRandomColor();

  login.style.display = 'none';
  chat.style.display = 'flex';

  WebSocket = new WebSocket('wss://trabai-backend.onrender.com');
  WebSocket.onmessage = processMessage;
};

const sendMessage = (e) => {
  e.preventDefault();

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  };
  WebSocket.send(JSON.stringify(message));
  chatInput.value = '';
};

loginForm.addEventListener('submit', handleLogin);
chatForm.addEventListener('submit', sendMessage);
