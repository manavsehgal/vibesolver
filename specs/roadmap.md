# Product Feature Roadmap

[✅] Create a Production-Like Server based on following instructions. Update the specs/stack.md accordingly.

```bash
pnpm add -D express compression helmet
```

Create `server.js`:
```javascript
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import path from 'path'

const app = express()
const port = 3000

app.use(helmet())
app.use(compression())
app.use(express.static('dist'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist/index.html'))
})

app.listen(port, () => {
  console.log(`Production build running on http://localhost:${port}`)
})
```

Then add to `package.json`:
```json
{
  "scripts": {
    "serve:prod": "node server.js"
  }
}
```

Run with:
```bash
pnpm build
pnpm serve:prod
```

[✅] Solve the CORS issue to make the Anthropic API calls work. Use Vercel AI SDK (https://ai-sdk.dev/docs/introduction) with the tech stack defined in specs/stack.md. Do not create any new dependencies on Vercel Cloud (like functions) or Next.js.

