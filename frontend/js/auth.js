const API = "../backend/";
let isLogin = true;

// Toggle Login ↔ Signup
function toggleMode() {
  isLogin = !isLogin;

  document.getElementById("title").innerText = isLogin
    ? "🔐 Login"
    : "📝 Signup";

  document.getElementById("mainBtn").innerText = isLogin
    ? "Login"
    : "Signup";

  document.getElementById("toggleText").innerHTML = isLogin
    ? `Don't have account? <a href="#" onclick="toggleMode()">Signup</a>`
    : `Already have account? <a href="#" onclick="toggleMode()">Login</a>`;
}

// Handle Login + Signup
async function handleAuth() {
  let username = document.getElementById("user").value;
  let password = document.getElementById("pass").value;

  if (!username || !password) {
    alert("All fields required");
    return;
  }

  let url = isLogin ? "login.php" : "signup.php";

  let res = await fetch(API + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  let data = await res.json();

  // LOGIN
  if (isLogin) {
    if (data.success) {
      localStorage.setItem("auth", "true");
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials");
    }
  }

  // SIGNUP
  else {
    if (data.success) {
      alert("Signup successful ✅ Now login");
      toggleMode(); // switch back to login
    } else {
      alert("Signup failed ❌");
    }
  }
}