const access_token = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("access_token="))
                    ?.split("=")[1];

async function fetchGreetingAndImage() {
    try {
        const response = await fetch('/displayName');
        const data = await response.json();
        document.getElementById('greeting').textContent = `Hello, ${data.displayName}!`;
        if (data.imageUrl) {
            document.getElementById('user-image').src = data.imageUrl;
        } else {
            document.getElementById('user-image').style.display = 'none';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('greeting').textContent = 'Error loading user data.';
    }
}
fetchGreetingAndImage();
