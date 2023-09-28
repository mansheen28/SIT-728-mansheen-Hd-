const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');
const Web3 = require('web3');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
const web3 = new Web3(provider);

const contractABI = require('../src/ProductContract.json');
const contractAddress = '0xAb216222A24374bbb876d5a9880eC6222FCDbc20';

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chaintrace'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as ID ' + db.threadId);
});

async function hashPassword(password) {
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    return await bcrypt.hash(password, saltRounds);
}

async function comparePasswords(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

// Route for user signup
app.post('/signup', async (req, res) => {
    const { name, email, role, address, password } = req.body;

    // Hash and salt the password (use a library like bcrypt)
    // Store user data in the 'users' table
    const hashedPassword = await hashPassword(password);
    db.query('INSERT INTO users (name, email, role, address, password) VALUES (?, ?, ?, ?, ?)', [name, email, role, address, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error inserting user data: ' + err);
            res.status(400).json({ error: 'User registration failed' });
        } else {
            const user = req.body
            res.json({ message: 'User registered successfully', user});
        }
    });
});

// Route for user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Retrieve user data from the 'users' table
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {

        } else {
            if (result.length === 0) {
                return res.status(401).json({ message: 'User not found' });
            }
            const user = result[0];

            // Compare hashed password with user input (use a library like bcrypt)
            const isPasswordValid = comparePasswords(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            res.json({ message: 'Login successful', user });
        }
    });
});

// Route for registering product
app.post('/register-product', async (req, res) => {
    try {
        const { productName, productDescription, manufacturerName, manufacturerAddress } = req.body;

        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];

        const tx = await contract.methods.registerProduct(
            productName, 
            productDescription,
            Math.floor(Date.now() / 1000),
            manufacturerName,
            manufacturerAddress
        ).send({
            from: senderAddress,
            gas: 2000000,
        });

        const productId = tx.events.ProductRegistered.returnValues.productId;

        return res.json({message: 'Product Registered successfully', id: productId});
    } catch (error) {
        console.error('Error registering product:', error);
        return res.status(400).json({ error: 'Internal server error' });
    }
});

// Route for updating product status
app.post('/update-product', async (req, res) => {
    try {
        const { productId, warehouseName, warehouseAddress } = req.body;

        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];

        const tx = await contract.methods.updateProductStatus(
            productId, 
            "In-Transit",
            warehouseName,
            warehouseAddress,
            Math.floor(Date.now() / 1000),
        ).send({
            from: senderAddress,
            gas: 2000000,
        });

        return res.json({message: 'Product Updated successfully'});
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(400).json({ error: 'Internal server error' });
    }
});

// Route for fetching product status
app.get('/fetch-product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const productDetails = await contract.methods.getProductDetails(productId).call();

        return res.json({message: 'Product Fetched successfully', product: productDetails});
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(400).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
