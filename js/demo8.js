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
	// equation of a line
	const lineEq = (y2, y1, x2, x1, currentVal) => {
		// y = mx + b
		const m = (y2 - y1) / (x2 - x1);
		const b = y1 - m * x1;
		return m * currentVal + b;
	};

	class Letter {
		constructor(letter, pos) {
			this.DOM = {};
			this.DOM.letter = letter;
			this.CONFIG = {
				triggerProgress: 15
			};
			this.pos = pos;
			this.layout();
			this.initEvents();
		}
		layout() {
			this.DOM.letterInner = document.createElement('span');
			this.DOM.letterInner.innerHTML = this.DOM.letter.innerHTML;
			this.DOM.letterInner.style.transformOrigin = '50% 100%';
			this.DOM.letter.innerHTML = '';
			this.DOM.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			this.DOM.svg.setAttribute('width', '100px');
			this.DOM.svg.setAttribute('height', '150px');
			this.DOM.svg.setAttribute('viewBox', '0 0 100 150');
			this.DOM.svg.setAttribute('preserveAspectRatio', 'xMaxYMin meet');

			for (let i = 0; i < 3; i++) {
				const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
				rect.setAttribute('width', 15);
				rect.setAttribute('height', 15);
				rect.setAttribute('x', 12+i*30);
				rect.setAttribute('y', 12);
				this.DOM.svg.appendChild(rect);
			};
			this.DOM.rects = Array.from(this.DOM.svg.querySelectorAll('rect'));
			this.DOM.letter.appendChild(this.DOM.svg);
			this.DOM.letter.appendChild(this.DOM.letterInner);
		}
		initEvents() {
			this.mousedownFn = () => this.mouseTimeout = setTimeout(() => {
				if( this.isActive || this.isAnimating ) return;
				this.isActive = true;
				
				anime.remove(this.DOM.letterInner);
				anime({
					targets: this.DOM.letterInner,
					duration: 1500,
					easing: 'easeOutExpo',
					scaleX: 1.2,
					scaleY: 0.4,
					update: (a) => {
						this.currentProgress = a.progress;
						if ( this.currentProgress > this.CONFIG.triggerProgress && !this.isShaking ) {
							this.isShaking = true;
							anime.remove(this.DOM.letter);
							anime({
								targets: this.DOM.letter,
								duration: 100,
								easing: 'linear',
								loop: true,
								translateX: [{value:-1},{value:1}],
								translateY: [{value:-1},{value:1}]
							});
						}
					}
				});
			}, 50);

			this.mouseupFn = () => {
				clearTimeout(this.mouseTimeout);
				if( !this.isActive || this.isAnimating ) return;
				this.isActive = false;
				this.isAnimating = true;
				anime.remove(this.DOM.letter);
				this.isShaking = false;
				anime.remove(this.DOM.letterInner);
				
				if ( this.currentProgress > this.CONFIG.triggerProgress ) {
					const durationUp = lineEq(80,300,100,this.CONFIG.triggerProgress,this.currentProgress);
					const durationDown = lineEq(80,500,100,this.CONFIG.triggerProgress,this.currentProgress);
					anime({
						targets: this.DOM.letterInner,
						translateY: [
							{ 
								value: (t) => {
									const bcr = t.getBoundingClientRect();
									return -1*bcr.top - bcr.height;
								},
								duration: durationUp, 
								easing: 'easeInExpo' 
							},
							{ 
								value: (t) => {
									const bcr = t.getBoundingClientRect();
									return [bcr.top + bcr.height,0];
								},
								duration: durationDown, 
								easing: 'easeOutExpo' 
							}
						],
						scaleY: [
							{ 
								value: 2.8, 
								duration: durationUp, 
								easing: 'easeInExpo' 
							},
							{ 
								value: [2.8,1], 
								duration: durationDown+500, 
								elasticity: 300 
							}
						],
						scaleX: [
							{ 
								value: 0.5, 
								duration: durationUp,
								easing: 'easeInExpo' 
							},
							{ 
								value: [0.5,1], 
								duration: durationDown+500, 
								elasticity: 300 
							}
						],
						transformOrigin: [
							{
								value: '50% 100%', 
								duration: 1
							},
							{
								value: '50% 0%', 
								delay: durationUp,
								duration: 1
							},
							{
								value: '50% 100%', 
								delay: durationDown+500,
								duration: 1
							}
						],
						complete: () => { this.isAnimating = false; }
					});

					let allLettersFiltered = allLetters.filter((el, pos) => {return pos != this.pos});
					anime.remove(allLettersFiltered);
					anime({
						targets: allLettersFiltered,
						duration: 200,
						easing: 'easeOutQuad',
						translateY: [
							{
								value: [0,-30],
								delay: (t,i) => {
									let j = i >= this.pos ? i+1 : i;
									return 60*(Math.abs(this.pos-j))+durationUp/2;
								}
							},
							{
								value: 0,
								duration: 800,
								easing: 'easeOutElastic'
							}
						]
					});

					anime.remove(this.DOM.rects);
					anime({
						targets: this.DOM.rects,
						duration: durationUp,
						delay: durationUp/2,
						easing: 'easeOutQuint',
						opacity: [
							{value: 1, duration: 10, easing: 'linear'},
							{value: 0, duration: durationUp-10, easing: 'linear'}
						],
						translateY: (t,i) => { return [-100, anime.random(100,250)]; },
						scaleX: [0.5,0.5],
						scaleY: () => { return [1, anime.random(3,10)]; }
					});
				}
				else {
					anime({
						targets: this.DOM.letterInner,
						duration: lineEq(1000,300,this.CONFIG.triggerProgress,0,this.currentProgress),
						easing: 'easeOutExpo',
						scaleX: 1,
						scaleY: 1,
						complete: () => { this.isAnimating = false; }
					});
				}
			};
			
			this.DOM.letter.addEventListener('mousedown', this.mousedownFn);
			this.DOM.letter.addEventListener('mouseup', this.mouseupFn);
			this.DOM.letter.addEventListener('mouseleave', this.mouseupFn);
			this.DOM.letter.addEventListener('touchstart', this.mousedownFn);
			this.DOM.letter.addEventListener('touchend', this.mouseupFn);
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
			Array.from(this.DOM.word.querySelectorAll('span')).forEach((letter,pos) => {
				new Letter(letter, pos);
				allLetters.push(letter);
			});
		}
	}

	let allLetters = [];

	Array.from(document.querySelectorAll('.word')).forEach((word) => new Word(word));
};