import { describe, before, afterEach, it } from "node:test";
import assert from "node:assert";
import { createSandbox, SinonSandbox } from "sinon";
import { Pagination } from "./pagination";

describe("Pagination tests", () => {
	let sandbox: SinonSandbox;

	before(() => {
		sandbox = createSandbox();
	});

	afterEach(() => sandbox.restore());

	describe("#Pagination", () => {
		it("#sleep should be a promise and not return values", async () => {
			const clock = sandbox.useFakeTimers();
			const time = 1;
			const pendingPromise = Pagination.sleep(time);
			clock.tick(time);
			assert.ok(pendingPromise instanceof Promise);
			const result = await pendingPromise;
			assert.ok(result === undefined);
		});

		describe("#handleRequest", () => {
			// it("should retry an request twice before throing an exception and validate request params and flow", async () => {
			// 	const expectedCallCount = 2;
			// 	const expectedTimeout = 10;

			// 	const pagination = new Pagination({
			// 		maxRetries: expectedCallCount,
			// 		retryTimeout: expectedTimeout,
			// 		maxRequestTimeout: expectedTimeout,
			// 		threshold: 200,
			// 	});

			// 	const error = new Error("Timeout");

			// 	sandbox.spy(pagination, "handleRequest");
			// 	sandbox.stub(pagination, "sleep" as keyof Pagination).resolves();

			// 	sandbox.stub(pagination.request, "makeRequest").rejects(error);

			// 	const dataRequest = {
			// 		url: "https://google.com.br",
			// 		page: 0,
			// 		retries: 1,
			// 	};
			// 	await assert.rejects(pagination.handleRequest(dataRequest), error);

			// 	assert.deepStrictEqual(
			// 		pagination.handleRequest.callCount,
			// 		expectedCallCount,
			// 	);

			// 	const lastCall = 1;
			// 	const firstCallArg = pagination.handleRequest.getCall(1).args[0];
			// 	const firstCallRetries = firstCallArg.retries;
			// 	assert.deepStrictEqual(firstCallRetries, expectedCallCount);

			// 	const expectedArgs = {
			// 		url: `${dataRequest.url}?tid=${dataRequest.page}`,
			// 		timeout: expectedTimeout,
			// 	};

			// 	const firstCallArgs =
			// 		pagination.request.makeRequest.getCall(0).args[0];

			// 	assert.deepStrictEqual(firstCallArgs, [expectedArgs]);
			// 	assert.ok(pagination.sleep.calledWithExactly(expectedTimeout));
			// });

			it("should return data from request when succeded", async () => {
				const data = { result: "ok" };
				const pagination = new Pagination();
				sandbox
					.stub(pagination.request, "makeRequest")
					.resolves(data as any);
				const result = await pagination.handleRequest({
					url: "https://google.com.br",
					page: 1,
					retries: 1,
				});
				assert.deepStrictEqual(result, data);
			});
		});
	});

	describe("#getPaginated", () => {
		const responseMock = [
			{
				tid: 5705,
				date: 1373123005,
				type: "sell",
				price: 196.52,
				amount: 0.01,
			},
			{
				tid: 5706,
				date: 1373124523,
				type: "buy",
				price: 200,
				amount: 0.3,
			},
		];

		it("should update request id on each request", async () => {
			const pagination = new Pagination();
			sandbox
				.stub(pagination, "handleRequest" as keyof Pagination)
				.resolves();

			sandbox
				.stub(pagination, "handleRequest")
				.onCall(0)
				.resolves(responseMock[0])
				.onCall(1)
				.resolves(responseMock[1])
				.onCall(2)
				.resolves([]);

			sandbox.spy(pagination, "getPaginated");

			// const data = {
			// 	url: "https://google.com.br",
			// 	page: 1,
			// };

			// const secondCallExpectation = {
			// 	...data,
			// 	page: responseMock[0]?.tid ?? 0,
			// };

			// const thirdCallExpectation = {
			// 	...secondCallExpectation,
			// 	page: responseMock[1]?.tid ?? 0,
			// };

			// const getFirstArgFromCall = (value: number) => pagination.handleRequest.getCall
		});
	});
});
