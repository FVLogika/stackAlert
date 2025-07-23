(function ($) {
  function injectStyles() {
    if ($('#stackAlertStyles').length) return; // evita duplicati

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

    $('<style>', {
      id: 'stackAlertStyles',
      type: 'text/css',
      text: css
    }).appendTo('head');
  }

  $.fn.stackAlert = function (options) {
    injectStyles(); // 👈 inietta il CSS una sola volta

    const settings = $.extend({
      message: 'Alert generico',
      type: 'info',
      timeout: 5000,
      position: 'top-right'
    }, options);

    const icons = {
      info: 'fa-circle-info',
      success: 'fa-circle-check',
      warning: 'fa-triangle-exclamation',
      danger: 'fa-circle-exclamation'
    };

    const alertId = 'alert-' + Date.now();
    const containerId = 'alert-stack-' + settings.position;
    let $container = $('#' + containerId);

    if (!$container.length) {
      const positions = {
        'top-right': { top: '20px', right: '20px' },
        'bottom-right': { bottom: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' }
      };
      const posStyle = positions[settings.position];
      $container = $('<div>', {
        id: containerId,
        css: $.extend({ position: 'fixed', zIndex: 1050 }, posStyle)
      }).appendTo('body');
    }

    const alertHtml = `
      <div id="${alertId}" class="alert alert-${settings.type} alert-dismissible fade show alert-pro" role="alert" style="margin-bottom: 10px;">
        <i class="fa-solid ${icons[settings.type]} me-2"></i>
        ${settings.message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Chiudi"></button>
      </div>
    `;

    $container.append(alertHtml);

    if (settings.timeout > 0) {
      setTimeout(() => {
        $('#' + alertId).alert('close');
      }, settings.timeout);
    }

    return this;
  };
}(jQuery));
