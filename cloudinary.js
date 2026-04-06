// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'ddso5jxzt';
const CLOUDINARY_UPLOAD_PRESET = 'product_images';

// Upload image to Cloudinary
async function uploadImage(file) {
    try {
        updateConnectionStatus('connecting');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('[v0] Image uploaded to Cloudinary:', data.secure_url);
        updateConnectionStatus('connected');
        return data.secure_url;
    } catch (error) {
        console.error('[v0] Image upload error:', error);
        showNotification('Upload failed: ' + error.message, 'error');
        updateConnectionStatus('disconnected');
        return null;
    }
}

// Upload multiple images
async function uploadMultipleImages(files) {
    try {
        const urls = [];
        for (const file of files) {
            const url = await uploadImage(file);
            if (url) {
                urls.push(url);
            }
        }
        return urls;
    } catch (error) {
        console.error('[v0] Multiple upload error:', error);
        return [];
    }
}

// Upload story image
async function uploadStoryImage(file) {
    return uploadImage(file);
}

// Upload video to Cloudinary
async function uploadVideo(file) {
    try {
        updateConnectionStatus('connecting');
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
        formData.append('resource_type', 'video');

        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Video upload failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('[v0] Video uploaded to Cloudinary:', data.secure_url);
        updateConnectionStatus('connected');
        return data.secure_url;
    } catch (error) {
        console.error('[v0] Video upload error:', error);
        showNotification('Video upload failed: ' + error.message, 'error');
        updateConnectionStatus('disconnected');
        return null;
    }
}

// Upload multiple videos
async function uploadMultipleVideos(files) {
    try {
        const urls = [];
        for (const file of files) {
            const url = await uploadVideo(file);
            if (url) {
                urls.push(url);
            }
        }
        return urls;
    } catch (error) {
        console.error('[v0] Multiple video upload error:', error);
        return [];
    }
}
