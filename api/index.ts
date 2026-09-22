import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app';

const app = createApp();

export default async function handler(req: VercelRequest, res: VercelResponse) {
	await app.ready();
	if (req.url) {
		req.url = req.url.replace(/^\/api(\/|\?|$)/, '$1') || '/';
		if (!req.url.startsWith('/')) {
			req.url = '/' + req.url;
		}
	}
	app.server.emit('request', req, res);
}

