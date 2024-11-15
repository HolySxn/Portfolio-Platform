document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    const messageElement = document.getElementById('register-message');
    messageElement.textContent = '';

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, firstName, lastName, age, gender })
        });

        if (response.ok) {
            messageElement.textContent = 'Registration successful! Redirecting...';
            setTimeout(() => {
                window.location.href = '/html/portfolio.html';
            }, 2000);
        } else {
            const errorData = await response.json();
            messageElement.textContent = errorData.error || 'Failed to register. Try again.';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        messageElement.textContent = 'An unexpected error occurred.';
    }
});
