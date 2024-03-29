// naming vars and consts 
const apiUrl = 'https://airplanegame-17aa.restdb.io/rest/accounts';
const apiKey = '65c61a19be534ae09fd9ef74';

const highScore = document.getElementById('highscore');
const uEmail = document.getElementById('userEmail');
const profile = document.getElementById('profile');
const uQuote = document.getElementById('quote');
const cUser = document.getElementById('currentUsername');
const deleteContainer = document.getElementById('delete-container');

const currentEmail = sessionStorage.getItem("email");
const currentUsername = sessionStorage.getItem("username");
const imgSrc = sessionStorage.getItem('profile');
const userQuote = sessionStorage.getItem('quote');
const highscore = sessionStorage.getItem('highscore');

// change txt content for specifc element ids
cUser.textContent = `${currentUsername}`;
profile.src = imgSrc;
uEmail.textContent = `${currentEmail}`;
uQuote.textContent = `${userQuote}`;
highScore.textContent = `${highscore}`;

// to delete an account 
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
              }, 5000);
        } else {
            console.error('Error deleting account:', deletedResponse.statusText);
        }
    })
    .catch(error => {
        console.error('Error deleting account:', error);
    });
}

// show pop up when delete button clicked 
document.getElementById('delete-account-btn').addEventListener('click', function() {
    const username = sessionStorage.getItem('username'); 
    // if corr, run delete acc 
    if (confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      deleteAccount(username);  
    }
});

// to logout
function logout() {
    window.location.href = "index.html";
}



  

