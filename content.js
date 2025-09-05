let blockedWords = [];

// Carrega as palavras bloqueadas do armazenamento
chrome.storage.sync.get(['blockedWords'], (result) => {
  if (result.blockedWords) {
    blockedWords = result.blockedWords;
    blockWords(document.body);
  }
});

// Ouve por mudanças nas palavras bloqueadas
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedWords) {
    blockedWords = changes.blockedWords.newValue;
    // Idealmente, você re-processaria a página aqui.
    // Por simplicidade, vamos apenas recarregar a página.
    window.location.reload();
  }
});

function blockWords(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let content = node.textContent;
    blockedWords.forEach(word => {
      // Usando uma expressão regular para substituir apenas palavras inteiras, ignorando maiúsculas e minúsculas.
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      content = content.replace(regex, '***');
    });
    node.textContent = content;
  } else {
    for (let i = 0; i < node.childNodes.length; i++) {
      blockWords(node.childNodes[i]);
    }
  }
}

// Observa mudanças no DOM para bloquear conteúdo carregado dinamicamente
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes) {
      mutation.addedNodes.forEach((node) => {
        blockWords(node);
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Executa o bloqueio inicial
blockWords(document.body);