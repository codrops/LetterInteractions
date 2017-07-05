/**
 * demo6.js
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
				perspective: 2000,
				perspectiveOrigin: ['200% 300%', '-100% -200%', '0% 200%', '200% 200%', '200% -200%'],
				totalInner: 8	
			};
			this.pos = pos;
			this.layout();
			this.initEvents();
		}
		layout() {
			this.DOM.letterInners = [];
			const letterStr = this.DOM.letter.innerHTML;
			this.DOM.letter.innerHTML = '';
			for (let i = 0; i < this.CONFIG.totalInner; ++i) {
				const letterInner = document.createElement('span');
				letterInner.innerHTML = letterStr;
				this.DOM.letterInners.push(letterInner);
				this.DOM.letter.appendChild(letterInner);
			}
			this.DOM.letter.style.perspective = `${this.CONFIG.perspective}px`;
			this.DOM.letter.style.perspectiveOrigin = this.CONFIG.perspectiveOrigin[this.pos];
		}
		initEvents() {
			this.mouseenterFn = () => this.mouseTimeout = setTimeout(() => {
				if( this.isActive ) return;
				this.isActive = true;

				this.DOM.letter.style.zIndex = 1;
				anime.remove(this.DOM.letterInners);
				anime({
					targets: this.DOM.letterInners,
					duration: 800,
					delay: (t,i,c) => {
						return i*60;
					},
					easing: [0.2,1,0.3,1],
					translateZ: (t,i,c) => {
						return -1*(c-i-1)*300;
					},
					rotate: (t,i,c) => {
						if ( i !== c-1 ) {
							return anime.random(-10,10);
						}
					},
					opacity: (t,i,c) => {
						return (i+1)*1/(c);
					}
				});
			}, 50);
			
			this.mouseleaveFn = () => {
				clearTimeout(this.mouseTimeout);
				if( !this.isActive ) return;
				this.isActive = false;
				this.DOM.letter.style.zIndex = 100;
				anime.remove(this.DOM.letterInners);
				anime({
					targets: this.DOM.letterInners,
					duration: 200,
					delay: (t,i,c) => {
						return (c-i-1)*30;
					},
					easing: 'easeOutQuint',
					translateZ: 0,
					rotate: 0,
					opacity: {
						value: 1,
						easing: 'linear'
					}
				});
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