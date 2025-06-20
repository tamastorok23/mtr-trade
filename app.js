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