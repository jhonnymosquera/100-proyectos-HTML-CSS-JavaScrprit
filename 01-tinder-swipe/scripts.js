const DECISION = 80;
let isAnimating = false;
let pullDeltaX = 0; // distancia que la card se esta arrastrando

function startDrag(event) {
	if (isAnimating) return;

	const actualCard = event.target.closest('article');
	if (!actualCard) return;

	const startX = event.pageX ?? event.touches[0].pageX;

	document.addEventListener('mousemove', onMove);
	document.addEventListener('mouseup', onEnd);

	document.addEventListener('touchmove', onMove, { passive: true });
	document.addEventListener('touchend', onEnd, { passive: true });

	function onMove(event) {
		const currentX = event.pageX ?? event.touches[0].pageX;

		pullDeltaX = currentX - startX;

		if (pullDeltaX == 0) return;

		isAnimating = true;

		const deg = pullDeltaX / 14;

		actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
		actualCard.style.cursor = 'grabbing';

		const opacity = Math.abs(pullDeltaX) / 100;

		const isRight = pullDeltaX > 0;

		const choiceEl = isRight ? actualCard.querySelector('.choice.like') : actualCard.querySelector('.choice.nope');

		choiceEl.style.opacity = opacity;
	}

	function onEnd(event) {
		document.removeEventListener('mousemove', onMove);
		document.removeEventListener('mouseup', onEnd);

		document.removeEventListener('touchmove', onMove, { passive: true });
		document.removeEventListener('touchend', onEnd, { passive: true });

		const decisionMade = Math.abs(pullDeltaX) >= DECISION;

		if (decisionMade) {
			const goRight = pullDeltaX >= 0;

			actualCard.classList.add(goRight ? 'go-right' : 'go-left');
			actualCard.addEventListener('transitionend', () => {
				actualCard.remove();
			});
		} else {
			actualCard.classList.add('reset');
			actualCard.classList.remove('go-right', 'go-left');
			const choice = actualCard.getElementsByClassName('choice');

			for (let i = 0; i < choice.length; i++) {
				choice[i].style.opacity = 0;
			}
		}

		actualCard.addEventListener('transitionend', () => {
			actualCard.removeAttribute('style');
			actualCard.classList.remove('reset');
			isAnimating = false;
			pullDeltaX = 0;
			actualCard.style.cursor = 'grab';
		});
	}
}
document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: true });
