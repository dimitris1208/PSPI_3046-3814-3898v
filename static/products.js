const api = "http://127.0.0.1:5000";

window.onload = () => {
    // BEGIN CODE HERE
    document.getElementById("searchButton").addEventListener("click",searchButtonOnClick);
    document.getElementById("productForm").addEventListener("submit",productFormOnSubmit);
}

searchButtonOnClick = (event) => {
    event.preventDefault();
    var query = document.getElementById('searchInput').value;
    window.location.href = `/search?name=${encodeURIComponent(query)}`;
        console.log("hi")
        history.pushState("http://127.0.0.1:5000/search?name=",encodeURIComponent(query));
}

productFormOnSubmit = (event) => {
    // BEGIN CODE HERE
    event.preventDefault();
    const formData = {
        name: document.getElementById("productName").value,
        production_year: parseInt(document.getElementById("productYear").value),
        price: parseFloat(document.getElementById("productPrice").value),
        color: parseInt(document.getElementById("productColor").value),
        size: parseFloat(document.getElementById("productSize").value)
    };
    console.log(JSON.stringify(formData))
    fetch("/add-product", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        alert('OK');
        window.location.href = '/search'; // Redirect to the home page after success
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    });


}
