document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('login-message'); // Assuming this is your message element

    try {
        // First request: Send email and password
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json(); // Properly define 'result'

        if (response.ok) {
            if (result.twoFactorRequired) {
                // 2FA is required; prompt the user for the 2FA code
                const twoFactorCode = prompt('Enter your 2FA code:');

                // Second request: Submit 2FA code
                const secondResponse = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, twoFactorCode }),
                });

                const secondResult = await secondResponse.json();

                if (secondResponse.ok) {
                    // Redirect to portfolio page
                    messageElement.textContent = 'Login successful! Redirecting...';
                    setTimeout(() => {
                        window.location.href = '/html/portfolio.html';
                    }, 2000);
                } else {
                    messageElement.textContent = secondResult.error || 'Invalid 2FA code.';
                }
            } else {
                // No 2FA required; login is successful
                messageElement.textContent = 'Login successful! Redirecting...';
                // Redirect to portfolio page
                setTimeout(() => {
                    window.location.href = '/html/portfolio.html';
                }, 2000);
            }
        } else {
            // Handle errors from the first response
            messageElement.textContent = result.error || 'Login failed.';
        }
    } catch (error) {
        console.error('Error during login:', error);
        messageElement.textContent = 'An unexpected error occurred during login.';
    }
});
