# Govaina
Analyze government decisions in a click

## How to build & deploy

### develop
```bash
git clone git@github.com:YochayCO/govaina.git
cd govaina/server
npm install
/* set environment variables in .env.local */ 
npm run dev

cd ../client
npm install
/* set environment variables in .env.local */ 
npm run dev
```

### deploy
```bash
/* set environment variables in server/.env.production */ 
docker-compose up -d
```
