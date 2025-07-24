/*!
 * stackAlert.js
 * Plugin jQuery per alert impilati "fixed" con Bootstrap 5 + Font Awesome
 * Creato da FVLogika ✨
 */

(function ($) {
	// 🔍 Verifica se una classe CSS esiste nei fogli di stile caricati
	function cssClassExists(selector) {
		for (const sheet of document.styleSheets) {
			try {
				const rules = sheet.cssRules || sheet.rules;
				for (const rule of rules) {
					if (rule.selectorText === selector) {
						return true;
					}
				}
			} catch (e) {
				// Ignora fogli remoti (CORS)
				continue;
			}
		}
		return false;
	}

	// 🔗 Inietta gli stili solo se .alert-pro non è già definita
	function injectStyles() {
		if ($('#stackAlertStyles').length) return;
		if (cssClassExists('.alert-pro')) return;

		const css = `
			.alert-pro {
				box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
				border-left: 5px solid #ccc;
				opacity: 0;
				transform: translateY(-12px);
				transition: opacity 0.4s ease, transform 0.4s ease;
			}
			.alert-pro.showing {
				opacity: 1;
				transform: translateY(0);
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

		const defaults = {
			message:	'Alert generico',
			type:		 'info',
			timeout:	5000,
			position: 'top-right'
		};

		let settings;

		// 📦 Supporto shorthand (1–4 argomenti)
		if (typeof arguments[0] === 'string') {
			settings = {
				message:	arguments[0],
				type:		 arguments[1] ?? defaults.type,
				timeout:	arguments[2] ?? defaults.timeout,
				position: arguments[3] ?? defaults.position
			};
		} else {
			settings = $.extend({}, defaults, arguments[0]);
		}

		// 🎨 Icone Font Awesome
		const icons = {
			info:		'fa-circle-info',
			success: 'fa-circle-check',
			warning: 'fa-triangle-exclamation',
			danger:	'fa-circle-exclamation'
		};

		const alertId		 = 'alert-' + Date.now();
		const containerId = 'alert-stack-' + settings.position;
		let $container		= $('#' + containerId);

		// 📐 Mappa delle posizioni
		const positions = {
			'top-right':		 { top: '20px', right: '20px' },
			'bottom-right':	{ bottom: '20px', right: '20px' },
			'top-left':			{ top: '20px', left: '20px' },
			'bottom-left':	 { bottom: '20px', left: '20px' },
			'top-center':		{ top: '20px', left: '50%', transform: 'translateX(-50%)' },
			'bottom-center': { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
		};

		// 📦 Crea contenitore se non esiste
		if (!$container.length) {
			$container = $('<div>', {
				id: containerId,
				css: $.extend({
					position: 'fixed',
					zIndex: 1050,
					minWidth: '25%'
				}, positions[settings.position])
			}).appendTo('body');

			// Applica trasformazione se centrato
			if (positions[settings.position].transform) {
				$container.css('transform', positions[settings.position].transform);
			}
		}

		// 🧾 HTML alert
		const alertHtml = `
			<div id="${alertId}"
					 class="alert alert-${settings.type} alert-dismissible fade show alert-pro"
					 role="alert"
					 style="margin-bottom: 10px;">
				<i class="fa-solid ${icons[settings.type]} me-2"></i>
				${settings.message}
				<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Chiudi"></button>
			</div>
		`;

		$container.append(alertHtml);

		// 🪄 Attiva animazione con .showing dopo breve ritardo
		setTimeout(() => {
			$('#' + alertId).addClass('showing');
		}, 50);

		// ⏱️ Chiusura automatica se timeout > 0
		if (settings.timeout > 0) {
			setTimeout(() => {
				$('#' + alertId).alert('close');
			}, settings.timeout);
		}

		return this;
	};

	// 🧹 Metodo per chiudere tutti gli alert impilati
	$.fn.stackAlert.closeAll = function () {
		$('[id^="alert-stack-"]').remove();
	};

	// 🔍 Metodo per chiudere solo una posizione
	$.fn.stackAlert.closePosition = function (position) {
		$('#alert-stack-' + position).remove();
	};
}(jQuery));
