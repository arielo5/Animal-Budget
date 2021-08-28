const request = indexedDB.open('Animal_Budget', 1);

let db;

function uploadTransaction() {

    console.log("Uploading!!");
    
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_transaction');

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {

        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
              method: 'POST',
              body: JSON.stringify(getAll.result),
              headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              }
            }).then(response => response.json())
              .then(serverResponse => {
                if (serverResponse.message) {
                  throw new Error(serverResponse);
                }
                
                budgetObjectStore.clear();
      
                const transaction = db.transaction(['new_transaction'], 'readwrite');      

                const budgetObjectStore = transaction.objectStore('new_transaction');
                
                alert('All Saved up to date!');

              }).catch(err => {console.log(err)});

    }
  }
}; 

function saveNumbers(num) {
      const transaction = db.transaction(['new_transaction'],
      'readwrite');

      const budgetObjectStore = transaction.objectStore("new_transaction");

      budgetObjectStore.add(num);
  };

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
  };

request.onsuccess = function(e) {
      db = e.target.result;
      if (navigator.online) {
          uploadTransaction();
      }
  };

request.onerror = function(e) {
      console.log(e.target.errorCode);
  };

window.addEventListener('online', uploadTransaction);