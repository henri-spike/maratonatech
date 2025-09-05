let blockedWords = [];
let blockedSites = [];

// Função principal que inicia o bloqueio
function startBlocking() {
  chrome.storage.sync.get(['blockedWords', 'blockedSites'], (result) => {
    blockedWords = result.blockedWords || [];
    blockedSites = result.blockedSites || [];

    // 1. Bloquear o site inteiro, se necessário
    if (isSiteBlocked(window.location.hostname, blockedSites)) {
      document.body.innerHTML = '<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; z-index: 9999; display: flex; justify-content: center; align-items: center; font-size: 2em;">Este site está bloqueado.</div>';
      return; // Para a execução se o site estiver bloqueado
    }

    // 2. Se o site não estiver bloqueado, continue para bloquear palavras e links
    blockContent(document.body);

    // Observa mudanças no DOM para bloquear conteúdo carregado dinamicamente
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            blockContent(node);
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Verifica se o domínio do site está na lista de bloqueio
function isSiteBlocked(currentHost, sitesToBlock) {
  for (const site of sitesToBlock) {
    if (currentHost.includes(site)) {
      return true;
    }
  }
  return false;
}

// Função que bloqueia palavras e links
function blockContent(node) {
  // Bloqueia palavras em nós de texto
  if (node.nodeType === Node.TEXT_NODE) {
    let content = node.textContent;
    blockedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      content = content.replace(regex, '***');
    });
    node.textContent = content;
  }
  // Bloqueia links (tags <a>)
  else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'A' && node.href) {
      if (isSiteBlocked(node.hostname, blockedSites)) {
        node.style.display = 'none'; // Oculta o link
      }
    }
    // Processa os filhos do nó recursivamente
    for (let i = 0; i < node.childNodes.length; i++) {
      blockContent(node.childNodes[i]);
    }
  }
}

// Ouve por mudanças no armazenamento para recarregar a página
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedWords || changes.blockedSites) {
    window.location.reload();
  }
});

// Inicia todo o processo
startBlocking();