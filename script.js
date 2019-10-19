(() => {
  const cardWidth = 400;
  const url = 'https://pixabay.com/api/?key=8156433-1f1d20d41a35fcae4e667e5b5&image_type=photo';

  const elements = document.getElementsByClassName('container');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const pacmanButton = document.getElementById('pacman');

  let pacmanInserted = false;
  let eatenCards = 0;
  let steps = 1;
  let pacman;

  let cards = [];

  if (!elements.length) {
    throw new Error('No element with class "container" was found');
  }

  const container = elements[0];

  /**
   * @param {string} search
   */
  function getImages(search) {
    fetch(`${url}&q=${search}`)
      .then(response => response.json())
      .then(response => {
        container.innerHTML = '';
        cards = [];
        pacmanInserted = false;
        eatenCards = 0;
        steps = 1;
        response.hits.forEach(picture => {

          const imgElement = document.createElement('img');
          imgElement.src = picture.webformatURL;

          const card = document.createElement('div');
          card.classList.add('card');
          card.appendChild(imgElement);

          cards.push(card);
          container.appendChild(card);
        });
      });
  }

  searchInput.addEventListener('keyup', (event) => {
    if (event.keyCode && event.keyCode !== 13) {
      return;
    }
    getImages(searchInput.value);
  });

  searchButton.addEventListener('click', () => {
    getImages(searchInput.value);
  });

  function activatePacman() {
    if (eatenCards === 2) {
      return;
    }
    const left = steps * 100;
    const card = cards[cards.length - 1];

    setTimeout(() => {
      if (left % 400 === 0 && left > 400) {
        card.remove();
        cards.splice(cards.length - 1, 1);
        eatenCards++;
        steps -= 8;
      } else if (left % 400 === 0) {
        card.classList.add('pacman-food');
      }

      pacman.style.marginLeft = -(steps++) * 100 + 'px';

      if (eatenCards === 2) {
        pacman.remove();
      } else {
        activatePacman();
      }

    }, 250);
  }

  // Add pacman in page and activate it
  pacmanButton.addEventListener('click', () => {
    if (pacmanInserted) {
      return;
    }

    const halfPacman = document.createElement('div');
    halfPacman.classList.add('half-pacman');

    const card = document.createElement('div');

    card.appendChild(halfPacman);
    card.appendChild(halfPacman.cloneNode());

    container.append(card);

    pacman = card;
    pacman.style.height = '300px';
    pacmanInserted = true;

    activatePacman();
  });

  getImages('minions');
})();
