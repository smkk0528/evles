(function(window, undefined) {
	var document = window.document, navigator = window.navigator, location = window.location,userAgent = navigator.userAgent,
	//[canvas name] -> canvas
	canvas_cache = {},
	//[canvas name] - > entry array
	canvas_entity_data = {},
	//[img name]-> Image()
	img_cache = {},
	// [[Class]] -> type pairs
	class2type = {},
	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [], core_version = "2.0.3",
	//with onmessage function
	remoteEventListeners = {},
	//with onmessage function
	onfireListeners = {},
	// Save a reference to some core methods
	core_concat = core_deletedIds.concat, core_push = core_deletedIds.push, core_slice = core_deletedIds.slice, core_indexOf = core_deletedIds.indexOf, core_toString = class2type.toString, core_hasOwn = class2type.hasOwnProperty, core_trim = core_version.trim;

	//Teewn.js

	/**
	 * @author sole / http://soledadpenades.com
	 * @author mrdoob / http://mrdoob.com
	 * @author Robert Eisele / http://www.xarg.org
	 * @author Philippe / http://philippe.elsass.me
	 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
	 * @author Paul Lewis / http://www.aerotwist.com/
	 * @author lechecacharro
	 * @author Josh Faul / http://jocafa.com/
	 * @author egraether / http://egraether.com/
	 * @author endel / http://endel.me
	 * @author Ben Delarre / http://delarre.net
	 */

	// Date.now shim for (ahem) Internet Explo(d|r)er
	if (Date.now === undefined) {
		Date.now = function() {
			return new Date().valueOf();
		};
	}

	var TWEEN = TWEEN || (function() {
		var _tweens = [];
		return {
			REVISION : '11dev',
			getAll : function() {
				return _tweens;
			},
			removeAll : function() {
				_tweens = [];
			},
			add : function(tween) {
				_tweens.push(tween);
			},
			remove : function(tween) {
				var i = _tweens.indexOf(tween);
				if (i !== -1) {
					_tweens.splice(i, 1);
				}
			},
			update : function(time) {
				if (_tweens.length === 0)
					return false;
				var i = 0, numTweens = _tweens.length;
				time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
				while (i < numTweens) {
					if (_tweens[i].update(time)) {
						i++;
					} else {
						_tweens.splice(i, 1);
						numTweens--;
					}
				}
				return true;
			},
			size : function() {
				return _tweens.length;
			}
		};

	} )();

	TWEEN.Easing = {
		Linear : {
			None : function(k) {
				return k;
			}
		},

		Quadratic : {
			In : function(k) {
				return k * k;
			},

			Out : function(k) {
				return k * (2 - k );
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k;
				return -0.5 * (--k * (k - 2 ) - 1 );
			}
		},

		Cubic : {
			In : function(k) {
				return k * k * k;
			},

			Out : function(k) {
				return --k * k * k + 1;
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k * k;
				return 0.5 * ((k -= 2 ) * k * k + 2 );
			}
		},

		Quartic : {
			In : function(k) {
				return k * k * k * k;
			},

			Out : function(k) {
				return 1 - (--k * k * k * k );
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k * k * k;
				return -0.5 * ((k -= 2 ) * k * k * k - 2 );
			}
		},

		Quintic : {
			In : function(k) {
				return k * k * k * k * k;
			},

			Out : function(k) {
				return --k * k * k * k * k + 1;
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return 0.5 * k * k * k * k * k;
				return 0.5 * ((k -= 2 ) * k * k * k * k + 2 );

			}
		},

		Sinusoidal : {
			In : function(k) {
				return 1 - Math.cos(k * Math.PI / 2);
			},

			Out : function(k) {
				return Math.sin(k * Math.PI / 2);
			},

			InOut : function(k) {
				return 0.5 * (1 - Math.cos(Math.PI * k) );
			}
		},

		Exponential : {
			In : function(k) {
				return k === 0 ? 0 : Math.pow(1024, k - 1);
			},

			Out : function(k) {
				return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
			},

			InOut : function(k) {
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if ((k *= 2 ) < 1)
					return 0.5 * Math.pow(1024, k - 1);
				return 0.5 * (-Math.pow(2, -10 * (k - 1 )) + 2 );
			}
		},

		Circular : {
			In : function(k) {
				return 1 - Math.sqrt(1 - k * k);
			},

			Out : function(k) {
				return Math.sqrt(1 - (--k * k ));
			},

			InOut : function(k) {
				if ((k *= 2 ) < 1)
					return -0.5 * (Math.sqrt(1 - k * k) - 1);
				return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

			}
		},

		Elastic : {
			In : function(k) {
				var s, a = 0.1, p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI );
				return -(a * Math.pow(2, 10 * (k -= 1 )) * Math.sin((k - s ) * (2 * Math.PI ) / p) );

			},

			Out : function(k) {
				var s, a = 0.1, p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI );
				return (a * Math.pow(2, -10 * k) * Math.sin((k - s ) * (2 * Math.PI ) / p) + 1 );
			},

			InOut : function(k) {
				var s, a = 0.1, p = 0.4;
				if (k === 0)
					return 0;
				if (k === 1)
					return 1;
				if (!a || a < 1) {
					a = 1;
					s = p / 4;
				} else
					s = p * Math.asin(1 / a) / (2 * Math.PI );
				if ((k *= 2 ) < 1)
					return -0.5 * (a * Math.pow(2, 10 * (k -= 1 )) * Math.sin((k - s ) * (2 * Math.PI ) / p) );
				return a * Math.pow(2, -10 * (k -= 1 )) * Math.sin((k - s ) * (2 * Math.PI ) / p) * 0.5 + 1;

			}
		},

		Back : {
			In : function(k) {
				var s = 1.70158;
				return k * k * ((s + 1 ) * k - s );
			},

			Out : function(k) {
				var s = 1.70158;
				return --k * k * ((s + 1 ) * k + s ) + 1;
			},

			InOut : function(k) {
				var s = 1.70158 * 1.525;
				if ((k *= 2 ) < 1)
					return 0.5 * (k * k * ((s + 1 ) * k - s ) );
				return 0.5 * ((k -= 2 ) * k * ((s + 1 ) * k + s ) + 2 );

			}
		},

		Bounce : {
			In : function(k) {
				return 1 - TWEEN.Easing.Bounce.Out(1 - k);
			},

			Out : function(k) {
				if (k < (1 / 2.75 )) {
					return 7.5625 * k * k;
				} else if (k < (2 / 2.75 )) {
					return 7.5625 * (k -= (1.5 / 2.75 ) ) * k + 0.75;
				} else if (k < (2.5 / 2.75 )) {
					return 7.5625 * (k -= (2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * (k -= (2.625 / 2.75 ) ) * k + 0.984375;
				}

			},

			InOut : function(k) {
				if (k < 0.5)
					return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
				return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

			}
		}

	};

	TWEEN.Interpolation = {
		Linear : function(v, k) {
			var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.Linear;
			if (k < 0)
				return fn(v[0], v[1], f);
			if (k > 1)
				return fn(v[m], v[m - 1], m - f);
			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
		},

		Bezier : function(v, k) {
			var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;
			for ( i = 0; i <= n; i++) {
				b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
			}
			return b;
		},

		CatmullRom : function(v, k) {
			var m = v.length - 1, f = m * k, i = Math.floor(f), fn = TWEEN.Interpolation.Utils.CatmullRom;
			if (v[0] === v[m]) {
				if (k < 0)
					i = Math.floor( f = m * (1 + k ));
				return fn(v[(i - 1 + m ) % m], v[i], v[(i + 1 ) % m], v[(i + 2 ) % m], f - i);
			} else {
				if (k < 0)
					return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0] );
				if (k > 1)
					return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m] );
				return fn(v[ i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
			}
		},

		Utils : {
			Linear : function(p0, p1, t) {
				return (p1 - p0 ) * t + p0;
			},

			Bernstein : function(n, i) {
				var fc = TWEEN.Interpolation.Utils.Factorial;
				return fc(n) / fc(i) / fc(n - i);
			},

			Factorial : (function() {
				var a = [1];
				return function(n) {
					var s = 1, i;
					if (a[n])
						return a[n];
					for ( i = n; i > 1; i--)
						s *= i;
					return a[n] = s;
				};
			} )(),

			CatmullRom : function(p0, p1, p2, p3, t) {
				var v0 = (p2 - p0 ) * 0.5, v1 = (p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
				return (2 * p1 - 2 * p2 + v0 + v1 ) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;
			}
		}

	};

	window.Evles = window.$ = (function() {
		var Evles = function(selector) {
			if ( typeof selector === "string") {
				if (selector.charAt(0) === "$") {
					if (selector.indexOf('@') > 0) {
						return new Evles.fn.Entity(selector);
					}
					return new Evles.fn.Canvas(selector);
				} else {
					return new Evles.fn.Dom(selector);
				}
			}

			if (Evles.isFunction(selector)) {
				window.addEventListener('load', selector);
				return this;
			}

		};

		Evles.fn = Evles.prototype = {
			constructor : Evles,
			Dom : function(selector) {
				console.log(selector);
				// Handle $(""), $(null), or $(undefined)
				if (!selector) {
					return this;
				}

				// Handle $(DOMElement)
				if (selector.nodeType) {
					this.context = this[0] = selector;
					this.length = 1;
					return this;
				}

				// Handle HTML strings,
				if ( typeof selector === "string") {
					var elem;
					if (selector.charAt(0) === "#") {
						elem = document.querySelector(selector);

					} else {
						elem = document.querySelectorAll(selector);
					}
					if (elem) {
						this.length = elem.length;
					}
					this[0] = elem;
					return this;
				}
			},
			Canvas : function(selector) {
				//when select canvas object like '$canvas'
				if ( selector in canvas_cache) {
					this[0] = canvas_cache[selector];
					this.context = canvas_cache[selector].context;
					this.selector = selector;
				}
				return this;
			},
			Entity : function(selector) {
				//when select entity objcet like '@canvas:entity'
				// console.log(selector);
				var s = selector.split('@');
				if (s.length == 2) {
					var entries = canvas_entity_data[s[0]];
					for (var i = 0; i < entries.length; i++) {
						var entity = entries[i];
						if (entity && ('name' in entity) && entity.name === s[1]) {
							this[0] = entity;
							this[1] = canvas_cache[s[0]];
							//console.log(canvas_cache);
							//console.log(this[1]);
							this.context = canvas_cache[s[0]].context;
							break;
						}
					}
				}
				return this;
			},
			Animation : function(selector) {
				if ( typeof selector === 'string') {

				} else {
					this._object = selector;
					this._valuesStart = {};
					this._valuesEnd = {};
					this._valuesStartRepeat = {};
					this._duration = 1000;
					this._repeat = 0;
					this._yoyo = false;
					this._reversed = false;
					this._delayTime = 0;
					this._startTime = null;
					this._chainedTweens = [];
					this._onStartCallback = null;
					this._onStartCallbackFired = false;
					this._onUpdateCallback = null;
					this._onCompleteCallback = null;
					for (var field in selector ) {
						if (Evles.isNumeric(selector[field])) {
							this._valuesStart[field] = parseFloat(selector[field], 10);
						}
					}
					return this;
				}
			}
		};

		Evles.fn.Dom.fn = Evles.fn.Dom.prototype;
		Evles.fn.Canvas.fn = Evles.fn.Canvas.prototype;
		Evles.fn.Entity.fn = Evles.fn.Entity.prototype;
		Evles.fn.Animation.fn = Evles.fn.Animation.prototype;

		Evles.extend = Evles.fn.Dom.fn.extend = Evles.fn.Canvas.fn.extend = Evles.fn.Entity.fn.extend = Evles.fn.Animation.fn.extend = function() {
			var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean") {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !Evles.isFunction(target)) {
				target = {};
			}

			// extend Evles itself if only one argument is passed
			if (length === i) {
				target = this; --i;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if (( options = arguments[i]) != null) {
					// Extend the base object
					for (name in options ) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (Evles.isPlainObject(copy) || ( copyIsArray = Evles.isArray(copy)) )) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && Evles.isArray(src) ? src : [];
							} else {
								clone = src && Evles.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = Evles.extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};

		Evles.extend({
			isFunction : function(obj) {
				return Evles.type(obj) === "function";
			},
			isArray : Array.isArray,
			isAndroid : function() {
				return (userAgent.toLowerCase().indexOf('android') >= 0);
			},
			isIPhone : function() {
				return (userAgent.toLowerCase().indexOf('iphone') >= 0);
			},
			isIPad : function() {
				return (userAgent.toLowerCase().indexOf('ipad') >= 0);
			},
			isWindow : function(obj) {
				return obj != null && obj === obj.window;
			},
			isNumeric : function(obj) {
				return !isNaN(parseFloat(obj)) && isFinite(obj);
			},
			type : function(obj) {
				if (obj == null) {
					return String(obj);
				}
				// Support: Safari <= 5.1 (functionish RegExp)
				return typeof obj === "object" || typeof obj === "function" ? class2type[core_toString.call(obj)] || "object" : typeof obj;
			},
			isPlainObject : function(obj) {
				// Not plain objects:
				// - Any object or value whose internal [[Class]] property is not "[object Object]"
				// - DOM nodes
				// - window
				if (Evles.type(obj) !== "object" || obj.nodeType || Evles.isWindow(obj)) {
					return false;
				}

				// Support: Firefox <20
				// The try/catch suppresses exceptions thrown when attempting to access
				// the "constructor" property of certain host objects, ie. |window.location|
				// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
				try {
					if (obj.constructor && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
						return false;
					}
				} catch ( e ) {
					return false;
				}

				// If the function hasn't returned already, we're confident that
				// |obj| is a plain object, created by {} or constructed with new Object
				return true;
			},
			isEmptyObject : function(obj) {
				var name;
				for (name in obj ) {
					return false;
				}
				return true;
			},
			// args is for internal usage only
			each : function(obj, callback, args) {
				var value, i = 0, length = obj.length, isArray = isArraylike(obj);

				if (args) {
					if (isArray) {
						for (; i < length; i++) {
							value = callback.apply(obj[i], args);

							if (value === false) {
								break;
							}
						}
					} else {
						for (i in obj ) {
							value = callback.apply(obj[i], args);

							if (value === false) {
								break;
							}
						}
					}

					// A special, fast, case for the most common use of each
				} else {
					if (isArray) {
						for (; i < length; i++) {
							value = callback.call(obj[i], i, obj[i]);

							if (value === false) {
								break;
							}
						}
					} else {
						for (i in obj ) {
							value = callback.call(obj[i], i, obj[i]);

							if (value === false) {
								break;
							}
						}
					}
				}

				return obj;
			},
			trim : function(text) {
				return text == null ? "" : core_trim.call(text);
			},

			// results is for internal usage only
			makeArray : function(arr, results) {
				var ret = results || [];

				if (arr != null) {
					if (isArraylike(Object(arr))) {
						Evles.merge(ret, typeof arr === "string" ? [arr] : arr);
					} else {
						core_push.call(ret, arr);
					}
				}

				return ret;
			},
			merge : function(first, second) {
				var l = second.length, i = first.length, j = 0;

				if ( typeof l === "number") {
					for (; j < l; j++) {
						first[i++] = second[j];
					}
				} else {
					while (second[j] !== undefined) {
						first[i++] = second[j++];
					}
				}

				first.length = i;

				return first;
			},

			inArray : function(elem, arr, i) {
				return arr == null ? -1 : core_indexOf.call(arr, elem, i);
			},

			cacheImg : function(name, src, fn) {
				if (!( name in img_cache)) {
					var imageObject = new Image();
					if (fn && Evles.isFunction(fn)) {
						imageObject.onload = function() {
							fn();
						};
					}
					imageObject.src = src;
					img_cache[name] = imageObject;
				}
			},

			addRemoteEventListener : function(eventTag, fn) {
				if ( eventTag in remoteEventListeners) {
					remoteEventListeners[eventTag].push(fn);
				} else {
					remoteEventListeners[eventTag] = [fn];
				}
			}
		});

		// Populate the class2type map
		Evles.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});

		function isArraylike(obj) {
			var length = obj.length, type = Evles.type(obj);

			if (Evles.isWindow(obj)) {
				return false;
			}

			if (obj.nodeType === 1 && length) {
				return true;
			}

			return type === "array" || type !== "function" && (length === 0 || typeof length === "number" && length > 0 && (length - 1 ) in obj );
		};

		Evles.fn.Dom.fn.extend({
			asCanvas : function(option) {
				if (!this._animation) {
					option._animation = true;
				}
				option.selector = '$' + option.name;
				option.context = this[0].getContext('2d');
				if (!('width' in option)) {
					option.width = parseInt(this[0].width);
				}
				if (!('height' in option)) {
					option.height = parseInt(this[0].height);
				}
				canvas_cache['$' + option.name] = option;
				return new Evles.fn.Canvas('$' + option.name);
			}
		});

		Evles.fn.Canvas.fn.extend({
			start : function() {
				return this[0]._animation = true;
			},
			stop : function() {
				return this[0]._animation = false;
			},
			arc : function(x, y, r, color) {
				this.context.save();
				this.context.fillStyle = color;
				this.context.beginPath();
				this.context.arc(x, y, r, 0, 2 * Math.PI, true);
				this.context.closePath();
				this.context.fill();
				this.context.restore();
				return this;
			},
			entity : function(option) {
				// console.log('entity selector :' + this.selector);
				var entries = canvas_entity_data[this.selector] || [];
				if ( typeof option === 'string') {
					for (var i = 0; i < entries.length; i++) {
						if (entries[i].name === option) {
							// console.log(this.selector);
							return Evles(this.selector + '@' + entries[i].name);
						}
					}
				} else {
					entries.push(option);
					canvas_entity_data[this.selector] = entries;
					// console.log(this.selector + '@' + option.name);
					return Evles(this.selector + '@' + option.name);
				}
				return this;
			},
			flush : function() {
				if (this[0]._animation === true) {
					this.context.clearRect(0, 0, this[0].width, this[0].height);
					var entries = canvas_entity_data[this.selector];
					for (var i = 0; entries && i < entries.length; i++) {
						var entry = Evles(this.selector + '@' + entries[i].name);
						entry.flush();
					}
				}
				return this;
			}
		});

		Evles.fn.Entity.fn.extend({
			flush : function() {
				// console.log(this[0]);
				if (this[0]._hide) {
					return;
				}
				if ('flush' in this[0]) {
					this[0].flush.call(this);
				} else {
					this.context.save();
					if ('translateX' in this[0] && 'translateY' in this[0]) {
						this.context.translate(this[0].translateX, this[0].translateY);
					}
					if ('rotate' in this[0]) {
						this.context.rotate((Math.PI / 180) * this[0].rotate);
					}
					if (this[0].type === 'img') {
						var img = img_cache[this[0].res];
						// console.log(this[0].res + "|" + img);
						if (!img) {
							return;
						}
						// console.log(this[0]);
						if (('sx' in this[0]) && ('sy' in this[0]) && ('sw' in this[0]) && ('sh' in this[0]) && ('dx' in this[0]) && ('dy' in this[0]) && ('dw' in this[0]) && ('dh' in this[0])) {
							this.context.drawImage(img, this[0].sx, this[0].sy, this[0].sw, this[0].sh, this[0].dx, this[0].dy, this[0].dw, this[0].dh);
						} else if (('dx' in this[0]) && ('dy' in this[0]) && ('dw' in this[0]) && ('dh' in this[0])) {
							this.context.drawImage(img, this[0].dx, this[0].dy, this[0].dw, this[0].dh);
						} else {
							// console.log(this[0].dx + "|" + this[0].dy);
							this.context.drawImage(img, this[0].dx, this[0].dy);
						}
					} else {
						if ('draw' in this[0] && Evles.isFunction(this[0].draw)) {
							this[0].draw.call(this);
						}
					}
					this.context.restore();
				}
				return this;
			},
			animation : function() {
				// console.log("animation");
				return new Evles.fn.Animation(this[0]);
			},
			hide : function() {
				this[0]._hide = true;
				Evles(this[1].selector).flush();
			},
			show : function() {
				this[0]._hide = false;
				Evles(this[1].selector).flush();
			},
			bind : function(eventTag, fn, isPropagation) {
				var events = onfireListeners[eventTag] || [];
				events.push({
					data : this[0],
					selector : this[1].selector,
					fn : fn,
					isPropagation : isPropagation,
				});
				onfireListeners[eventTag] = events;
				return this;
			},
			unbind : function(fn) {
				var events = onfireListeners[eventTag] || [];
				for (var i = 0; i < events.length; i++) {
					if (events[i].fn == fn) {
						events.splice(i, 1);
					}
				}
				return this;
			},
			remove : function() {
				//console.log(this[1].selector);
				var entities = canvas_entity_data[this[1].selector] || [];
				for (var i = 0; i < entities.length; i++) {
					if (entities[i] == this[0]) {
						entities.splice(i, 1);
					}
				}
				return this;
			},
			up : function() {
				// console.log(canvas_entity_data);
				var entities = canvas_entity_data[this[1].selector] || [];
				for (var i = 0; i < entities.length; i++) {
					if (entities[i].name === this[0].name) {
						var tentity = entities.splice(i, 1);
						entities.push(tentity[0]);
						return this;
					}
				}
				return this;
			},
			down : function() {
				var entities = canvas_entity_data[this[1].selector] || [];
				for (var i = 0; i < entities.length; i++) {
					if (entities[i].name === this[0].name) {
						var tentity = entities.splice(i, 1);
						entities.unshift(tentity[0]);
						return this;
					}
				}
				return this;
			}
		});

		Evles.fn.Animation.fn.extend({
			_interpolationFunction : TWEEN.Interpolation.Linear,
			_easingFunction : TWEEN.Easing.Linear.None,
			to : function(properties, duration) {
				if (duration !== undefined) {
					this._duration = duration;
				}
				// console.log(this._duration);
				this._valuesEnd = properties;
				return this;
			},
			start : function(time) {
				TWEEN.add(this);
				this._onStartCallbackFired = false;
				this._startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
				this._startTime += this._delayTime;
				for (var property in this._valuesEnd ) {
					// check if an Array was provided as property value
					if (this._valuesEnd[property] instanceof Array) {
						if (this._valuesEnd[property].length === 0) {
							continue;
						}
						// create a local copy of the Array with the start value at the front
						this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

					}
					this._valuesStart[property] = this._object[property];
					if ((this._valuesStart[property] instanceof Array ) === false) {
						this._valuesStart[property] *= 1.0;
						// Ensures we're using numbers, not strings
					}
					this._valuesStartRepeat[property] = this._valuesStart[property] || 0;
				}
				return this;
			},

			stop : function() {
				TWEEN.remove(this);
				return this;
			},

			delay : function(amount) {
				this._delayTime = amount;
				return this;
			},

			repeat : function(times) {
				this._repeat = times;
				return this;
			},
			yoyo : function(yoyo) {
				this._yoyo = yoyo;
				return this;
			},
			easing : function(easing) {
				this._easingFunction = easing;
				return this;
			},
			interpolation : function(interpolation) {
				this._interpolationFunction = interpolation;
				return this;
			},
			chain : function() {
				this._chainedTweens = arguments;
				return this;
			},
			onStart : function(callback) {
				this._onStartCallback = callback;
				return this;
			},
			onUpdate : function(callback) {
				this._onUpdateCallback = callback;
				return this;
			},
			onComplete : function(callback) {
				this._onCompleteCallback = callback;
				return this;
			},
			update : function(time) {
				var property;
				if (time < this._startTime) {
					return true;
				}

				if (this._onStartCallbackFired === false) {
					if (this._onStartCallback !== null) {
						this._onStartCallback.call(this._object);
					}
					this._onStartCallbackFired = true;
				}

				var elapsed = (time - this._startTime ) / this._duration;
				elapsed = elapsed > 1 ? 1 : elapsed;

				var value = this._easingFunction(elapsed);

				for (property in this._valuesEnd ) {
					var start = this._valuesStart[property] || 0;
					var end = this._valuesEnd[property];
					if ( end instanceof Array) {
						this._object[property] = this._interpolationFunction(end, value);
					} else {
						// Parses relative end values with start as base (e.g.: +10, -3)
						if ( typeof (end) === "string") {
							end = start + parseFloat(end, 10);
						}
						// protect against non numeric properties.
						if ( typeof (end) === "number") {
							this._object[property] = start + (end - start ) * value;
						}

					}

				}

				if (this._onUpdateCallback !== null) {
					this._onUpdateCallback.call(this._object, value);
				}

				if (elapsed == 1) {
					if (this._repeat > 0) {
						if (isFinite(this._repeat)) {
							this._repeat--;
						}
						// reassign starting values, restart by making startTime = now
						for (property in this._valuesStartRepeat ) {
							if ( typeof (this._valuesEnd[property] ) === "string") {
								this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property], 10);
							}
							if (this._yoyo) {
								var tmp = this._valuesStartRepeat[property];
								this._valuesStartRepeat[property] = this._valuesEnd[property];
								this._valuesEnd[property] = tmp;
								this._reversed = !this._reversed;
							}
							this._valuesStart[property] = this._valuesStartRepeat[property];
						}
						this._startTime = time + this._delayTime;
						return true;
					} else {
						if (this._onCompleteCallback !== null) {
							this._onCompleteCallback.call(this._object);
						}
						for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
							this._chainedTweens[i].start(time);
						}
						return false;
					}
				}
				return true;
			}
		});

		return Evles;
	})();

	Evles.Easing = TWEEN.Easing;

	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				// console.log(timeToCall);
				var id = window.setTimeout(function() {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	})();

	function animate() {
		requestAnimationFrame(animate);
		if (TWEEN.update()) {
			flush();
		}
	}

	function flush() {
		// console.log('flush running');
		for (var name in canvas_cache) {
			Evles(name).flush();
		}
	}

	var _touchstart = (Evles.isAndroid() ? 'touchstart' : 'mousedown');
	window.addEventListener(_touchstart, function(event) {
		var target = Evles.isAndroid() ? event.changedTouches[0] : event,
		x = target.pageX, y = target.pageY,
		listeners = onfireListeners['touchstart'];
		//console.log("zuobiao:"+x+"|"+y);
		
		if(listeners){
			console.log(_touchstart);
			for(var i=0;i<listeners.length;i++){
				var e = listeners[i],shape = e.data.shape || 'rect',
				w = e.data.dw || e.data.w || 0,
				h = e.data.dh || e.data.h || 0,
				dx = e.data.translateX?e.data.translateX+e.data.dx : e.data.dx,
				dy = e.data.translateY?e.data.translateY+e.data.dy : e.data.dy;
				
				if(shape === 'rect'){
					//console.log(e);
					if(x>dx && y>dy && x<dx+w && y<dy+h){
						e.fn.call(e.data,x,y);
						if(!e.isPropagation){
							break;
						}
					}
				}
			}
		}
	}, false);
	
	window.onmessage = function(msg) {
		var data = msg, onFireEvents = remoteEventListeners[data.eventTag];
		for (var i = 0; onFireEvents && i < onFireEvents.length; i++) {
			onFireEvents[i](data);
		}
	};

	animate();
})(window);

