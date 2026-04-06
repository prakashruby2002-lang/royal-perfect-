// Products Page Functions

let currentPage = 1;
let productsPerPage = 12;
let allProducts = [];
let filteredProducts = [];
let selectedCategory = null;

// Initialize products page
async function initProducts() {
    console.log('[v0] Initializing products page');
    await loadCategories();
    await loadProducts();
    setupFilters();
    setupRealtime();
}

// Load categories and display as navigation
async function loadCategories() {
    console.log('[v0] Loading categories');
    const categories = await getCategories();
    
    // Populate navbar
    const navbarItems = document.getElementById('navbar-items');
    if (navbarItems) {
        navbarItems.innerHTML = '<div class="nav-item active" onclick="filterByCategory(null)">All Products</div>';
        categories.forEach(cat => {
            const item = document.createElement('div');
            item.className = 'nav-item';
            item.textContent = cat.name;
            item.onclick = () => filterByCategory(cat.name);
            navbarItems.appendChild(item);
        });
    }
    
    // Populate category icons
    const categoryIcons = document.getElementById('category-icons');
    if (categoryIcons) {
        categoryIcons.innerHTML = '';
        categories.forEach(cat => {
            const icon = document.createElement('div');
            icon.className = 'category-icon-item';
            icon.onclick = () => filterByCategory(cat.name);
            icon.innerHTML = `
                <img src="${cat.image || 'https://via.placeholder.com/48'}" alt="${cat.name}" class="category-icon-img" style="object-fit: cover;">
                <span class="category-icon-name">${cat.name}</span>
            `;
            categoryIcons.appendChild(icon);
        });
    }
}

// Load and display products
async function loadProducts() {
    console.log('[v0] Loading products - Page:', currentPage);
    const client = getSupabaseClient();
    if (!client) return;
    
    try {
        let query = client.from('products').select('*');
        
        if (selectedCategory) {
            query = query.eq('category', selectedCategory);
        }
        
        const { data, error } = await query.order('createdat', { ascending: false });
        
        if (error) {
            console.error('[v0] Error loading products:', error);
            showNotification('Unable to load products', 'error');
            return;
        }
        
        allProducts = data || [];
        filteredProducts = allProducts;
        
        displayProducts();
        updatePagination();
    } catch (error) {
        console.error('[v0] Products loading error:', error);
    }
}

// Display products on grid
function displayProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);
    
    if (productsToShow.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No products found</div>';
        return;
    }
    
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-item" onclick="viewProductDetail('${product.id}')">
            <div class="product-image" style="background-image: url('${product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/190x253'}')"></div>
            <div class="product-body">
                <div class="product-name">${product.name}</div>
                <div class="product-rating">★★★★★ (${Math.floor(Math.random() * 500)})</div>
                <div class="product-price-container">
                    <span class="product-actual-price">₹${product.actual_price.toFixed(0)}</span>
                    <span class="product-offer-price">₹${product.offer_price.toFixed(0)}</span>
                </div>
                <div class="product-buttons">
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${product.id}', '${product.name}', ${product.offer_price})">Add to Cart</button>
                    <button class="btn-view-detail" onclick="event.stopPropagation(); viewProductDetail('${product.id}')">Details</button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('[v0] Displayed', productsToShow.length, 'products');
}

// View product detail
async function viewProductDetail(productId) {
    console.log('[v0] Viewing product:', productId);
    const product = await getProductById(productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return;
    }
    
    localStorage.setItem('selectedProduct', JSON.stringify(product));
    window.location.href = 'product-detail.html';
}

// Filter by category
async function filterByCategory(category) {
    console.log('[v0] Filtering by category:', category);
    selectedCategory = category;
    currentPage = 1;
    
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if ((category && item.textContent === category) || (!category && item.textContent === 'All Products')) {
            item.classList.add('active');
        }
    });
    
    // Update category icons
    document.querySelectorAll('.category-icon-item').forEach(item => {
        item.classList.remove('active');
        if (category && item.textContent.includes(category)) {
            item.classList.add('active');
        }
    });
    
    await loadProducts();
}

// Setup filters
function setupFilters() {
    const priceLow = document.getElementById('price-low');
    const priceMid = document.getElementById('price-mid');
    const priceHigh = document.getElementById('price-high');
    
    if (priceLow) priceLow.addEventListener('change', applyPriceFilter);
    if (priceMid) priceMid.addEventListener('change', applyPriceFilter);
    if (priceHigh) priceHigh.addEventListener('change', applyPriceFilter);
}

// Apply price filter
function applyPriceFilter() {
    const priceLow = document.getElementById('price-low')?.checked;
    const priceMid = document.getElementById('price-mid')?.checked;
    const priceHigh = document.getElementById('price-high')?.checked;
    
    filteredProducts = allProducts.filter(product => {
        if (!priceLow && !priceMid && !priceHigh) return true;
        
        const price = product.offer_price;
        if (priceLow && price <= 5000) return true;
        if (priceMid && price > 5000 && price <= 15000) return true;
        if (priceHigh && price > 15000) return true;
        
        return false;
    });
    
    currentPage = 1;
    displayProducts();
    updatePagination();
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    console.log('[v0] Searching for:', query);
    
    filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
    );
    
    currentPage = 1;
    displayProducts();
    updatePagination();
}

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationInfo = document.getElementById('pagination-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (paginationInfo) {
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`;
    }
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
}

function nextPage() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayProducts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayProducts();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Cart functions
let cart = JSON.parse(localStorage.getItem('rp_cart')) || [];

function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, name: productName, price, quantity: 1 });
    }
    
    localStorage.setItem('rp_cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${productName} added to cart`);
    console.log('[v0] Added to cart:', productName);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = cart.length;
    }
}

function openCart() {
    console.log('[v0] Opening cart');
    showNotification('Cart feature coming soon');
}

// Navigation
function goToHome() {
    window.location.href = 'index.html';
}

function goToStory() {
    window.location.href = 'story.html';
}

function goToAdmin() {
    window.location.href = 'admin.html';
}

// Setup realtime updates
function setupRealtime() {
    const client = getSupabaseClient();
    if (!client) return;
    
    // Subscribe to products changes
    const productsSubscription = client
        .channel('products-changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'products' },
            (payload) => {
                console.log('[v0] Products updated via realtime:', payload);
                loadProducts();
            }
        )
        .subscribe();
    
    console.log('[v0] Realtime subscriptions setup complete');
}

// Initialize on page load
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', initProducts);
}

// Update cart badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
