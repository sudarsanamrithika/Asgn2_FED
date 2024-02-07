const aUrl = 'https://airplanegame-0e10.restdb.io/rest/accounts';
const aKey = '65c2fea74405e1eb04db0819';

function closeUpdate() {
    updateContainer.classList.add('hidden');
    location.reload();
}
  
function removeHidden(){
    updateContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
  
function previewImage(event) {
    const reader = new FileReader();
    
    reader.onload = function() {
      const imagePreview = document.getElementById('image-preview');
      imagePreview.src = reader.result;
    };
    
    reader.readAsDataURL(event.target.files[0]);
}
  
document.getElementById('update-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
  
    const newEmail = document.getElementById('new-email').value;
    const newProfilePic = document.getElementById('new-profile').value;
    const newQuote = document.getElementById('new-quote').value;
    
    const newData = {
        email: newEmail,
        profilePic: newProfilePic,
        quote: newQuote
    };
  
    const username = sessionStorage.getItem('username'); // Assuming username is stored in sessionStorage
    updateUserData(username, newData);
});
  
function updateUserData(username, newData) {
    // Fetch user data based on the username
    fetch(`${aUrl}?q={"username":"${username}"}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': aKey,
        },
    })
    .then(response => response.json())
    .then(data => {
        // Check if user with provided username exists
        if (data.length > 0) {
            const userId = data[0]._id;
            // Now, perform the update operation using the userId
            return fetch(`${aUrl}/${userId}`, {
                method: 'PUT', // Use PUT method for update
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': aKey,
                },
                body: JSON.stringify(newData), // Data to be updated
            });
        } else {
            console.log('User not found.');
            // Handle the case where the user doesn't exist
            // (e.g., show an error message to the user)
        }
    })
    .then(updatedResponse => {
        if (updatedResponse.ok) {
            console.log('User data updated successfully.');
            // Optionally, perform any additional actions after update
        } else {
            console.error('Error updating user data:', updatedResponse.statusText);
            // Handle the case where update failed
            // (e.g., show an error message to the user)
        }
    })
    .catch(error => {
        console.error('Error updating user data:', error);
        // Handle any other errors that may occur
        // (e.g., show an error message to the user)
    });
}