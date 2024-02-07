const popupContainer = document.getElementById('popup-container');
const loadingContainer = document.getElementById('loading-container');
const deleteContainer = document.getElementById('delete-container');
const closeBtn = document.getElementById('close-btn');
const cUser = document.getElementById('currentUsername');
const wBack = document.getElementById('welcome-back');
const uEmail = document.getElementById('userEmail');
const profile = document.getElementById('profile');
const uQuote = document.getElementById('quote');
const highScore = document.getElementById('highscore');
const delay = 5000;
const apiUrl = 'https://airplanegame-0e10.restdb.io/rest/accounts';
const apiKey = '65c2fea74405e1eb04db0819';

function postData() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const profilePic = 'imgs/baseProfile.png';
  const highScore = 0;
  const quote = 'Lorem ipsum';
  
  const formData = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    highscore: 0,
    quote: 'Lorem ipsum',
    profilePic: 'imgs/baseProfile.png'
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
  
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("username", username);
  sessionStorage.setItem("profile", profilePic);
  sessionStorage.setItem("highscore", highScore);
  sessionStorage.setItem("quote", quote);
}
  
function login() {
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
    if (data.length > 0) {
      const userData = data[0];

      if (userData.password === loginPassword) {
        sessionStorage.setItem("email", userData.email);
        sessionStorage.setItem("profile", userData.profilePic);
        sessionStorage.setItem("quote", userData.quote);
        sessionStorage.setItem("highscore", userData.highscore);
        console.log(userData.highscore);
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
  .catch(error => {
    console.error('Error fetching user data:', error);
  });

  sessionStorage.setItem("username", loginUsername);
  sessionStorage.setItem("password", loginPassword);
}

function deleteAccount(username) {
  fetch(`${apiUrl}?q={"username":"${username}"}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'x-apikey': apiKey,
      },
  })
  .then(response => response.json())
  .then(data => {
      if (data.length > 0) {
          const userId = data[0]._id;
          return fetch(`${apiUrl}/${userId}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
                  'x-apikey': apiKey,
              },
          });
      } else {
          console.log('User not found.');
      }
  })
  .then(deletedResponse => {
      if (deletedResponse.ok) {
          console.log('Account deleted successfully.');
          deleteContainer.classList.remove('hidden');
          setTimeout(() => {
            window.location.href = 'index.html';
          }, delay);
      } else {
          console.error('Error deleting account:', deletedResponse.statusText);
      }
  })
  .catch(error => {
      console.error('Error deleting account:', error);
  });
}

function closePopup() {
  popupContainer.classList.add('hidden');
  location.reload();
}

document.getElementById('delete-account-btn').addEventListener('click', function() {
  const username = sessionStorage.getItem('username'); 
  if (confirm('Are you sure you want to delete your account? This cannot be undone!')) {
    deleteAccount(username);  
  };
});

const currentUsername = sessionStorage.getItem("username");
const currentEmail = sessionStorage.getItem("email");
const imgSrc = sessionStorage.getItem('profile');
const userQuote = sessionStorage.getItem('quote');
const highscore = sessionStorage.getItem('highscore');
profile.src = imgSrc;
cUser.textContent = `${currentUsername}!!!`;
uEmail.textContent = `${currentEmail}`;
uQuote.textContent = `${userQuote}`;
highScore.textContent = `${highscore}`;



