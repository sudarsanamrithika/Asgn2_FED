const apiUrl = 'https://airplanegame-f27a.restdb.io/rest/accounts';
const apiKey = '65b70864da76eb17f5969090';
const popupContainer = document.getElementById('popup-container');
const closeBtn = document.getElementById('close-btn');
const loginUsername = document.getElementById('login-username').value;
const loginPassword = document.getElementById('login-password').value;


function postData() {
  const formData = {
    username: document.getElementById('newUsername').value,
    email: document.getElementById('newEmail').value,
    password: document.getElementById('newPassword').value,
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
    window.location.href = 'home.html';
  })
  .catch(error => {
    console.error('Error posting data:', error);
    popupContainer.classList.remove('hidden');
  });

  sessionStorage.setItem("newUsername", newUsername);
  sessionStorage.setItem("newPassword", newPassword);
  sessionStorage.setItem("newEmail", newEmail);
}
  
function login() {
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

  sessionStorage.setItem("username", loginUsername);
  sessionStorage.setItem("password", loginPassword);
  sessionStorage.setItem("email", email);
}

function updateHighscore() {
  var newHighScore = 0;
  console.log(newHighScore);
  var jsondata = {loginUsername: loginUsername, email: email, password: password, newHighScore: newHighScore, dodged: dodged };
  var settings = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify(jsondata)
  }

  fetch(`apiUrl/${loginUsername}`, settings)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    }); 
}
  
function closePopup() {
  popupContainer.classList.add('hidden');
  location.reload();
}

closeBtn.addEventListener('click', closePopup);
