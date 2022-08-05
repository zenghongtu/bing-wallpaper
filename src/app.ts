import Fastify, { FastifyInstance, FastifyReply, FastifyRequest, FastifyServerOptions } from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import Ajv, { JSONSchemaType } from 'ajv';
import path from 'path';
import { promises as fs } from 'fs';

const resolutions = ['4k', '2k', '1080p', '720p', '480p'] as const;

const resolutionSizeMap = {
	'4k': {
		w: 3840,
		h: 2160,
	},
	'2k': {
		w: 2560,
		h: 1440,
	},
	'1080p': {
		w: 1920,
		h: 1080,
	},
	'720p': {
		w: 1280,
		h: 720,
	},
	'480p': {
		w: 640,
		h: 480,
	},
} as const;

// const resolutions = [
// 	'UHD',
// 	'1920x1200',
// 	'1920x1080',
// 	'1366x768',
// 	'1280x768',
// 	'1024x768',
// 	'800x600',
// 	'800x480',
// 	'768x1280',
// 	'720x1280',
// 	'640x480',
// 	'480x800',
// 	'400x240',
// 	'320x240',
// 	'240x320',
// ] as const;

type QuerystringType = {
	resolution?: typeof resolutions[number];
	w?: number;
	h?: number;
	qlt?: number;
	index?: number;
	date?: string;
	rand?: boolean;
	format?: 'json';
};

const querystringSchema: JSONSchemaType<QuerystringType> = {
	type: 'object',
	properties: {
		resolution: {
			type: 'string',
			nullable: true,
			enum: resolutions,
			default: '1080p',
		},
		w: {
			type: 'integer',
			minimum: 0,
			nullable: true,
		},
		h: {
			type: 'integer',
			minimum: 0,
			nullable: true,
		},
		qlt: {
			type: 'integer',
			nullable: true,
			minimum: 0,
			maximum: 100,
		},
		index: {
			type: 'integer',
			nullable: true,
		},
		date: {
			type: 'string',
			pattern: '\\d{8}',
			nullable: true,
		},
		rand: {
			type: 'boolean',
			nullable: true,
			default: false,
		},
		format: {
			type: 'string',
			nullable: true,
			enum: ['json'],
		},
	},
	additionalProperties: false,
};

interface ImageType {
	startdate: string;
	copyright: string;
	urlbase: string;
	title: string;
}

const BASE_URL = 'https://www.bing.com';

const dataFilePath = path.join(__dirname, '..', 'json', 'data.json');

const getImageByIndex = (data: ImageType[], index: number) => {
	const len = data.length;

	if (index >= len) {
		throw new Error(`Out of 'index' range!`);
	}

	if (index < 0) {
		return data[len + index];
	}

	return data[index];
};

const getImageByDate = (data: ImageType[], date: string) => {
	const image = data.find((item) => item.startdate === date);

	if (!image) {
		throw new Error(`Out of 'date' range!`);
	}

	return image;
};

const getImageRandom = (data: ImageType[]) => {
	const len = data.length;
	const idx = Math.floor(len * Math.random());

	return getImageByIndex(data, idx);
};

const isNumber = (v: any) => {
	return typeof v === 'number' && !Number.isNaN(v);
};

export const createApp = (options: FastifyServerOptions = {}) => {
	const app = Fastify({
		ignoreTrailingSlash: true,
		...options,
	});

	app.register(cors, { origin: true, methods: ['GET'] });
	app.register(sensible);

	app.get(
		'/v1',
		{
			schema: {
				querystring: querystringSchema,
			},
		},
		async (
			request: FastifyRequest<{
				Querystring: QuerystringType;
			}>,
			reply: FastifyReply
		) => {
			const { date, index, rand, format, resolution, ...params } = request.query;

			const data = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));

			let image: ImageType & { url?: string };

			if (isNumber(index)) {
				image = getImageByIndex(data, index!);
			} else if (date) {
				image = getImageByDate(data, date);
			} else if (rand === true) {
				image = getImageRandom(data);
			} else {
				image = getImageByIndex(data, 0);
			}

			if (!isNumber(params.h) && !isNumber(params.w) && resolution) {
				Object.assign(params, resolutionSizeMap[resolution]);
			}

			const search = new URLSearchParams(params as any).toString();
			const url = `${BASE_URL}${image.urlbase}_UHD.jpg&${search}`;

			console.log('url: ', url);

			if (format === 'json') {
				return { ...image, url };
			}

			return reply.redirect(307, url);
		}
	);

	return app;
};
