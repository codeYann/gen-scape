import { assert } from "console";
import { it } from "node:test";
import { HttpRequest, HttpRequestError } from "./request";

it("It should return 200 status", async () => {
	const request = new HttpRequest();
	const response = await request.makeRequest({
		url: "https://stephen-king-api.onrender.com/api/books",
		method: "get",
		timeout: 1000,
	});
	assert(response.length === 62);
});

it("It should return an error", async () => {
	const request = new HttpRequest();
	try {
		await request.makeRequest({
			url: "http://fake-url.com",
			method: "get",
			timeout: 1,
		});
	} catch (error) {
		assert(error instanceof HttpRequestError);
	}
});
