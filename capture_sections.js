// capture_sections.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'file:///C:/Users/andrews/.gemini/antigravity/scratch/TECHNOVA/index.html';
const OUTPUT_DIR = 'C:\\Users\\andrews\\.gemini\\antigravity\\brain\\f7e91896-c6dd-4aed-a35d-ff3efa8de99b';
const PORT = 9223;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
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
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
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
  close() { this.ws.close(); }
}

async function run() {
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
    const targets = await fetchJson(`http://localhost:${PORT}/json/list`);
    const target = targets.find(t => t.type === 'page') || targets[0];
    const client = new CDPClient(target.webSocketDebuggerUrl);
    await client.ready;

    await client.send('Page.enable');
    await client.send('Page.navigate', { url: TARGET_URL });
    await sleep(1500);

    const sections = ['technology', 'featured', 'innovations', 'contact'];

    // Desktop sections
    await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await sleep(500);
    for (const s of sections) {
      await client.send('Runtime.evaluate', { expression: `document.getElementById('${s}').scrollIntoView();` });
      await sleep(400);
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUTPUT_DIR, `desktop-section-${s}.png`), Buffer.from(shot.data, 'base64'));
    }

    // Mobile sections
    await client.send('Emulation.setDeviceMetricsOverride', { width: 425, height: 850, deviceScaleFactor: 1, mobile: true });
    await sleep(500);
    for (const s of sections) {
      await client.send('Runtime.evaluate', { expression: `document.getElementById('${s}').scrollIntoView();` });
      await sleep(400);
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(OUTPUT_DIR, `mobile-section-${s}.png`), Buffer.from(shot.data, 'base64'));
    }

    client.close();
    console.log('Section screenshots captured successfully!');
  } finally {
    chromeProcess.kill('SIGKILL');
  }
}
run().catch(console.error);
