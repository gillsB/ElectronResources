import { app, BrowserWindow, Menu } from "electron";
import { isDev } from "./util.js";

export function createMenu(mainWindow: BrowserWindow){
    // If not isDev() return and do not create a menu
    if (!isDev()){
        Menu.setApplicationMenu(null);
        return;
    }

    Menu.setApplicationMenu(Menu.buildFromTemplate([{
        // MacOS by default names the first menu tab the same name as the source file.
        label: process.platform === 'darwin' ? undefined : "Dev",
        type: 'submenu',
        submenu: [
            {
                label: 'DevTools',
                click: () => mainWindow.webContents.openDevTools(),
                visible: isDev(),
            },
        ]
    }]));
}