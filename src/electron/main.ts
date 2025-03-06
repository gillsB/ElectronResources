import {app, BrowserWindow} from "electron";
import path from 'path';
import { ipcMainHandle, isDev } from './util.js'
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

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
});