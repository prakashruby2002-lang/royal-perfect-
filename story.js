// Story Page Functions

async function initStoryPage() {
    console.log('[v0] Initializing story page');
    await loadStoryContent();
}

async function loadStoryContent() {
    console.log('[v0] Loading story content');
    const storyContent = document.getElementById('story-content');
    if (!storyContent) return;
    
    storyContent.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>Loading story...</p></div>';
    
    const stories = await getStory();
    
    if (stories.length === 0) {
        storyContent.innerHTML = '<div class="empty-state"><h3>Story coming soon</h3><p>Our story sections are being prepared. Check back soon!</p></div>';
        return;
    }
    
    let html = '';
    
    stories.forEach((story, index) => {
        html += `
            <div class="story-section" style="animation-delay: ${index * 0.2}s">
                <div class="story-image">
                    ${story.image ? 
                        `<img src="${story.image}" alt="${story.title}" loading="lazy">` : 
                        '<div class="story-image-skeleton"></div>'
                    }
                </div>
                <div class="story-content">
                    <h2>${story.title}</h2>
                    <p>${story.description}</p>
                </div>
            </div>
        `;
    });
    
    storyContent.innerHTML = html;
    console.log('[v0] Story content loaded:', stories.length, 'sections');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initStoryPage);
