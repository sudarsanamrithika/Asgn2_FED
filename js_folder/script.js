const apiUrl = 'https://airplanegame-f27a.restdb.io/rest/accounts';
const apiKey = '65b70864da76eb17f5969090';
const popupContainer = document.getElementById('popup-container');
const closeBtn = document.getElementById('close-btn');

function postData() {
  const formData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
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
      window.location.href = 'home.html';
    })
    .catch(error => {
      console.error('Error posting data:', error);
      popupContainer.classList.remove('hidden');
    });
}
  
function login() {
  const loginUsername = document.getElementById('login-username').value;
  const loginPassword = document.getElementById('login-password').value;

  // Fetch user data based on the username
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
      } else {
        console.log('Incorrect password. Login failed.');
        popupContainer.classList.remove('hidden');
      }
    } else {
      console.log('User not found. Login failed.');
      popupContainer.classList.remove('hidden');
    }
  })

  .catch(error => {
    console.error('Error during login:', error);
    popupContainer.classList.remove('hidden');
  });
}

function closePopup() {
  popupContainer.classList.add('hidden');
}

closeBtn.addEventListener('click', closePopup);
