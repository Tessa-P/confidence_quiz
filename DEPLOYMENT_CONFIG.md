# Deployment Configuration Guide

This project is configured to support multiple deployment scenarios with minimal changes.

## Current Setup

All files are configured with empty/default values that work for local development and initial cloud deployment (Vercel + Render).

## Environment Variables

### Frontend

**Local Development** (`frontend/.env`):
```bash
VITE_API_URL=http://localhost:8000
VITE_BASE_PATH=
```

**Vercel Deployment** (set in Vercel dashboard):
```bash
VITE_API_URL=https://your-backend.onrender.com
VITE_BASE_PATH=
```

**Future Production** (`frontend/.env.production`):
```bash
VITE_API_URL=https://tessapugh.com/confidence_quiz/api
VITE_BASE_PATH=/confidence_quiz
```

### Backend

**Local Development** (`.env`):
```bash
ROOT_PATH=
```

**Render Deployment** (set in Render dashboard):
```bash
ROOT_PATH=
```

**Future Production** (set on shell server):
```bash
ROOT_PATH=/confidence_quiz/api
```

## Files Modified for Deployment Flexibility

1. ✅ `frontend/src/lib/api.ts` - API URL helper with environment variable support
2. ✅ `frontend/vite.config.ts` - Dynamic base path configuration
3. ✅ `frontend/.env` - Local development settings
4. ✅ `frontend/.env.production` - Production settings (pre-configured for future use)
5. ✅ `backend/app/core/config.py` - Added ROOT_PATH setting
6. ✅ `backend/app/main.py` - Added root_path to FastAPI app
7. ✅ `.env` - Added ROOT_PATH variable

## Deployment Steps

### Neon Database
1. Create project at neon.tech
2. Copy connection details to `.env`:
   - POSTGRES_SERVER
   - POSTGRES_DB
   - POSTGRES_USER
   - POSTGRES_PASSWORD

### Render (Backend)
1. Create new Web Service
2. Connect GitHub repository
3. Set root directory: `backend`
4. Build command: `pip install -e .` or `uv sync`
5. Start command: `fastapi run app/main.py --host 0.0.0.0 --port $PORT`
6. Environment variables:
   - All POSTGRES_* variables from Neon
   - BACKEND_CORS_ORIGINS (include Vercel URL)
   - FRONTEND_HOST (your Vercel URL)
   - ENVIRONMENT=production
   - ROOT_PATH= (empty)
7. Run migrations via Shell: `alembic upgrade head`

### Vercel (Frontend)
1. Import repository
2. Framework: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables:
   - VITE_API_URL=https://your-backend.onrender.com
   - VITE_BASE_PATH= (empty)

### Future Shell Deployment
When moving to tessapugh.com/confidence_quiz:

**Frontend:**
- Build with: `npm run build` (uses .env.production automatically)
- Deploy `dist/` folder to web server
- Nginx config:
  ```nginx
  location /confidence_quiz {
      alias /path/to/frontend/dist;
      try_files $uri $uri/ /confidence_quiz/index.html;
  }
  ```

**Backend:**
- Update environment: `ROOT_PATH=/confidence_quiz/api`
- Nginx config:
  ```nginx
  location /confidence_quiz/api {
      proxy_pass http://localhost:8000;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
  }
  ```

## API Usage in Frontend

Always use the `getApiUrl()` helper from `@/lib/api`:

```typescript
import { getApiUrl } from '@/lib/api'

// Correct
const response = await fetch(getApiUrl('api/v1/quiz/questions'))

// Don't hardcode URLs
const response = await fetch('http://localhost:8000/api/v1/quiz/questions')  // ❌
```

## Testing Configuration

**Test local development works:**
```bash
# Terminal 1 - Backend
cd backend
uv run fastapi dev app/main.py

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Test production build locally:**
```bash
cd frontend
npm run build
npm run preview
```

## Notes

- Empty `VITE_BASE_PATH` and `ROOT_PATH` mean no subpath (root deployment)
- Current config supports all three deployment scenarios
- No code changes needed when moving between environments
- Only environment variables need updating
