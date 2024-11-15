document.getElementById('create-post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const externalImageUrl = document.getElementById('externalImageUrl').value;

    // Add external image URLs to the form data
    if (externalImageUrl) {
        formData.append('externalImageUrl', externalImageUrl);
    }

    const messageElement = document.getElementById('create-post-message');

    try {
        const response = await fetch('/portfolio/create', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            messageElement.textContent = 'Post created successfully!';
            setTimeout(() => {
                window.location.href = '/html/portfolio.html';
            }, 2000);
        } else {
            const errorData = await response.json();
            messageElement.textContent = errorData.error || 'Error creating post.';
        }
    } catch (error) {
        console.error('Error submitting post:', error);
        messageElement.textContent = 'An unexpected error occurred.';
    }
});
