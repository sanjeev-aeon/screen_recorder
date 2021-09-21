
const video = document.querySelector('video');
const save = document.querySelector('.button-save');

const selectScreenButton = document.querySelector('.button-select-screen');



let mediaRecorder = null;
let chunks = [];
selectScreenButton.onclick = () => {
    window.rContext.showContextMenu();
    mediaRecorder = null;
    chunks = [];
}

function handleStream(stream) {
    video.srcObject = stream
    video.onloadedmetadata = () => video.play()

    const options = { MimeType: 'video/webm; codecs=vp9' };
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.start();
    mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
    }
    mediaRecorder.onstop = (e) => {
        video.pause();
        pushToSave(chunks);
    }
}
const pushToSave = (chunks) => {
    window.rContext.saveRecording(chunks);
}

const recordVideo = async (source) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: source.id,
                    minWidth: 500,
                    maxWidth: 500,
                    minHeight: 500,
                    maxHeight: 500
                }
            }
        })
        handleStream(stream)
    } catch (e) {
        console.error(e);
    }
};
window.rContext.recordMetaObject.setSubscriber(recordVideo);

save.onclick = () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
};

//update label
const locationLabel = document.querySelector('.location');
window.rContext.saveResultMetaData.onSuccess((filePath) => {
    locationLabel.textContent = filePath;
});




