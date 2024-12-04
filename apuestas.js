document.getElementById('numRaces').addEventListener('change', function() {
    const numRaces = parseInt(this.value);
    const table = document.getElementById('bettingTable');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Clear existing columns
    while (thead.children.length > 1) {
        thead.removeChild(thead.lastChild);
    }
    tbody.querySelectorAll('tr').forEach(row => {
        while (row.children.length > 1) {
            row.removeChild(row.lastChild);
        }
    });

    // Add new columns
    for (let i = 1; i <= numRaces; i++) {
        const th = document.createElement('th');
        th.textContent = `Carrera ${i}`;
        thead.appendChild(th);
        tbody.querySelectorAll('tr').forEach(row => {
            const td = document.createElement('td');
            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.min = '0';
            amountInput.placeholder = 'Cantidad';
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Nombre';
            td.appendChild(amountInput);
            td.appendChild(nameInput);
            row.appendChild(td);
        });
    }
});

document.getElementById('startRaceButton').addEventListener('click', function() {
    const table = document.getElementById('bettingTable');
    const bets = [];

    table.querySelectorAll('tbody tr').forEach(row => {
        const bet = {};
        bet.gamba = row.children[0].textContent;
        bet.races = [];
        for (let i = 1; i < row.children.length; i++) {
            const inputs = row.children[i].querySelectorAll('input');
            bet.races.push({
                amount: inputs[0].value,
                name: inputs[1].value
            });
        }
        bets.push(bet);
    });

    sessionStorage.setItem('bets', JSON.stringify(bets));
    window.location.href = 'carreragambas.html';
});
