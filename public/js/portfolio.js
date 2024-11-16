document.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('portfolio-posts');
    const createPostButton = document.getElementById('create-post-button');
    const enable2FAButton = document.getElementById('enable-2fa-button');
    const disable2FAButton = document.getElementById('disable-2fa-button');
    const qrCodeSection = document.getElementById('qr-code');
    const qrCodeImg = document.getElementById('qr-code-img');
    const twoFactorStatus = document.getElementById('2fa-status');

    let userRole = ''; // Store the user's role

    // Function to fetch the user's role
    async function fetchUserRole() {
        try {
            const response = await fetch('/auth/user', { credentials: 'include' });
            const user = await response.json();

            if (response.ok) {
                userRole = user.role; // Save the user's role
                console.log(userRole)
            } else {
                console.error('Failed to fetch user role:', user.error);
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    }

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

    // Function to delete a post
    async function deletePost(postId) {
        try {
            const response = await fetch(`/portfolio/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Post deleted successfully.');
                await fetchPosts(); // Refresh posts
            } else {
                const result = await response.json();
                alert(result.error || 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('An unexpected error occurred while deleting the post.');
        }
    }

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
                    ${
                        userRole === 'admin'
                            ? `<button class="delete-post-button" data-id="${post._id}">Delete Post</button>`
                            : ''
                    }
                </div>
                `;
                postsContainer.appendChild(postElement);
            });

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>No posts yet. Create your first post!</p>';
            }

            // Attach delete event listeners
            document.querySelectorAll('.delete-post-button').forEach((button) => {
                button.addEventListener('click', async () => {
                    const postId = button.getAttribute('data-id');
                    await deletePost(postId);
                });
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p>Failed to load posts.</p>';
        }
    }

    // Redirect to create post page
    createPostButton.addEventListener('click', () => {
        window.location.href = '/html/create-post.html';
    });

    // Function to check 2FA status
     async function check2FAStatus() {
        try {
            const response = await fetch('/auth/2fa/status', { credentials: 'include' });
            const result = await response.json();

            if (response.ok) {
                if (result.twoFactorEnabled) {
                    // 2FA is enabled
                    twoFactorStatus.textContent = '2FA is enabled for your account.';
                    enable2FAButton.style.display = 'none';
                    disable2FAButton.style.display = 'inline-block';
                    qrCodeSection.style.display = 'none';
                } else {
                    // 2FA is not enabled
                    twoFactorStatus.textContent = '2FA is not enabled for your account.';
                    enable2FAButton.style.display = 'inline-block';
                    disable2FAButton.style.display = 'none';
                    qrCodeSection.style.display = 'none';
                }
            } else {
                twoFactorStatus.textContent = 'Unable to fetch 2FA status. Please try again later.';
            }
        } catch (error) {
            console.error('Error checking 2FA status:', error);
            twoFactorStatus.textContent = 'An error occurred while checking 2FA status.';
        }
    }

    // Event listener to enable 2FA
    enable2FAButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/auth/2fa/enable', {
                method: 'POST',
                credentials: 'include',
            });
            const result = await response.json();

            if (response.ok) {
                // Update status and display QR code
                twoFactorStatus.textContent = '2FA enabled. Use the QR code to configure your authenticator app.';
                enable2FAButton.style.display = 'none';
                disable2FAButton.style.display = 'inline-block';
                qrCodeSection.style.display = 'block';
                qrCodeImg.src = result.qrCode; // Display the QR code
            } else {
                alert(result.error || 'Failed to enable 2FA. Please try again.');
            }
        } catch (error) {
            console.error('Error enabling 2FA:', error);
            alert('An unexpected error occurred while enabling 2FA.');
        }
    });

    // Event listener to disable 2FA
    disable2FAButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/auth/2fa/disable', {
                method: 'POST',
                credentials: 'include',
            });
            const result = await response.json();

            if (response.ok) {
                alert('2FA disabled successfully.');
                await check2FAStatus(); // Refresh the 2FA status
            } else {
                alert(result.error || 'Failed to disable 2FA. Please try again.');
            }
        } catch (error) {
            console.error('Error disabling 2FA:', error);
            alert('An unexpected error occurred while disabling 2FA.');
        }
    });

    // Initial check of 2FA status
    await check2FAStatus();

    // Fetch user role and posts
    await fetchUserRole();
    await fetchPosts();
});
