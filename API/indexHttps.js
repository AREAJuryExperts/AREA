const app = require("./app");
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync(process.env.SSL_KEY, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');

const credentials = { key: privateKey, cert: certificate };


// Création du serveur HTTPS après la déclaration de toutes les routes
const httpsServer = https.createServer(credentials, app);

// Écoute sur le port HTTPS par défaut (443)
httpsServer.listen(443, () => {
    console.log('Le serveur HTTPS est en cours d\'exécution');
});

const http = require('http');
http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(8080);