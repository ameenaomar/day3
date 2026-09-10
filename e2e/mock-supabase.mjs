/**
 * A stand-in for the Supabase Auth + PostgREST endpoints this app calls.
 *
 * The environment this was verified in cannot reach *.supabase.co, so the real
 * project is exercised over SQL (the trigger and the RLS policies) and the
 * HTTP paths are exercised here: signup, password grant, refresh grant, the
 * user endpoint, logout, and the one Customer read the account page makes.
 */
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.PORT ?? 54321);
/** Set to "1" to make signup require email confirmation (Supabase's default). */
const CONFIRM = process.env.CONFIRM_EMAIL === "1";
/** Seconds an access token lasts. Lower it to exercise the refresh path. */
const TTL = Number(process.env.TOKEN_TTL ?? 3600);

const users = new Map(); // email -> { id, email, password, name, locale, confirmed }
const sessions = new Map(); // access_token -> user id
/**
 * refresh_token -> { userId, issued, at }
 *
 * Supabase does not invalidate a refresh token the instant it is used: for a
 * grace window (10s by default) the same token can be presented again and
 * returns the same new session. That matters here because several server
 * clients — the proxy, the render, an action — can each reach for a refresh
 * within the same request.
 */
const refresh = new Map();
const REUSE_MS = Number(process.env.REFRESH_REUSE_MS ?? 10_000);

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");

function jwt(user) {
  const exp = Math.floor(Date.now() / 1000) + TTL;
  return [
    b64({ alg: "HS256", typ: "JWT" }),
    b64({ sub: user.id, email: user.email, role: "authenticated", exp, iat: Math.floor(Date.now() / 1000) }),
    "mock-signature",
  ].join(".");
}

function userJson(u) {
  return {
    id: u.id,
    aud: "authenticated",
    role: "authenticated",
    email: u.email,
    email_confirmed_at: u.confirmed ? new Date().toISOString() : null,
    created_at: u.createdAt,
    updated_at: u.createdAt,
    app_metadata: { provider: "email" },
    user_metadata: { name: u.name, locale: u.locale },
    identities: [{ id: u.id, user_id: u.id, provider: "email" }],
  };
}

function sessionJson(u) {
  const access = jwt(u);
  const rt = randomUUID();
  sessions.set(access, u.id);
  refresh.set(rt, { userId: u.id, issued: null, at: 0 });
  return {
    access_token: access,
    token_type: "bearer",
    expires_in: TTL,
    expires_at: Math.floor(Date.now() / 1000) + TTL,
    refresh_token: rt,
    user: userJson(u),
  };
}

const byId = (id) => [...users.values()].find((u) => u.id === id);

function bearer(req) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const id = sessions.get(token);
  return id ? byId(id) : null;
}

function send(res, status, body, headers = {}) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "*",
    "access-control-allow-methods": "*",
    ...headers,
  });
  res.end(payload);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let raw = "";
  req.on("data", (chunk) => (raw += chunk));
  req.on("end", () => {
    const body = raw ? JSON.parse(raw) : {};
    const path = url.pathname;

    if (process.env.LOG_REQUESTS === "1") {
      console.log(`${req.method} ${req.url}`);
    }
    if (req.method === "OPTIONS") return send(res, 204, {});

    if (path === "/auth/v1/signup" && req.method === "POST") {
      const email = String(body.email ?? "").toLowerCase();
      const password = String(body.password ?? "");
      if (!email.includes("@")) {
        return send(res, 400, { code: 400, error_code: "validation_failed", msg: "bad email" });
      }
      if (password.length < 6) {
        return send(res, 422, { code: 422, error_code: "weak_password", msg: "too short" });
      }
      if (users.has(email)) {
        // Supabase hides this when confirmations are on; it reports it when off.
        if (!CONFIRM) {
          return send(res, 422, { code: 422, error_code: "user_already_exists", msg: "exists" });
        }
        return send(res, 200, { ...userJson(users.get(email)), identities: [] });
      }
      const user = {
        id: randomUUID(),
        email,
        password,
        name: body.data?.name ?? "",
        locale: body.data?.locale ?? "en",
        confirmed: !CONFIRM,
        createdAt: new Date().toISOString(),
      };
      users.set(email, user);
      if (CONFIRM) return send(res, 200, userJson(user));
      return send(res, 200, sessionJson(user));
    }

    if (path === "/auth/v1/token" && req.method === "POST") {
      const grant = url.searchParams.get("grant_type");
      if (grant === "password") {
        const user = users.get(String(body.email ?? "").toLowerCase());
        if (!user || user.password !== body.password) {
          return send(res, 400, { code: 400, error_code: "invalid_credentials", msg: "Invalid login credentials" });
        }
        if (!user.confirmed) {
          return send(res, 400, { code: 400, error_code: "email_not_confirmed", msg: "Email not confirmed" });
        }
        return send(res, 200, sessionJson(user));
      }
      if (grant === "refresh_token") {
        const token = String(body.refresh_token ?? "");
        const record = refresh.get(token);
        const invalid = { code: 400, error_code: "invalid_grant", msg: "Invalid Refresh Token" };
        if (!record) return send(res, 400, invalid);
        if (record.issued) {
          // Inside the reuse window, hand back the same session again.
          if (Date.now() - record.at <= REUSE_MS) return send(res, 200, record.issued);
          return send(res, 400, invalid);
        }
        const session = sessionJson(byId(record.userId));
        record.issued = session;
        record.at = Date.now();
        return send(res, 200, session);
      }
      return send(res, 400, { code: 400, error_code: "validation_failed", msg: "bad grant" });
    }

    if (path === "/auth/v1/user") {
      const user = bearer(req);
      if (!user) return send(res, 401, { code: 401, error_code: "bad_jwt", msg: "invalid token" });
      if (req.method === "PUT") return send(res, 200, userJson(user));
      return send(res, 200, userJson(user));
    }

    if (path === "/auth/v1/logout" && req.method === "POST") {
      const header = req.headers.authorization ?? "";
      sessions.delete(header.startsWith("Bearer ") ? header.slice(7) : "");
      return send(res, 204, {});
    }

    // The account page's own-row read.
    if (path === "/rest/v1/Customer" && req.method === "GET") {
      const user = bearer(req);
      const wants = url.searchParams.get("authUserId") ?? "";
      const id = wants.replace(/^eq\./, "");
      const rows =
        user && user.id === id
          ? [{ name: user.name, email: user.email, createdAt: user.createdAt }]
          : [];
      const single = (req.headers.accept ?? "").includes("vnd.pgrst.object");
      if (single) {
        if (rows.length === 0) return send(res, 406, { code: "PGRST116", message: "no rows" });
        return send(res, 200, rows[0]);
      }
      return send(res, 200, rows);
    }

    // Test-only: stands in for the customer clicking the confirmation link.
    if (path === "/test/confirm" && req.method === "POST") {
      const user = users.get(String(body.email ?? "").toLowerCase());
      if (!user) return send(res, 404, { message: "no such user" });
      user.confirmed = true;
      return send(res, 200, sessionJson(user));
    }

    send(res, 404, { message: `mock: no route for ${req.method} ${path}` });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`mock supabase on http://127.0.0.1:${PORT} (confirm_email=${CONFIRM ? "on" : "off"})`);
});
