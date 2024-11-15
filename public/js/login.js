document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const messageElement = document.getElementById('login-message');
    messageElement.textContent = '';

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            messageElement.textContent = 'Login successful! Redirecting...';

            // Save token in local storage (optional)
            localStorage.setItem('token', data.token);

            // Redirect to portfolio page
            setTimeout(() => {
                window.location.href = '/html/portfolio.html';
            }, 2000);
        } else {
            const errorData = await response.json();
            messageElement.textContent = errorData.error || 'Login failed. Please try again.';
        }
    } catch (error) {
        console.error('Error during login:', error);
        messageElement.textContent = 'An unexpected error occurred.';
    }
});
