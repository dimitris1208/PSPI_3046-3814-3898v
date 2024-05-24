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
        const resultsContainer = document.getElementById("resultsBody");
    resultsContainer.innerHTML = ""; // Clear previous results

    results.forEach(result => {
        // Create a new table row for each result
        const resultRow = document.createElement("tr");

        // Create and append table data cells for each property of the result
        const idCell = document.createElement("td");
        idCell.innerText = result._id;
        resultRow.appendChild(idCell);

        const nameCell = document.createElement("td");
        nameCell.innerText = result.name;
        resultRow.appendChild(nameCell);

        const productionYearCell = document.createElement("td");
        productionYearCell.innerText = result.production_year;
        resultRow.appendChild(productionYearCell);

        const colorCell = document.createElement("td");
        colorCell.innerText = result.color;
        resultRow.appendChild(colorCell);

        const priceCell = document.createElement("td");
        priceCell.innerText = result.price;
        resultRow.appendChild(priceCell);

        const sizeCell = document.createElement("td");
        sizeCell.innerText = result.size;
        resultRow.appendChild(sizeCell);

        // Append the row to the results container
        resultsContainer.appendChild(resultRow);
        });
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
            document.getElementById("productName").value = "";
            document.getElementById("productYear").value = "";
            document.getElementById("productColor").value = "";
            document.getElementById("productPrice").value = "";
            document.getElementById("productSize").value = "";
            alert("OK");
        })
        .catch(error=> {
            console.error('Error:',error);
            alert("Error");
        })

    // END CODE HERE
}
