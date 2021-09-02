// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

// contract DwebNFT is ERC721, Ownable {
contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    using Strings for uint256;
    mapping (uint256 => string) private _tokenURIs;
    // constructor() ERC721("DwebNFT", "DNFT") {}
    // constructor(address marketplaceAddress) ERC721("DwebVerse", "DWV") {
    constructor(address marketplaceAddress) ERC721("Metaverse", "METT") {
        contractAddress = marketplaceAddress;
    }

    // function mint
    function createToken(string memory uri) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // recipient is msg.sender
        // uri is tokenURI
        // uint256 is uint
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, uri);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    // function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    //     _tokenURIs[tokenId] = _tokenURI;
    // }

    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    //     require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    //     string memory _tokenURI = _tokenURIs[tokenId];
    //     return _tokenURI;
    // }

    


}