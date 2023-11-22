// fetch product********************

async function fetchProducts(searchProduct = "") {
    try {
        const url = `https://dummyjson.com/products/search?q=${searchProduct}`;

        const response = await fetch(url);
        const data = await response.json();
        //console.log(data);
        return data;
    } catch (error) {
        console.log("Error:", error);
    }
}


//fetch product category wise**********************

async function fetchProductCategory(category) {
    try {
        const url = `https://dummyjson.com/products/category/${category}`;

        const response = await fetch(url);
        const data = await response.json();
        const products = data.products;
        makeProductCard(products);
    } catch (error) {
        console.log("Error:", error);
    }
}

//fetch category***********************

async function fetchCategories() {
    try {
        const url = "https://dummyjson.com/products/categories";
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Error:", error);
        return [];
    }
}

//creating product card*************

function makeProductCard(products) {
    const cardContainer = document.querySelector(".product-card");

    cardContainer.innerHTML = "";

    products.forEach((product) => {
        var card = document.createElement("div");
        card.classList.add("productsCards");

        const productImg = document.createElement("img");
        productImg.src = product.images[0];
        productImg.alt = product.title;
        productImg.id = 'feature-image'
        productImg.style.width = '180px'
        card.appendChild(productImg);

        const title = document.createElement("h3");
        title.classList.add("title");
        title.innerText = product.title;
        card.appendChild(title);

        const price = document.createElement("p");
        price.classList.add("priceTag");
        price.innerText = `PRICE:$ ${product.price}`;
        card.appendChild(price);

        const thumbnailImage = document.createElement("img");
        thumbnailImage.classList.add("thumbnail");
        thumbnailImage.src = product.thumbnail;
        thumbnailImage.alt = product.title[0];
        card.appendChild(thumbnailImage);

        const rating = document.createElement("p");
        rating.classList.add("rating");
        rating.innerText = `Rating:${product.rating}`;
        card.appendChild(rating);

        const viewDescription = document.createElement("p");
        viewDescription.classList.add("view-description");
        viewDescription.innerText = "Show Description";
        viewDescription.addEventListener("click", () => {
            description.style.display = "block";
        });
        card.appendChild(viewDescription);

        const hideDescription = document.createElement("p");
        hideDescription.classList.add("hide-description");
        hideDescription.innerText = "Hide Description";
        hideDescription.addEventListener("click", () => {
            description.style.display = "none";
        });
        card.appendChild(hideDescription);

        const description = document.createElement("div");
        description.classList.add("description");
        description.innerText = product.description;
        card.appendChild(description);

        cardContainer.appendChild(card);
    });
}

//show category*****************

function showCategory(categories) {
    var categoryList = document.querySelector('.categoryRadios');

    if (categories.length === 0) {
        return;
    }

    categories.forEach((category) => {
        var dropDownInput = document.createElement('input');
        dropDownInput.type = 'radio';
        dropDownInput.name = 'category';
        dropDownInput.value = category;
        dropDownInput.id = category;
        categoryList.appendChild(dropDownInput);

        dropDownInput.addEventListener("change", (e) => {
            const selectedCategory = e.target.value;
            fetchProductCategory(selectedCategory);
        });

        const dropdownLabel = document.createElement('label');
        dropdownLabel.htmlFor = category;
        dropdownLabel.innerText = category;
        categoryList.appendChild(dropdownLabel);
    });
}
//search product********************

function searchProducts() {
    const searchInput = document.getElementById("search");
    const searchQuery = searchInput.value.trim();

    if (searchQuery !== "") {
        fetchProducts(searchQuery)
            .then((data) => {
                const searchProducts = data.products;
                makeProductCard(searchProducts);
            })
            .catch((error) => console.log("Error:", error));
    }
}


//resolving fectproduct API**********

let productss = [];
fetchProducts()
    .then((data) => {
        productss = data.products;
        makeProductCard(productss);
    })
    .catch((error) => {
        console.log("Error:", error);
    });

//resolving category API ***********

fetchCategories()
    .then((categories) => {
        showCategory(categories);
    })
    .catch((error) => {
        console.log("Error:", error);
    });


//category list ****************
const categoryRadios = document.querySelectorAll('input[name="category"]');
categoryRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
        const category = e.target.value;
        fetchProductCategory(category);
    });
});



//*******************************Home page************

//remove sselect categories

document.addEventListener("DOMContentLoaded", () => {
    let selectedCategory = "";


//hide category list

    function toggleDropDownOptions() {
        const dropdownOptions = document.getElementById("category-list");
        dropdownOptions.style.display = dropdownOptions.style.display === "block" ? "none" : "block";
    }


    

    function selectCategory(category) {
        const dropDownButton = document.getElementById("categories");
        dropDownButton.textContent = category;
        toggleDropDownOptions();

        selectedCategory = category;

        fetchProductCategory(category);
    }

    document
        .getElementById("categories")
        .addEventListener("click", toggleDropDownOptions);


        //remove category******

    function clearCategories() {
        const dropdownButton = document.getElementById("categories");
        dropdownButton.textContent = defaultDropdownText;
        selectedCategory = "";
        fetchProducts().then((data) => {
            const products = data.products;
            makeProductCard(products);
        });
    }

    //resolving categories API

    
    fetchCategories()
        .then((categories) => {
            const dropdownOptions = document.getElementById("category-list");
            categories.forEach((category) => {
                const option = document.createElement("li");
                option.textContent = category;
                option.addEventListener("click", () => selectCategory(category));
                dropdownOptions.appendChild(option);
            });

            const categoryRadios = document.querySelectorAll('input[name="category"]');
            categoryRadios.forEach((radio) => {
                radio.addEventListener("change", (e) => {
                    const category = e.target.value;
                    fetchProductCategory(category);
                });
            });
        })
        .catch((error) => console.log("Error:", error));





        //buttons functonalities**********


        //clear search 

    document
        .getElementById("clearSearchButton")
        .addEventListener("click", function clearSearches() {
            const searchInput = document.getElementById("search");
            searchInput.value = "";
            fetchProducts().then((data) => {
                const products = data.products;
                makeProductCard(products);
            });
        });



        //clear category

    document
        .getElementById("clearCategoriesButton")
        .addEventListener("click", clearCategories);



        //sort buttons********

    document
        .getElementsByClassName("SRPLH-button")[0]
        .addEventListener("click", function sortPriceLowToHigh() {
            let sortedProducts = productss.slice().sort((productOne, productTwo) => productOne.price - productTwo.price);
            makeProductCard(sortedProducts);
        });

    document
        .getElementsByClassName("SRPHL-button")[0]
        .addEventListener("click", function sortPriceHighToLow() {
            let sortedProducts = productss.slice().sort((productOne, productTwo) => productTwo.price - productOne.price);
            makeProductCard(sortedProducts);
        });

    document
        .getElementsByClassName("SRR-button")[0]
        .addEventListener("click", function sortRatingHighToLow() {
            let sortedProducts = productss.slice().sort((productOne, productTwo) => productTwo.rating - productOne.rating);
            makeProductCard(sortedProducts);
        });





        //Search Button************

    document
        .getElementById("search")
        .addEventListener("keypress", function enterToSearch(event) {
            if (event.key === "Enter") {
                searchProducts();
            }
        });

        document.getElementById("btn").addEventListener("click", searchProducts);

});