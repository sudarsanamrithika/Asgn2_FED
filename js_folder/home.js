const cUser = document.getElementById('currentUsername');
const currentUsername = sessionStorage.getItem("username");
cUser.textContent = `${currentUsername}!!!`;