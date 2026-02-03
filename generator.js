// Generator page logic

const nameInput = document.getElementById('nameInput');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const generatedLink = document.getElementById('generatedLink');
const copyBtn = document.getElementById('copyBtn');
const newLinkBtn = document.getElementById('newLinkBtn');

// Generate link when button is clicked
generateBtn.addEventListener('click', generateLink);

// Also generate on Enter key
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateLink();
    }
});

// Enable/disable button based on input
nameInput.addEventListener('input', () => {
    const name = nameInput.value.trim();
    generateBtn.disabled = name.length === 0;
});

function generateLink() {
    const name = nameInput.value.trim();

    if (!name) {
        alert('Por favor, introduce un nombre');
        return;
    }

    // Get base URL (works both locally and on GitHub Pages)
    const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');

    // Encode name to Base64 (supporting UTF-8 characters)
    const encodedName = btoa(unescape(encodeURIComponent(name)));

    // Create personalized URL with encoded name (using 'v' for 'value' to be more opaque)
    const personalizedUrl = `${baseUrl}proposal.html?v=${encodedName}`;

    // Show result section
    resultSection.style.display = 'block';
    generatedLink.value = personalizedUrl;

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Copy link to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(generatedLink.value);

        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ ¡Copiado!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        generatedLink.select();
        document.execCommand('copy');

        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ ¡Copiado!';

        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }
});

// Create new link
newLinkBtn.addEventListener('click', () => {
    nameInput.value = '';
    resultSection.style.display = 'none';
    nameInput.focus();
    generateBtn.disabled = true;
});

// Focus input on load
nameInput.focus();
