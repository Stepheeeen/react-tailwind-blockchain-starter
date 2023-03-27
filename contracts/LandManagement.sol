// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LandManagement {
    struct Land {
        string photoHash;
        string jsonHash;
        address owner;
        uint256 price;
        bool isForSale;
    }

    struct LandHistory {
        address owner;
        uint256 timestamp;
    }

    mapping(address => Land) public lands;
    address[] public landsArray;
    mapping(address => LandHistory[]) public landHistory;
    mapping(address => uint256) public ownerLandCount;
    mapping(address => uint256) public landHistoryCount;
    uint256 public landCount;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this operation.");
        _;
    }

    address public admin;

    constructor() {
        admin = msg.sender;
        landCount = 0;
    }

    event LandAdded(address indexed landId, address indexed owner);
    event LandForSale(address indexed landId, uint256 price, address owner);
    event LandSold(
        address indexed landId,
        uint256 price,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    function addLand(
        string memory _photoHash,
        string memory _jsonHash
    ) public onlyAdmin returns (address) {
        address landId = address(
            uint160(
                uint(keccak256(abi.encodePacked(msg.sender, block.timestamp)))
            )
        );
        require(lands[landId].owner == address(0), "This land already exists.");
        address owner = admin;
        lands[landId].owner = owner;
        lands[landId].photoHash = _photoHash;
        lands[landId].jsonHash = _jsonHash;
        lands[landId].isForSale = false;
        landHistory[landId].push(LandHistory(owner, block.timestamp));
        ownerLandCount[owner]++;
        landsArray.push(landId);
        landHistoryCount[landId]++;
        landCount++;
        emit LandAdded(landId, owner);
        return landId;
    }

    function addLandForAccount(
        address owner,
        string memory _photoHash,
        string memory _jsonHash
    ) public onlyAdmin returns (address) {
        address landId = address(
            uint160(
                uint(keccak256(abi.encodePacked(msg.sender, block.timestamp)))
            )
        );
        require(lands[landId].owner == address(0), "This land already exists.");
        lands[landId].owner = owner;
        lands[landId].photoHash = _photoHash;
        lands[landId].jsonHash = _jsonHash;
        lands[landId].isForSale = false;
        landHistory[landId].push(LandHistory(owner, block.timestamp));
        ownerLandCount[owner]++;
        landsArray.push(landId);
        landHistoryCount[landId]++;
        landCount++;
        emit LandAdded(landId, owner);
        return landId;
    }

    function transferLandOwnership(address landId, address newOwner) public {
        require(
            lands[landId].owner == msg.sender,
            "You must own this land to transfer it."
        );
        ownerLandCount[lands[landId].owner]--;
        lands[landId].owner = newOwner;
        landHistoryCount[landId]++;
        ownerLandCount[newOwner]++;
        landHistory[landId].push(LandHistory(newOwner, block.timestamp));
    }

    function sellLand(address landId, uint256 price) public {
        require(
            msg.sender == lands[landId].owner,
            "You must own this land to sell it."
        );
        require(!lands[landId].isForSale, "This land is already for sale.");
        lands[landId].price = price;
        lands[landId].isForSale = true;
        emit LandForSale(landId, price, msg.sender);
    }

    function buyLand(address landId) public payable {
        Land storage land = lands[landId];
        require(land.isForSale, "This land is not for sale.");
        require(msg.value >= land.price, "Insufficient payment.");
        address oldOwner = land.owner;
        ownerLandCount[oldOwner]--;
        land.owner = msg.sender;
        ownerLandCount[msg.sender]++;
        landHistory[landId].push(LandHistory(msg.sender, block.timestamp));
        land.isForSale = false;
        landHistoryCount[landId]++;

        payable(oldOwner).transfer(msg.value);
        emit LandSold(
            landId,
            land.price,
            oldOwner,
            msg.sender,
            block.timestamp
        );
    }

    function getLandsIdByAccount(
        address account
    ) public view returns (address[] memory) {
        uint256 count = ownerLandCount[account];
        address[] memory landsForAccount = new address[](count);
        for (uint256 i = 0; i < landCount; i++) {
            if (lands[landsArray[i]].owner == account) {
                landsForAccount[i] = landsArray[i];
            }
        }
        return landsForAccount;
    }
}
