const { writeFile } = require('fs');
const electron = require('electron');
const { ipcRenderer, contextBridge } = electron;

console.log('ssss', electron);

const recordMetaObject = {
    subscriber: null,
    setSubscriber: (cb) => { this.subscriber = cb; },
    update: (source) => { this.subscriber(source); }
};

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
    console.log('path', filePath);
    writeFile(filePath, recordingBuffer, () => {
        console.log('Successfully saved at ', filePath);
    });

}
//export
contextBridge.exposeInMainWorld('rContext', { showContextMenu: showContextMenu, recordMetaObject: recordMetaObject, saveRecording: saveRecording });
