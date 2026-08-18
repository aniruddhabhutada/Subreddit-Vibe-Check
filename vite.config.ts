import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handler as redditFunctionHandler } from './netlify/functions/reddit-hot.js';

function netlifyFunctionsDevPlugin(): Plugin {
  return {
    name: 'netlify-functions-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/.netlify/functions/reddit-hot') || req.url?.startsWith('/api/reddit-hot')) {
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          const queryStringParameters = Object.fromEntries(urlObj.searchParams.entries());

          const event = {
            httpMethod: req.method || 'GET',
            queryStringParameters
          };

          try {
            const result = await redditFunctionHandler(event, {});
            res.statusCode = result.statusCode || 200;
            if (result.headers) {
              Object.entries(result.headers).forEach(([k, v]) => {
                res.setHeader(k, v as string);
              });
            }
            res.end(result.body);
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal Dev Server Error' }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), netlifyFunctionsDevPlugin()],
  server: {
    port: 3000,
    open: false
  }
});
