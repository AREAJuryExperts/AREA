const app = require("./app");
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync(process.env.SSL_KEY, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');

const credentials = { key: privateKey, cert: certificate };


const httpsServer = https.createServer(credentials, app);

httpsServer.listen(8080, () => {
    console.log('Le serveur HTTPS est en cours d\'exécution');
});
