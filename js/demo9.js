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
		constructor(letter) {
			this.DOM = {};
			this.DOM.letter = letter;
			this.DOM.letterPath = this.DOM.letter.querySelector('path.letter-solid');
			this.DOM.letterLines = this.DOM.letter.querySelector('path.letter-weaved');
			this.initEvents();
		}
		initEvents() {
			this.mouseenterFn = () => this.mouseTimeout = setTimeout(() => {
				if( this.isActive ) return;
				this.isActive = true;

				anime.remove(this.DOM.letterPath);
				anime({
					targets: this.DOM.letterPath,
					duration: 400,
					easing: 'easeOutExpo',
					scale: [1,0.9],
					opacity: {
						value: 0,
						duration: 100,
						easing: 'linear'
					}
				});

				anime.remove(this.DOM.letterLines);
				anime({
					targets: this.DOM.letterLines,
					duration: 2000,
					easing: 'linear',
					strokeDashoffset: [anime.setDashoffset, 0],
					opacity: {
						value: 1,
						duration: 1
					}
				});
			}, 50);
			
			this.mouseleaveFn = () => {
				clearTimeout(this.mouseTimeout);
				if( !this.isActive ) return;
				this.isActive = false;

				anime.remove(this.DOM.letterLines);
				anime({
					targets: this.DOM.letterLines,
					duration: 1000,
					easing: 'linear',
					strokeDashoffset: anime.setDashoffset
				});

				anime.remove(this.DOM.letterPath);
				anime({
					targets: this.DOM.letterPath,
					duration: 400,
					delay: 1100,
					easing: 'easeOutExpo',
					scale: 1,
					opacity: {
						value: 1,
						duration: 100,
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
			Array.from(this.DOM.word.querySelectorAll('svg')).forEach((letter,pos) => new Letter(letter));
		}
	}

	Array.from(document.querySelectorAll('.word')).forEach((word) => new Word(word));
};