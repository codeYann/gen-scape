import { HttpRequest } from "../http/request";

const DEFAULT_OPTIONS_ENUM = {
	maxRetries: 4,
	retryTimeout: 1000,
	maxRequestTimeout: 1000,
	threshold: 1200,
};

type getPaginatedType = {
	url: string;
	page: number;
};

type handleRequestType = {
	url: string;
	page: number;
	retries: number;
};

export interface IPagination {
	request: HttpRequest;
	maxRetries: number;
	retryTimeout: number;
	maxRequestTimeout: number;
	threshold: number;
	getPaginated({
		url,
		page,
	}: getPaginatedType): AsyncGenerator<unknown, unknown, unknown>;
	handleRequest({ url, page, retries }: handleRequestType): Promise<unknown>;
}

export class Pagination implements IPagination {
	request: HttpRequest;
	maxRetries: number;
	retryTimeout: number;
	maxRequestTimeout: number;
	threshold: number;

	constructor(options = DEFAULT_OPTIONS_ENUM) {
		this.request = new HttpRequest();
		this.maxRetries = options.maxRetries;
		this.retryTimeout = options.retryTimeout;
		this.maxRequestTimeout = 1000;
		this.threshold = 1200;
	}

	static sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async handleRequest({
		url,
		page,
		retries = 1,
	}: handleRequestType): Promise<unknown> {
		try {
			const finalURL = new URL("", url);
			finalURL.searchParams.set("tid", page.toString());

			const result = await this.request.makeRequest({
				url: finalURL.href,
				timeout: this.maxRequestTimeout,
			});

			return result;
		} catch (error) {
			if (retries === this.maxRetries) {
				console.log(`[${retries}] max retries reached!`);
				throw error;
			}

			await Pagination.sleep(this.retryTimeout);
			return this.handleRequest({ url, page, retries: (retries += 1) });
		}
	}

	async *getPaginated({
		url,
		page,
	}: getPaginatedType): AsyncGenerator<unknown, unknown, unknown> {
		const result = await this.handleRequest({ url, page, retries: 1 });
		const lastId = result[result.length - 1]?.tid ?? 0;
		if (lastId === 0) {
			return;
		}

		yield result;
		await Pagination.sleep(this.threshold);
		yield* this.getPaginated({ url, page: lastId });
	}
}
