/*
 * Hexen
 *
 * Version: 0.1.0
 * Author: Horst Freigang
 *
 * */

;(function($) {

	$.fn.hexen = function(hexenOptions) {

		// support mutltiple elements
		if(this.length > 1) {
			this.each(function() {
				$(this).hexen(hexenOptions)
			});
			return this;
		}

		// setup variables
		var _hexen = this;
		var defaultOptions = {
			cell: '.hex',
			cellOrientation: 'horizontal',
			filter: '',
			spacing: 1
		};
		var options = $.extend(true, {}, defaultOptions, hexenOptions);

		// debounce function
		var debounce = function(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};

		// switch layout
		var layout = function() {
			switch(options['cellOrientation']) {
				case 'horizontal': layoutHorizontal(); break;
				case 'vertical': layoutVertical(); break;
				default: layoutHorizontal(); break;
			}
		};

		// default layout
		var layoutHorizontal = function() {
			var col = 0;
			var row = 0;
			var posLeft = 0;
			var posTop = 0;
			var spacing = options['spacing'];

			_hexen.find(options['cell']).each(function() {
				var hexWidth = $(this).width();
				var hexHeight = $(this).height();

				if($(this).hasClass('disabled') == false) {
					// positioning of elements
					if(((col + 1) * hexWidth + (col + 1) * spacing - col * (hexWidth / 4)) > _hexen.width()) {
						posLeft = 0;
						col = 0;
						row++;
					} else {
						posLeft = Math.floor(hexWidth - (hexWidth / 4) + spacing) * col;
					}

					if(col % 2 == 0) {
						posTop = hexHeight * row + spacing * row;
					} else {
						posTop = Math.floor((hexHeight * row + spacing * row) + (hexHeight / 2) + (spacing / 2));
					}

					$(this)
						.css('position', 'absolute')
						.css('left', posLeft)
						.css('top', posTop);

					_hexen.height(Math.round((row + 1) * hexHeight + (row + 1) * spacing + hexHeight / 2));
					col++;
				}
			});
		};

		// default layout but rotated 90 degrees
		var layoutVertical = function() {
			var col = 0;
			var row = 0;
			var posLeft = 0;
			var posTop = 0;
			var spacing = options['spacing'];

			_hexen.find(options['cell']).each(function() {
				var hexWidth = $(this).width();
				var hexHeight = $(this).height();

				if($(this).hasClass('disabled') == false) {
					// positioning of elements
					if(((col + 1) * hexWidth + (col + 1) * spacing + hexWidth / 2) > _hexen.width()) {
						if(row % 2 == 0) {
							posLeft = hexWidth / 2 + Math.floor(spacing / 2);
						} else {
							posLeft = 0;
						}
						col = 0;
						row++;
					} else {
						if(row % 2 == 0) {
							posLeft = Math.floor(hexWidth + spacing) * col;
						} else {
							posLeft = Math.floor(hexWidth + spacing) * col + hexWidth / 2 + Math.floor(spacing / 2);
						}
					}

					posTop = Math.floor(hexHeight - (hexHeight / 4) + spacing) * row;

					$(this)
						.css('position', 'absolute')
						.css('left', posLeft)
						.css('top', posTop);

					_hexen.height(Math.round((row + 1) * hexHeight + (row + 1) * spacing - row * hexHeight / 4));
					col++;
				}
			});
		};

		// add svg for "z-indexing"
		/*var addSvg = function(w, h) {
			var coords = 'm ' + 0 + ' ' + (h / 2) + ' l ' + (w * .25) + ' ' + (h / 2 * -1) + ' l '+ (w / 2) + ' 0 l '+ (w * .25) + ' ' + (h / 2) + ' l '+ (w * .25 * -1) + ' ' + (h / 2) + ' l ' + (w / 2 * -1) + ' 0 z';
			var svg = '' +
				'<svg style="position: absolute; top: 0; left: 0;" width="'+w+'" height="'+h+'">' +
				'<path d="'+coords+'" fill="none"></path>' +
				'</svg>';

			return svg;
		};*/

		// init resize function
		var resize = function() {
			var reposition = debounce(function() {
				layout(_hexen);
			}, 250);
			$(window).on('resize', reposition);
		};

		// initiallize plugin
		var init = function() {
			layout(options['cellOrientation']);
			resize();

			if(options['filter'] != '') {
				$(options['filter']).on('click', 'button', function(e) {
					e.preventDefault();
					_hexen.filterGrid($(this));
				});
			}
		};

		this.filterGrid = function($btn) {
			var f = $btn.attr('data-filter');
			var target = $(options['filter']).attr('data-target');

			if(f == 'reset') {
				$(target).find(options['cell']).removeClass('disabled');
			} else {
				$(target).find(options['cell']).each(function() {
					$(this).addClass('disabled');

					if($(this).hasClass(f) == true) {
						$(this).removeClass('disabled');
					}
				});
			}

			layout();
		};

		init();

		return this;
	};

})(jQuery);