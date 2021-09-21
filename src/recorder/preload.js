const { writeFile } = require('fs');
const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

const recordMetaObject = {
    subscriber: null,
    setSubscriber: (cb) => { this.subscriber = cb; },
    update: (source) => { this.subscriber(source); }
};
const saveResultMetaData = {
    cb: null,
    onSuccess: (cb) => { this.cb = cb; },
    update: (filePath) => { this.cb(filePath); }
}

function showContextMenu() {
    ipcRenderer.send('show-context-menu')
}


ipcRenderer.on('context-menu-command', (e, source) => {
    recordMetaObject.update(source);
});

const saveRecording = async (chunks) => {

    const options = { type: 'video/webm; codecs=vp9' };
    const blob = new Blob(chunks, options);
    const recordingBuffer = Buffer.from(await blob.arrayBuffer());
    const filePath = await ipcRenderer.invoke('file-path');
    writeFile(filePath, recordingBuffer, () => {
        console.log('Successfully saved at ', filePath);
        saveResultMetaData.update(filePath);
    });

}
//export
contextBridge.exposeInMainWorld('rContext', { showContextMenu: showContextMenu, recordMetaObject: recordMetaObject, saveRecording: saveRecording, saveResultMetaData: saveResultMetaData });
