const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Buy order indítása
// Input: { symbol: String, quantity: Number, price?: Number }
router.get('/teszt', async (ctx) => {
  console.log('teszt oldal megnyitva');
  ctx.body = 'Teszt OK!';
});

router.post('/buy', async (ctx) => {
	console.log('buy oldal megnyitva');

	const { username, password, symbol, lot } = ctx.request.body;

	console.log('Buy oldal megnyitva');
	console.log(`Felhasználó: ${username}`);
	console.log(`Jelszó: ${password}`);
	console.log(`Szimbólum: ${symbol}`);
	console.log(`Mennyiség: ${lot}`);
  
	const browser = await puppeteer.launch({
		headless: true,
		userDataDir: './temp-user-data',
		executablePath: '/app/.apt/usr/bin/google-chrome-stable',
		args: [
		'--no-sandbox', '--disable-setuid-sandbox',
		'--disable-infobars',
		'--disable-blink-features=AutomationControlled',
		'--disable-password-generation',
		'--disable-save-password-bubble',
		'--disable-features=PasswordManagerEnableAccountStorage,PasswordLeakDetection',
		'--password-store=basic'
		],
		defaultViewport: null
	});

	const context = browser.defaultBrowserContext();
	await context.overridePermissions('https://mtr.gooeytrade.com', []);

	const page = await browser.newPage();

	await page.goto('https://mtr.gooeytrade.com/login', {
		waitUntil: 'networkidle2'
	});
	
	console.log('Oldal betöltve.');
  
	ctx.body = {
		status: 'success',
		message: 'Buy kérés fogadva',
		data: { username, symbol, lot }
	};
});

// Router és szerver indítása
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Koa szerver fut: http://localhost:${PORT}/`);
});