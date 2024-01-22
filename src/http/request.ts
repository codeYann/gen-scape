import https from "https";

export class HttpRequestError extends Error {
	statusCode?: number;
	constructor(message: string, statusCode?: number) {
		super(message);
		this.name = "HttpRequestError";
		this.statusCode = statusCode;
		Object.setPrototypeOf(this, HttpRequestError.prototype);
	}
}

export interface IHttpRequest {
	makeRequest({ url, method, timeout }): Promise<any>;
}

export class HttpRequest implements IHttpRequest {
	private errorTimeout = (reject, urlRequest) =>
		reject(new HttpRequestError(`Timeout at [${urlRequest}]`));

	private raceTimeoutDelay = (urlRequest: string, timeout: number) =>
		new Promise((_, reject) =>
			setTimeout(() => this.errorTimeout(reject, urlRequest), timeout),
		);

	private get = (url: string): Promise<any> => {
		return new Promise((resolve, reject) => {
			https.get(url, (response) => {
				const items: any[] = [];
				response
					.on("data", (data) => items.push(data))
					.on("end", () => resolve(JSON.parse(items.join(""))))
					.on("error", (error) =>
						reject(
							new HttpRequestError(
								error.message,
								response.statusCode,
							),
						),
					);
			});
		});
	};

	async makeRequest({ url, method, timeout }): Promise<any> {
		return Promise.race([
			this[method](url),
			this.raceTimeoutDelay(url, timeout),
		]);
	}
}
