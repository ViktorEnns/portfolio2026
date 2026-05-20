/**
 * Viktor Enns - Portfolio Page Application Script
 * Orchestrates dynamic QR code generation, interactive configuration controls, and printing.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // DOM ELEMENTS
    // ----------------------------------------------------------------------
    const qrUrlInput = document.getElementById('qr-url-input');
    const qrCodeContainer = document.getElementById('qrcode');
    const customizerPanel = document.getElementById('customizer');
    const togglePanelBtn = document.getElementById('toggle-panel-btn');
    const printBtn = document.getElementById('print-btn');
    
    // Toggles & Checkboxes
    const focusRadioBtns = document.querySelectorAll('input[name="focus-toggle"]');
    const togglePortraitCheck = document.getElementById('toggle-portrait');
    const toggleCompetenciesCheck = document.getElementById('toggle-competencies');
    const toggleEducationCheck = document.getElementById('toggle-education');
    
    // Layout target containers
    const uxFocusBlock = document.getElementById('ux-focus-block');
    const photoFocusBlock = document.getElementById('photo-focus-block');
    const profilePortraitBox = document.getElementById('profile-portrait-box');
    const competenciesBox = document.getElementById('competencies-box');
    const educationBox = document.getElementById('education-box');

    // ----------------------------------------------------------------------
    // DYNAMIC QR CODE GENERATOR
    // ----------------------------------------------------------------------
    let qrInstance = null;

    /**
     * Initializes or updates the QR code with the provided URL
     * @param {string} url - The URL to encode in the QR Code
     */
    function updateQRCode(url) {
        if (!url) return;
        
        // Clean URL whitespace
        const targetUrl = url.trim();

        // Clear existing QR code contents
        qrCodeContainer.innerHTML = '';

        try {
            // Generate QR Code using the CDN library
            qrInstance = new QRCode(qrCodeContainer, {
                text: targetUrl,
                width: 140,
                height: 140,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H // High error correction for best print scanning
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            // Fallback content in case library fails
            qrCodeContainer.innerHTML = `<span style="font-size: 10px; color: red; text-align: center;">QR-Fehler</span>`;
        }
    }

    // Initialize with default LinkedIn profile URL
    updateQRCode(qrUrlInput.value);

    // Event listener for URL input change (generates live preview)
    qrUrlInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.startsWith('http://') || value.startsWith('https://')) {
            updateQRCode(value);
        }
    });

    // ----------------------------------------------------------------------
    // INTERACTIVE CUSTOMIZER PANEL CONTROLS
    // ----------------------------------------------------------------------
    
    // Expand layout padding by default when customizer is open
    document.body.classList.add('customizer-expanded');

    // Collapse / Expand Toggle
    togglePanelBtn.addEventListener('click', () => {
        customizerPanel.classList.toggle('collapsed');
        document.body.classList.toggle('customizer-expanded');
    });

    // Portfolio Focus Toggles (All vs UX vs Photography)
    focusRadioBtns.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const focusValue = e.target.value;
            
            if (focusValue === 'all') {
                uxFocusBlock.style.display = 'block';
                photoFocusBlock.style.display = 'block';
            } else if (focusValue === 'ux') {
                uxFocusBlock.style.display = 'block';
                photoFocusBlock.style.display = 'none';
            } else if (focusValue === 'photo') {
                uxFocusBlock.style.display = 'none';
                photoFocusBlock.style.display = 'block';
            }
        });
    });

    // Sidebar Portrait Visibility
    togglePortraitCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            profilePortraitBox.style.display = 'flex';
        } else {
            profilePortraitBox.style.display = 'none';
        }
    });

    // Competencies/Methods Visibility
    toggleCompetenciesCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            competenciesBox.style.display = 'block';
        } else {
            competenciesBox.style.display = 'none';
        }
    });

    // Education Section Visibility
    toggleEducationCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            educationBox.style.display = 'block';
        } else {
            educationBox.style.display = 'none';
        }
    });

    // ----------------------------------------------------------------------
    // PRINT ACTION TRIGGER
    // ----------------------------------------------------------------------
    printBtn.addEventListener('click', () => {
        // Short timeout to ensure active classes align
        setTimeout(() => {
            window.print();
        }, 150);
    });
});
