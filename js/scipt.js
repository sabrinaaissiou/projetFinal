// Fonction pour mélanger un tableau
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// Fonction pour créer la grille
function createGrid() {
    const gridElement = document.getElementById('grid');
    const grid = [];

    for (let y = 0; y < 15; y++) {
        const row = [];
        for (let x = 0; x < 25; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'empty');
            row.push(cell);
            gridElement.appendChild(cell);
        }
        grid.push(row);
    }
    

// fonction pour générer un labyrinthe 
    function generateMaze(x, y) {
        const directions = [
            [0, -2], 
            [0, 2],  
            [-2, 0], 
            [2, 0]   
    ];

        shuffle(directions); // Mélanger les directions pour éviter les circuits fermés

        for (const direction of directions) {
            const dx = direction[0];
            const dy = direction[1];

            const newX = x + dx;
            const newY = y + dy;

            if (newX >= 0 && newX < 25 && newY >= 0 && newY < 15) {
                if (!grid[newY][newX].classList.contains('wall')) {
                    grid[newY][newX].classList.add('wall');
                    grid[y + dy / 2][x + dx / 2].classList.add('wall');
                    generateMaze(newX, newY);
                }
            }
        }
    }

    // Génération du  labyrinthe en commençant depuis une position aléatoire
    const startX = Math.floor(Math.random() * 12) * 2 + 1;
    const startY = Math.floor(Math.random() * 7) * 2 + 1;
    generateMaze(startX, startY);


    // Placement des monstres dune maniere aleatoire
    for (let i = 0; i < 3; i++) {
    let randomX, randomY;
    do {
    randomX = Math.floor(Math.random() * 23) + 1; // Limiter les positions pour éviter les bords
    randomY = Math.floor(Math.random() * 13) + 1;
    } while (grid[randomY][randomX].classList.contains('wall') || grid[randomY][randomX].classList.contains('monster'));

    grid[randomY][randomX].classList.add('monster');
    }


    //placer les tresors

    const mazeWidth = 25; // Largeur du labyrinthe
    const mazeHeight = 15; // Hauteur du labyrinthe


    for (let i = 0; i < 5; i++) {
    let randomX, randomY;
    let maxAttempts = 100; 

    do {
    randomX = Math.floor(Math.random() * mazeWidth);
    randomY = Math.floor(Math.random() * mazeHeight);
    maxAttempts--;
    } while (
    (grid[randomY][randomX].classList.contains('wall') ||
    grid[randomY][randomX].classList.contains('treasure') ||
    !isAccessibleFromStart(grid, randomX, randomY, startX, startY)) &&
    maxAttempts > 0
     );

    if (maxAttempts === 0) {
    console.log("Impossible de placer un trésor accessible.");
    break; 
    }

    grid[randomY][randomX].classList.add('treasure-cell');
    grid[randomY][randomX].classList.add('treasure');
    }



    // Fonction pour marquer les cellules accessibles 
    function isAccessibleFromStart(grid, x, y, startX, startY) {
    let visited = new Array(grid.length).fill(false).map(() => new Array(grid[0].length).fill(false));
    let queue = [{ x: startX, y: startY }];

    while (queue.length > 0) {
    let current = queue.shift();

    if (current.x === x && current.y === y) {
    return true;
    }

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        let newX = current.x + dx;
        let newY = current.y + dy;

        if (
            newX >= 0 && newX < grid[0].length &&
            newY >= 0 && newY < grid.length &&
            !visited[newY][newX] &&
            !grid[newY][newX].classList.contains('wall')
        ) {
            visited[newY][newX] = true;
            queue.push({ x: newX, y: newY });
        }
       }
      }
    }

        return false;
}

    return grid;
}


// Classe Monstre pour représenter les monstres
class Monstre {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function checkCollision() {
    if (donjon.isGameOver()) {
       
        return;
    }

    const playerCell = donjon.grid[donjon.playerY][donjon.playerX];

    // Vérifier si la case du joueur contient un monstre
    if (playerCell.classList.contains('monster')) {
        donjon.gameOver = true;
        alert('Game Over! Votre score : ' + donjon.score);
        return;
    }

    // Vérifier si la case du joueur contient un trésor
    if (playerCell.classList.contains('treasure')) {
        donjon.score++;
        playerCell.classList.remove('treasure');
        if (donjon.score >= 5) {
            donjon.gameOver = true;
            alert('Vous avez gagné! Votre score : ' + donjon.score);
        }
    }
}


// Classe Donjon qui sert a gerer la logique du jeu
class Donjon {
    constructor(grid) {
        this.grid = grid;
        this.playerX = 0;
        this.playerY = 0;
        this.score = 0;
        this.gameOver = false;
        this.grid[0][0].classList.add('player');

        this.monsters = [];
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 25; x++) {
                if (this.grid[y][x].classList.contains('monster')) {
                    this.monsters.push(new Monstre(x, y));
                }
            }
        }
    }
    

    movePlayer(dx, dy) {
        if (this.gameOver) return;

        const newX = this.playerX + dx;
        const newY = this.playerY + dy;
        const newCell = this.grid[newY][newX];

        if (newX >= 0 && newX < 25 && newY >= 0 && newY < 15 && !newCell.classList.contains('wall')) {
       
            if (newCell.classList.contains('monster')) {
                this.gameOver = true;
                alert('Game Over! Votre score : ' + this.score);
                return;
            } else if (newCell.classList.contains('treasure')) {
                this.score++;
                newCell.classList.remove('treasure');
            }

            this.grid[this.playerY][this.playerX].classList.remove('player');
            newCell.classList.add('player');
            this.playerX = newX;
            this.playerY = newY;

            if (this.score >= 5) { 
                this.gameOver = true;
                alert('Vous avez gagne! Votre score : ' + this.score);
            }

            this.checkCollision(); 
        }
    }

    checkCollision() {
        const playerCell = this.grid[this.playerY][this.playerX];
        if (playerCell.classList.contains('monster')) {
            this.gameOver = true;
            alert('Game Over! Votre score : ' + this.score);
        }
    }

  



moveMonsters() {
    if (this.gameOver) return;

    const playerX = this.playerX;
    const playerY = this.playerY;

    for (const monster of this.monsters) {
        const dx = playerX - monster.x;
        const dy = playerY - monster.y;

        let newX = monster.x;
        let newY = monster.y;

        // Choix de la direction la plus proche du joueur
        if (Math.abs(dx) > Math.abs(dy)) {
            newX = monster.x + Math.sign(dx);
        } else {
            newY = monster.y + Math.sign(dy);
        }

        if (
            newX >= 0 && newX < 25 &&
            newY >= 0 && newY < 15 &&
            !this.grid[newY][newX].classList.contains('wall') &&
            !this.grid[newY][newX].classList.contains('treasure') &&
            !this.grid[newY][newX].classList.contains('monster')
        ) {

            // Mettre à jour la position du monstre
            this.grid[monster.y][monster.x].classList.remove('monster');
            monster.x = newX;
            monster.y = newY;
            this.grid[monster.y][monster.x].classList.add('monster');
        }
    }
}



    getGrid() {
        return this.grid.map(row => row.map(cell => cell.className));
    }

    getScore() {
        return this.score;
    }

    isGameOver() {
        return this.gameOver;
    }
}


// Initialiser la grille et le jeu
const grid = createGrid();
let donjon = new Donjon(grid); 

// Fonction qui met à jour l'affichage de la grille et du score
function updateGridAndScore() {

    const grid = donjon.getGrid();
    for (let y = 0; y < 15; y++) {
        for (let x = 0; x < 25; x++) {
            const cellType = grid[y][x];
            grid[y][x].className = cellType;
        }
    }

    document.getElementById('score').innerText = 'Score: ' + donjon.getScore();
}

donjon.moveMonsters(); // Appel à moveMonsters apres que le joueur se deplace 

// Gérer les déplacements du joueur avec les boutons de contrôle
btnUp.addEventListener('click', () => {
    donjon.movePlayer(0, -1);
    donjon.moveMonsters();
    checkCollision(); 
    updateGridAndScore();
});

btnDown.addEventListener('click', () => {
    donjon.movePlayer(0, 1);
    donjon.moveMonsters();
    checkCollision();
});

btnLeft.addEventListener('click', () => {
    donjon.movePlayer(-1, 0);
    donjon.moveMonsters();
    checkCollision(); 
    updateGridAndScore();
});

btnRight.addEventListener('click', () => {
    donjon.movePlayer(1, 0);
    donjon.moveMonsters();
    checkCollision(); 
    updateGridAndScore();
});

// Gérer les déplacements du joueur avec les flèches du clavier
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        donjon.movePlayer(0, -1);
        donjon.moveMonsters();
        checkCollision(); 
        updateGridAndScore();
    } else if (event.key === 'ArrowDown') {
        donjon.movePlayer(0, 1);
        donjon.moveMonsters();
        checkCollision(); 
        updateGridAndScore();
    } else if (event.key === 'ArrowLeft') {
        donjon.movePlayer(-1, 0);
        donjon.moveMonsters();
        checkCollision(); 
        updateGridAndScore();
    } else if (event.key === 'ArrowRight') {
        donjon.movePlayer(1, 0);
        donjon.moveMonsters();
        checkCollision();
        updateGridAndScore();
    }
});


// Récupération du  bouton "Recommencer"
const btnRestart = document.getElementById('btnRestart');

// Gérer le clic sur le bouton "Recommencer"

btnRestart.addEventListener('click', () => {
    // Réinitialiser la grille et le jeu
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = ''; 
    const newGrid = createGrid();
    donjon = new Donjon(newGrid);
    donjon.score = 0;

    // Mettre à jour l'affichage du score
    document.getElementById('score').innerText = 'Score: 0';
});