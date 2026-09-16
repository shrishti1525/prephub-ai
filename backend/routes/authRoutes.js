const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "prephub_super_secret_key_2026",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { _id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "prephub_super_secret_key_2026",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

const { OAuth2Client } = require("google-auth-library");

function getOAuthClient(customRedirectUri) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = customRedirectUri || process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback";

  if (!clientId || !clientSecret) {
    return null;
  }

  return new OAuth2Client(clientId, clientSecret, callbackUrl);
}

// Helper to handle both popup window messaging and standard redirect
function sendAuthResponse(res, frontendUrl, isSuccess, data) {
  if (isSuccess) {
    const { token, safeUser } = data;
    return res.send(`<!DOCTYPE html>
<html>
<head><title>PrepHub AI - Google Authentication</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <div style="width:36px;height:36px;border:3px solid #334155;border-top-color:#38bdf8;border-radius:50%;margin:0 auto 16px;animation:spin 0.8s linear infinite;"></div>
    <h3 style="margin:0 0 6px;font-size:16px;">Authentication Successful</h3>
    <p style="margin:0;font-size:13px;color:#94a3b8;">Completing sign in...</p>
  </div>
  <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: "GOOGLE_AUTH_SUCCESS",
          token: ${JSON.stringify(token)},
          user: ${JSON.stringify(safeUser)}
        }, "*");
        window.close();
      } else {
        window.location.href = "${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(safeUser))}";
      }
    } catch (e) {
      window.location.href = "${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(safeUser))}";
    }
  </script>
</body>
</html>`);
  } else {
    const errorMsg = data.error || "Google authentication failed";
    return res.send(`<!DOCTYPE html>
<html>
<head><title>PrepHub AI - Authentication Failed</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#0f172a;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;max-width:360px;padding:20px;">
    <div style="color:#ef4444;font-size:32px;margin-bottom:12px;">⚠️</div>
    <h3 style="margin:0 0 8px;font-size:16px;">Authentication Failed</h3>
    <p style="margin:0 0 16px;font-size:13px;color:#94a3b8;">${errorMsg}</p>
  </div>
  <script>
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          type: "GOOGLE_AUTH_FAILURE",
          error: ${JSON.stringify(errorMsg)}
        }, "*");
        window.close();
      } else {
        window.location.href = "${frontendUrl}/login?error=${encodeURIComponent(errorMsg)}";
      }
    } catch (e) {
      window.location.href = "${frontendUrl}/login?error=${encodeURIComponent(errorMsg)}";
    }
  </script>
</body>
</html>`);
  }
}

// GET /api/auth/google - Initiates Google OAuth2 Authorization Code flow
router.get("/google", (req, res) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
  const client = getOAuthClient();

  if (!client) {
    const errMsg = "Google OAuth is not configured on the server. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env";
    return req.query.popup === "1"
      ? sendAuthResponse(res, frontendUrl, false, { error: errMsg })
      : res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(errMsg)}`);
  }

  try {
    const state = req.query.popup === "1" ? "popup" : "";
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ],
      prompt: "select_account",
      ...(state ? { state } : {})
    });
    res.redirect(authUrl);
  } catch (err) {
    const errMsg = "Failed to initialize Google authentication: " + err.message;
    return req.query.popup === "1"
      ? sendAuthResponse(res, frontendUrl, false, { error: errMsg })
      : res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(errMsg)}`);
  }
});

// GET /api/auth/google/callback - Receives the authorization code from Google
router.get("/google/callback", async (req, res) => {
  const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
  const { code, error, state } = req.query;

  if (error) {
    return sendAuthResponse(res, frontendUrl, false, {
      error: "Google authentication was cancelled or failed: " + error
    });
  }

  if (!code) {
    return sendAuthResponse(res, frontendUrl, false, {
      error: "Missing authorization code from Google redirect"
    });
  }

  const client = getOAuthClient();
  if (!client) {
    return sendAuthResponse(res, frontendUrl, false, {
      error: "Google OAuth is not configured on the server. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env"
    });
  }

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    let googleProfile = null;

    if (tokens.id_token) {
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      googleProfile = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
    } else {
      const userinfoRes = await client.request({
        url: "https://www.googleapis.com/oauth2/v3/userinfo"
      });
      googleProfile = {
        sub: userinfoRes.data.sub,
        email: userinfoRes.data.email,
        name: userinfoRes.data.name,
        picture: userinfoRes.data.picture
      };
    }

    if (!googleProfile || !googleProfile.email) {
      return sendAuthResponse(res, frontendUrl, false, {
        error: "Failed to retrieve verified email from Google profile"
      });
    }

    const normalizedEmail = googleProfile.email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      let updated = false;
      if (!user.googleId && googleProfile.sub) {
        user.googleId = googleProfile.sub;
        updated = true;
      }
      if (!user.avatar && googleProfile.picture) {
        user.avatar = googleProfile.picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      const displayName = googleProfile.name && googleProfile.name.trim()
        ? googleProfile.name.trim()
        : normalizedEmail.split("@")[0];

      user = await User.create({
        name: displayName,
        email: normalizedEmail,
        googleId: googleProfile.sub,
        avatar: googleProfile.picture || "",
        authProvider: "google"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "prephub_super_secret_key_2026",
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider
    };

    return sendAuthResponse(res, frontendUrl, true, { token, safeUser });
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return sendAuthResponse(res, frontendUrl, false, {
      error: "Google authentication failed: " + (err.message || "Unknown error")
    });
  }
});

// POST /api/auth/google - API exchange for authorization code or ID token credential
router.post("/google", async (req, res) => {
  try {
    const { code, credential, redirectUri } = req.body;

    if (!code && !credential) {
      return res.status(400).json({
        message: "Either authorization code or Google credential (id_token) is required"
      });
    }

    const client = getOAuthClient(redirectUri || "postmessage");
    if (!client) {
      return res.status(503).json({
        message: "Google OAuth is not configured on the server. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env"
      });
    }

    let googleProfile = null;

    if (code) {
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);

      if (tokens.id_token) {
        const ticket = await client.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        googleProfile = {
          sub: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        };
      } else {
        const userinfoRes = await client.request({
          url: "https://www.googleapis.com/oauth2/v3/userinfo"
        });
        googleProfile = {
          sub: userinfoRes.data.sub,
          email: userinfoRes.data.email,
          name: userinfoRes.data.name,
          picture: userinfoRes.data.picture
        };
      }
    } else if (credential) {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      googleProfile = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };
    }

    if (!googleProfile || !googleProfile.email) {
      return res.status(400).json({ message: "Could not retrieve user details from Google token" });
    }

    const normalizedEmail = googleProfile.email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      let updated = false;
      if (!user.googleId && googleProfile.sub) {
        user.googleId = googleProfile.sub;
        updated = true;
      }
      if (!user.avatar && googleProfile.picture) {
        user.avatar = googleProfile.picture;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      const displayName = googleProfile.name && googleProfile.name.trim()
        ? googleProfile.name.trim()
        : normalizedEmail.split("@")[0];

      user = await User.create({
        name: displayName,
        email: normalizedEmail,
        googleId: googleProfile.sub,
        avatar: googleProfile.picture || "",
        authProvider: "google"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "prephub_super_secret_key_2026",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google authentication successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
});

// GET /api/auth/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
  }
});

module.exports = router;
