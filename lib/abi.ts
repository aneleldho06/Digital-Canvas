export const CONTRACT_ABI = [
    {
        "inputs": [
            { "internalType": "int256", "name": "x", "type": "int256" },
            { "internalType": "int256", "name": "y", "type": "int256" },
            { "internalType": "string", "name": "ipfsHash", "type": "string" },
            { "internalType": "string", "name": "title", "type": "string" }
        ],
        "name": "placeItem",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
        "name": "deleteItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllItems",
        "outputs": [
            {
                "components": [
                    { "internalType": "address", "name": "owner", "type": "address" },
                    { "internalType": "int256", "name": "x", "type": "int256" },
                    { "internalType": "int256", "name": "y", "type": "int256" },
                    { "internalType": "string", "name": "ipfsHash", "type": "string" },
                    { "internalType": "string", "name": "title", "type": "string" },
                    { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
                    { "internalType": "bool", "name": "deleted", "type": "bool" }
                ],
                "internalType": "struct DigitalCanvas.Item[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
