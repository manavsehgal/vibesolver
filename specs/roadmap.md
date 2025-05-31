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

[✅] Increase the height of the architecture diagram canvas to match the width such that it is a square.

[✅] Fix panning when holding an empty part of canvas and dragging.

[✅] Add a "Redraw" button to redraw the diagram to ensure that all features of the diagram are visible with minimal overlap.

[✅] Fix Flashcards generation. Currently it only generates the same two flashcards with answers, spacebar not working to flip and instead it only shows Easy, Medium, Hard tags. When Generate Flashcards is clicked follow error message appears - Anthropic API error: 400 {"type":"error","error":{"type":"invalid_request_error","message":"tools.0.custom.input_schema.type: Input should be 'object'"}}

