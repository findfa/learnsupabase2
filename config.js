// config.js

// Make sure supabase-js is loaded first in HTML (via CDN)
const supabaseUrl = "https://gmfgchuizwemqcafdtcd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZmdjaHVpendlbXFjYWZkdGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxOTg5MDIsImV4cCI6MjA3MTc3NDkwMn0.uchcIzuwXntPCxLPlOQQ7YgEyTd5xI7lAHt33F365C4";

// Initialize the Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Expose globally so app.js can use it
window.supabaseClient = supabase;


