document.addEventListener('DOMContentLoaded', () => {
  const wordList = document.getElementById('wordList');
  const saveButton = document.getElementById('saveButton');

  // Carrega as palavras salvas
  chrome.storage.sync.get(['blockedWords'], (result) => {
    if (result.blockedWords) {
      wordList.value = result.blockedWords.join(', ');
    }
  });

  // Salva as novas palavras
  saveButton.addEventListener('click', () => {
    const words = wordList.value.split(',').map(word => word.trim()).filter(word => word.length > 0);
    chrome.storage.sync.set({ blockedWords: words }, () => {
      alert('Palavras salvas!');
      // Recarrega a aba ativa para aplicar as novas palavras
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  });
});
