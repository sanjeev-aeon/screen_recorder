const video = document.querySelector('video');
const stopRecButton = document.querySelector('.button-stop');
const save = document.querySelector('.button-save');
const selectScreenButton = document.querySelector('.button-select-screen');
selectScreenButton.onclick = window.rContext.showContextMenu;


function handleStream(stream) {
    video.srcObject = stream
    video.onloadedmetadata = () => video.play()
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



