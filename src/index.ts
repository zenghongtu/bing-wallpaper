import { createApp } from './app';

const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || 'localhost';

const server = createApp({});

server
	.listen({ port, host })
	.then((value) => {
		console.log(`Server listening at ${value}, PID: ${process.pid}`);
	})
	.catch((err) => {
		server.log.error(err);
		process.exit(1);
	});
