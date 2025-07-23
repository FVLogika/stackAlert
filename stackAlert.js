/*!
 * stackAlert.js
 * Plugin jQuery per alert impilati "fixed" con Bootstrap 5 + Font Awesome
 * Creato da Flavio ✨
 */
(function ($) {
  // 🧪 Funzione per iniettare lo stile "pro" se non è già presente
  function injectStyles() {
    // Verifica se lo stile è già stato aggiunto
    if ($('#stackAlertStyles').length) return;

    // CSS iniettato dinamicamente (animazione + box shadow)
    const css = `
      .alert-pro {
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        border-left: 5px solid #ccc;
        animation: slideIn 0.5s ease-out;
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;

    // Crea il tag <style> e lo aggiunge al <head>
    $('<style>', {
      id: 'stackAlertStyles',
      type: 'text/css',
      text: css
    }).appendTo('head');
  }

  // 🧩 Plugin principale
  $.fn.stackAlert = function (options) {
    injectStyles(); // Inietta gli stili al primo utilizzo

    // ⚙️ Configurazioni con valori di default
    const settings = $.extend({
      message: 'Alert generico',
      type: 'info',        // Varianti: info, success, warning, danger
      timeout: 5000,       // Tempo in millisecondi (0 = solo chiusura manuale)
      position: 'top-right'// Posizioni: top-right, bottom-right, top-left, bottom-left
    }, options);

    // 🎨 Icone Font Awesome per ciascun tipo
    const icons = {
      info: 'fa-circle-info',
      success: 'fa-circle-check',
      warning: 'fa-triangle-exclamation',
      danger: 'fa-circle-exclamation'
    };

    // 🔠 Genera un ID unico per l'alert
    const alertId = 'alert-' + Date.now();

    // 📦 Contenitore: controlla se esiste già per la posizione scelta
    const containerId = 'alert-stack-' + settings.position;
    let $container = $('#' + containerId);

    if (!$container.length) {
      // Posizioni con coordinate CSS
      const positions = {
        'top-right': { top: '20px', right: '20px' },
        'bottom-right': { bottom: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' }
      };

      // Crea il contenitore e lo aggiunge al <body>
      $container = $('<div>', {
        id: containerId,
        css: $.extend({ position: 'fixed', zIndex: 1050 }, positions[settings.position])
      }).appendTo('body');
    }

    // 🧱 HTML dell’alert con Bootstrap + Font Awesome
    const alertHtml = `
      <div id="${alertId}" class="alert alert-${settings.type} alert-dismissible fade show alert-pro" role="alert" style="margin-bottom: 10px;">
        <i class="fa-solid ${icons[settings.type]} me-2"></i>
        ${settings.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Chiudi"></button>
      </div>
    `;

    // ➕ Aggiunge l’alert al contenitore corrispondente
    $container.append(alertHtml);

    // ⏱️ Chiusura automatica se timeout > 0
    if (settings.timeout > 0) {
      setTimeout(() => {
        $('#' + alertId).alert('close');
      }, settings.timeout);
    }

    // 🔄 Ritorna l'elemento jQuery originale per chaining
    return this;
  };
}(jQuery));
