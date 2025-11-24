# Inda Home - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Copy the environment template to create your local config:
```bash
cp .env.local.template .env.local
```

Edit `.env.local` and fill in required values:

**Required:**
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (default works for staging)
- `NEXT_PUBLIC_ENCRYPTION_SECRET` - Secret for client-side obfuscation (legacy, being phased out)

**Authentication (Enhanced - Works with existing backend):**
- Uses Authorization headers (compatible with your current backend)
- Tokens stored encrypted in localStorage (AES encryption)
- Optional: Backend can provide CSRF tokens via `/auth/csrf-token`
- Optional: Backend can implement `/auth/refresh` endpoint for auto-refresh
- See `BACKEND_REQUIREMENTS.md` for optional enhancements

**OAuth (Optional but Recommended):**
- Configure Google OAuth 2.0 credentials in Google Cloud Console
- Add authorized redirect URIs: `http://localhost:9007/auth/oauth/callback`, `https://yourdomain.com/auth/oauth/callback`
- Backend must implement `/auth/google` and `/auth/google/callback` endpoints

**Optional but Recommended:**
- `NEXT_PUBLIC_MAPBOX_TOKEN` - For map features ([Get token](https://account.mapbox.com/))
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For Street View and Aerial maps ([Get key](https://console.cloud.google.com/))

**Optional:**
- Analytics IDs (leave empty to disable tracking in dev)
- Social media links
- WhatsApp contact numbers

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:9007](http://localhost:9007) in your browser.

## Environment Variables Explained

### API Configuration
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ Yes | `https://inda-core-backend-services.onrender.com` | Backend API base URL |

### Security
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_ENCRYPTION_SECRET` | ✅ Yes | `inda_super_secret_key` | Client-side obfuscation key (not true encryption) |

⚠️ **Security Note:** The encryption secret is exposed in the client bundle. It provides obfuscation only, not real security. Do not store sensitive data relying on this encryption.

### Maps
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | ❌ No | - | Mapbox access token for interactive maps |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ❌ No | - | Google Maps API key for Street View |
| `NEXT_PUBLIC_MAP_DEFAULT_LAT` | ❌ No | `6.6018` | Default map latitude (Lagos) |
| `NEXT_PUBLIC_MAP_DEFAULT_LNG` | ❌ No | `3.3515` | Default map longitude (Lagos) |
| `NEXT_PUBLIC_MAP_DEFAULT_ZOOM` | ❌ No | `16` | Default map zoom level |

### Analytics
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_MICROSOFT_CLARITY_ID` | ❌ No | - | Microsoft Clarity tracking ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ❌ No | - | Google Analytics 4 measurement ID |

**Note:** If these are empty, tracking scripts won't load. Perfect for local development!

## Development

### Available Scripts

```bash
# Start dev server on port 9007 with Turbopack
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Run linter (must pass before committing)
npm run lint
```

### Code Style

- **Indentation:** 2 spaces
- **File naming:** PascalCase for components (`Button.tsx`), camelCase for utilities
- **TypeScript:** Required, add types in `src/types/` for shared structures
- **Styling:** Tailwind CSS utility-first, avoid ad-hoc CSS
- **Commits:** Use conventional commits (`feat:`, `fix:`, `chore:`)

### Project Structure

```
src/
├── config/         # Centralized configuration
│   └── env.ts      # Environment variables with validation
├── api/            # API client and endpoints
├── components/     # Shared components
│   ├── base/       # Basic UI primitives
│   └── inc/        # Integrated components
├── helpers/        # Utility functions
├── pages/          # Next.js pages (routes)
├── views/          # Page view compositions
├── types/          # TypeScript type definitions
├── data/           # Static data and configs
└── styles/         # Global styles
```

## Common Issues

### Maps Not Loading

**Problem:** Mapbox or Google Maps showing errors

**Solution:**
1. Check if you've added the API keys to `.env.local`
2. Verify the keys are valid and have the right permissions
3. For Mapbox: Ensure the domain is allowlisted in your Mapbox account
4. For Google Maps: Enable Maps JavaScript API and Street View API

### "Missing environment variable" Warning

**Problem:** Console warning about missing env vars

**Solution:**
1. Copy `.env.local.template` to `.env.local`
2. Fill in at least the required variables
3. Restart the dev server

### Port 9007 Already in Use

**Problem:** Dev server won't start due to port conflict

**Solution:**
```bash
# Find and kill process using port 9007
lsof -ti:9007 | xargs kill -9

# Or change port in package.json:
"dev": "next dev --turbopack -p 3000"
```

### Build Fails with ESLint Errors

**Problem:** `npm run build` fails with linting errors

**Solution:**
```bash
# Run linter to see errors
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Fix remaining issues manually
```

This is intentional - we enforce code quality in builds now.

## Authentication System

### Enhanced Authorization Header Auth

The application uses **encrypted localStorage** with Authorization headers (compatible with existing backend). While not as secure as httpOnly cookies, it includes significant security improvements.

**Key Features:**
- ✅ Automatic token refresh
- ✅ CSRF protection
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ Google OAuth ready (requires backend setup)

**Important:** Works with existing Authorization header backends. See `BACKEND_REQUIREMENTS.md` for optional enhancements.

### CORS Configuration

Your existing CORS should work fine. If you want to add CSRF protection:
- Allow headers: `Content-Type`, `X-CSRF-Token`, `Authorization`

## Testing Locally

### Manual Testing Checklist

Before committing major changes, test:

**Authentication Flows:**
- [ ] Sign up with email (including OTP verification)
- [ ] Sign in with email
- [ ] Google OAuth (if configured)
- [ ] Password reset flow
- [ ] Session persistence (refresh page)
- [ ] Automatic token refresh (wait 10+ minutes)
- [ ] Logout flow

**Protected Routes:**
- [ ] Orders page (redirects if not authenticated)
- [ ] Profile page (redirects if not authenticated)
- [ ] Deep Dive questionnaire
- [ ] Deeper Dive questionnaire

**General:**
- [ ] Property search
- [ ] Payment modal interactions
- [ ] Navigation between pages
- [ ] Mobile responsive design
- [ ] Error handling (try invalid inputs)
- [ ] Rate limiting (spam form submissions)

### Test Accounts

For local development, you can create test accounts through the sign-up flow. The backend should handle OTP in development mode.


