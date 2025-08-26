// app.js

document.addEventListener("DOMContentLoaded", () => {
  // ========== SIGNUP ==========
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      // Sign up user
      const { data: signupData, error: signupError } = await supabase.auth.signUp({ email, password });

      const messageDiv = document.getElementById("signup-message");
      if (signupError) {
        messageDiv.textContent = signupError.message;
        messageDiv.style.color = "red";
      } else {
        messageDiv.textContent = "Signup successful! Check your email to confirm.";
        messageDiv.style.color = "green";

        // Automatically create profile for the user in 'profiles' table
        if (signupData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: signupData.user.id }]);  // only id is required, full_name optional

          if (profileError) console.error("Error creating profile:", profileError.message);
        }
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

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      const messageDiv = document.getElementById("login-message");
      if (loginError) {
        messageDiv.textContent = loginError.message;
        messageDiv.style.color = "red";
      } else {
        messageDiv.textContent = "Login successful! Redirecting...";
        messageDiv.style.color = "green";
        setTimeout(() => window.location.href = "dashboard.html", 1500);
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

    // Check session and fetch profile
    loadDashboard();
  }
});

// Check session and fetch profile
async function loadDashboard() {
  const { data: { session } } = await supabase.auth.getSession();
  const userEmail = document.getElementById("user-email");

  if (!session) {
    // not logged in → redirect
    window.location.href = "index.html";
  } else {
    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      userEmail.textContent = `Logged in as: ${session.user.email}`;
    } else {
      const name = profile.full_name || session.user.email;
      userEmail.textContent = `Welcome, ${name}`;
    }
  }
}
