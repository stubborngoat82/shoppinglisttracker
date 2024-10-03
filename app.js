// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnnarQSZRNM5mbJhginhrHacai5UYfGUA",
  authDomain: "grocerytracker-27461.firebaseapp.com",
  databaseURL: "https://grocerytracker-27461-default-rtdb.firebaseio.com",
  projectId: "grocerytracker-27461",
  storageBucket: "grocerytracker-27461.appspot.com",
  messagingSenderId: "752726472357",
  appId: "1:752726472357:web:7603acb03d1a42cdab7f4c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref('items');

// DOM elements
const addItemForm = document.getElementById('addItemForm');
const itemName = document.getElementById('itemName');
const storeName = document.getElementById('storeName');
const quantity = document.getElementById('quantity');
const itemsList = document.getElementById('itemsList');
const storeFilter = document.getElementById('storeFilter');

// Add new item to Firebase
addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        name: itemName.value,
        store: storeName.value,
        quantity: quantity.value
    };
    db.push(newItem);
    addItemForm.reset();
});

// Listen for real-time updates and display items
db.on('value', (snapshot) => {
    itemsList.innerHTML = '';
    const stores = new Set();
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        const itemElement = document.createElement('li');
        itemElement.textContent = `${item.name} - ${item.store} (Qty: ${item.quantity})`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('bg-red-500', 'text-white', 'ml-4', 'px-2', 'py-1', 'rounded');
        deleteButton.onclick = () => db.child(childSnapshot.key).remove();

        itemElement.appendChild(deleteButton);
        itemsList.appendChild(itemElement);

        stores.add(item.store);
    });

    updateStoreFilter(stores);
});

// Update store filter options
function updateStoreFilter(stores) {
    storeFilter.innerHTML = '<option value="all">All Stores</option>';
    stores.forEach(store => {
        const option = document.createElement('option');
        option.value = store;
        option.textContent = store;
        storeFilter.appendChild(option);
    });
}

// Filter items by store
storeFilter.addEventListener('change', () => {
    const selectedStore = storeFilter.value;
    db.once('value').then(snapshot => {
        itemsList.innerHTML = '';
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            if (selectedStore === 'all' || item.store === selectedStore) {
                const itemElement = document.createElement('li');
                itemElement.textContent = `${item.name} - ${item.store} (Qty: ${item.quantity})`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('bg-red-500', 'text-white', 'ml-4', 'px-2', 'py-1', 'rounded');
                deleteButton.onclick = () => db.child(childSnapshot.key).remove();

                itemElement.appendChild(deleteButton);
                itemsList.appendChild(itemElement);
            }
        });
    });
});