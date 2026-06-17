const filename = document.getElementById('filename');
const logContent = document.getElementById('logContent');
const copyBtn = document.getElementById('copyBtn');

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
