
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
   
    const confirmation = confirm('คุณต้องการที่จะลบข้อมูลทั้งหมดใช่หรือไม่?');
    
   
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

    
    alert('ข้อมูลทั้งหมดถูกลบแล้ว');
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
    const numberNames = Array.from({ length: 100 }, () => []); // Array to store names associated with each number
    let totalAmount = 0;
    let matchingNumberAmount = 0;
    let nonMatchingNumberAmount = 0;

    const searchNumber = parseInt(document.getElementById('search-number').value);
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
                numberNames[number].push(name); // Store the name associated with this number

                if (number === searchNumber) {
                    matchingNumberAmount += amount;
                    row.classList.add('highlighted'); // Highlight the row associated with the matching number
                } else {
                    nonMatchingNumberAmount += amount;
                    row.classList.remove('highlighted'); // Remove highlighting from non-matching rows
                }
            }

            totalAmount += amount;
        }
    });

    const numberSummaryElement = document.querySelector('.number-fields');
    numberSummaryElement.innerHTML = '';

    const totalAmountElement = document.createElement('div');
    totalAmountElement.textContent = `1. จำนวนเงินทั้งหมด: ${totalAmount} บาท`;
    numberSummaryElement.appendChild(totalAmountElement);

    const matchingNumberAmountElement = document.createElement('div');
    matchingNumberAmountElement.textContent = `2. จำนวนเงินที่ถูก: ${matchingNumberAmount} บาท`;
    numberSummaryElement.appendChild(matchingNumberAmountElement);

    // Display names associated with the matching numbers
    const matchingNumberNames = numberNames[searchNumber];
    if (matchingNumberNames && matchingNumberNames.length > 0) {
        const matchingNumberNamesElement = document.createElement('div');
        matchingNumberNamesElement.textContent = `   Names: ${matchingNumberNames.join(', ')}`;
        matchingNumberAmountElement.appendChild(matchingNumberNamesElement);
    }

    const nonMatchingNumberAmountElement = document.createElement('div');
    nonMatchingNumberAmountElement.textContent = `3. จำนวนเงินที่ไม่ถูก: ${nonMatchingNumberAmount} บาท`;
    numberSummaryElement.appendChild(nonMatchingNumberAmountElement);

    // Display names associated with the non-matching numbers
    const nonMatchingNumberNames = numberNames.filter((_, index) => index !== searchNumber).flat();
    if (nonMatchingNumberNames.length > 0) {
        const nonMatchingNumberNamesElement = document.createElement('div');
        nonMatchingNumberNamesElement.textContent = `   Names: ${nonMatchingNumberNames.join(', ')}`;
        nonMatchingNumberAmountElement.appendChild(nonMatchingNumberNamesElement);
    }

    for (let i = 0; i < 100; i++) {
        const numberField = document.createElement('div');
        numberField.classList.add('number-field');
        numberField.innerHTML = `
            <h4>Number: ${String(i).padStart(2, '0')}</h4>
            <p>Count: ${numberCounts[i]} times</p>
            <p>Total amount: ${numberAmounts[i]} Baht</p>
            <p>Names: ${numberNames[i].join(', ')}</p>`; // Join names with a comma
        numberSummaryElement.appendChild(numberField);
    }
});



document.getElementById('search-button').addEventListener('click', function() {
    const searchNumber = document.getElementById('search-number').value;
    if (!searchNumber) {
      alert('Please enter a number.');
      return;
    }
  
    const rows = document.querySelectorAll('#entry-list tr');
  
    // Highlight rows with matching number
    rows.forEach(row => {
      const numberCell = row.querySelector('td:nth-child(2)');
      if (numberCell.textContent.toLowerCase() === searchNumber.toLowerCase()) {
        row.classList.add('highlighted');
    } else {
        row.classList.remove('highlighted'); // Remove highlighting from non-matching rows
    }
    
    });
  });
  
// Get the button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
// When the user clicks on the button, scroll to the top of the document smoothly
scrollToTopBtn.addEventListener("click", () => {
    // Scroll to the top with smooth behavior
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


