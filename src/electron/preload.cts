const electron = require('electron');

// builds the bridge for communicating with ui
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback: (statistics: any) => void) => {
        electron.ipcRenderer.on("statistics", (_: any, stats: any) => {
            callback(stats);
        })
        
    },
    getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
})