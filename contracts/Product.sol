// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {
    // Struct to represent a product
    struct Product {
        uint256 id;                  // Unique identifier for the product
        string name;                 // Name of the product
        string description;          // Description of the product
        uint256 manufacturingDate;   // Manufacturing date (timestamp)
        string manufacturerName;     // Name of the manufacturer
        string manufacturerAddress;  // Address of the manufacturer
        string status;               // Current status of the product
        string warehouseName;        // Name of the warehouse (if in transit)
        string warehouseAddress;     // Address of the warehouse (if in transit)
        uint256 timestamp;           // Timestamp of the status update
    }

    uint256 private productIdCounter; // Counter to generate unique product IDs
    mapping(uint256 => Product) public products; // Mapping to store product information

    event ProductRegistered(uint256 indexed productId);
    event ProductStatusUpdated(uint256 indexed productId, string newStatus, string warehouseName, string warehouseAddress, uint256 timestamp);

    // Function to register a new product
    function registerProduct(
        string memory _name,
        string memory _description,
        uint256 _manufacturingDate,
        string memory _manufacturerName,
        string memory _manufacturerAddress
    ) public {
        productIdCounter++;

        // Create a new product with default values
        products[productIdCounter] = Product({
            id: productIdCounter,
            name: _name,
            description: _description,
            manufacturingDate: _manufacturingDate,
            manufacturerName: _manufacturerName,
            manufacturerAddress: _manufacturerAddress,
            status: "Manufacturing Completed",
            warehouseName: "",
            warehouseAddress: "",
            timestamp: 0
        });

        // Emit an event to indicate the product registration
        emit ProductRegistered(productIdCounter);
    }

    // Function to update the status of a product
    function updateProductStatus(
        uint256 _productId,
        string memory _status,
        string memory _warehouseName,
        string memory _warehouseAddress,
        uint256 _timestamp
    ) public {
        // Check if the status is not empty and the product exists
        require(bytes(_status).length > 0, "Status cannot be empty");
        require(bytes(products[_productId].status).length > 0, "Product does not exist");
        require(keccak256(bytes(products[_productId].status)) == keccak256(bytes("Manufacturing Completed")), "Product is not in 'Manufacturing Completed' status");

        // Update product status and warehouse information
        products[_productId].status = _status;
        products[_productId].warehouseName = _warehouseName;
        products[_productId].warehouseAddress = _warehouseAddress;
        products[_productId].timestamp = _timestamp;

        // Emit an event to indicate the product status update
        emit ProductStatusUpdated(_productId, _status, _warehouseName, _warehouseAddress, _timestamp);
    }

    // Function to retrieve all details of a product
    function getProductDetails(uint256 _productId) public view returns (
        uint256 id,
        string memory name,
        string memory description,
        uint256 manufacturingDate,
        string memory manufacturerName,
        string memory manufacturerAddress,
        string memory status,
        string memory warehouseName,
        string memory warehouseAddress,
        uint256 timestamp
    ) {
        Product storage product = products[_productId];

        // Retrieve product details
        id = product.id;
        name = product.name;
        description = product.description;
        manufacturingDate = product.manufacturingDate;
        manufacturerName = product.manufacturerName;
        manufacturerAddress = product.manufacturerAddress;
        status = product.status;
        warehouseName = product.warehouseName;
        warehouseAddress = product.warehouseAddress;
        timestamp = product.timestamp;
    }
}
