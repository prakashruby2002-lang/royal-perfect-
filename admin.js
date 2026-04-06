// Admin Dashboard Functions

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Switch panels
function switchPanel(panelName) {
    // Update sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update panels
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const panel = document.getElementById(panelName);
    if (panel) {
        panel.classList.add('active');
        
        // Load data based on panel
        if (panelName === 'products') {
            loadAdminProducts();
        } else if (panelName === 'categories') {
            loadAdminCategories();
        } else if (panelName === 'story') {
            loadAdminStory();
        } else if (panelName === 'orders') {
            loadAdminOrders();
        } else if (panelName === 'reviews') {
            loadAdminReviews();
        } else if (panelName === 'settings') {
            loadAdminSettings();
        }
    }
}

// Logout
function logout() {
    adminLogout();
}

// ===== PRODUCTS MANAGEMENT =====

async function loadAdminProducts() {
    console.log('[v0] Loading admin products');
    const productsList = document.getElementById('products-list');
    if (!productsList) return;
    
    productsList.innerHTML = '<div class="loading">Loading products...</div>';
    
    const products = await getProducts(1, 100);
    
    if (products.length === 0) {
        productsList.innerHTML = '<div class="empty-state"><h3>No products yet</h3><p>Add your first product to get started</p></div>';
        return;
    }
    
    let html = '<table class="data-table"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Offer Price</th><th>Actions</th></tr></thead><tbody>';
    
    products.forEach(product => {
        html += `
            <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>₹${product.price.toFixed(0)}</td>
                <td>₹${product.offer_price.toFixed(0)}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteProductAdmin('${product.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    productsList.innerHTML = html;
}

function openProductModal() {
    // Load categories for dropdown
    loadCategoriesForDropdown();
    closeModal('category-modal');
    closeModal('story-modal');
    openModal('product-modal');
}

async function loadCategoriesForDropdown() {
    const select = document.getElementById('product-category');
    if (!select) return;
    
    const categories = await getCategories();
    select.innerHTML = '<option value="">Select a category</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

async function saveProduct(event) {
    event.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const offerPrice = parseFloat(document.getElementById('product-offer-price').value) || price;
    const imagesInput = document.getElementById('product-images');
    const videosInput = document.getElementById('product-videos');
    
    console.log('[v0] Saving product:', name);
    
    let images = [];
    let videos = [];
    
    // Upload images
    if (imagesInput && imagesInput.files.length > 0) {
        images = await uploadMultipleImages(Array.from(imagesInput.files));
    }
    
    // Upload videos
    if (videosInput && videosInput.files.length > 0) {
        videos = await uploadMultipleVideos(Array.from(videosInput.files));
    }
    
    const product = {
        name,
        category,
        description,
        price,
        offer_price: offerPrice,
        images,
        videos
    };
    
    const result = await createProduct(product);
    
    if (result) {
        closeModal('product-modal');
        document.querySelector('#product-modal form').reset();
        loadAdminProducts();
    }
}

function editProduct(productId) {
    console.log('[v0] Editing product:', productId);
    showNotification('Edit feature coming soon');
}

async function deleteProductAdmin(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const result = await deleteProduct(productId);
        if (result) {
            loadAdminProducts();
        }
    }
}

// ===== CATEGORIES MANAGEMENT =====

async function loadAdminCategories() {
    console.log('[v0] Loading admin categories');
    const categoriesList = document.getElementById('categories-list');
    if (!categoriesList) return;
    
    categoriesList.innerHTML = '<div class="loading">Loading categories...</div>';
    
    const categories = await getCategories();
    
    if (categories.length === 0) {
        categoriesList.innerHTML = '<div class="empty-state"><h3>No categories yet</h3><p>Add your first category to get started</p></div>';
        return;
    }
    
    let html = '<table class="data-table"><thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead><tbody>';
    
    categories.forEach(cat => {
        html += `
            <tr>
                <td>${cat.name}</td>
                <td>${cat.description || 'N/A'}</td>
                <td>
                    <button class="btn-edit" onclick="editCategory('${cat.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteCategoryAdmin('${cat.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    categoriesList.innerHTML = html;
}

function openCategoryModal() {
    closeModal('product-modal');
    closeModal('story-modal');
    openModal('category-modal');
}

async function saveCategory(event) {
    event.preventDefault();
    
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    const imageInput = document.getElementById('category-image');
    
    console.log('[v0] Saving category:', name);
    
    let image = '';
    
    if (imageInput && imageInput.files.length > 0) {
        image = await uploadImage(imageInput.files[0]);
    }
    
    const category = {
        name,
        description,
        image
    };
    
    const result = await createCategory(category);
    
    if (result) {
        closeModal('category-modal');
        document.querySelector('#category-modal form').reset();
        loadAdminCategories();
        loadCategories(); // Update frontend categories too
    }
}

function editCategory(categoryId) {
    console.log('[v0] Editing category:', categoryId);
    showNotification('Edit feature coming soon');
}

async function deleteCategoryAdmin(categoryId) {
    if (confirm('Are you sure you want to delete this category?')) {
        const result = await deleteCategory(categoryId);
        if (result) {
            loadAdminCategories();
            loadCategories(); // Update frontend categories too
        }
    }
}

// ===== STORY MANAGEMENT =====

async function loadAdminStory() {
    console.log('[v0] Loading admin story');
    const storyList = document.getElementById('story-list');
    if (!storyList) return;
    
    storyList.innerHTML = '<div class="loading">Loading story...</div>';
    
    const stories = await getStory();
    
    if (stories.length === 0) {
        storyList.innerHTML = '<div class="empty-state"><h3>No story sections yet</h3><p>Add your first story section to get started</p></div>';
        return;
    }
    
    let html = '<table class="data-table"><thead><tr><th>Title</th><th>Order</th><th>Description</th><th>Actions</th></tr></thead><tbody>';
    
    stories.forEach(story => {
        html += `
            <tr>
                <td>${story.title}</td>
                <td>${story.section_order}</td>
                <td>${(story.description || '').substring(0, 50)}...</td>
                <td>
                    <button class="btn-edit" onclick="editStory('${story.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteStoryAdmin('${story.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    storyList.innerHTML = html;
}

function openStoryModal() {
    closeModal('product-modal');
    closeModal('category-modal');
    openModal('story-modal');
}

async function saveStory(event) {
    event.preventDefault();
    
    const title = document.getElementById('story-title').value;
    const description = document.getElementById('story-description').value;
    const imageInput = document.getElementById('story-image');
    const order = parseInt(document.getElementById('story-order').value);
    
    console.log('[v0] Saving story:', title);
    
    let image = '';
    
    if (imageInput && imageInput.files.length > 0) {
        image = await uploadStoryImage(imageInput.files[0]);
    }
    
    const story = {
        title,
        description,
        image,
        section_order: order
    };
    
    const result = await createStory(story);
    
    if (result) {
        closeModal('story-modal');
        document.querySelector('#story-modal form').reset();
        loadAdminStory();
    }
}

function editStory(storyId) {
    console.log('[v0] Editing story:', storyId);
    showNotification('Edit feature coming soon');
}

async function deleteStoryAdmin(storyId) {
    if (confirm('Are you sure you want to delete this story section?')) {
        const result = await deleteStory(storyId);
        if (result) {
            loadAdminStory();
        }
    }
}

// ===== ORDERS MANAGEMENT =====

async function loadAdminOrders() {
    console.log('[v0] Loading admin orders');
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;
    
    ordersList.innerHTML = '<div class="loading">Loading orders...</div>';
    
    const orders = await getOrders();
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="empty-state"><h3>No orders yet</h3></div>';
        return;
    }
    
    let html = '<table class="data-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>';
    
    orders.forEach(order => {
        html += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer_email || 'N/A'}</td>
                <td>₹${order.total?.toFixed(0) || '0'}</td>
                <td>${order.status || 'Pending'}</td>
                <td>${new Date(order.createdat).toLocaleDateString()}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    ordersList.innerHTML = html;
}

// ===== REVIEWS MANAGEMENT =====

async function loadAdminReviews() {
    console.log('[v0] Loading admin reviews');
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    reviewsList.innerHTML = '<div class="loading">Loading reviews...</div>';
    
    const reviews = await getReviews();
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<div class="empty-state"><h3>No reviews yet</h3></div>';
        return;
    }
    
    let html = '<table class="data-table"><thead><tr><th>Product</th><th>Customer</th><th>Rating</th><th>Comment</th><th>Date</th></tr></thead><tbody>';
    
    reviews.forEach(review => {
        html += `
            <tr>
                <td>${review.product_name || 'N/A'}</td>
                <td>${review.customer_name || 'N/A'}</td>
                <td>${'★'.repeat(review.rating || 0)}</td>
                <td>${(review.comment || '').substring(0, 50)}...</td>
                <td>${new Date(review.createdat).toLocaleDateString()}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    reviewsList.innerHTML = html;
}

// ===== SETTINGS MANAGEMENT =====

async function loadAdminSettings() {
    console.log('[v0] Loading admin settings');
    const settingsContent = document.getElementById('settings-content');
    if (!settingsContent) return;
    
    const settings = await getSettings();
    
    settingsContent.innerHTML = `
        <div class="form-group">
            <label>Admin Password</label>
            <input type="password" id="admin-password" placeholder="Enter new admin password">
            <button class="btn-primary" onclick="updateAdminPassword()" style="margin-top: 10px;">Update Password</button>
        </div>
        <div class="form-group">
            <label>Store Name</label>
            <input type="text" id="store-name" value="${settings.store_name || 'Royal Perfect'}" placeholder="Store name">
            <button class="btn-primary" onclick="updateSetting('store_name')" style="margin-top: 10px;">Save</button>
        </div>
        <div class="form-group">
            <label>Store Email</label>
            <input type="email" id="store-email" value="${settings.store_email || ''}" placeholder="Store email">
            <button class="btn-primary" onclick="updateSetting('store_email')" style="margin-top: 10px;">Save</button>
        </div>
    `;
}

async function updateSetting(key) {
    const inputId = key === 'store_name' ? 'store-name' : 'store-email';
    const value = document.getElementById(inputId).value;
    
    const result = await updateSettings(key, value);
    
    if (result) {
        showNotification('Setting updated successfully');
    } else {
        showNotification('Error updating setting', 'error');
    }
}

function updateAdminPassword() {
    const newPassword = document.getElementById('admin-password').value;
    if (newPassword) {
        // In a real app, this would be securely stored
        sessionStorage.setItem('admin_password', newPassword);
        showNotification('Admin password updated (session only - will reset on refresh)');
        document.getElementById('admin-password').value = '';
    }
}

// Initialize admin panel on load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        loadCategoriesForDropdown();
    }
});
