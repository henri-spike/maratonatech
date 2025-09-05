document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('loginSection');
  const wordsSection = document.getElementById('wordsSection');
  const passwordInput = document.getElementById('passwordInput');
  const loginButton = document.getElementById('loginButton');
  const wordList = document.getElementById('wordList');
  const saveButton = document.getElementById('saveButton');

  const correctPassword = 'nestor2a';

  loginButton.addEventListener('click', () => {
    if (passwordInput.value === correctPassword) {
      loginSection.style.display = 'none';
      wordsSection.style.display = 'block';
      loadWords();
    } else {
      alert('Senha incorreta!');
    }
  });

  function loadWords() {
    // Carrega as palavras salvas
    chrome.storage.sync.get(['blockedWords'], (result) => {
      if (result.blockedWords) {
        wordList.value = result.blockedWords.join(', ');
      }
    });
  }

  // Salva as novas palavras
  saveButton.addEventListener('click', () => {
    const words = wordList.value.split(',').map(word => word.trim()).filter(word => word.length > 0);
    chrome.storage.sync.set({ blockedWords: words }, () => {
      alert('Palavras salvas!');
      // Recarrega a aba ativa para aplicar as novas palavras
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
});
