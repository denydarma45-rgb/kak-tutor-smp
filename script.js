document.getElementById('sendBtn').addEventListener('click', async () => {
    const apiKeyInput = document.getElementById('apiKey').value.trim();
    const userInputInput = document.getElementById('userInput').value.trim();
    const chatBox = document.getElementById('chatBox');

    if (!apiKeyInput) {
        alert('Mohon masukkan API Key Gemini terlebih dahulu di kotak atas!');
        return;
    }
    if (!userInputInput) return;

    // 1. Tampilkan pesan user di chat box
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.textContent = userInputInput;
    chatBox.appendChild(userDiv);
    
    // Kosongkan kolom input
    document.getElementById('userInput').value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Tampilkan indikator Loading
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.textContent = 'Kak Tutor sedang membaca buku paket... ⚡';
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Perintah Sistem (System Prompt)
    const systemInstruction = `Anda adalah "Kak Tutor", asisten belajar virtual untuk anak SMP kelas 7 di Indonesia. Tugas Anda membantu menjawab seluruh mapel kelas 7 (Matematika, IPA, IPS, Bahasa, dll) sesuai Kurikulum Merdeka. 
    WAJIB JAWAB DENGAN STRUKTUR BERIKUT:
    1. Sebutkan Mata Pelajaran & Bab Buku terkait.
    2. Berikan konsep atau rumus dasarnya dengan bahasa anak SMP.
    3. Berikan langkah pengerjaan/proses logikanya.
    4. Di bagian paling bawah, berikan "Jawaban Akhir" dengan jelas dan dicetak tebal agar siswa bisa mencocokkan hasil kerjanya.
    Jaga bahasa agar ramah dan menyemangati!`;

    try {
        // Menggunakan model gemini-1.5-flash yang sangat stabil untuk web fetch
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeyInput}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemInstruction + "\n\nPertanyaan Siswa: " + userInputInput }]
                }]
            })
        });

        const data = await response.json();
        
        // Hapus tulisan loading
        chatBox.removeChild(loadingDiv);

        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-message';
        
        // Cek apakah ada respon teks dari Google API
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let reply = data.candidates[0].content.parts[0].text;
            // Format teks agar rapi saat tampil di HTML
            botDiv.innerHTML = reply.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else if (data.error) {
            // Jika Google memberikan pesan eror (misal API Key salah)
            botDiv.innerHTML = `<strong>Eror dari Sistem:</strong> ${data.error.message}`;
        } else {
            botDiv.textContent = 'Maaf, Kakak mengalami kendala format data. Coba ulangi lagi ya!';
        }
        
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        if (chatBox.contains(loadingDiv)) {
            chatBox.removeChild(loadingDiv);
        }
        alert('Terjadi kesalahan jaringan atau gagal menghubungi server AI.');
        console.error(error);
    }
});
