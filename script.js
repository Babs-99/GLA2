document.addEventListener("DOMContentLoaded", function () {
    //initializing my variables here
    const productGrid = document.getElementById('product-grid');
    const productDetails = document.getElementById('product-details');
    const categoryFilter = document.getElementById('category');
    const sortSelect = document.getElementById('sort');

    // fetching the details from the api, if it does not return anything, it displays the error message
    async function fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async function renderProducts() {
        productDetails.classList.remove('show');
        const products = await fetchProducts();
        const filteredProducts = filterProducts(products);
        const sortedProducts = sortProducts(filteredProducts);
        productGrid.innerHTML = '';
        sortedProducts.forEach(product => {
            // creates the html elements for my products
            const { id, title, image, price } = product;
            const productCard = `
                <div class="product-card" data-id="${id}">
                    <img src="${image}" alt="${title}">
                    <h3>${title}</h3>
                    <p>$${price}</p>
                </div>
            `;
            productGrid.innerHTML += productCard;
        });
    }

    function filterProducts(products) {
        //my filter function for the different categories
        const category = categoryFilter.value;
        if (category === '') {
            return products;
        } else {
            return products.filter(product => product.category === category);
        }
    }

    function sortProducts(products) {
        // the function for sorting products
        const sortBy = sortSelect.value;
        if (sortBy === 'asc') {
            return products.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'desc') {
            return products.sort((a, b) => b.price - a.price);
        } else {
            return products;
        }
    }

    function renderProductDetails(product) {
        const { title, price, description, category, image } = product;
        productDetails.innerHTML = `
            <h2>${title}</h2>
            <p><strong>Price:</strong> $${price}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Description:</strong> ${description}</p>
            <img src="${image}" alt="${title}">
        `;
        productDetails.classList.add('show');
    }

    productGrid.addEventListener('click', async function (event) {
        if (event.target.closest('.product-card')) {
            const productId = event.target.closest('.product-card').getAttribute('data-id');
            const products = await fetchProducts();
            const selectedProduct = products.find(product => product.id === parseInt(productId));
            renderProductDetails(selectedProduct);
        }
    });

    categoryFilter.addEventListener('change', renderProducts);
    sortSelect.addEventListener('change', renderProducts);

    renderProducts();
});
