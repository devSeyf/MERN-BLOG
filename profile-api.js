const http = require('http');

async function profile(url) {
    const start = Date.now();
    console.log(`Fetching ${url}...`);
    return new Promise((resolve) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                const duration = Date.now() - start;
                console.log(`Status: ${res.statusCode}, Time: ${duration}ms, Size: ${data.length} bytes`);
                resolve();
            });
        }).on('error', (err) => {
            console.error(`Error: ${err.message}`);
            resolve();
        });
    });
}

async function run() {
    await profile('http://localhost:5000/api/blogs?limit=3');
    await profile('http://localhost:5000/api/blogs?limit=3');
    await profile('http://localhost:5000/api/blogs?limit=3');
}

run();
