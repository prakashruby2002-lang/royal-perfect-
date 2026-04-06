// API Helper Functions

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff3333 0%, #ff6666 100%)';
    }
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Get all products
async function getProducts(page = 1, limit = 12, category = null) {
    try {
        const client = getSupabaseClient();
        if (!client) return [];
        
        let query = client.from('products').select('*');
        
        if (category) {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query
            .order('createdat', { ascending: false })
            .range((page - 1) * limit, page * limit - 1);
        
        if (error) {
            console.error('[v0] Error fetching products:', error.message);
            showNotification('Unable to load products', 'error');
            return [];
        }
        
        console.log('[v0] Products fetched:', data.length);
        return data || [];
    } catch (error) {
        console.error('[v0] Products fetch error:', error);
        return [];
    }
}

// Get product by ID
async function getProductById(id) {
    try {
        const client = getSupabaseClient();
        if (!client) return null;
        
        const { data, error } = await client
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            console.error('[v0] Error fetching product:', error.message);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('[v0] Product fetch error:', error);
        return null;
    }
}

// Create product
async function createProduct(product) {
    try {
        const client = getSupabaseClient();
        if (!client) return null;
        
        const { data, error } = await client
            .from('products')
            .insert([{
                name: product.name,
                price: product.price,
                offer_price: product.offer_price || product.price,
                actual_price: product.price,
                category: product.category,
                description: product.description,
                images: product.images || [],
                videos: product.videos || [],
                createdat: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) {
            console.error('[v0] Error creating product:', error.message);
            showNotification('Error creating product', 'error');
            return null;
        }
        
        console.log('[v0] Product created:', data.id);
        showNotification('Product created successfully');
        return data;
    } catch (error) {
        console.error('[v0] Product creation error:', error);
        return null;
    }
}

// Update product
async function updateProduct(id, product) {
    try {
        const client = getSupabaseClient();
        if (!client) return null;
        
        const { data, error } = await client
            .from('products')
            .update({
                name: product.name,
                price: product.price,
                offer_price: product.offer_price || product.price,
                actual_price: product.price,
                category: product.category,
                description: product.description,
                images: product.images || [],
                videos: product.videos || []
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) {
            console.error('[v0] Error updating product:', error.message);
            showNotification('Error updating product', 'error');
            return null;
        }
        
        console.log('[v0] Product updated:', data.id);
        showNotification('Product updated successfully');
        return data;
    } catch (error) {
        console.error('[v0] Product update error:', error);
        return null;
    }
}

// Delete product
async function deleteProduct(id) {
    try {
        const client = getSupabaseClient();
        if (!client) return false;
        
        const { error } = await client
            .from('products')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('[v0] Error deleting product:', error.message);
            showNotification('Error deleting product', 'error');
            return false;
        }
        
        console.log('[v0] Product deleted:', id);
        showNotification('Product deleted successfully');
        return true;
    } catch (error) {
        console.error('[v0] Product delete error:', error);
        return false;
    }
}

// Get all categories
async function getCategories() {
    try {
        const client = getSupabaseClient();
        if (!client) return [];
        
        const { data, error } = await client
            .from('categories')
            .select('*')
            .order('id', { ascending: true });
        
        if (error) {
            console.error('[v0] Error fetching categories:', error.message);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('[v0] Categories fetch error:', error);
        return [];
    }
}

// Create category
async function createCategory(category) {
    try {
        const client = getSupabaseClient();
        if (!client) return null;
        
        const { data, error } = await client
            .from('categories')
            .insert([{
                name: category.name,
                description: category.description,
                image: category.image || ''
            }])
            .select()
            .single();
        
        if (error) {
            console.error('[v0] Error creating category:', error.message);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('[v0] Category creation error:', error);
        return null;
    }
}

// Delete category
async function deleteCategory(id) {
    try {
        const client = getSupabaseClient();
        if (!client) return false;
        
        const { error } = await client
            .from('categories')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('[v0] Error deleting category:', error.message);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('[v0] Category delete error:', error);
        return false;
    }
}

// Get all story sections
async function getStory() {
    try {
        const client = getSupabaseClient();
        if (!client) return [];
        
        const { data, error } = await client
            .from('story')
            .select('*')
            .order('section_order', { ascending: true });
        
        if (error) {
            console.error('[v0] Error fetching story:', error.message);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('[v0] Story fetch error:', error);
        return [];
    }
}

// Create story section
async function createStory(story) {
    try {
        const client = getSupabaseClient();
        if (!client) return null;
        
        const { data, error } = await client
            .from('story')
            .insert([{
                title: story.title,
                description: story.description,
                image: story.image || '',
                section_order: story.section_order || 1,
                createdat: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) {
            console.error('[v0] Error creating story:', error.message);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('[v0] Story creation error:', error);
        return null;
    }
}

// Update story section
async function updateStory(id, story) {
    try {
        const client = getSupabaseClient();
        if (!client) return null;
        
        const { data, error } = await client
            .from('story')
            .update({
                title: story.title,
                description: story.description,
                image: story.image,
                section_order: story.section_order
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) {
            console.error('[v0] Error updating story:', error.message);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('[v0] Story update error:', error);
        return null;
    }
}

// Delete story section
async function deleteStory(id) {
    try {
        const client = getSupabaseClient();
        if (!client) return false;
        
        const { error } = await client
            .from('story')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('[v0] Error deleting story:', error.message);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('[v0] Story delete error:', error);
        return false;
    }
}

// Get all orders
async function getOrders() {
    try {
        const client = getSupabaseClient();
        if (!client) return [];
        
        const { data, error } = await client
            .from('orders')
            .select('*')
            .order('createdat', { ascending: false });
        
        if (error) {
            console.error('[v0] Error fetching orders:', error.message);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('[v0] Orders fetch error:', error);
        return [];
    }
}

// Get all reviews
async function getReviews() {
    try {
        const client = getSupabaseClient();
        if (!client) return [];
        
        const { data, error } = await client
            .from('reviews')
            .select('*')
            .order('createdat', { ascending: false });
        
        if (error) {
            console.error('[v0] Error fetching reviews:', error.message);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('[v0] Reviews fetch error:', error);
        return [];
    }
}

// Get settings
async function getSettings() {
    try {
        const client = getSupabaseClient();
        if (!client) return {};
        
        const { data, error } = await client
            .from('settings')
            .select('*')
            .single();
        
        if (error) {
            console.error('[v0] Error fetching settings:', error.message);
            return {};
        }
        
        return data || {};
    } catch (error) {
        console.error('[v0] Settings fetch error:', error);
        return {};
    }
}

// Update settings
async function updateSettings(key, value) {
    try {
        const client = getSupabaseClient();
        if (!client) return false;
        
        const { error } = await client
            .from('settings')
            .upsert({ key, value })
            .eq('key', key);
        
        if (error) {
            console.error('[v0] Error updating settings:', error.message);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('[v0] Settings update error:', error);
        return false;
    }
}
