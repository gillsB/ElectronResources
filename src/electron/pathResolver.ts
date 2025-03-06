import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';

export function getPreloadPath(){
    return path.join(
        app.getAppPath(),
        // the directory for this is different in the installed vs the development env.
        isDev() ? '.' : '..',
        '/dist-electron/preload.cjs'
    )
}

export function getUIPath() {
    return path.join(app.getAppPath(), '/dist-react/index.html')
}