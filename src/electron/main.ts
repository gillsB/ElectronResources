import {app, BrowserWindow, Menu, Tray} from "electron";
import path from 'path';
import { ipcMainHandle, ipcMainOn, isDev } from './util.js'
import { getStaticData, pollResources } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

// This disables the menu completely. Must be done before "ready" or gets more complicated.
//Menu.setApplicationMenu(null);

app.on("ready", () =>{
    const mainWindow = new BrowserWindow({
        webPreferences: {
            // preload function to allow only specific functions to communicate with from the ui.
            preload: getPreloadPath(),
        },
        frame: false,
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

    ipcMainOn("sendFrameAction", (payload) =>{
        switch(payload){
            case 'MINIMIZE':
                mainWindow.minimize();
                break;
            case 'MAXIMIZE':
                mainWindow.maximize();
                break;
            case 'CLOSE':
                mainWindow.close();
                break;
        }
    })

    createTray(mainWindow)
    handleCloseEvents(mainWindow);
    createMenu(mainWindow);
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