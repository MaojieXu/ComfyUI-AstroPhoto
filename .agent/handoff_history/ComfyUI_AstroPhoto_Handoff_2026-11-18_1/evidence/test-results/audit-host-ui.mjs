import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { join } from 'node:path';
const requireFrontend = createRequire(join(process.cwd(),'frontend','package.json'));
const { chromium } = requireFrontend('playwright');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  const blocked = [];
  const errors = [];
  await page.route('**/*', route => {
    const request = route.request();
    const safe = new URL(request.url()).origin === 'http://127.0.0.1:8207' && ['GET','HEAD','OPTIONS'].includes(request.method());
    if (!safe) {
      blocked.push(request.method());
      return route.abort();
    }
    return route.continue();
  });
  page.on('pageerror', error => errors.push(error.name));
  await page.goto('http://127.0.0.1:8207/');
  const button = page.getByRole('button', {name:'AstroPhoto', exact:true});
  await button.waitFor({timeout:20000});
  assert.equal(await button.count(),1);
  await button.click();
  const root = page.locator('.astrophoto-ui');
  await root.waitFor();
  assert.equal(await root.count(),1);
  const tabs = root.getByRole('tab');
  assert.equal(await tabs.count(),3);
  console.log('GET-only sidebar tabs:', await tabs.allTextContents());
  await tabs.nth(0).click();
  await root.locator('input').first().waitFor({timeout:10000});
  await tabs.nth(2).click();
  for (const label of [/Storage|存储/, /Equipment|设备/, /Software|软件/, /Environment|环境配置/]) {
    await root.getByRole('button',{name:label}).first().waitFor({timeout:10000});
  }
  assert.equal(await root.getByRole('button',{name:/Observing Sites|观测地/}).count(),0);
  console.log('PASS one sidebar, Nodes search, and current Settings entries');
  console.log('Host-script automatic blocked methods:',JSON.stringify(blocked));
  console.log('Page error names (diagnostic):',JSON.stringify(errors));
} finally {
  await browser.close();
}
