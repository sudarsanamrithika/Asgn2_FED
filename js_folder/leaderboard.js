const APIURL = 'https://airplanegame-17aa.restdb.io/rest/accounts';
const APIKEY = '65c61a19be534ae09fd9ef74';

// Function to fetch all high scores from different accounts
async function fetchAllHighScores() {
    try {
        const response = await fetch(`${APIURL}?sort=highscore&dir=-1`, {
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': APIKEY
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch high scores');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching high scores:', error);
        throw error;
    }
}

async function renderLeaderboard() {
    const podium = document.getElementById('podium');
    const leaderboardList = document.getElementById('leaderboard-list');
    podium.innerHTML = ''; 
    leaderboardList.innerHTML = ''; 

    try {
        // Fetch high scores
        const highScores = await fetchAllHighScores();

        // Render podium (players in order of 2nd, 1st, and 3rd)
        for (let i = 0; i < Math.min(3, highScores.length); i++) {
            const player = highScores[i];
            const podiumElement = document.createElement('div');
            podiumElement.classList.add('top-player');
            // Reorder podium
            if (i === 1) {
                podiumElement.textContent = '2nd. ' + player.username + ': ' + player.highscore;
            } else if (i === 0) {
                podiumElement.textContent = '1st. ' + player.username + ': ' + player.highscore;
            } else {
                podiumElement.textContent = '3rd. ' + player.username + ': ' + player.highscore;
            }
            podium.appendChild(podiumElement);
        }

        // Render leaderboard data (remaining players)
        for (let i = 3; i < highScores.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = (i + 1) + '. ' + highScores[i].username + ': ' + highScores[i].highscore;
            leaderboardList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Error rendering leaderboard:', error);
        leaderboardList.innerHTML = '<li>Error fetching leaderboard data</li>';
    }
}

function goToLoginPage() {
    window.location.href="login.html";
}

function goToSignUp() {
    window.location.href = "signup.html";
}

// Render leaderboard when the page loads
document.addEventListener('DOMContentLoaded', renderLeaderboard);
