const api = "http://127.0.0.1:5000";

window.onload = () => {
    // BEGIN CODE HERE
    document.getElementById("searchButton").addEventListener("click",searchButtonOnClick);
    document.getElementById("productForm").addEventListener("submit",productFormOnSubmit);
    // END CODE HERE
}

searchButtonOnClick = () => {
    // BEGIN CODE HERE
    const query = document.getElementById("searchInput").value;
    

    function displaySearchResults(results){
        const resultsContainer = document.getElementById("searchResults");
        resultsContainer.innerHTML = "";
        results.forEach(result => {
            const resultItem = document.createElement("div");
            resultItem.innerText = `Name: ${result.name}, Year: ${result.production_year}, Color: ${result.color}, Price: ${result.price}, Size: ${result.size}`;
            resultsContainer.appendChild(resultItem);
        }
        );
    }

    fetch(`${api}/search?name=${query}`)
        .then(response => response.json())
        .then(data => {
            displaySearchResults(data);
        })
        .catch(error => console.error('Error:', error));
    // END CODE HERE
}

productFormOnSubmit = (event) => {
    // BEGIN CODE HERE
    event.preventDefault();

    const formData = {
        name: document.getElementById("productName").value,
        production_year: document.getElementById("productYear").value,
        color: document.getElementById("productColor").value,
        price: document.getElementById("productPrice").value,
        size: document.getElementById("productSize").value
    };

    fetch(`${api}/add-product`, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response=> response.json())
        .then(data => {
            console.log("Success");
        })
        .catch(error=> console.error('Error:',error))

    // END CODE HERE
}
