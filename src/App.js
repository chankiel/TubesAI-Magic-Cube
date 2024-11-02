import './App.css';

function App() {
  function createAppendForResults(el1, id, innerTexte, value, delay) {
    const divElement = document.createElement('div');
    divElement.id = id;
    divElement.className = "res-effect";
    const h1Element = document.createElement('h1');
    h1Element.innerText = value;
    const pElement = document.createElement('p');
    pElement.innerText = innerTexte;
    divElement.appendChild(h1Element);
    divElement.appendChild(pElement);
    el1.appendChild(divElement)

    setTimeout(() => {
      el1.classList.add('visible');
    }, delay);
  }

  const solveCube = () => {
    const selected = document.getElementById('input-select');
    const selectedValue = selected.value;
    console.log(selectedValue);

    const resultContainer = document.getElementById('result-placer');
    resultContainer.innerHTML = '';

    createAppendForResults(resultContainer, 'objective-score', 'Objective Score', 500, 500);
    createAppendForResults(resultContainer, 'jumlah-populasi', 'Population Amount', 500, 500);
    createAppendForResults(resultContainer, 'banyak-iterasi', 'Iterations', 500, 500);
    createAppendForResults(resultContainer, 'durasi-proses-pencarian', 'Searching Process Duration', 500, 500);
  }

  return (
    <div className="App">
      <header className='header'>
        <h1>Le Cube Magique</h1>
      </header>
      <main>
        <div className='main-element'>
          <div className='input-result-container'>
            <section id="input-form">
              <div className='form-texts'>
                <h1>Solve This Magical Cube</h1>
                <h2>
                A magic cube is a three-dimensional extension of a magic square, where multiple magic squares are arranged in a cube formation. In a magic cube of order n×n×n, each layer (horizontal, vertical, and depth) forms an n×n magic square.
                </h2>
              </div>
              <div className="input-container">
                <select id="input-select" className='selectors'>
                  <option value="Steepest Ascent Hill Climbing">Steepest Ascent Hill Climbing</option>
                  <option value="Sideways Move Hill Climbing">Sideways Move Hill Climbing</option>
                  <option value="Random Restart Hill Climbing">Random Restart Hill Climbing</option>
                  <option value="Stochastic Hill Climbing">Stochastic Hill Climbing</option>
                  <option value="Simulated Annealing">Simulated Annealing</option>
                  <option value="Genetic Algorithm">Genetic Algorithm</option>
                </select>
                <button id="solve" onClick={solveCube} className='selectors'>Solve</button>
              </div>
            </section>
            <section id="cube">This is le cube</section>
          </div>
        </div>
        <footer className='footer'>
          <section id="results">
            <div id="result-placer" className="result-container">
            </div>
          </section>
        </footer>
      </main>
    </div>
  );
}

export default App;
