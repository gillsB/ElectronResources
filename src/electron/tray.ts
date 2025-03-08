import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";

export function createTray(mainWindow : BrowserWindow){
    const tray = new Tray(path.join(getAssetPath(),
        process.platform === "darwin" ? "altTemplate@2x.png" : 'alt@2x.png')
        );

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "Show",
            click: () =>{
                mainWindow.show();
                //mac os restore taskbar
                if(app.dock){
                    app.dock.show();
                }
            },
        },
        {
        label: "Quit",
        click: () =>app.quit(),
        }

    ]))
}