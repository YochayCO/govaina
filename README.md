# Govaina
Analyze government decisions in a click

## How to build & deploy

### build
```
git clone git@github.com:YochayCO/govaina.git
cd govaina/client
npm install
/* set environment variables */ 
npm build
```

### dev
`npm run dev`

### deploy
`pm2 --env production --name govaina start server.js`
