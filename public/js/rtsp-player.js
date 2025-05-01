// Status constants
var SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
var STREAM_STATUS = Flashphoner.constants.STREAM_STATUS;
var session;
var stream;
var PRELOADER_URL = "https://github.com/flashphoner/flashphoner_client/raw/wcs_api-2.0/examples/demo/dependencies/media/preloader.mp4";

// Init Flashphoner API on page load
function init_api() {
    Flashphoner.init({});
    
    // Connect to WCS server over websockets
    session = Flashphoner.createSession({
        urlServer: "wss://demo.flashphoner.com:8443"
    }).on(SESSION_STATUS.ESTABLISHED, function(session) {
        console.log("Connection ESTABLISHED");
        updateStatus("Connected to streaming server", "success");
    }).on(SESSION_STATUS.DISCONNECTED, function() {
        console.log("Connection DISCONNECTED");
        updateStatus("Disconnected from server", "danger");
    }).on(SESSION_STATUS.FAILED, function() {
        console.log("Connection FAILED");
        updateStatus("Connection failed", "danger");
    });

    // Add click handlers
    document.getElementById('playBtn').onclick = playClick;
    document.getElementById('stopBtn').onclick = stopStream;
}

// Detect browser
var Browser = {
    isSafari: function() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
}

function updateStatus(message, type) {
    const statusEl = document.getElementById('stream-status');
    statusEl.className = `status-badge bg-${type}`;
    statusEl.innerHTML = `<i class="bi bi-circle-fill me-2"></i>${message}`;
}

function toggleControls(isPlaying) {
    document.getElementById('playBtn').style.display = isPlaying ? 'none' : 'inline-block';
    document.getElementById('stopBtn').style.display = isPlaying ? 'inline-block' : 'none';
}

function playClick() {
    if (Browser.isSafari()) {
        Flashphoner.playFirstVideo(document.getElementById("play"), true, PRELOADER_URL).then(function() {
            playStream();
        });
    } else {
        playStream();
    }
}

function playStream() {
    if (stream) {
        stream.stop();
    }

    stream = session.createStream({
        name: "rtsp://admin:akilicamera@154.70.45.143:554/mode=real&idc=1&ids=1",
        display: document.getElementById("play")
    }).on(STREAM_STATUS.PENDING, function(stream) {
        console.log("Stream pending...");
        updateStatus("Stream connecting...", "warning");
    }).on(STREAM_STATUS.PLAYING, function(stream) {
        console.log("Stream playing");
        updateStatus("Stream active", "success");
        toggleControls(true);
    }).on(STREAM_STATUS.STOPPED, function() {
        console.log("Stream stopped");
        updateStatus("Stream stopped", "secondary");
        toggleControls(false);
    }).on(STREAM_STATUS.FAILED, function(stream) {
        console.log("Stream failed", stream.getInfo());
        updateStatus("Stream failed: " + stream.getInfo(), "danger");
        toggleControls(false);
    });

    stream.play();
}

function stopStream() {
    if (stream) {
        stream.stop();
    }
} 