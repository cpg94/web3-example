//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Skill is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;


    modifier onlyOwner(uint256 _nftId) {
        require(whoOwns[_nftId] == msg.sender, "Only owners can perform this action");
        _;
    }

    modifier onlyAccess(uint256 _nftId) {
        require(hasAccess[_nftId][msg.sender], "Only people with access can perform this action");
        _;
    }

    event Minted(uint256 _nftId);

    mapping (uint256 => mapping (address => bool)) public hasAccess;
    mapping (uint256 => address) public whoOwns;
    mapping (address => uint256[]) public tokensUserHas;
    mapping (uint256 => string) public tokenMapToUri;

    constructor() ERC721("Skill Token", "STKN") {}

    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        tokensUserHas[msg.sender].push(newItemId);
        whoOwns[newItemId] = msg.sender;
        tokenMapToUri[newItemId] = tokenURI;
        hasAccess[newItemId][msg.sender] = true;

        emit Minted(newItemId);

        return newItemId;
    }


    function grantAccess(address _tokenToGrantAccess, uint256 _nftId) public onlyOwner(_nftId) {
        hasAccess[_nftId][_tokenToGrantAccess] = true;
    }

    function revokeAccess(address _tokenToGrantAccess, uint256 _nftId) public onlyOwner(_nftId) {
        hasAccess[_nftId][_tokenToGrantAccess] = false;
    }

    function getUri(uint256 _nftId) public view onlyAccess(_nftId) returns (string memory)  {
        return tokenMapToUri[_nftId];
    }

    function getAllTokens() public view returns (uint256[] memory) {
        return tokensUserHas[msg.sender];
    }
}