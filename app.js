// app.js

document.addEventListener("DOMContentLoaded", () => {
  // ========== SIGNUP ==========
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
      const fullName = document.getElementById("signup-fullname").value;

      // 1️⃣ Create user with Supabase Auth
      const { data: userData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      const messageDiv = document.getElementById("signup-message");
      if (signupError) {
        messageDiv.textContent = signupError.message;
        messageDiv.style.color = "red";
        return;
      }

      // 2️⃣ Insert profile with full_name (RLS ensures this is allowed)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: userData.user.id, full_name: fullName }]);

      if (profileError) {
        messageDiv.textContent = profileError.message;
        messageDiv.style.color = "red";
        return;
      }

      messageDiv.textContent = "Signup successful! Check your email to confirm.";
      messageDiv.style.color = "green";
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
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData || !sessionData.session) {
    window.location.href = "index.html"; // redirect if not logged in
    return;
  }

  const user = sessionData.session.user;

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
