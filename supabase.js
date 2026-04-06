// Supabase Configuration and Client Initialization
const SUPABASE_URL = 'https://gltkxgvxbbajlbecfkua.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdGt4Z3Z4YmJhamxiZWNma3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwNjUyMDAsImV4cCI6MjAzMjY0MTIwMH0.P7wZ5X8dKqL5mJ9pY2qR8xT3vU0aB1cN2dE4fG6hI7s';

// Supabase JS CDN Client
const { createClient } = window.supabase;
let supabaseClient;

async function initSupabase() {
    try {
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('[v0] Supabase initialized successfully');
        
        // Test connection
        const { data, error } = await supabaseClient.from('products').select('count', { count: 'exact' });
        if (error) {
            console.error('[v0] Supabase connection error:', error.message);
            updateConnectionStatus('disconnected');
            return false;
        }
        
        updateConnectionStatus('connected');
        console.log('[v0] Supabase connected');
        return true;
    } catch (error) {
        console.error('[v0] Supabase initialization error:', error);
        updateConnectionStatus('disconnected');
        return false;
    }
}

function getSupabaseClient() {
    if (!supabaseClient) {
        console.error('[v0] Supabase client not initialized');
        return null;
    }
    return supabaseClient;
}

function updateConnectionStatus(status) {
    const statusBar = document.querySelector('.connection-status-bar');
    const indicator = document.querySelector('.connection-indicator');
    
    if (!statusBar || !indicator) return;
    
    statusBar.classList.remove('connected', 'disconnected', 'connecting');
    
    if (status === 'connected') {
        statusBar.classList.add('connected');
        indicator.querySelector('span').textContent = 'Connected';
        indicator.querySelector('.dot').style.background = '#31a24c';
    } else if (status === 'disconnected') {
        statusBar.classList.add('disconnected');
        indicator.querySelector('span').textContent = 'Disconnected';
        indicator.querySelector('.dot').style.background = '#ff3333';
    } else {
        statusBar.classList.add('connecting');
        indicator.querySelector('span').textContent = 'Connecting...';
        indicator.querySelector('.dot').style.background = '#ff9500';
    }
}

// Load Supabase JS client from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
script.async = true;
script.onload = () => {
    console.log('[v0] Supabase JS CDN loaded');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSupabase);
    } else {
        initSupabase();
    }
};
document.head.appendChild(script);
