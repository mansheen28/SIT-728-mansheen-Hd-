document.addEventListener('DOMContentLoaded', function () {

    if (window.location.href === 'http://127.0.0.1:3000/') {
        // Check if a user is not found in local storage
        const userObj = localStorage.getItem('user');
        if (!userObj) {
            window.location.href = 'http://127.0.0.1:3000/login.html';
        }

        const manufacturerOptions = document.getElementById('manufacturer-options');
        const warehouseOptions = document.getElementById('warehouse-options');
        const consumerOptions = document.getElementById('consumer-options');

        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        // Adding role based check
        if (user.role == 'manufacturer') {
            warehouseOptions.style.display = 'none';
            consumerOptions.style.display = 'none';
        }else if (user.role == 'warehouse') {
            manufacturerOptions.style.display = 'none';
            consumerOptions.style.display = 'none';
        }else {
            warehouseOptions.style.display = 'none';
            manufacturerOptions.style.display = 'none';
        }
    }

    // Signup
    const signupButton = document.getElementById('signup-btn');
    if (signupButton) {
        signupButton.addEventListener('click', async function (e) {
            e.preventDefault();

            // Get form data
            const form = document.getElementById('signup-form')
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            const apiEndpoint = 'http://127.0.0.1:3000/signup';

            // Make a POST request to the appropriate API endpoint
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Action successful:', responseData);
                    alert(responseData.message)
                    // You can redirect to the user's dashboard or perform other actions here
                } else {
                    console.error('Action failed:', response.statusText);
                    // Display an error message to the user or handle as needed
                }
            } catch (error) {
                console.error('Error occurred:', error);
                // Handle network errors or other exceptions
            }
        });
    }

    // Login
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async function (e) {
            e.preventDefault();

            // Get form data
            const form = document.getElementById('login-form')
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            const apiEndpoint = 'http://127.0.0.1:3000/login';

            // Make a POST request to the appropriate API endpoint
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Action successful:', responseData);
                    localStorage.setItem('user', JSON.stringify(responseData.user));
                    window.location.href = 'http://127.0.0.1:3000';
                    // You can redirect to the user's dashboard or perform other actions here
                } else {
                    console.error('Action failed:', response.statusText);
                    // Display an error message to the user or handle as needed
                }
            } catch (error) {
                console.error('Error occurred:', error);
                // Handle network errors or other exceptions
            }
        });
    }

    // Register product
    const registerProduct = document.getElementById('register-product-btn');
    if (registerProduct) {
        registerProduct.addEventListener('click', async function (e) {
            e.preventDefault();
            // Get form data
            const form = document.getElementById('productRegistrationForm')
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            const user = JSON.parse(localStorage.getItem('user'));

            formObject["manufacturerName"] = user.name
            formObject["manufacturerAddress"] = user.address

            const apiEndpoint = 'http://127.0.0.1:3000/register-product';

            // Make a POST request to the appropriate API endpoint
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Action successful:', responseData);
                    alert(`${responseData.message} with ID: ${responseData.id}`);
                } else {
                    console.error('Action failed:', response.statusText);
                    // Display an error message to the user or handle as needed
                }
            } catch (error) {
                console.error('Error occurred:', error);
                // Handle network errors or other exceptions
            }
        });
    }

    // Update product
    const updateProduct = document.getElementById('update-product-btn');
    if (updateProduct) {
        updateProduct.addEventListener('click', async function (e) {
            e.preventDefault();
            // Get form data
            const form = document.getElementById('updateProductStatusForm')
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            const user = JSON.parse(localStorage.getItem('user'));

            formObject["warehouseName"] = user.name
            formObject["warehouseAddress"] = user.address

            console.log(formObject);

            const apiEndpoint = 'http://127.0.0.1:3000/update-product';

            // Make a POST request to the appropriate API endpoint
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Action successful:', responseData);
                    alert(responseData.message);
                } else {
                    console.error('Action failed:', response.statusText);
                    // Display an error message to the user or handle as needed
                }
            } catch (error) {
                console.error('Error occurred:', error);
                // Handle network errors or other exceptions
            }
        });
    }

    // Fetch product
    const fetchProduct = document.getElementById('fetch-product-btn');
    if (fetchProduct) {
        fetchProduct.addEventListener('click', async function (e) {
            e.preventDefault();
            // Get form data
            const productId = document.getElementById('fetchProductForm').elements.productId.value;
            const apiEndpoint = `http://127.0.0.1:3000/fetch-product/${productId}`;

            // Make a get request to the appropriate API endpoint
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Action successful:', responseData);
                    const product = responseData.product
                    document.getElementById('productDetails').innerHTML = `
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <th scope="row">Product ID</th>
                                    <td>${product.id}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Product Name</th>
                                    <td>${product.name}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Product Description</th>
                                    <td>${product.description}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Product Status</th>
                                    <td>${product.status}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Manufacturer Name</th>
                                    <td>${product.manufacturerName}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Manufacturer Address</th>
                                    <td>${product.manufacturerAddress}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Manufacturing Date</th>
                                    <td>${new Date(product.manufacturingDate * 1000).toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Warehouse Name</th>
                                    <td>${product.warehouseName}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Warehouse Address</th>
                                    <td>${product.warehouseAddress}</td>
                                </tr>
                            </tbody>
                        </table>
                    `;

                } else {
                    console.error('Action failed:', response.statusText);
                    document.getElementById('productDetails').innerHTML = `
                        <p>Error: ${response.statusText}</p>
                    `;
                    // Display an error message to the user or handle as needed
                }
            } catch (error) {
                console.error('Error occurred:', error);
                // Handle network errors or other exceptions
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = 'http://127.0.0.1:3000/login.html';
        });
    }
});
