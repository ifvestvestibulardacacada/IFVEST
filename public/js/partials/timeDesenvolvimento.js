const { ScrollObserver, valueAtPercentage } = aat;

const cardsContainer = document.querySelector('.cards');
const cards = document.querySelectorAll('.card');

// Function to update card heights and layout
function updateCardLayout() {
    const isMobile = window.innerWidth <= 1024;
    
    cards.forEach((card, index) => {
        const cardInner = card.querySelector('.card__inner');
        
        if (isMobile) {
            // Mobile layout - no scroll animation
            cardInner.style.transform = 'none';
            cardInner.style.filter = 'none';
            card.style.paddingTop = '0';
        } else {
            // Desktop layout - with scroll animation
            const offsetTop = 20 + index * 20;
            card.style.paddingTop = `${offsetTop}px`;
            
            if (index === cards.length - 1) return;
            
            const toScale = 1 - (cards.length - 1 - index) * 0.1;
            const nextCard = cards[index + 1];
            
            ScrollObserver.Element(nextCard, {
                offsetTop,
                offsetBottom: window.innerHeight - card.clientHeight
            }).onScroll(({ percentageY }) => {
                cardInner.style.transform = `scale(${valueAtPercentage({
                    from: 1,
                    to: toScale,
                    percentage: percentageY
                })})`;
                cardInner.style.filter = `brightness(${valueAtPercentage({
                    from: 1,
                    to: 0.6,
                    percentage: percentageY
                })})`;
            });
        }
    });
}

// Initial setup
updateCardLayout();

// Update on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateCardLayout, 250);
});