import { IPagination, Pagination } from "./pagination/pagination";

class App {
	app: IPagination;

	constructor(pagination: IPagination) {
		this.app = pagination;
	}

	async start() {
		const iterator = this.app.getPaginated({
			url: "https://www.mercadobitcoin.net/api/BTC/trades/",
			page: 5704,
		});

		for await (const item of iterator) {
			console.table(item);
		}
	}
}

const app = new App(new Pagination());

app.start();
