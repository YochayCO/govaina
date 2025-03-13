import './config/env.js'
import fs from 'node:fs/promises'
import express from 'express'
import { OpenAI } from 'openai'
import { ASSISTANT_INSTRUCTIONS } from './utils/ASSISTANT_INSTRUCTIONS.js'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-fgvdbOMEi46sit0opJ6AlWJi",
});

// Cached production assets
const templateHtml = isProduction
    ? await fs.readFile('./dist/client/index.html', 'utf-8')
    : ''

// Create http server
const app = express()


app.use(express.json());

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite
if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
        server: { middlewareMode: true },
        appType: 'custom',
        base,
    })
    app.use(vite.middlewares)
} else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv('./dist/client', { extensions: [] }))
}

// Serve HTML
app.get('/', async (req, res) => {
    try {
        console.log(req.originalUrl, req.method)
        const url = req.originalUrl.replace(base, '')

        /** @type {string} */
        let template
        /** @type {import('./src/entry-server.ts').render} */
        let render
        if (!isProduction) {
            // Always read fresh template in development
            template = await fs.readFile('./index.html', 'utf-8')
            template = await vite.transformIndexHtml(url, template)
            render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
        } else {
            template = templateHtml
            render = (await import('./dist/server/entry-server.js')).render
        }

        const rendered = await render(url)

        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')

        res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
        vite?.ssrFixStacktrace(e)
        console.log(e.stack)
        res.status(500).end(e.stack)
    }
})

app.post('/api/evaluations', async (req, res) => {
    const { decisionNumber, decisionText } = req.body;

    // TODO: check if evaluation exists in database (by decisionNumber)
    if (!decisionNumber || !decisionText) {
        res.status(400).send('Missing decision number or decision text');
        return
    }

    console.log(`Evaluating decision number ${decisionNumber} with text: ${decisionText}`);

    const [error, evaluationText] = await evaluateDecision(decisionText);

    if (error) {
        res.status(400).send(error.toString());
    } else {
        res.send(evaluationText);
    }
});

// Start http server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

async function catchError(promise) {
    return promise
        .then((data) => [undefined, data])
        .catch((error) => [error])
}

async function performCompletion(userMessageText) {
    const [error, completionObj] = await catchError(openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        temperature: 1,
        top_p: 1,
        messages: [
            { role: 'system', content: ASSISTANT_INSTRUCTIONS }, 
            { role: "user", content: userMessageText }
        ],
    }));
    
    if (error) {
        return [error];
    }

    const evaluation = completionObj.choices[0].message.content
    if (!evaluation) return [new Error('Empty evaluation')]
    
    return [undefined, evaluation]
}

async function evaluateDecision (decisionText) {
  const userMessageText = `${decisionText}`;
  const [error, message] = await performCompletion(userMessageText, ASSISTANT_INSTRUCTIONS);

  if (error) {
      return [error];
  }

  if (!message) return [new Error('Empty response')];

  return [undefined, message];
}
