import { test, expect, _electron } from '@playwright/test';
import { electron } from 'process';

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainPage: Awaited<ReturnType<typeof electronApp.firstWindow>>;

test.beforeEach(async () =>{
  // sets up the same environment as dev:electron in package.json
  electronApp = await _electron.launch({
    args: ['.'],
    env: { NODE_ENV: 'development'},
  });
  mainPage = await electronApp.firstWindow();
})

test.afterEach(async () =>{
  await electronApp.close();
});


test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
