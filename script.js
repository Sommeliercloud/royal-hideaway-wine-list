document.addEventListener('DOMContentLoaded', () => {

    let wineDatabase = [];
    let currentCountryFilter = 'all';

    const modal = document.getElementById('wineModal');
    const logo = document.querySelector('.hotel-logo-text');

    // Ocultar logo al hacer scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            logo.classList.add('hidden');
        } else {
            logo.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
    });



    // Cargar la base de datos de vinos desde el archivo JSON

    fetch('wines.json')

        .then(response => response.json())

        .then(data => {

            wineDatabase = data;

            populateWineSections(wineDatabase);

            setupCountryFilters();

        })

        .catch(error => console.error('Error al cargar la base de datos de vinos:', error));



    // Función para llenar las secciones con las tarjetas de vino

    function populateWineSections(wines) {

        const sections = {

            espumosos: document.querySelector('#espumosos .wine-grid'),

            blancos: document.querySelector('#blancos .wine-grid'),

            rosados: document.querySelector('#rosados .wine-grid'),

            tintos: document.querySelector('#tintos .wine-grid')

        };



        // Limpiar secciones por si acaso

        for (const key in sections) {

            sections[key].innerHTML = '';

        }



        // Filtrar vinos por país si hay un filtro activo

        const filteredWines = currentCountryFilter === 'all'
            ? wines
            : wines.filter(wine => wine.pais === currentCountryFilter);



        // Crear y añadir cada tarjeta de vino

        filteredWines.forEach(wine => {

            const wineCard = document.createElement('div');

            wineCard.className = 'wine-card';

            wineCard.setAttribute('onclick', `openModal('${wine.id}')`);



            wineCard.innerHTML = `

                <div class="img-container"><img src="${wine.image}" alt="${wine.name}"></div>

                <div>

                    <h3>${wine.name}</h3>

                    <span class="volume">${wine.volume}</span>

                    <p class="origin">${wine.subHeader.split('–')[1].trim()}</p>

                    <p class="price">${wine.price}</p>

                </div>

            `;



            if (sections[wine.category]) {

                sections[wine.category].appendChild(wineCard);

            }

        });

    }



    // Funciones del Modal (globales para ser accesibles por onclick)

    window.openModal = function(wineId) {

        const wine = wineDatabase.find(w => w.id === wineId);

        if (!wine) return;



        const bodyPosition = getBodyPosition(wine.body);

        const modalHTML = `

            <div class="modal-content">

                <span class="close-button" onclick="closeModal()">&times;</span>

                <a href="#top" class="home-button" onclick="closeModal()">&#8962;</a>

                <div class="modal-image"><img src="${wine.image}" alt="${wine.name}"></div>

                <div class="modal-info">

                    <h2>${wine.name}</h2>

                    <p class="wine-sub-header">${wine.volume} | ${wine.subHeader}</p>

                    <h3>NOTAS DE CATA | TASTING NOTES</h3>

                    <div class="lang-block"><span class="lang-tag">ES</span><p>${wine.tasting_es}</p></div>

                    <div class="lang-block"><span class="lang-tag">EN</span><p>${wine.tasting_en}</p></div>

                    <h3>MARIDAJE | PAIRING</h3>

                    <div class="lang-block"><span class="lang-tag">ES</span><p>${wine.pairing_es}</p></div>

                    <div class="lang-block"><span class="lang-tag">EN</span><p>${wine.pairing_en}</p></div>

                    <h3>CUERPO | BODY</h3>

                    <div class="body-scale"><div class="body-indicator" style="left: ${bodyPosition};"></div></div>

                    <div class="body-labels">

                        <span>Ligero / Light</span>

                        <span>Medio / Medium</span>

                        <span>Robusto / Full-Bodied</span>

                    </div>

                </div>

            </div>`;

       

        modal.innerHTML = modalHTML;

        modal.style.display = "block";

        document.body.style.overflow = 'hidden';

    }



    window.closeModal = function() {

        modal.style.display = "none";

        document.body.style.overflow = 'auto';

    }



    function getBodyPosition(body) {

        switch (body.toLowerCase()) {

            case 'ligero': return '15%';

            case 'medio': return '50%';

            case 'robusto': return '85%';

            default: return '50%';

        }

    }



    window.onclick = function(event) {

        if (event.target == modal) {

            closeModal();

        }

    }



    // Configurar filtros de país

    function setupCountryFilters() {

        const filterButtons = document.querySelectorAll('.filter-btn');



        filterButtons.forEach(button => {

            button.addEventListener('click', function() {

                // Remover clase active de todos los botones

                filterButtons.forEach(btn => btn.classList.remove('active'));



                // Agregar clase active al botón clickeado

                this.classList.add('active');



                // Actualizar el filtro actual

                currentCountryFilter = this.getAttribute('data-country');



                // Repoblar las secciones con el filtro aplicado

                populateWineSections(wineDatabase);

            });

        });

    }

});