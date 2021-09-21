const { ipcRenderer, contextBridge } = require('electron');
// renderer

function showContextMenu() {
    ipcRenderer.send('show-context-menu')
}

ipcRenderer.on('context-menu-command', (e, command) => {
    console.log('reply', e, command);
});

//export

contextBridge.exposeInMainWorld('rContext', { showContextMenu: showContextMenu });
