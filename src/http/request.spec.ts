import assert from "node:assert";
import { describe, it } from "node:test";
import { HttpRequest, HttpRequestError } from "./request";

describe("Http request error", () => {
	it("It should return an error", async () => {
		const request = new HttpRequest();
		try {
			await request.makeRequest({
				url: "http://fake-url.com",
				timeout: 1,
			});
		} catch (error) {
			assert(error instanceof HttpRequestError);
		}
	});
});

describe("Http request to an endpoint", () => {
	it("It should return 200 status", async () => {
		const request = new HttpRequest();
		const response = await request.makeRequest({
			url: "https://stephen-king-api.onrender.com/api/books",
			timeout: 1000,
		});
		assert.equal(response.length, 62);
	});
});
