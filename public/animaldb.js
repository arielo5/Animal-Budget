const request = indexedDB.open('Animal_Budget', 1);

let db;

request.onupgradeneeded = function(e) {
    const db = request.result;
    db.createObjectStore('new_calculation', { autoIncrement: true });
  };

  request.onsuccess = function(e) {
      db = e.target.result;
      if (navigator.online) {
          uploadCalculation();
      }
  };

  request.onerror = function(e) {
      console.log(e.target.errorCode);
  };

  function saveNumbers(num) {
      const calculation = db.calculation(['new_calculation'],
      'readwrite');

      const budgetObjectStore = calculation.objectStore("new_calculation");

      budgetObjectStore.add(num);
  };

  window.addEventListener('online', UploadCalculation);

  function uploadCalculation() {

    const getAll = budgetObjectStore.getAll();

    const calculation = db.calculation(['new_calculation'], 'readwrite');

    const budgetObjectStore = calculation.objectStore('new_calculation');

    getAll.onsuccess = function() {

        if (getAll.result.length > 0) {
            fetch('/api/calculation', {
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
      
                const calculation = db.calculation(['new_calculation'], 'readwrite');
      

                const budgetObjectStore = calculation.objectStore('new_calculation');
                
                alert('All saved calculations has been submitted!');

              }).catch(err => {console.log(err)});

    }
  }
};