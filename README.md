# GitHub Actions Demo App

Node.js Express app để test CI/CD pipeline.

## Cấu trúc project

```
.
├── .github/
│   └── workflows/
│       └── production.yml    # Pipeline đã fix toàn bộ bugs
├── src/
│   ├── app.js                # Express app (với /health endpoint)
│   └── server.js             # Entry point
├── tests/
│   └── app.test.js           # Jest tests
├── Dockerfile                # Multi-stage build
├── .dockerignore
├── .eslintrc.js
└── package.json
```

## Chạy local

```bash
npm install
npm run dev         # Development
npm test            # Tests + coverage
npm run lint        # Lint
```

## Test Docker local

```bash
docker build -t demo-app .
docker run -p 3000:3000 demo-app
curl http://localhost:3000/health
```

## Setup GitHub Actions

### 1. Tạo GitHub Secrets

```
Repo → Settings → Secrets and variables → Actions
```

Cần các secrets sau:

| Secret | Mô tả |
|--------|-------|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `HOSTNAME_STAGING` | IP/hostname staging server |
| `USERNAME_STAGING` | SSH user staging |
| `PRIVATE_KEY_STAGING` | SSH private key staging |
| `HOSTNAME_PRODUCTION` | IP/hostname production server |
| `USERNAME_PRODUCTION` | SSH user production |
| `PRIVATE_KEY_PRODUCTION` | SSH private key production |
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook URL |

### 2. Tạo GitHub Environments

```
Repo → Settings → Environments
```

- **staging**: không cần approval
- **production**: bật "Required reviewers" → thêm bản thân

### 3. Setup server (staging & production)

```bash
# Trên server, tạo env file
sudo mkdir -p /etc/app
sudo nano /etc/app/staging.env
# Thêm: NODE_ENV=staging, PORT=3000, ...

sudo nano /etc/app/production.env
# Thêm: NODE_ENV=production, PORT=3000, ...
```

### 4. Push code và xem pipeline chạy

```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO
git add .
git commit -m "feat: initial commit"
git push origin main
```

## Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| GET | `/health` | Health check (dùng cho smoke test) |
| GET | `/` | Welcome message |
| POST | `/add` | Cộng 2 số: `{"a": 1, "b": 2}` |
