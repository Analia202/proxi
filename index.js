const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8000', 'http://http://127.0.0.1:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
    ]
}));


const onProxyReq = async function (proxyReq, req, res) {
    const token = req.cookies?.access;
    if (token) {
        proxyReq.setHeader('Authorization', 'Bearer ' + token);
    }
};


const apiProxy = createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true,
    pathRewrite: { '^/webproxy': '' },
    on: { proxyReq: onProxyReq }
});



app.use('/webproxy', apiProxy);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require('./routers/auth.routes')(app);

app.listen(port, () => {
    console.log(`Proxy server is running at http://localhost:${port}`);
});