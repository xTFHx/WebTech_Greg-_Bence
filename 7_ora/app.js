const GL_ACCES_TOKEN = 'ghp_6ihalPJRDieehQRI2bbL66ztwhZ-Na61pTOME'

function loadNavigation() {
    fetch('./navbar.html')
        .then(res => res.text())
        .then(navbarHtml => {
            document.body.insertAdjacentHTML('afterbegin', navbarHtml)
        })
        .catch(err => {
            console.error(err);
            alert("Hiba a menürendszer betöltésekor.");
        });
}

loadNavigation();