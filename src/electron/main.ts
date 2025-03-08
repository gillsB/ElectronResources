import {app, BrowserWindow, Tray} from "electron";
import path from 'path';
import { ipcMainHandle, isDev } from './util.js'
import { getStaticData, pollResources } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";

app.on("ready", () =>{
    const mainWindow = new BrowserWindow({
        webPreferences: {
            // preload function to allow only specific functions to communicate with from the ui.
            preload: getPreloadPath(),
        },
    });
    if (isDev()){
        mainWindow.loadURL('http://localhost:5123')
    } else{
        mainWindow.loadFile(getUIPath())
    }

    pollResources(mainWindow);

    ipcMainHandle("getStaticData", () =>{
        return getStaticData();
    });

    new Tray(path.join(getAssetPath(),
    process.platform === "darwin" ? "altTemplate@2x.png" : 'alt@2x.png')
    );

    handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow){
    let willClose = false;

    mainWindow.on('close', (e) => {
        if(willClose){
            // if we tell it to close just return (full close).
            return;
        }
        // else hide to tray.
        e.preventDefault();
        mainWindow.hide();
        //mac os hide taskbar
        if (app.dock){
            app.dock.hide();
        }
    });
    app.on('before-quit', () => {
        willClose = true;
    }); 

    mainWindow.on('show', () =>{
        willClose = false;
    });
}