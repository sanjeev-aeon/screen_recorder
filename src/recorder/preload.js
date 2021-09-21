const { ipcRenderer, contextBridge } = require('electron');

const recordMetaObject = {
    subscriber: null,
    setSubscriber: (cb) => { this.subscriber = cb; },
    update: (source) => { this.subscriber(source); }
};

function showContextMenu() {
    ipcRenderer.send('show-context-menu')
}


ipcRenderer.on('context-menu-command', (e, source) => {
    console.log('reply', e, source);
    recordMetaObject.update(source);
});


//export
contextBridge.exposeInMainWorld('rContext', { showContextMenu: showContextMenu, recordMetaObject: recordMetaObject });
