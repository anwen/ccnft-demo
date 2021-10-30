// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    using Strings for uint256; // uint256 is uint
    mapping (uint256 => string) private _tokenURIs;

    constructor(address marketplaceAddress) ERC721("CC3", "CC3") {
        contractAddress = marketplaceAddress;
    }

    // mint, uri is tokenURI
    function createToken(string memory uri) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId); // msg.sender is recipient
        _setTokenURI(newItemId, uri);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

}