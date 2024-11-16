document.getElementById('create-post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const imagesInput = document.getElementById('images').files;

    const images = [];
    for (const file of imagesInput) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => {
            reader.onloadend = () => {
                const base64Data = reader.result.split(',')[1];
                images.push({
                    data: base64Data,
                    contentType: file.type,
                });
                resolve();
            };
        });
    }


    const messageElement = document.getElementById('create-post-message');

    try {
        const response = await fetch('/portfolio/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description,
                images,
            }),
        });

        if (response.ok) {
            messageElement.textContent = 'Post created successfully!';
            setTimeout(() => {
                window.location.href = '/html/portfolio.html';
            }, 2000);
        } else {
            const errorData = await response.json();
            messageElement.textContent =
                errorData.error || 'Failed to create post. Try again.';
        }
    } catch (error) {
        console.error('Error creating post:', error);
        messageElement.textContent = 'An unexpected error occurred.';
    }
});
