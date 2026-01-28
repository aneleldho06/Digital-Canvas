// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DigitalCanvas {
    struct Item {
        address owner;
        int256 x;
        int256 y;
        string ipfsHash;
        string title;
        uint256 timestamp;
        bool deleted;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;

    event ItemPlaced(uint256 indexed id, address indexed owner, string ipfsHash, int256 x, int256 y);
    event ItemDeleted(uint256 indexed id);

    function placeItem(int256 x, int256 y, string calldata ipfsHash, string calldata title) external returns (uint256) {
        uint256 newItemId = itemCount;
        items[newItemId] = Item({
            owner: msg.sender,
            x: x,
            y: y,
            ipfsHash: ipfsHash,
            title: title,
            timestamp: block.timestamp,
            deleted: false
        });
        
        itemCount++;
        emit ItemPlaced(newItemId, msg.sender, ipfsHash, x, y);
        return newItemId;
    }

    function deleteItem(uint256 id) external {
        require(id < itemCount, "Item does not exist");
        require(items[id].owner == msg.sender, "Not owner");
        require(!items[id].deleted, "Already deleted");
        
        items[id].deleted = true;
        emit ItemDeleted(id);
    }

    function getAllItems() external view returns (Item[] memory) {
        Item[] memory allItems = new Item[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            allItems[i] = items[i];
        }
        return allItems;
    }
}
