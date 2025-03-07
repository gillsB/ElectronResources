const electron = require('electron');

// builds the bridge for communicating with ui
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback) => 
        ipcOn("statistics", (stats) => {
            callback(stats);
        }),
    subscribeChangeView: (callback) => 
        ipcOn("changeView", (view) => {
            callback(view);
        }),
    getStaticData: () => ipcInvoke('getStaticData'),
} satisfies Window['electron']);


function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}
function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
  ) {
    //the _: any will eventually be replaced/removed.
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
  }

