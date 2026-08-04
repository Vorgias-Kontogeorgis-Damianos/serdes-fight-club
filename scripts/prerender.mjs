import { execFileSync } from 'node:child_process';
import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--ssr', 'src/entry-server.jsx', '--outDir', 'dist-ssr'], { stdio: 'inherit' });

const serverEntry = pathToFileURL(resolve('dist-ssr/entry-server.js')).href;
const { render } = await import(serverEntry);
const page = await readFile('dist/index.html', 'utf8');
const rendered = page.replace('<!--ssr-outlet-->', render());

if (rendered === page) throw new Error('SSR outlet was not found in dist/index.html.');
await writeFile('dist/index.html', rendered);
await rm('dist-ssr', { recursive: true, force: true });
