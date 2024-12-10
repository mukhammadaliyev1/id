const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const resultDiv = document.getElementById('result');
const captureButton = document.getElementById('capture');
const context = canvas.getContext('2d');

// Kamerani ishga tushirish
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error('Kamera yoqilmadi:', error);
    });

// Rasmga olish va OCR ishlatish
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    resultDiv.innerHTML = "<p>Rasm skanerlashda...</p>";

    Tesseract.recognize(
        imageData,  // Skanerlash uchun rasm
        'eng',      // OCR tilini o'rnatish
        { logger: (m) => console.log(m) } // Protsess loglari
    ).then(({ data: { text } }) => {
        resultDiv.innerHTML = `<h3>Natija:</h3><p>${text}</p>`;
    }).catch((error) => {
        console.error('OCR xatosi:', error);
        resultDiv.innerHTML = "<p>Xatolik yuz berdi. Qayta urinib ko'ring.</p>";
    });
});
