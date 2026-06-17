const filename = document.getElementById('filename');
const logContent = document.getElementById('logContent');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
let currentContent = '';
let currentFilename = '';

const REPO = 'nextprofession5/SecurityCheckUpload';
const BRANCH = 'main';

async function loadContent() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        filename.textContent = 'No file specified';
        logContent.textContent = 'Invalid URL. Please upload a file first.';
        return;
    }

    try {
        const path = `uploads/${id}.txt`;
        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`);

        if (!response.ok) {
            throw new Error('File not found');
        }

        const data = await response.json();
        const content = atob(data.content);
        
        filename.textContent = `SecurityCheck Log - ${id}.txt`;
        logContent.textContent = content;
        currentContent = content;
        currentFilename = `${id}.txt`;
    } catch (error) {
        filename.textContent = 'Error';
        logContent.textContent = 'Failed to load file. It may not exist or has been deleted.';
    }
}

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        copyBtn.textContent = 'COPIED!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = 'COPY LINK';
            copyBtn.classList.remove('copied');
        }, 2000);
    });
});

loadContent();

downloadBtn.addEventListener('click', () => {
    if (!currentContent) return;
    const blob = new Blob([currentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename || 'log.txt';
    a.click();
    URL.revokeObjectURL(url);
});
