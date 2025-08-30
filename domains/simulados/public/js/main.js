/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
        nav = document.getElementById(navbarId);

    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            nav.classList.add('show-menu');
        });
    }
};

const closeMenu = (headerClose, navbarId) => {
    const closeBtn = document.getElementById(headerClose),
        nav = document.getElementById(navbarId);

    if (closeBtn && nav) {
        closeBtn.addEventListener('click', () => {
            nav.classList.remove('show-menu');
        });
    }
};

showMenu('header-toggle', 'navbar');
closeMenu('header-close', 'navbar');
const menu = document.getElementById('menu');
const nav = document.querySelector('.nav');
/*==================== CHANGE BACKGROUND HEADER ====================*/ 
function scrollHeader(){
        const header = document.getElementById('header')
        if(this.scrollY >= 200) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

nav.addEventListener('mouseover', () => {
    document.body.classList.add('move-right');
});

nav.addEventListener('mouseout', () => {
    document.body.classList.remove('move-right');
});

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
    linkColor.forEach(l => l.classList.remove('active'))
    this.classList.add('active')
}

linkColor.forEach(l => l.addEventListener('click', colorLink))


