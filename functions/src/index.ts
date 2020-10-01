import * as functions from 'firebase-functions';
import * as express from 'express';
import { createClient } from 'contentful';
import { Entry, EntryFields, Asset } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import * as cors from 'cors';

const app = express();

app.use(cors({ origin: true }));

const { space_id, access_token } = functions.config().contentful;

const client = createClient({
	space: space_id,
	accessToken: access_token,
});

interface IStructure {
	name: EntryFields.Text;
	content: Document;
	logo: Asset;
}

export type StructureEntry = Entry<IStructure>;

export const getStructures = (): Promise<StructureEntry[]> =>
	client
		.getEntries<IStructure>({
			content_type: 'bflStructure',
			order: 'fields.name',
		})
		.then((res) => res.items);

interface IBlogPost {
	title: EntryFields.Text;
	slug: EntryFields.Text;
	thumbnail: Asset;
	excerpt: EntryFields.Text;
	content: Document;
	date: EntryFields.Date;
	author: EntryFields.Text;
}

export type BlogPostEntry = Entry<IBlogPost>;

export const getBlogPosts = (): Promise<BlogPostEntry[]> =>
	client
		.getEntries<IBlogPost>({
			content_type: 'bflBlogPost',
		})
		.then((res) => res.items);

export const getBlogPost = (slug: string): Promise<BlogPostEntry> =>
	client
		.getEntries<IBlogPost>({
			'fields.slug': slug,
			content_type: 'bflBlogPost',
		})
		.then((res) => res.items[0]);

app.get('/api', (req, res) => {
	res.status(200).send('BFL API');
});

app.get('/api/blog', (req, res) => {
	getBlogPosts().then((data) => {
		res.status(200).send(data);
	});
});

app.get('/api/blog/:slug', (req, res) => {
	const { slug } = req.params;

	getBlogPost(slug).then((data) => {
		res.status(200).send(data);
	});
});

app.get('/api/structures', (req, res) => {
	getStructures().then((data) => {
		res.status(200).send(data);
	});
});

export const api = functions.https.onRequest(app);
