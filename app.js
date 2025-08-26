// app.js

document.addEventListener("DOMContentLoaded", () => {
  // ========== SIGNUP ==========
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      const { error } = await supabase.auth.signUp({ email, password });

      const messageDiv = document.getElementById("signup-message");
      if (error) {
        messageDiv.textContent = error.message;
        messageDiv.style.color = "red";
      } else {
        messageDiv.textContent = "Signup successful! Check your email to confirm.";
        messageDiv.style.color = "green";
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

    // Check session on dashboard
    checkSession();
  }
});

// Check if user is logged in
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  const userEmail = document.getElementById("user-email");

  if (!session) {
    // not logged in → redirect
    window.location.href = "index.html";
  } else {
    userEmail.textContent = `Logged in as: ${session.user.email}`;
  }
}
