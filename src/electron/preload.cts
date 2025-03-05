const electron = require('electron');

// builds the bridge for communicating with ui
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback: (statistics: any) => void) => {
        ipcOn("statistics", (stats) => {
            callback(stats);
        })
        
    },
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
    electron.ipcRenderer.on(key, (_: any, payload: EventPayloadMapping[Key]) => callback(payload));
  }

