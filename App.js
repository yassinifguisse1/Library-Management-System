// create product save localStorage
// clear inputs
// read
// delete
// count 
// update
// search
// clean data

const Book_Title = document.getElementById('Book_Title');
const Author_Name = document.getElementById('Author_Name');
const Genre = document.getElementById('Book_Genre');
const Publisher = document.getElementById('Publish_Year');
const Quantity = document.getElementById('Quantity');
// const search = document.getElementById('search');
const btn_Add = document.getElementById('button_Add');
const table = document.getElementById('table');

// eventListners
btn_Add.addEventListener("click",addBook);



// Sample Data Structure
let libraryData = {
    books: [],
    users: [],
    reservations: [],
};
initializeLibraryData()
// ----------------------------------ADD Book-------------------------------
function addBook(event) {
    event.preventDefault();
    if(Book_Title.value ==='' || Author_Name.value ==='' || Genre.value ===''|| Publisher.value ===''|| Quantity.value ===''){
        showAlert(' Please fill all fields ','danger', 'bx-error-alt')
    }else{
        
        let bookObj = {
            title : Book_Title.value,
            author : Author_Name.value,
            genre : Genre.value,
            publishDate : Publisher.value, 
            Quantity: Quantity.value  
        }
        libraryData.books.push(bookObj); 
        
     // SAVE IN LOCALSTORAGE
    
        saveToLocalStorage('books', libraryData.books);
        
    //   call function clear input
        clearinputs()  
        showData()
        showAlert(' Book Added','success', 'bxs-badge-check')
    }
    
}


// ------------------------------ clear inputs--------------------------
function clearinputs(){
    Book_Title.value = '';
    Author_Name.value= '';
    Genre.value= '';
    Publisher.value= '';
    Quantity.value= '';  
}

// ------------------------------ Read _ show Data in the table -------------------

function showData(){
    let table_Body ='';
    for (let i = 0; i < libraryData.books.length; i++){
        const bookId = `book-${i}`;
        table_Body += `
            <tr id="${bookId}">
                <th scope="row ">${[i+1]}</th>
                <td >${libraryData.books[i].title}</td>
                <td >${libraryData.books[i].author}</td>
                <td >${libraryData.books[i].genre}</td>
                <td >${libraryData.books[i].publishDate}</td>
                <td >${libraryData.books[i].Quantity}</td>
                <td>
                    <button onclick="openUpdateModal(${i})" id="update_btn" class="btn btn-outline-primary" type="submit"><i class='bx bx-refresh'></i></button>
                    <button onclick="deleteBook(${i})" id="delete_btn" class="btn btn-outline-danger mt-1" type="submit"><i class='bx bx-trash'></i>
                    </button>
                </td>

            </tr>
        `;
        
    }
    
    document.getElementById('table_Body').innerHTML = table_Body;
    let btnDelete = document.getElementById('deleteAll');
    const storedBooks = localStorage.getItem('books');
    const hasBooks = storedBooks && JSON.parse(storedBooks).length > 0;

    if (hasBooks) {
        // deleteAllButton.style.display = 'block';
        btnDelete.innerHTML = `
        <td><button id="btnDelete" class="btn btn-outline-danger mt-2 w-100" type="submit" onclick="deleteAll()">Delete All (${libraryData.books.length}) </button></td>
        `;
    } else {
        // deleteAllButton.style.display = 'none';
        btnDelete.innerHTML =''
    }
}
showData();

function deleteAll() {
    libraryData.books = [];

    // Clear the HTML content of the table body
    document.getElementById('table_Body').innerHTML = '';

    // Remove the 'books' item from localStorage
    localStorage.removeItem('books');

    // Update the button display after deletion
    showData();
    showAlert(' All Books deleted','success', 'bxs-badge-check')
        
}
showData();
function deleteBook(i) {
   
    const bookId = `book-${i}`;
    const bookElement = document.getElementById(bookId);
    bookElement.classList.add('fade-out');
    setTimeout(() => {
        // Remove the book element from the DOM or update UI as needed
        bookElement.remove(); // Example: Remove the element from the DOM
        libraryData.books.splice(i, 1);// Example: Remove the element from the Array
        saveToLocalStorage('books', libraryData.books);
        initializeLibraryData();
        showData();
        showAlert(' Book deleted','success', 'bxs-badge-check')
      }, 300); 
      scroll({top: 0, behavior: 'smooth' });
}

// ----------------------- Update book----------------------------------------

function openUpdateModal(i) {
    // Get the index of the book you want to update (i is the index of the book)
    const bookIndexToUpdate = i;

    // Get the book data based on the index
    const bookToUpdate = libraryData.books[bookIndexToUpdate];


    // Create the update form dynamically
    const updateForm = document.createElement('form');
    updateForm.id = 'updateBookForm';

    // Populate the form with existing book data
    updateForm.innerHTML = `
      <div class="mb-3">
        <label for="updateBookTitle" class="form-label">Title</label>
        <input type="text" class="form-control" id="updateBookTitle" value="${bookToUpdate.title}" required>
      </div>
      <div class="mb-3">
        <label for="updateBookAuthor" class="form-label">Author</label>
        <input type="text" class="form-control" id="updateBookAuthor" value="${bookToUpdate.author}" required>
      </div>
      <div class="mb-3">
        <label for="updateBookGenre" class="form-label">Genre</label>
        <input type="text" class="form-control" id="updateBookGenre" value="${bookToUpdate.genre}" required>
      </div>
      <div class="mb-3">
        <label for="updateBookPublishYear" class="form-label">Publish Year</label>
        <input type="number" class="form-control" id="updateBookPublishYear" value="${bookToUpdate.publishDate}" required>
      </div>
      <div class="mb-3">
        <label for="updateBookQuantity" class="form-label">Quantity</label>
        <input type="number" class="form-control" id="updateBookQuantity" value="${bookToUpdate.Quantity}" required>
      </div>
      <button type="button" class="btn btn-primary" onclick="updateBook(${i})">Update Book</button>
    `;

    // Clear the existing content in the modal and add the new form
    const updateFormContainer = document.getElementById('updateBookFormContainer');
    // make sure that updateFormContainer is empty
    updateFormContainer.innerHTML = '';
    updateFormContainer.appendChild(updateForm);

    // Show the modal
    $('#updateBookModal').modal('show');
  
}
function updateBook(index) {
    // Get the updated values from the form
    const updatedBook = {
      title: document.getElementById('updateBookTitle').value,
      author: document.getElementById('updateBookAuthor').value,
      genre: document.getElementById('updateBookGenre').value,
      publishDate: document.getElementById('updateBookPublishYear').value,
      Quantity: document.getElementById('updateBookQuantity').value,
    };
    

    // Update the book in the libraryData array
    libraryData.books[index] = updatedBook;

    // Save the updated data to localStorage
    saveToLocalStorage('books', libraryData.books);

    // Update in-memory data structure
    initializeLibraryData();

    // Show the updated data
    showData();

    // Hide the modal
    $('#updateBookModal').modal('hide');
    showAlert(' Book Updated','success','bxs-badge-check')
    scroll({top: 0, behavior: 'smooth' });
}




// search--------------------------------------

const searchInput = document.getElementById('searchInput');
searchInput.onkeyup = function(){
    
    let table_Body = '';
    let input = searchInput.value.toLowerCase();
    
    for(let i = 0; i < libraryData.books.length; i++){
        const title = libraryData.books[i].title.toLowerCase();
        const author = libraryData.books[i].author.toLowerCase();
        const genre = libraryData.books[i].genre.toLowerCase();
        if(input.length === 0 || `${title} ${author} ${genre}`.includes(input)){
            table_Body += `
            <tr >
                <th scope="row ">${[i+1]}</th>
                <td >${libraryData.books[i].title}</td>
                <td >${libraryData.books[i].author}</td>
                <td >${libraryData.books[i].genre}</td>
                <td >${libraryData.books[i].publishDate}</td>
                <td >${libraryData.books[i].Quantity}</td>
                <td>
                    <button onclick="openUpdateModal(${i})" id="update_btn" class="btn btn-outline-primary" type="submit"><i class='bx bx-refresh'></i></button>
                    <button onclick="deleteBook(${i})" id="delete_btn" class="btn btn-outline-danger mt-1" type="submit"><i class='bx bx-trash'></i>
                    </button>
                </td>

            </tr>
        `;
            

        }

    }
    document.getElementById('table_Body').innerHTML = table_Body;
}






// Add alert 
function showAlert(message,className,classicon){

    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    const i = document.createElement('i');
    i.className = `bx ${classicon}`;  
    div.appendChild(i);
    div.appendChild(document.createTextNode(message));
    const content = document.querySelector('.content');
    const form = document.querySelector('#book_form')
    content.insertBefore(div,form)
    // Time out after 3 seconds
    setTimeout(()=>{div.remove()
        },3000)
        
}

// -------------------- localStorage--------------------------
// Function to initialize libraryData in localStorage
function initializeLibraryData() {
    const storedBooks = localStorage.getItem('books');
    const storedUsers = localStorage.getItem('users');
    const storedReservations = localStorage.getItem('reservations');
  
    if (storedBooks) {
      libraryData.books = JSON.parse(storedBooks);
    } else {
      saveToLocalStorage('books', libraryData.books);
    }
  
    if (storedUsers) {
      libraryData.users = JSON.parse(storedUsers);
    } else {
      saveToLocalStorage('users', libraryData.users);
    }
  
    if (storedReservations) {
      libraryData.reservations = JSON.parse(storedReservations);
    } else {
      saveToLocalStorage('reservations', libraryData.reservations);
    }
}

function saveToLocalStorage(dataKey, data) {
    localStorage.setItem(dataKey, JSON.stringify(data));
}