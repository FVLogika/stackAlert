/*!
 * stackAlert.js
 * Plugin jQuery per alert impilati "fixed" con Bootstrap 5 + Font Awesome
 * Creato da FVLogika ✨
 */

(function ($) {
  // 🔗 Inietta gli stili "pro" solo una volta
  function injectStyles() {
    if ($('#stackAlertStyles').length) return;

    const css = `
      .alert-pro {
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        border-left: 5px solid #ccc;
        animation: slideIn 0.5s ease-out;
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;

    $('<style>', {
      id: 'stackAlertStyles',
      type: 'text/css',
      text: css
    }).appendTo('head');
  }

  // 🧩 Plugin principale
  $.fn.stackAlert = function () {
    injectStyles();

    // ⚙️ Configurazioni di default
    const defaults = {
      message:  'Alert generico',
      type:     'info',
      timeout:  5000,
      position: 'top-right'
    };

    let settings;

    // 📦 Supporta 1-4 parametri shorthand (string + opzionali)
    if (typeof arguments[0] === 'string') {
      settings = {
        message:  arguments[0],
        type:     arguments.length > 1 ? arguments[1] : defaults.type,
        timeout:  arguments.length > 2 ? arguments[2] : defaults.timeout,
        position: arguments.length > 3 ? arguments[3] : defaults.position
      };
    } else {
      // 🔧 Configurazione via oggetto
      settings = $.extend({}, defaults, arguments[0]);
    }

    // 🎨 Icone Font Awesome per ciascun tipo
    const icons = {
      info:    'fa-circle-info',
      success: 'fa-circle-check',
      warning: 'fa-triangle-exclamation',
      danger:  'fa-circle-exclamation'
    };

    // 🧱 Contenitore dinamico in base alla posizione
    const alertId     = 'alert-' + Date.now();
    const containerId = 'alert-stack-' + settings.position;
    let $container    = $('#' + containerId);

    // 📐 Mappa delle posizioni supportate
    const positions = {
      'top-right':     { top: '20px', right: '20px' },
      'bottom-right':  { bottom: '20px', right: '20px' },
      'top-left':      { top: '20px', left: '20px' },
      'bottom-left':   { bottom: '20px', left: '20px' },
      'top-center':    { top: '20px', left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
    };

    // 🎯 Crea contenitore se non esiste ancora
    if (!$container.length) {
      $container = $('<div>', {
        id: containerId,
        css: $.extend({
          position: 'fixed',
          zIndex: 1050,
          minWidth: '25%'
        }, positions[settings.position])
      }).appendTo('body');

      // 📌 Se è centrato, applica trasformazione
      if (positions[settings.position].transform) {
        $container.css('transform', positions[settings.position].transform);
      }
    }

    // 📦 HTML dell’alert con Bootstrap + Font Awesome
    const alertHtml = `
      <div id="${alertId}" class="alert alert-${settings.type} alert-dismissible fade show alert-pro" role="alert" style="margin-bottom: 10px;">
        <i class="fa-solid ${icons[settings.type]} me-2"></i>
        ${settings.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Chiudi"></button>
      </div>
    `;

    // ➕ Aggiunge alert al contenitore
    $container.append(alertHtml);

    // ⏱️ Chiusura automatica (se timeout > 0)
    if (settings.timeout > 0) {
      setTimeout(() => {
        $('#' + alertId).alert('close');
      }, settings.timeout);
    }

    return this;
  };
}(jQuery));
