import {expect, Mock, test, vi} from 'vitest';
import { app, BrowserWindow, Menu } from 'electron';
import { createTray } from '../electron/tray.js';

vi.mock("electron", ()=>{
    return{
        Tray: vi.fn().mockReturnValue({
            setContextMenu: vi.fn(),

        }),
        app: {
            getAppPath: vi.fn().mockReturnValue('/'),
            dock:{
                show: vi.fn(),
            },
            quit: vi.fn()
        },
        Menu: {
            buildFromTemplate: vi.fn(),
        }
    };
});

const mainWindow = {
    show: vi.fn(),
    isMinimized: vi.fn().mockReturnValue(true) as Mock,
    restore: vi.fn(),
}satisfies Partial<BrowserWindow> as any as BrowserWindow;

test('', ()=>{
    createTray(mainWindow);

    const calls = (Menu.buildFromTemplate as any as Mock).mock.calls;
    const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;
    const template = args[0];

    // Ensure tray setup.
    expect(template).toHaveLength(2);
    expect(template[0].label).toEqual('Show');
    expect(template[1].label).toEqual('Quit');

    // Test 'Show' with isMinimized = True
    template[0]?.click?.(null as any, null as any, null as any);
    expect(mainWindow.restore).toHaveBeenCalled();
    expect(app.dock.show).toHaveBeenCalled();

    // Test 'Show' with isMinimized = False
    (mainWindow.isMinimized as Mock).mockReturnValue(false);
    template[0]?.click?.(null as any, null as any, null as any);
    expect(mainWindow.show).toHaveBeenCalled();
    expect(app.dock.show).toHaveBeenCalled();

    // Test 'Quit'
    template[1]?.click?.(null as any, null as any, null as any);
    expect(app.quit).toHaveBeenCalled();
});