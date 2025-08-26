// app.js

document.addEventListener("DOMContentLoaded", () => {
  // ========== SIGNUP ==========
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      const { data: user, error } = await supabase.auth.signUp({ email, password });

      const messageDiv = document.getElementById("signup-message");
      if (error) {
        messageDiv.textContent = error.message;
        messageDiv.style.color = "red";
      } else {
        messageDiv.textContent = "Signup successful! Check your email to confirm.";
        messageDiv.style.color = "green";

        // Optionally insert profile row (if trigger not used)
        await supabase.from('profiles').insert([{ id: user.user.id }]);
      }
    });
  }

  // ========== LOGIN ==========
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      const messageDiv = document.getElementById("login-message");
      if (error) {
        messageDiv.textContent = error.message;
        messageDiv.style.color = "red";
      } else {
        messageDiv.textContent = "Login successful! Redirecting...";
        messageDiv.style.color = "green";
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      }
    });
  }

  // ========== DASHBOARD ==========
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "index.html";
    });

    // Load profile if on dashboard
    loadProfile();
  }
});

// Load the current user's profile (RLS ensures user sees only their row)
async function loadProfile() {
  const { data: session } = await supabase.auth.getSession();

  if (!session || !session.user) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }

  const user = session.user;

  // Fetch profile safely under RLS
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .single(); // RLS automatically filters by auth.uid()

  if (error) {
    console.error("Error fetching profile:", error.message);
    return;
  }

  document.getElementById('user-email').textContent = `Email: ${user.email}`;
  if (profile && profile.full_name) {
    document.getElementById('user-fullname').textContent = `Name: ${profile.full_name}`;
  }
}
