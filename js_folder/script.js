function postData() {
    const apiUrl = 'https://airplanegame-f27a.restdb.io/rest/accounts';
    const apiKey = '65b70864da76eb17f5969090';
  
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
      .then(response => response.json())
      .then(data => {
        console.log('Data posted successfully:', data);
        // Optionally, you can redirect to another page or perform additional actions after successful posting
      })
      .catch(error => {
        console.error('Error posting data:', error);
        // Handle errors as needed
      });
  }
  