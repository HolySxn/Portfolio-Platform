document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('portfolio-posts');
    const createPostButton = document.getElementById('create-post-button');

    // Logout logic
    document.getElementById('logout-button').addEventListener('click', async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Logged out successfully!');
                window.location.href = '/html/login.html';
            } else {
                const errorData = await response.json();
                alert(`Logout failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error logging out:', error);
            alert('An unexpected error occurred during logout.');
        }
    });

    // Fetch and display portfolio posts
    async function fetchPosts() {
        try {
            const response = await fetch('/portfolio', { credentials: 'include' });
            if (!response.ok) throw new Error('Failed to fetch posts.');
            const posts = await response.json();

            postsContainer.innerHTML = '';
            posts.forEach((post) => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                <div class="portfolio-post">
                    <h3>${post.title}</h3>
                    <p>${post.description}</p>
                    <div>
                        ${post.images
                            .map(
                                (img) =>
                                    `<img src="data:${img.contentType};base64,${img.data}" alt="${post.title}" />`
                            )
                            .join('')}
                    </div>
                </div>
                `;
                postsContainer.appendChild(postElement);
            });

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>No posts yet. Create your first post!</p>';
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p>Failed to load posts.</p>';
        }
    }

    await fetchPosts();

    // Redirect to create post page
    createPostButton.addEventListener('click', () => {
        window.location.href = '/html/create-post.html';
    });
});
