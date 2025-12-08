// ==========================================
// BLUESTIFT - PDF VIEWER SYSTEM (CONDITIONAL)
// Version 3.0 - WITH OFFICIAL vs COMMUNITY DIFFERENTIATION
// ==========================================

/**
 * 🎯 FONCTION PRINCIPALE : Ouvrir un document (PDF, images, etc.)
 * @param {string} url - URL du document (Google Drive preview link)
 * @param {string} title - Titre du document
 * @param {string} mimeType - Type MIME du fichier (optionnel)
 * @param {string} docSource - Source: 'official' ou 'community' (NEW!)
 */
function openPDFViewer(url, title, mimeType, docSource = 'official') {
  openDocumentViewer(url, title, mimeType, docSource);
}

/**
 * 📱 OUVRIR LE VIEWER DE DOCUMENT (tous types de fichiers)
 * @param {string} url - URL du document
 * @param {string} title - Titre du document
 * @param {string} mimeType - Type MIME (optionnel)
 * @param {string} docSource - 'official' ou 'community' (NEW!)
 */
function openDocumentViewer(url, title, mimeType, docSource = 'official') {
  // Supprimer viewer existant
  const existing = document.getElementById('document-viewer-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'document-viewer-modal';
  modal.className = 'pdf-viewer-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.95);
    z-index: 10005;
    display: flex;
    flex-direction: column;
  `;
  
  const fileIcon = getDocumentIcon(mimeType, title);
  
  // 🔑 CONDITION: Afficher ou non le bouton "Open in Drive"
  const showOpenInDriveButton = docSource !== 'official';
  
  // 🔑 CONDITION: Footer message selon la source
  const footerMessage = docSource === 'official' 
    ? 'This is an official Bluestift document. Redistribution is not permitted.'
    : 'Bluestift Community Library, Copyright 2025.';
  
  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="display: flex; align-items: center; gap: 15px;">
        <span style="font-size: 2.5rem;">${fileIcon}</span>
        <div>
          <h3 style="margin: 0; font-size: 1.3rem;">${title || 'Document'}</h3>
          <p style="margin: 5px 0 0 0; font-size: 0.9rem; opacity: 0.9;">
            ${mimeType ? getFileTypeLabel(mimeType) : 'Document'}
          </p>
        </div>
      </div>
      <div style="display: flex; gap: 10px;">
        ${showOpenInDriveButton ? `
          <button onclick="window.open('${url.replace(/\/preview$/, '/view')}', '_blank')" 
                  style="background: rgba(255,255,255,0.2); color: white; border: 2px solid white; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: all 0.3s ease;">
            <i class="fas fa-external-link-alt"></i> Open in Drive
          </button>
        ` : ''}
        <button onclick="closePDFViewer()" 
                style="background: rgba(239, 68, 68, 0.9); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>
    <div style="flex: 1; background: #000; display: flex; align-items: center; justify-content: center; position: relative;">
      <iframe src="${url}" 
              style="width: 100%; height: 100%; border: none; background: white;"
              sandbox="allow-scripts allow-same-origin"
              allowfullscreen>
      </iframe>
      
      <!-- Loading Overlay -->
      <div id="loading-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; z-index: 10;">
        <div style="font-size: 3rem; margin-bottom: 20px; animation: spin 1s linear infinite;">
          <i class="fas fa-spinner"></i>
        </div>
        <p style="font-size: 1.2rem; font-weight: 600;">Loading document...</p>
        <p style="font-size: 0.9rem; opacity: 0.7; margin-top: 10px;">Please wait</p>
      </div>
      
      <!-- Watermark (protection visuelle) -->
      <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(0, 0, 0, 0.7); color: white; padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; pointer-events: none; opacity: 0.6; z-index: 5;">
        <span class="notranslate">Bluestift Document</span>
      </div>
    </div>
    
    <!-- Footer info (CONDITIONNEL) -->
    <div style="padding: 15px 25px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="margin: 0; font-size: 0.9rem; color: #666;">
        <i class="fas fa-info-circle" style="color: #2563eb; margin-right: 5px;"></i>
        ${footerMessage}
      </p>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Désactiver le scroll du body
  document.body.style.overflow = 'hidden';
  
  // Cacher le loading après 2.5 secondes
  setTimeout(() => {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
      loading.style.transition = 'opacity 0.5s ease';
      loading.style.opacity = '0';
      setTimeout(() => loading.remove(), 500);
    }
  }, 2500);
  
  // Fermer avec Escape
  const closeHandler = (e) => {
    if (e.key === 'Escape') {
      closePDFViewer();
      document.removeEventListener('keydown', closeHandler);
    }
  };
  document.addEventListener('keydown', closeHandler);
  
  // Hover effects sur les boutons
  const buttons = modal.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = 'none';
    });
  });
  
  // 📊 Tracking
  console.log(`📄 Document opened: ${title} [${docSource}]`);
}

/**
 * ❌ FERMER LE VIEWER
 */
function closePDFViewer() {
  const modal = document.getElementById('document-viewer-modal');
  if (modal) {
    // Animation de sortie
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.remove();
      // Réactiver le scroll
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

/**
 * 📥 OUVRIR UN PDF TÉLÉCHARGEABLE (pour bibliothèque communautaire)
 * @param {string} pdfUrl - URL du PDF (Google Drive download link)
 * @param {string} title - Titre du document
 */
function openDownloadablePDF(pdfUrl, title) {
  // Créer un modal avec options READ ou DOWNLOAD
  let downloadModal = document.getElementById('pdf-download-modal');
  
  if (!downloadModal) {
    downloadModal = createDownloadPDFModal();
    document.body.appendChild(downloadModal);
  }
  
  const titleElement = downloadModal.querySelector('#pdf-download-title');
  const readBtn = downloadModal.querySelector('#read-pdf-btn');
  const downloadBtn = downloadModal.querySelector('#download-pdf-btn');
  
  titleElement.textContent = title;
  
  // Bouton READ → Ouvre le viewer (avec docSource = 'community')
  readBtn.onclick = () => {
    closeDownloadModal();
    // Transformer l'URL en mode preview
    const previewUrl = pdfUrl.replace('/view', '/preview').replace('export=download', 'preview');
    openDocumentViewer(previewUrl, title, 'application/pdf', 'community'); // ✅ docSource = 'community'
  };
  
  // Bouton DOWNLOAD → Télécharge directement
  downloadBtn.onclick = () => {
    window.open(pdfUrl, '_blank');
    closeDownloadModal();
  };
  
  downloadModal.style.display = 'flex';
}

/**
 * 🗂️ CRÉER LE MODAL DE CHOIX (Read ou Download)
 */
function createDownloadPDFModal() {
  const modal = document.createElement('div');
  modal.id = 'pdf-download-modal';
  modal.className = 'pdf-download-modal';
  
  modal.innerHTML = `
    <div class="pdf-download-content">
      <span class="close-download-modal" onclick="closeDownloadModal()">&times;</span>
      
      <div class="pdf-icon-large">
        <i class="fas fa-file-pdf"></i>
      </div>
      
      <h3 id="pdf-download-title">Document Title</h3>
      <p>What would you like to do with this document?</p>
      
      <div class="pdf-action-buttons">
        <button id="read-pdf-btn" class="btn-read">
          <i class="fas fa-eye"></i>
          Read Online
        </button>
        <button id="download-pdf-btn" class="btn-download">
          <i class="fas fa-download"></i>
          Download PDF
        </button>
      </div>
    </div>
  `;
  
  return modal;
}

/**
 * ❌ FERMER LE MODAL DE CHOIX
 */
function closeDownloadModal() {
  const modal = document.getElementById('pdf-download-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * 🎨 ICÔNE DU DOCUMENT
 */
function getDocumentIcon(mimeType, title) {
  if (!mimeType && title) {
    const ext = title.split('.').pop().toLowerCase();
    const icons = {
      'pdf': '📕',
      'doc': '📘', 'docx': '📘',
      'xls': '📊', 'xlsx': '📊',
      'ppt': '📊', 'pptx': '📊',
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
      'mp4': '🎥', 'avi': '🎥',
      'mp3': '🎵', 'wav': '🎵',
      'zip': '📦', 'rar': '📦'
    };
    return icons[ext] || '📄';
  }
  
  if (!mimeType) return '📄';
  
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📘';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  
  return '📄';
}

/**
 * 🏷️ LABEL DU TYPE DE FICHIER
 */
function getFileTypeLabel(mimeType) {
  if (!mimeType) return 'Document';
  
  if (mimeType.includes('pdf')) return 'PDF Document';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'Word Document';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Excel Spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'PowerPoint Presentation';
  if (mimeType.includes('image')) return 'Image';
  if (mimeType.includes('video')) return 'Video';
  if (mimeType.includes('audio')) return 'Audio';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
  
  return 'Document';
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Fermer en cliquant à l'extérieur
window.addEventListener('click', (e) => {
  const modal = document.getElementById('document-viewer-modal');
  const downloadModal = document.getElementById('pdf-download-modal');
  
  if (e.target === modal) {
    closePDFViewer();
  }
  
  if (e.target === downloadModal) {
    closeDownloadModal();
  }
});

// ==========================================
// PROTECTION BASIQUE
// ==========================================

/**
 * 🛡️ Désactiver le clic droit sur le viewer PDF
 */
function initPDFProtection() {
  document.addEventListener('contextmenu', (e) => {
    const modal = document.getElementById('document-viewer-modal');
    if (modal && modal.contains(e.target)) {
      e.preventDefault();
      if (typeof showNotification === 'function') {
        showNotification('⚠️ Right-click is disabled for official documents', 'info');
      }
      return false;
    }
  });
  
  // Désactiver certains raccourcis clavier
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('document-viewer-modal');
    if (modal && modal.style.display !== 'none') {
      // Désactiver Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (typeof showNotification === 'function') {
          showNotification('⚠️ Download is disabled for official documents', 'info');
        }
        return false;
      }
      
      // Désactiver Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (typeof showNotification === 'function') {
          showNotification('⚠️ Printing is disabled for official documents', 'info');
        }
        return false;
      }
    }
  });
}

// Initialiser la protection au chargement
document.addEventListener('DOMContentLoaded', () => {
  initPDFProtection();
});

// ==========================================
// ANALYTICS (Optionnel)
// ==========================================

/**
 * 📊 Tracker l'ouverture d'un document
 * @param {string} docTitle - Titre du document
 * @param {string} docType - Type: 'official' ou 'community'
 */
function trackDocumentView(docTitle, docType) {
  console.log(`[Analytics] Document viewed: ${docTitle} (${docType})`);
  
  // Plus tard avec Firebase :
  // firebase.database().ref('analytics/document_views').push({
  //   title: docTitle,
  //   type: docType,
  //   timestamp: Date.now()
  // });
}

// ==========================================
// ANIMATIONS CSS (inline pour compatibilité)
// ==========================================

// Ajouter les animations au document
if (!document.getElementById('pdf-viewer-animations')) {
  const style = document.createElement('style');
  style.id = 'pdf-viewer-animations';
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// DEBUGGING
// ==========================================

window.debugPDFViewer = {
  testOfficial: () => {
    openPDFViewer(
      'https://drive.google.com/file/d/1ABC123/preview', 
      'Test Official Doc', 
      'application/pdf',
      'official' // ✅ Pas de bouton "Open in Drive"
    );
  },
  testCommunity: () => {
    openPDFViewer(
      'https://drive.google.com/file/d/1ABC123/preview', 
      'Test Community Doc', 
      'application/pdf',
      'community' // ✅ Avec bouton "Open in Drive" + footer custom
    );
  },
  testImage: () => {
    openDocumentViewer(
      'https://drive.google.com/file/d/1ABC123/preview', 
      'Test Image', 
      'image/jpeg',
      'community'
    );
  }
};

console.log('📄 PDF Viewer System v3.0 loaded!');
console.log('✅ CONDITIONAL RENDERING: Official vs Community');
console.log('💡 Debug: window.debugPDFViewer.testOfficial()');
console.log('💡 Debug: window.debugPDFViewer.testCommunity()');