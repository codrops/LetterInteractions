/**
 * demo3.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
{
	class Letter {
		constructor(letter, pos) {
			this.DOM = {};
			this.DOM.letter = letter;
			this.CONFIG = {
				animations: [
					{
						origin: '0% 0%',
						opts: {
							translateY: [
								{value: 400, duration: 400, delay: 500, easing: 'easeInSine'}
							],
							rotate: [
								{value: 30, duration: 500, easing: 'easeOutBack'},
								{value: 38, duration: 200, easing: 'easeInSine'}
							],
							opacity: [
								{value: 0, duration: 200, delay: 700, easing: 'easeInSine'}
							]
						}
					},
					{
						origin: '50% 50%',
						opts: {
							scale: {value: 0, duration: 300, easing: 'easeInBack'},
							opacity: {value: 0, duration: 100, delay: 200, easing: 'linear'}
						}
					},
					{
						origin: '50% 100%',
						opts: {
							translateY: [
								{ 
									value: -400, 
									duration: 800, 
									delay: 200, 
									elasticity: 300 
								},
							],
							scaleY: [
								{ 
									value: 0.7, 
									duration: 200, 
									easing: 'easeOutExpo' 
								},
								{ 
									value: 1, 
									duration: 800, 
									elasticity: 300 
								}
							],
							scaleX: [
								{ 
									value: 1.2, 
									duration: 200, 
									easing: 'easeOutExpo' 
								},
								{ 
									value: 1, 
									duration: 800, 
									elasticity: 300 
								}
							],
							opacity: {value: 0, duration: 100, delay: 250, easing: 'linear'}
						}
					},
					{
						origin: '100% 0%',
						opts: {
							translateY: [
								{value: 300, duration: 300, delay: 700, easing: 'easeInSine'}
							],
							rotate: [
								{value: -20, duration: 700, easing: 'easeOutElastic', elasticity: 400},
								{value: -30, duration: 200, easing: 'easeInSine'}
							],
							opacity: [
								{value: 0, duration: 200, delay: 800, easing: 'easeInSine'}
							]
						}
					}
				]
			};
			this.pos = pos;
			this.letterPath = letter.parentNode.dataset[`pathChar-${this.pos+1}`];
			this.layout();
			this.initEvents();
		}
		layout() {
			this.DOM.letterInner = document.createElement('span');
			this.DOM.letterInner.innerHTML = this.DOM.letter.innerHTML;
			this.DOM.letter.innerHTML = '';			
			this.DOM.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			this.DOM.svg.setAttribute('width', '95px');
			this.DOM.svg.setAttribute('height', '105px');
			this.DOM.svg.setAttribute('viewBox', '0 0 95 105');
			this.DOM.svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
			this.DOM.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			this.DOM.path.setAttribute('d', this.letterPath);
			this.DOM.svg.appendChild(this.DOM.path);
			this.DOM.letter.appendChild(this.DOM.svg);
			this.DOM.letter.appendChild(this.DOM.letterInner);
		}
		initEvents() {
			this.mouseenterFn = () => this.mouseTimeout = setTimeout(() => {
				if( this.isDrawing ) return;
				this.isDrawing = true;

				this.isActive = true;
				
				requestAnimationFrame(() => {
					this.DOM.letterInner.style.transformOrigin = this.CONFIG.animations[this.pos].origin;

					anime.remove(this.DOM.letterInner);
					let animOpts = {targets: this.DOM.letterInner};
					anime(Object.assign(animOpts, this.CONFIG.animations[this.pos].opts));

					anime.remove(this.DOM.path);
					anime({
						targets: this.DOM.path,
						duration: 700,
						delay: 300,
						easing: 'easeOutQuad',
						strokeDashoffset: [anime.setDashoffset, 0],
						opacity: {
							value: 1,
							duration: 1
						},
						complete: () => {
							this.DOM.path.style.strokeDashoffset = this.DOM.path.getTotalLength();
							this.DOM.letterInner.style.transformOrigin = '50% 50%';
							this.DOM.letterInner.style.transform = 'scale(0) translateX(0) translateY(0) rotate(0)';
							anime({
								targets: this.DOM.letterInner,
								duration: 500,
								delay: 0,
								elasticity: 500,
								scale: [0.5,1],
								opacity: [0,1],
								complete: () => this.isDrawing = false
							});
						}
					});
				});
			}, 50);
			
			
			this.mouseleaveFn = () => {
				clearTimeout(this.mouseTimeout);
				if( !this.isActive ) return;
				this.isActive = false;
			};
			this.DOM.letter.addEventListener('mouseenter', this.mouseenterFn);
			this.DOM.letter.addEventListener('mouseleave', this.mouseleaveFn);
			this.DOM.letter.addEventListener('touchstart', this.mouseenterFn);
			this.DOM.letter.addEventListener('touchend', this.mouseleaveFn);
		}
	}

	class Word {
		constructor(word) {
			this.DOM = {};
			this.DOM.word = word;
			this.layout();
		}
		layout() {
			charming(this.DOM.word, {classPrefix: 'letter'});
			Array.from(this.DOM.word.querySelectorAll('span')).forEach((letter,pos) => new Letter(letter, pos));
		}
	}

	Array.from(document.querySelectorAll('.word')).forEach((word) => new Word(word));
};