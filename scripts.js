window.onload = function() {
    const savedData = getFromLocalStorage();
    if (savedData) {
        savedData.forEach(entry => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.number}</td>
                <td>${entry.amount}</td>
                <td><button class="delete-button">Delete</button></td>
            `;
            document.getElementById('entry-list').appendChild(row);
        });
    }
};

document.getElementById('entry-form').addEventListener('submit', function(event) {
    event.preventDefault(); 

 
    const name = document.getElementById('name').value;
    const number = document.getElementById('number').value;
    const amount = document.getElementById('amount').value;

    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>${number}</td>
        <td>${amount}</td>
        <td><button class="delete-button">Delete</button></td>
    `;

    document.getElementById('entry-list').appendChild(row);

  
    const data = {
        name: name,
        number: number,
        amount: amount
    };
    saveToLocalStorage(data);

    document.getElementById('name').value = '';
    document.getElementById('number').value = '';
    document.getElementById('amount').value = '';
});

document.getElementById('entry-list').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button')) {
        const row = event.target.parentElement.parentElement;
        const name = row.children[0].innerText;
        const number = row.children[1].innerText;
        const amount = row.children[2].innerText;
        const confirmation = confirm(`Are you sure you want to delete ${name}'s entry?`);
        
        if (confirmation) {
            deleteRow(row);
            removeFromLocalStorage(name, number, amount);
        }
    }
});

document.getElementById('clear-button').addEventListener('click', function() {
   
    const confirmation = confirm('Are you sure you want to clear all data?');
    
   
    if (confirmation) {
        clearData();
    }
});

function deleteRow(row) {
    row.remove();
}

function removeFromLocalStorage(name, number, amount) {
    const savedData = getFromLocalStorage();
    if (savedData) {
        const newData = savedData.filter(entry => !(entry.name === name && entry.number === number && entry.amount === amount));
        localStorage.setItem('entries', JSON.stringify(newData));
    }
}

function clearData() {
   
    document.getElementById('entry-list').innerHTML = '';

   
    localStorage.removeItem('entries');

    
    alert('All data has been cleared.');
}

function saveToLocalStorage(data) {
    let savedData = localStorage.getItem('entries');
    if (!savedData) {
        savedData = [];
    } else {
        savedData = JSON.parse(savedData);
    }
    savedData.push(data);
    localStorage.setItem('entries', JSON.stringify(savedData));
}

function getFromLocalStorage() {
    const savedData = localStorage.getItem('entries');
    return savedData ? JSON.parse(savedData) : [];
}


document.getElementById('sum-up-button').addEventListener('click', function() {
  
    const numberCounts = Array.from({ length: 100 }, () => 0);
    const numberAmounts = Array.from({ length: 100 }, () => 0);
    const numberNames = Array.from({ length: 100 }, () => []);

  
    const rows = document.querySelectorAll('#entry-list tr');

   
    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)');
        const numberCell = row.querySelector('td:nth-child(2)');
        const amountCell = row.querySelector('td:nth-child(3)');

        if (nameCell && numberCell && amountCell) {
            const name = nameCell.textContent;
            const number = parseInt(numberCell.textContent);
            const amount = parseInt(amountCell.textContent);

         
            if (number >= 0 && number < 100) {
                numberCounts[number]++;
                numberAmounts[number] += amount;
                numberNames[number].push(name);
            }
        }
    });

 
    const numberSummaryElement = document.querySelector('.number-fields');
    numberSummaryElement.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const numberField = document.createElement('div');
        numberField.classList.add('number-field');
        numberField.innerHTML = `
            <h4>เลข: ${String(i).padStart(2, '0')}</h4>
            <p>จำนวน: ${numberCounts[i]} ครั้ง</p>
            <p>จำนวนเงินทั้งหมด: ${numberAmounts[i]} บาท</p>
            <p>ใครบ้าง: ${numberNames[i].join(', ')}</p>
        `;
        numberSummaryElement.appendChild(numberField);
    }
});



