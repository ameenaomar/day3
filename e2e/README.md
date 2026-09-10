# Auth end-to-end checks

Browser-driven checks for sign-up, sign-in, sign-out, email confirmation and
session refresh, across both front ends — the Next app under `/en` and `/ar`,
and the prototype served at `/`.

They run against `mock-supabase.mjs`, a stand-in for the Supabase Auth and
PostgREST endpoints the app calls, rather than against a real project. Two
reasons: a real run would create throwaway users in a live project on every
execution, and the failure paths that matter most here — an expired
confirmation link, a rotated refresh token, a rejected session — are painful to
provoke on purpose against a real auth server and trivial to provoke against a
mock.

What the mock is faithful about, because the code under test depends on it:

- `error_code` values (`invalid_credentials`, `email_not_confirmed`,
  `user_already_exists`, `weak_password`, …), which is how failures are turned
  into wording the customer reads.
- The refresh-token **reuse interval**. Supabase does not invalidate a refresh
  token the instant it is used; for a grace window it returns the same session
  again. `REFRESH_REUSE_MS=0` removes that grace, which is the setting that
  catches a proxy handing the route a token it has already spent.
- Whether email confirmation is on, which changes what sign-up returns.
- Refusing an unconfirmed sign-in, and returning a user with `identities: []`
  for an address that already has an account — the shape that stops the form
  becoming an account-enumeration oracle.

What it does not do: verify JWT signatures, or enforce row level security. RLS
is checked directly against the project in SQL — see the migration in
`supabase/migrations/`.

## Running them

Four terminals' worth of setup, in one place:

```sh
# 1. the stand-in auth server
node e2e/mock-supabase.mjs                      # add CONFIRM_EMAIL=1 for the
                                                # confirmation-flow checks

# 2. the app, built against it
cat > .env.local <<'ENV'
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_PUBLISHABLE_KEY=sb_publishable_mock
APP_URL=http://127.0.0.1:3100
ENV
npm run build && npx next start -p 3100

# 3. the checks, each against a mock started for it
node e2e/auth-flows.mjs                                    # default mock
CONFIRM_EMAIL=1 …                                          # then:
node e2e/auth-email-confirmation.mjs
TOKEN_TTL=100 REFRESH_REUSE_MS=0 …                         # then:
node e2e/auth-session-refresh.mjs
```

The front door at `/` needs no patching: it holds no Supabase URL of its own,
and asks `/api/me` who is signed in.

`CHROMIUM_PATH` sets the browser binary if Playwright's own download is not
where it expects. `BASE_URL` and `MOCK_URL` override the addresses.

Each script prints one line per check and exits non-zero if any failed.
