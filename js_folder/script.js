const popupContainer = document.getElementById('popup-container');
const loadingContainer = document.getElementById('loading-container');
const closeBtn = document.getElementById('close-btn');
const delay = 5000;
const apiUrl = 'https://airplanegame-5c8c.restdb.io/rest/accounts';
const apiKey = '65c0fe2e73f36e826e00b4d3';

function postData() {
  const formData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    highscore: 0,
    dodged: 0
  };
  
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-apikey': apiKey,
    },
    body: JSON.stringify(formData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Data posted successfully:', data);
    loadingContainer.classList.remove('hidden');
    setTimeout(() => {
      window.location.href = 'home.html';
    }, delay);
  })
  .catch(error => {
    console.error('Error posting data:', error);
    popupContainer.classList.remove('hidden');
  });

  sessionStorage.setItem("username", username);
  sessionStorage.setItem("password", password);
  sessionStorage.setItem("email", email);
}
  
function login() {
  // Fetch user data based on the username
  const loginUsername = document.getElementById('login-username').value;
  const loginPassword = document.getElementById('login-password').value;

  fetch(`${apiUrl}?q={"username":"${loginUsername}"}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-apikey': apiKey,
    },
  })
  .then(response => response.json())
  .then(data => {
    // Check if user with provided username exists
    if (data.length > 0) {
      const userData = data[0];

      if (userData.password === loginPassword) {
        console.log('Login successful!');
        loadingContainer.classList.remove('hidden');
        setTimeout(() => {
          window.location.href = 'home.html';
        }, delay);
      } else {
        console.log('Incorrect password. Login failed.');
        popupContainer.classList.remove('hidden');
      }
    } else {
      console.log('User not found. Login failed.');
      popupContainer.classList.remove('hidden');
    }
  })

  sessionStorage.setItem("username", loginUsername);
  sessionStorage.setItem("password", loginPassword);
}

  
function closePopup() {
  popupContainer.classList.add('hidden');
  location.reload();
}
