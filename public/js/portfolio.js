document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('portfolio-posts');
    const createPostButton = document.getElementById('create-post-button');

    // Fetch posts from the server
    try {
        const response = await fetch('/portfolio');
        const posts = await response.json();

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'portfolio-post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <div>
                    ${post.images.map(img => `<img src="${img}" alt="${post.title}" />`).join('')}
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }

    // Redirect to create post page
    createPostButton.addEventListener('click', () => {
        window.location.href = '/html/create-post.html';
    });
});
