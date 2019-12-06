const content = document.getElementById('content');
const pageSelector = document.getElementById('page-selector');
const audioContainer = document.getElementById('audio-container');
const audioElement = document.getElementById('audio');
const audioTitle = document.getElementById('audio-title');
const playingIndicator = document.getElementById('playing-indicator');
let indicatorInterval;
let compositionsElement;
let compositionHasBeenPlayed = false;

function loadAudio(url) {
    audioElement.pause();
    audioElement.src = url;
    audioElement.play();
}

async function loadHtml(url) {
    const htmlContent = await fetch(url);
    content.innerHTML = await htmlContent.text();
}

async function loadPage(pageConfig) {
    document.querySelector(`#img-container #${pageConfig.imageId}`).style.opacity = 1;
    document.querySelector(`#img-container img:not(#${pageConfig.imageId})`).style.opacity = 0;
    await loadHtml(pageConfig.html);
    document.body.style.backgroundColor = pageConfig.color;
    window.history.pushState({
        title: pageConfig.title
    },
    '', 
    pageConfig.url);
}

async function loadSoftwareDeveloper() {
    if (audioElement.paused) {
        audioContainer.style.opacity = 0;
    }
    await loadPage({
        imageId: 'developer-img',
        html: 'views/software-developer.html',
        color: '#fbfffa',
        title: 'Software Developer',
        url: '/software-engineer'
    });
}

async function loadMusician() {
    audioContainer.style.opacity = 1;
    await loadPage({
        imageId: 'musician-img',
        html: 'views/musician.html',
        color: '#f8f8f8',
        title: 'Musiciain',
        url: '/musician'
    });
    
    if (!compositionHasBeenPlayed) {
        try {
            audioElement.play();
            compositionHasBeenPlayed = true;
            audioElement.muted = false;
        }
        catch(error) {
            console.error(error);
        }
    }

    compositionsElement = document.getElementById('compositions');
    compositionsElement.addEventListener('click', event => {
        event.preventDefault();
        if (event.target.tagName === 'A') {
            loadAudio(`audio/${event.target.text}.mp3`);
            audioTitle.textContent = event.target.text;
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const location = window.location.pathname.toLowerCase();
    if (location.includes('software')) {
        await loadSoftwareDeveloper();
    }
    else if (location.includes('musician')) {
        compositionHasBeenPlayed = true;
        await loadMusician();
    }
    else {
        history.replaceState({
            title: 'Willie Wrinkle'
        },
        '', 
        '/');
    }
});

window.addEventListener('popstate', async () => {
    if (history.state) {
        if (history.state.title === 'Software Developer') {
            await loadSoftwareDeveloper();
        }
        else if (history.state.title === 'Musician') {
            await loadMusician();
        }
    }
});

pageSelector.addEventListener('click', async event => {
    event.preventDefault();
    if (event.target.tagName === 'A') {
        if (event.target.innerText.toLowerCase().includes('software')) {
            await loadSoftwareDeveloper();
        }
        else {
            await loadMusician();
        }
    }
});

audioElement.addEventListener('play', () => {
    indicatorInterval = setInterval(() => {
        if (playingIndicator.textContent.length < 3) {
            playingIndicator.textContent = playingIndicator.textContent + '.';
        }
        else {
            playingIndicator.textContent = '';
        }
    }, 500);
});

audioElement.addEventListener('pause', () => {
    clearInterval(indicatorInterval);
    playingIndicator.textContent = '';
});
