const crypto = require('crypto');

const SECRET_KEY_ACCESS_TOKEN = crypto.randomBytes(32).toString('hex');
const SECRET_KEY_REFRESH_TOKEN = crypto.randomBytes(32).toString('hex');
const COOKIE_SECRET_KEY = crypto.randomBytes(32).toString('hex');

console.table({SECRET_KEY_ACCESS_TOKEN, SECRET_KEY_REFRESH_TOKEN,COOKIE_SECRET_KEY});
