/**
 * Viktor Enns - Portfolio Page Application Script
 * Initializes the static LinkedIn QR code and handles print actions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const qrCodeContainer = document.getElementById('qrcode');
    const printBtn = document.getElementById('print-portfolio-btn');

    // ----------------------------------------------------------------------
    // STATIC QR CODE GENERATOR (Points to LinkedIn)
    // ----------------------------------------------------------------------
    function initQRCode() {
        if (!qrCodeContainer) return;
        
        const targetUrl = "https://www.linkedin.com/in/uxviktorenns/";
        qrCodeContainer.innerHTML = '';

        try {
            new QRCode(qrCodeContainer, {
                text: targetUrl,
                width: 170,
                height: 170,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H // High error correction for reliable scanning
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            qrCodeContainer.innerHTML = `<span style="font-size: 10px; color: red; text-align: center;">QR-Fehler</span>`;
        }
    }

    initQRCode();

    // ----------------------------------------------------------------------
    // PRINT ACTION TRIGGER
    // ----------------------------------------------------------------------
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
