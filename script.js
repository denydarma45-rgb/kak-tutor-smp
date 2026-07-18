document.getElementById('sendBtn').addEventListener('click', async () => {
const apiKeyInput = document.getElementById('apiKey').value.trim();
const userInputInput = document.getElementById('userInput').value.trim();
const chatBox = document.getElementById('chatBox');
if (!apiKeyInput) {
alert('Mohon masukkan API Key Gemini terlebih dahulu!');
return;
}
if (!userInputInput) return;
// Tampilkan pesan user di chat box
const userDiv = document.createElement('div');
userDiv.className = 'message user-message';
userDiv.textContent = userInputInput;
chatBox.appendChild(userDiv);
document.getElementById('userInput').value = '';
chatBox.scrollTop = chatBox.scrollHeight;
// Tampilkan indikator Loading Kak Tutor
const loadingDiv = document.createElement('div');
loadingDiv.className = 'message bot-message';
loadingDiv.textContent = 'Kak Tutor sedang membaca buku paket... ';
chatBox.appendChild(loadingDiv);
chatBox.scrollTop = chatBox.scrollHeight;
// Instruksi Khusus (System Prompt) agar AI bertindak menjadi guru pendamping
const systemInstruction = `Anda adalah "Kak Tutor", asisten belajar virtual untuk anak
SMP kelas 7 di Indonesia. Tugas Anda membantu menjawab seluruh mapel kelas 7 (Matematika,
IPA, IPS, Bahasa, dll) sesuai Kurikulum Merdeka.
WAJIB JAWAB DENGAN STRUKTUR BERIKUT:
1. Sebutkan Mata Pelajaran & Bab Buku terkait.

5

2. Berikan konsep atau rumus dasarnya dengan bahasa anak SMP.
3. Berikan langkah pengerjaan/proses logikanya.
4. Di bagian paling bawah, berikan "Jawaban Akhir" dengan jelas dan dicetak tebal agar
siswa bisa mencocokkan hasil kerjanya.
Jaga bahasa agar ramah dan menyemangati!`;
try {
const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/
models/gemini-2.5-flash:generateContent?key=${apiKeyInput}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
contents: [{
parts: [{ text: systemInstruction + "\n\nPertanyaan Siswa: " +
userInputInput }]
}]
})
});
const data = await response.json();
chatBox.removeChild(loadingDiv);
const botDiv = document.createElement('div');
botDiv.className = 'message bot-message';
if (data.candidates && data.candidates[0].content.parts[0].text) {
let reply = data.candidates[0].content.parts[0].text;
// Mengubah baris baru agar rapi di HTML
botDiv.innerHTML = reply.replace(/\n/g, '
').replace(/\*\*(.*?)\*\*/g, '$1');
} else {
botDiv.textContent = 'Maaf, Kakak mengalami kendala saat membaca buku. Coba
ulangi lagi ya!';
}
chatBox.appendChild(botDiv);
chatBox.scrollTop = chatBox.scrollHeight;
} catch (error) {
chatBox.removeChild(loadingDiv);
alert('Terjadi kesalahan koneksi atau API Key salah.');
console.error(error);
}
});
