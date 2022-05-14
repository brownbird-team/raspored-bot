// Dodaj prefix whatsapp kod ispisa u konzolu
exports.wapLog = (text) => {
    console.log("[\u001b[32mWhatsApp\033[00m] " + text);
}