import { APP_BASE_HREF } from '@angular/common';  // Importación del token APP_BASE_HREF para establecer la base de las rutas
import { CommonEngine } from '@angular/ssr';  // Importación del motor común de Angular para renderizado del lado del servidor
import express, { Request, Response, NextFunction } from 'express'; // Importación con tipos
import { fileURLToPath } from 'node:url'; // Importación de funciones para manejar URLs de archivos
import { dirname, join, resolve } from 'node:path'; // Importación de funciones de manejo de rutas
import bootstrap from './src/main.server';  // Importación del archivo de arranque del servidor

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  //const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const serverDistFolder = __dirname;
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const commonEngine = new CommonEngine();

  // Use the Angular engine for rendering
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {     // Serve static files
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req: Request, res: Response, next: NextFunction) => { // Tipos añadidos
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({   // Render the Angular application
        //bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;    // Return the server instance
}

function run(): void {
  const port = process.env['PORT'] || 4000; // Default port

  // Start up the Node server
  const server = app();                     // Call the app function to get the server instance
  server.listen(port, () => {               // Start listening on the specified port
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();      // Execute the run function to start the server
