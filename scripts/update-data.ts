import fs from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

const endpoint = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&mkt=en-US';
const dataFilePath = join(__dirname, '..', 'json', 'data.json');

fetch(endpoint)
	.then((rsp) => rsp.json())
	.then(({ images }: any) => {
		const str = fs.readFileSync(dataFilePath, 'utf8');
		const result = JSON.parse(str);

		const data = images
			.filter((item) => !result.find(({ startdate }) => item.startdate === startdate))
			.map((item) => ({
				startdate: item.startdate,
				copyright: item.copyright,
				urlbase: item.urlbase,
				title: item.title,
			}));

		console.log('data: ', data);

		result.push(...data);

		result.sort((a, b) => b.startdate - a.startdate);

		fs.writeFileSync(dataFilePath, JSON.stringify(result), 'utf8');
	});
