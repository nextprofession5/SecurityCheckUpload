const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const status = document.getElementById('status');

const GITHUB_TOKEN = localStorage.getItem('gh_token') || prompt('Enter your GitHub token:');
if (GITHUB_TOKEN) localStorage.setItem('gh_token', GITHUB_TOKEN);
const REPO = 'nextprofession5/SecurityCheckUpload';
const BRANCH = 'main';

let selectedFile = null;

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    selectedFile = file;
    document.querySelector('.filename').textContent = file.name;
    document.querySelector('.select-text').textContent = 'File Selected';
    status.textContent = '';
    status.className = 'status';
}

function generateId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

async function uploadFile() {
    if (!selectedFile) {
        status.textContent = 'Please select a file first';
        status.className = 'status error';
        return;
    }

    uploadBtn.disabled = true;
    status.textContent = 'Uploading...';
    status.className = 'status';

    try {
        const content = await readFileAsBase64(selectedFile);
        const id = generateId();
        const path = `uploads/${id}.txt`;

        const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload SecurityCheck Log: ${id}`,
                content: content,
                branch: BRANCH
            })
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        window.location.href = `view.html?id=${id}`;
    } catch (error) {
        status.textContent = 'Upload failed. Please try again.';
        status.className = 'status error';
        uploadBtn.disabled = false;
    }
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

uploadBtn.addEventListener('click', uploadFile);
