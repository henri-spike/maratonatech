document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('loginSection');
  const wordsSection = document.getElementById('wordsSection');
  const passwordInput = document.getElementById('passwordInput');
  const loginButton = document.getElementById('loginButton');
  
  const wordList = document.getElementById('wordList');
  const saveWordsButton = document.getElementById('saveWordsButton');
  
  const siteList = document.getElementById('siteList');
  const saveSitesButton = document.getElementById('saveSitesButton');

  const correctPassword = 'nestor2a';

  loginButton.addEventListener('click', () => {
    if (passwordInput.value === correctPassword) {
      loginSection.style.display = 'none';
      wordsSection.style.display = 'block';
      loadData();
    } else {
      alert('Senha incorreta!');
    }
  });

  function loadData() {
    // Carrega as palavras e sites salvos
    chrome.storage.sync.get(['blockedWords', 'blockedSites'], (result) => {
      if (result.blockedWords) {
        wordList.value = result.blockedWords.join(', ');
      }
      if (result.blockedSites) {
        siteList.value = result.blockedSites.join(', ');
      }
    });
  }

  // Salva as novas palavras
  saveWordsButton.addEventListener('click', () => {
    const words = wordList.value.split(',').map(word => word.trim()).filter(word => word.length > 0);
    chrome.storage.sync.set({ blockedWords: words }, () => {
      alert('Palavras salvas!');
      reloadActiveTab();
    });
  });

  // Salva os novos sites
  saveSitesButton.addEventListener('click', () => {
    const sites = siteList.value.split(',').map(site => site.trim()).filter(site => site.length > 0);
    chrome.storage.sync.set({ blockedSites: sites }, () => {
      alert('Sites salvos!');
      reloadActiveTab();
    });
  });

  function reloadActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
});
