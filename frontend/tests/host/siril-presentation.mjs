import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const { COMFYUI_TEST_URL: url } = process.env;
assert(url && ['localhost', '127.0.0.1'].includes(new URL(url).hostname), 'Use a local ComfyUI test host');
const current = process.argv.includes('--current');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const sidebarButton = page.locator('button').filter({ has: page.locator('.astrophoto-sidebar-icon') });
const tab = page.getByRole('tab', { name: /^(Nodes|节点)$/ });
const languageKey = 'Comfy.Locale';
const renderKey = 'Comfy.VueNodes.Enabled';
let saved;

const text = {
    en: { group: 'Geometry and Resampling', title: 'Crop Image', sequence: 'Crop Image (Sequence)',
        description: 'Keep a rectangular region of the current image.', usage: 'Command syntax',
        required: 'Current image', field: 'Arguments', color: 'Color and Channels', channels: 'Channel Management',
        compose: 'Compose RGB Image', settings: 'Settings', software: 'Software', alias: 'gradient removal' },
    zh: { group: '几何变换与重采样', title: '裁剪图像', sequence: '序列 · 裁剪图像',
        description: '保留当前图像的指定矩形区域。', usage: '命令用法',
        required: '当前图像', field: '命令参数', color: '色彩与通道', channels: '通道管理',
        compose: '合成 RGB 图像', settings: '设置', software: '软件管理', alias: '去梯度' },
};

async function ready() {
    await sidebarButton.waitFor();
}

async function verify(locale, nodes2, commands) {
    const words = text[locale];
    if (!current) {
        await page.evaluate(([language, mode, nextLocale, nextMode]) => {
            const setting = window.comfyAPI.app.app.extensionManager.setting;
            setting.set(language, nextLocale);
            setting.set(mode, nextMode);
        }, [languageKey, renderKey, locale, nodes2]);
        await page.reload();
        await ready();
    }

    await page.keyboard.press('Escape');
    if (!(await tab.isVisible())) await sidebarButton.click();
    await tab.click();
    const root = page.locator('button.ap-tree-folder').filter({ hasText: /^Siril$/ });
    await root.click();
    const branch = root.locator('..');
    assert.equal(await branch.locator(':scope > ul > li > button.ap-tree-folder').count(), 18);
    const color = branch.getByRole('button', { name: words.color, exact: true });
    await color.click();
    await color.locator('..').getByRole('button', { name: words.channels, exact: true }).click();
    await color.locator('..').getByRole('button', { name: words.compose, exact: true }).waitFor();
    await branch.getByRole('button', { name: words.group, exact: true }).click();
    await branch.getByRole('button', { name: words.title, exact: true }).waitFor();
    await branch.getByRole('button', { name: words.sequence, exact: true }).waitFor();
    assert.equal(await branch.getByRole('button', { name: 'CLI', exact: true }).count(), 0);
    await branch.getByRole('button', { name: words.title, exact: true }).click();
    const panel = page.getByRole('tabpanel', { name: /^(Nodes|节点)$/ });
    await panel.getByText(words.description, { exact: true }).waitFor();
    await panel.getByText(words.field, { exact: true }).waitFor();

    await page.getByRole('tab', { name: words.settings, exact: true }).click();
    await page.locator('.ap-module').getByText(words.software, { exact: true }).click();
    await page.locator('.ap-software-open').getByText('Siril', { exact: true }).click();
    await page.getByRole('button', { name: /^(Siril commands|Siril 命令)$/i }).click();
    const catalogue = page.locator('.ap-siril-commands');
    const colorGroup = catalogue.getByRole('heading', { name: words.color, exact: true }).locator('..');
    await colorGroup.getByRole('heading', { name: words.channels, exact: true }).waitFor();
    await colorGroup.getByText('rgbcomp', { exact: true }).waitFor();
    assert.equal(await catalogue.locator('li').count(), 201);
    await catalogue.locator('input[type=search]').fill(words.alias);
    await page.waitForFunction(() => document.querySelectorAll('.ap-siril-commands summary code').length === 2);
    assert.deepEqual(await catalogue.locator('summary code').allTextContents(), ['seqsubsky', 'subsky']);

    const nativeCategories = await page.evaluate(() => Object.entries(window.LiteGraph.registered_node_types)
        .flatMap(([id, node]) => id.startsWith('AstroPhotoSiril') && node.nodeData
            ? [[id, node.nodeData.category]] : []));
    const byId = new Map(nativeCategories);
    assert.equal(byId.size, 183);
    for (const command of commands.filter(row => row.scriptable)) {
        assert.equal(byId.get(command.node_id), locale === 'zh' ? 'AstroPhoto/Siril/' + command.category_zh : command.category);
    }
    if (await tab.isVisible()) await sidebarButton.click();

    const restored = await page.evaluate(async () => {
        const app = window.comfyAPI.app.app;
        const crop = window.LiteGraph.createNode('AstroPhotoSiril_crop');
        const custom = window.LiteGraph.createNode('AstroPhotoSiril_crop');
        crop.id = 1;
        custom.id = 2;
        crop.pos = [350, 225];
        custom.pos = [750, 225];
        crop.title = 'Siril · crop';
        custom.title = 'Keep my custom title';
        crop.widgets.find(widget => widget.name === 'arguments').value = '[0, 0, 20, 20]';
        await app.loadGraphData({
            last_node_id: 2, last_link_id: 0, nodes: [crop.serialize(), custom.serialize()],
            links: [], groups: [], config: {}, extra: {}, version: 0.4,
        });
        app.canvas.ds.scale = 1;
        app.canvas.ds.offset = [0, 0];
        app.canvas.setDirty(true, true);
        const definition = window.LiteGraph.registered_node_types.AstroPhotoSiril_crop.nodeData;
        return { category: definition.category, displayName: definition.display_name };
    });

    const guides = page.locator('.ap-siril-command-details').filter({ hasText: words.description });
    await guides.first().waitFor({ state: 'visible' });
    assert.equal(await guides.count(), 2);
    await guides.first().getByText(words.usage, { exact: true }).click();
    await guides.first().getByText('crop [x y width height]', { exact: true }).waitFor();
    assert.ok((await guides.first().locator('.ap-siril-requirements').textContent()).includes(words.required));
    const nodes = await page.evaluate(() => window.comfyAPI.app.app.rootGraph.nodes.map(node => ({
        title: node.title,
        widgetName: node.widgets.find(widget => widget.name === 'arguments')?.label,
        saved: node.serialize().widgets_values,
    })));
    assert.equal(restored.displayName, words.title);
    assert.ok(restored.category.endsWith('/' + words.group), restored.category);
    assert.equal(nodes[0].title, words.title);
    assert.equal(nodes[0].widgetName, words.field);
    assert.equal(nodes[1].title, 'Keep my custom title');
    assert.equal(nodes[0].saved[0], '[0, 0, 20, 20]');
    assert.equal(nodes[0].saved.length, nodes[1].saved.length);
    console.log(`PASS ${locale} ${nodes2 ? 'Nodes 2.0' : 'classic'} categories, node help, and workflow title compatibility`);
}

try {
    const info = await (await page.request.get(new URL('/object_info', url).href)).json();
    const defs = Object.values(info).filter(node => node.name.startsWith('AstroPhotoSiril'));
    assert.equal(defs.length, 183);
    assert.equal(new Set(defs.map(node => node.category)).size, 21);
    assert.ok(defs.every(node => !node.display_name.startsWith('Siril · ') && node.description));
    const response = await page.request.get(new URL('/astrophoto/v1/software/siril/commands', url).href,
        { headers: { 'X-AstroPhoto-Local': '1' } });
    assert.ok(response.ok(), 'Siril command catalogue must be available on the local host');
    const { commands } = await response.json();
    assert.equal(commands.length, 201);
    await page.goto(url);
    await ready();
    saved = await page.evaluate(keys => keys.map(key => window.comfyAPI.app.app.extensionManager.setting.get(key)),
        [languageKey, renderKey]);
    if (current) {
        await verify(String(saved[0]).startsWith('zh') ? 'zh' : 'en', Boolean(saved[1]), commands);
    } else {
        for (const locale of ['en', 'zh']) {
            for (const nodes2 of [false, true]) await verify(locale, nodes2, commands);
        }
    }
} finally {
    if (saved && !current) {
        await page.evaluate(([language, mode, values]) => {
            const setting = window.comfyAPI.app.app.extensionManager.setting;
            setting.set(language, values[0]);
            setting.set(mode, values[1]);
        }, [languageKey, renderKey, saved]).catch(() => {});
    }
    await browser.close();
}
