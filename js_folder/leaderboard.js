

async function fetchLeaderboardSorted() {
    const response = await fetch(`${apiUrl}?sort=score&dir=-1`, {
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': apiKey
        }
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error('Failed to fetch leaderboard data');
    }
}

fetchLeaderboardSorted()
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });