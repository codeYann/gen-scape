import https from "node:https";

export class HttpRequestError extends Error {
	statusCode?: number;
	constructor(message: string, statusCode?: number) {
		super(message);
		this.name = "HttpRequestError";
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, HttpRequestError.prototype);
	}
}

type makeRequestType = {
	url: string;
	timeout: number;
};

export interface IHttpRequest {
	makeRequest({ url, timeout }: makeRequestType): Promise<unknown>;
}

export class HttpRequest implements IHttpRequest {
	private errorTimeout = (reject: any, urlRequest: string) =>
		reject(new HttpRequestError(`Timeout at [${urlRequest}]`));

	private raceTimeoutDelay = (urlRequest: string, timeout: number) =>
		new Promise((_, reject) =>
			setTimeout(() => this.errorTimeout(reject, urlRequest), timeout),
		);

	private get = (url: string): Promise<unknown> => {
		return new Promise((resolve, reject) => {
			https.get(url, (response) => {
				const items: unknown[] = [];
				response
					.on("data", (data) => items.push(data))
					.on("end", () => resolve(JSON.parse(items.join(""))))
					.on("error", (error) =>
						reject(new HttpRequestError(error.message, response.statusCode)),
					);
			});
		});
	};

	async makeRequest({ url, timeout }: makeRequestType): Promise<unknown> {
		return Promise.race([this.get(url), this.raceTimeoutDelay(url, timeout)]);
	}
}
