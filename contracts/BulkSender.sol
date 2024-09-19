pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IBulkSender.sol";

contract BulkSender is Ownable, IBulkSender {
        
    address public receiverAddress;

    uint public txFee = 0.01 ether;
    uint public VIPFee = 0.1 ether;

    mapping(address => bool) private vipList;

    modifier onlyAllowedAccount(){
        require(isVIP(msg.sender) || msg.value >= txFee, NotAllowedAccount());
        if (!isVIP(msg.sender)) {
            payable(receiverAddress).transfer(msg.value);
        }
        _;
    }

    constructor(address _receiverAddress) Ownable(msg.sender) {
        receiverAddress = _receiverAddress;
    }

    /*
    *  Register VIP
    */
    function registerVIP() payable public {
        require(msg.value >= VIPFee, InsufficientFunds(msg.value, VIPFee));
        require(!isVIP(msg.sender), AlreadyVIP());
        payable(receiverAddress).transfer(msg.value);        
        vipList[msg.sender] = true;
        emit LogViPRegistered(msg.sender, msg.value);
    }

    /*
    * Remove address from VIP List by Owner
  */
    function removeFromVIPList(address[] calldata _vipList) onlyOwner public {
        for (uint i = 0; i < _vipList.length; i++) {
            vipList[_vipList[i]] = false;
        }
    }

    /*
    *@dev check if the address is VIP
    */
    function isVIP(address _addr) public view returns(bool) {
        return vipList[_addr];
    }

    /*
    *@dev set receiver address
    */
    function setReceiverAddress(address _addr) onlyOwner public {
        require(_addr != address(0));
        receiverAddress = _addr;
    }

    /*
        *@dev set vip fee
    */
    function setVIPFee(uint _fee) onlyOwner public {
        VIPFee = _fee;
    }

    /*
    * @dev set tx fee    
    */
    function setTxFee(uint _fee) onlyOwner public {
        txFee = _fee;
    }

    function bulkTransfer(address[] calldata _receivers, uint[] calldata _values) external payable onlyAllowedAccount() {
        require(_receivers.length == _values.length, InvalidInput());
        for (uint i = 0; i < _receivers.length; i++) {
            payable(_receivers[i]).transfer(_values[i]);
        }
        emit LogBulkSent(address(0),_receivers.length);
    }

    /**
     * @dev bulk transfer erc20 tokens with same value
     * @param _tokenAddress address of the token
     * @param _receivers array of receivers
     * @param _value amount of tokens to send
     */
    function bulkTransferERC20(address _tokenAddress, address[] calldata _receivers, uint _value) external payable onlyAllowedAccount() {

        IERC20 token = IERC20(_tokenAddress);

        for (uint i = 0; i < _receivers.length; i++) {
            token.transferFrom(msg.sender, _receivers[i], _value);
        }
        emit LogTokenBulkSent(_tokenAddress, _receivers.length);
    }

     /**
     * @dev bulk transfer erc20 tokens with different values
     * @param _tokenAddress address of the token
     * @param _receivers array of receivers
     * @param _values amounts of tokens to send
     */
    function bulkTransferERC20(address _tokenAddress, address[] calldata _receivers, uint[] calldata _values) external payable onlyAllowedAccount() {

        require(_receivers.length == _values.length, InvalidInput());
        IERC20 token = IERC20(_tokenAddress);
        
        for (uint i = 0; i < _receivers.length; i++) {
            token.transferFrom(msg.sender, _receivers[i], _values[i]);
        }
        emit LogTokenBulkSent(_tokenAddress, _receivers.length);
    }

    /**
    * @dev bulk transfer erc721 tokens
    * @param _tokenAddress address of the token
    * @param _receivers array of receivers
    * @param _tokenIds array of token ids
    */
    function bulkTransferERC721(address _tokenAddress, address[] calldata _receivers, uint[] calldata _tokenIds) external payable onlyAllowedAccount() {

        require(_receivers.length == _tokenIds.length, InvalidInput());
        IERC721 token = IERC721(_tokenAddress);

        for (uint i = 0; i < _receivers.length; i++) {
            token.safeTransferFrom(msg.sender, _receivers[i], _tokenIds[i]);
        }
        emit LogTokenBulkSent(_tokenAddress, _receivers.length);
    }

    /** 
     * @dev bulk transfer erc1155 tokens
     * @param _tokenAddress address of the token
     * @param _receivers array of receivers
     * @param _tokenIds array of token ids
     * @param _values array of token values
     */
    function bulkTransferERC1155(address _tokenAddress, address[] calldata _receivers, uint[] calldata _tokenIds, uint[] calldata _values) external payable onlyAllowedAccount() {

        require(_receivers.length == _tokenIds.length && _receivers.length == _values.length, InvalidInput());
        IERC1155 token = IERC1155(_tokenAddress);

        for (uint i = 0; i < _receivers.length; i++) {
            token.safeTransferFrom(msg.sender, _receivers[i], _tokenIds[i], _values[i], "");
        }
        emit LogTokenBulkSent(_tokenAddress, _receivers.length);
    }
}
