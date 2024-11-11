import http from 'http'
import dotenv from 'dotenv'
import fs from 'fs'

const host         = 'localhost';
const envConfig    = (() => {
  try {
    return dotenv.parse(fs.readFileSync('./.env'));
  } catch (error) {
    console.error('Error loading .env file in health-check.js');
    process.exit(1);
  }
})();
const port         = envConfig.PORT;

console.log("🚀 ~ port:", port)

const options = {
    host,
    port,
    path: '/api/trpc/health.check',
    timeout: 2000
};

let protocol = http;

if (process.argv.slice(2).includes(('--debug'))) {
    console.log('DEBUG MODE');
    console.log('OPTIONS', options);
    console.log('ENV process', process.env)
    console.log('ENV file', envConfig)

    const request = protocol.request(options, (res) => {
        console.log('STATUS', res.statusCode);
        // console.log('HEADERS', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log('BODY', chunk);
        });
    });

    request.setTimeout(options.timeout, () => {
        console.error('Timeout exceeded in health-check.js');
        process.exit(1);
    });

    request.on('error', function (err) {
        console.log('ERROR', err);
    });
    request.end();
} else {
    const request = protocol.request(options, (res) => {
        if (res.statusCode === 200) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    });

    request.setTimeout(options.timeout, () => {
        console.error('Timeout exceeded in health-check.js');
        process.exit(1);
    });

    request.on('error', function (err) {
        console.log('ERROR');
        process.exit(1);
    });
    request.end();
}



