const electron = require('electron');

// builds the bridge for communicating with ui
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback: (statistics: any) => void) => callback({}),
    getStaticData: () => console.log('static'),
})