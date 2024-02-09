// naming vars and consts
const popupContainer = document.getElementById('popup-container');
const loadingContainer = document.getElementById('loading-container');
const closeBtn = document.getElementById('close-btn');
const wBack = document.getElementById('welcome-back');
const deleteContainer = document.getElementById('delete-container');
const delay = 5000;
const apiUrl = 'https://airplanegame-17aa.restdb.io/rest/accounts';
const apiKey = '65c61a19be534ae09fd9ef74';

// to post new data to database
function postData() {
  // set base qualities
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const profilePic = 'imgs/baseProfile.png'; 
  const highScore = 0; 
  const quote = 'Lorem ipsum';
  
  // post to database
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
  
  // save in session storage to use across diff pages
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("username", username);
  sessionStorage.setItem("profile", profilePic);
  sessionStorage.setItem("highscore", highScore);
  sessionStorage.setItem("quote", quote);
}
  
// to login user
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
      // check is password is correct
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
        popupContainer.classList.remove('hidden'); // if error occur, pop up to notify user
      }
    } else {

      popupContainer.classList.remove('hidden');
    }
  })
  .catch(error => {
    popupContainer.classList.remove('hidden');
  });

  // save in session storage to use in diff pages
  sessionStorage.setItem("username", loginUsername);
  sessionStorage.setItem("password", loginPassword);
}

// close pop up on click
function closePopup() {
  popupContainer.classList.add('hidden');
  location.reload();
}

// go to game page 
function goToGamePage() {
  window.location.href = "game.html";
}




