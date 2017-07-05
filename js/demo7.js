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
		constructor(letter, row, col) {
			this.DOM = {};
			this.DOM.letter = letter;
			this.row = letter.style.gridRow = row;
			this.col = letter.style.gridColumn = col;
			this.layout();
		}
		layout() {
			this.DOM.letterInner = document.createElement('span');
			this.DOM.letterInner.innerHTML = this.DOM.letter.innerHTML;
			this.DOM.letterInner.style.transformOrigin = this.row % 2 == 0 ? '0% 50%' : '100% 50%';
			this.DOM.letter.innerHTML = '';
			this.DOM.letter.appendChild(this.DOM.letterInner);
			this.DOM.letter.style.perspective = '2000px';
		}
	}

	class LetterCross extends Letter {
		constructor(letter, row, col) {
			super(letter, row, col);
			letter.classList.add('word__cross');
		}
	}

	class LetterMain extends Letter {
		constructor(letter, row, col) {
			super(letter, row, col);
			letter.classList.add('word__main');
			this.DOM.letterInner.style.transformOrigin = '50% 50%';
			this.letters = [];
			this.initEvents();
		}
		addLetter(letter) {
			if( letter.row !== this.row ) {
				this.letters.push(letter.DOM.letterInner);
			}
		}
		initEvents() {
			this.mouseenterFn = () => this.mouseTimeout = setTimeout(() => {
				if( this.isActive ) return;
				this.isActive = true;
				anime.remove(this.letters);
				anime({
					targets: this.letters,
					duration: 500,
					delay: (t,i,c) => {
						return i*75;
					},
					easing: [0.2,1,0.3,1],
					rotateY: (t,i) => {
						return t.row % 2 == 0 ? [90,0] : [-90,0];
					},
					opacity: {
						value: 1,
						duration: 200,
						easing: 'linear'
					}
				});
				
				anime.remove(this.DOM.letterInner);
				anime({
					targets: this.DOM.letterInner,
					duration: 300,
					easing: 'easeInOutQuad',
					rotateY: [0,180],
					color: [
						{value: '#3f2b9a', delay: 150, duration: 1}
					]
				});
			}, 50);
			
			this.mouseleaveFn = () => {
				clearTimeout(this.mouseTimeout);
				if( !this.isActive ) return;
				this.isActive = false;
				
				anime.remove(this.letters);
				anime({
					targets: this.letters,
					duration: 500,
					easing: [0.2,1,0.3,1],
					rotateY: (t,i) => {
						return t.row % 2 == 0 ? 90 : -90;
					},
					opacity: {
						value: 0,
						duration: 200,
						easing: 'linear'
					}
				});

				anime.remove(this.DOM.letterInner);
				anime({
					targets: this.DOM.letterInner,
					duration: 300,
					easing: 'easeInOutQuad',
					rotateY: 0,
					color: [
						{value: '#fff', delay: 150, duration: 1}
					]
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
			this.DOM.wrapper = word;
			this.DOM.wordMain = word.querySelector('.word__main');
			this.DOM.wordCross = Array.from(word.querySelectorAll('.word__cross'));
			this.lettersMain = [];
			this.layout();
		}
		layout() {
			this.toLetters(this.DOM.wordMain);
			this.DOM.wordCross.forEach(w => this.toLetters(w, false));
		}
		toLetters(el, mainWord = true) {
			charming(el, {classPrefix: 'letter'});
			const row = parseInt(el.dataset.row);
			const col = parseInt(el.dataset.column);
			Array.from(el.querySelectorAll('span')).forEach((l,pos) => {
				let letter;
				if( mainWord ) {
					letter = new LetterMain(l, row, pos === 0 ? col : col+pos);
					this.lettersMain.push(letter);
				}
				else {
					letter = new LetterCross(l, pos === 0 ? row : row+pos, col);
					this.lettersMain[col-1].addLetter(letter);
				}
				this.DOM.wrapper.insertBefore(l, el);
			});
			this.DOM.wrapper.removeChild(el);
		}
	}

	Array.from(document.querySelectorAll('.word')).forEach((word) => new Word(word));
};