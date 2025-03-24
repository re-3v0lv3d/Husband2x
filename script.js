document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const originalCanvas = document.getElementById('originalCanvas');
    const scaledCanvas = document.getElementById('scaledCanvas');
    const scaleFactorSelect = document.getElementById('scaleFactor');
    const scaleButton = document.getElementById('scaleButton');
    const downloadLink = document.getElementById('downloadLink');

    let originalImage = null;

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    originalImage = img;
                    drawOriginalImage();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    scaleButton.addEventListener('click', () => {
        if (originalImage) {
            scaleImage();
        }
    });

    function drawOriginalImage() {
        const ctx = originalCanvas.getContext('2d');
        originalCanvas.width = originalImage.width;
        originalCanvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);
    }

    function scaleImage() {
        const scaleFactor = parseInt(scaleFactorSelect.value);
        const newWidth = originalCanvas.width * scaleFactor;
        const newHeight = originalCanvas.height * scaleFactor;

        scaledCanvas.width = newWidth;
        scaledCanvas.height = newHeight;

        const pica = window.pica();

        pica.resize(originalCanvas, scaledCanvas, {
            quality: 3,
            unsharpAmount: 160,
            unsharpRadius: 0.6,
            unsharpThreshold: 1,
        })
        .then(() => {
            const scaledImageDataUrl = scaledCanvas.toDataURL('image/png');
            downloadLink.href = scaledImageDataUrl;
            downloadLink.download = 'scaled-image.png';
            console.log('URL de datos (pica):', scaledImageDataUrl);
        })
        .catch(err => {
            console.error("Error al escalar la imagen:", err);
        });
    }
});
