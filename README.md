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

### local supabase db

Some of these might be redundant / missing, but here are the main actions:
```bash
cd govaina/server
npx supabase login # important
npx supabase link # important
npx supabase start # important
npx supabase db pull
npx supabase db dump # important
```
[Documentation](https://supabase.com/docs/reference/cli/supabase-db-dump) is (almost) not bad.

### deploy

Push & Pull from DockerHub @ `yochayc/govaina` & `yochayc/govaina-server`

```bash
/* set environment variables in `.env.production`, `server/.env.production` */
/* set image tags in `docker-compose.prod.yml` */
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```
