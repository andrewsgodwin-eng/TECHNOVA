// capture_screenshots.js
// Automates Chrome DevTools Protocol using native Node.js (v24) WebSocket

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'file:///C:/Users/andrews/.gemini/antigravity/scratch/TECHNOVA/index.html';
const OUTPUT_DIR = 'C:\\Users\\andrews\\.gemini\\antigravity\\scratch\\TECHNOVA';
const PORT = 9222;

const VIEWPORTS = [
  { name: '1440px-desktop', width: 1440, height: 900, isMobile: false },
  { name: '1024px-laptop', width: 1024, height: 800, isMobile: false },
  { name: '768px-tablet', width: 768, height: 1024, isMobile: true },
  { name: '425px-mobile', width: 425, height: 850, isMobile: true },
  { name: '375px-small-mobile', width: 375, height: 812, isMobile: true }
];

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) {
          reject(new Error(msg.error.message));
        } else {
          resolve(msg.result);
        }
      }
    };
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('Spawning Chrome...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    'about:blank'
  ]);

  try {
    await sleep(2000);

    const versionInfo = await fetchJson(`http://localhost:${PORT}/json/version`);
    console.log('Chrome Connected:', versionInfo.Browser);

    const targets = await fetchJson(`http://localhost:${PORT}/json/list`);
    const target = targets.find(t => t.type === 'page') || targets[0];
    console.log('Connecting to page target:', target.webSocketDebuggerUrl);

    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.ready;

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('CSS.enable');

    console.log(`Navigating to ${TARGET_URL}...`);
    await client.send('Page.navigate', { url: TARGET_URL });
    await sleep(1500);

    for (const vp of VIEWPORTS) {
      console.log(`Setting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile
      });
      await sleep(600);

      // Verify there is no horizontal scroll/overflow
      const evalResult = await client.send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        })`,
        returnByValue: true
      });
      console.log(`[Check ${vp.name}] Layout metrics:`, evalResult.result.value);

      // Capture screenshot
      const shot = await client.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false
      });

      const filePath = path.join(OUTPUT_DIR, `screenshot-${vp.name}.png`);
      fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved screenshot: ${filePath}`);
    }

    // Also capture full-page desktop screenshot
    console.log('Capturing full-page desktop screenshot...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
    await sleep(500);

    const fullShot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true
    });
    const fullPath = path.join(OUTPUT_DIR, 'screenshot-1440px-desktop-full.png');
    fs.writeFileSync(fullPath, Buffer.from(fullShot.data, 'base64'));
    console.log(`Saved full page: ${fullPath}`);

    // Test mobile hamburger menu interaction
    console.log('Testing mobile hamburger menu click...');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 425,
      height: 850,
      deviceScaleFactor: 1,
      mobile: true
    });
    await sleep(400);

    await client.send('Runtime.evaluate', {
      expression: `document.getElementById('hamburgerBtn').click();`
    });
    await sleep(500);

    const menuOpenShot = await client.send('Page.captureScreenshot', {
      format: 'png'
    });
    const menuOpenPath = path.join(OUTPUT_DIR, 'screenshot-425px-mobile-menu-open.png');
    fs.writeFileSync(menuOpenPath, Buffer.from(menuOpenShot.data, 'base64'));
    console.log(`Saved mobile menu open screenshot: ${menuOpenPath}`);

    client.close();
    console.log('All screenshots and verifications completed successfully!');
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}

run().catch(err => {
  console.error('Error running script:', err);
  process.exit(1);
});
