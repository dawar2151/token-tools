// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IBulkSender.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract BulkSenderV2 is IBulkSender, Initializable, OwnableUpgradeable {
    /// @custom:storage-location bulksendtokens.xyz.bulksender.storage.bulksender
    struct BulkSenderStorage {
        address _receiverAddress;
        uint _txFee;
        uint _vipFee;
        mapping(address => bool) _vipList;
    }

    // keccak256(abi.encode(uint256(keccak256("bulksendtokens.xyz.bulksender.storage.bulksender")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant BulkSenderStorageLocation =
        0xa9b8ea93cd1a4e28b0276278267515f30a34f7de34d3bc6de92b1e97a9a6b700;

    function _getBulkSenderStorage()
        private
        pure
        returns (BulkSenderStorage storage $)
    {
        assembly {
            $.slot := BulkSenderStorageLocation
        }
    }

    function initialize(address receiverAddress) public initializer {
        __Ownable_init(msg.sender);
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        $._receiverAddress = receiverAddress;
        $._txFee = 0.007 ether;
        $._vipFee = 0.1 ether;
    }

    constructor() {}

    modifier onlyAllowedAccount() {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        require(
            isVIP(msg.sender) || msg.value >= $._txFee,
            NotAllowedAccount()
        );
        if (!isVIP(msg.sender)) {
            payable($._receiverAddress).transfer($._txFee);
        }
        _;
    }

    /*
     *  Register VIP
     */
    function registerVIP() public payable {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        require(
            msg.value >= $._vipFee,
            InsufficientFunds(msg.value, $._vipFee)
        );
        require(!isVIP(msg.sender), AlreadyVIP());
        payable($._receiverAddress).transfer(msg.value);
        $._vipList[msg.sender] = true;
        emit LogViPRegistered(msg.sender, msg.value);
    }

    /*
     * Remove address from VIP List by Owner
     */
    function removeFromVIPList(address[] calldata _vipList) public onlyOwner {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        for (uint i = 0; i < _vipList.length; i++) {
            $._vipList[_vipList[i]] = false;
        }
    }

    /*
     *@dev check if the address is VIP
     */
    function isVIP(address _addr) public view returns (bool) {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        return $._vipList[_addr];
    }

    /*
     *   @dev set receiver address
     */
    function setReceiverAddress(address _addr) public onlyOwner {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        $._receiverAddress = _addr;
    }

    /*
     * @dev set vip fee
     */
    function setvipFee(uint _fee) public onlyOwner {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        $._vipFee = _fee;
    }

    /*
     * @dev set tx fee
     */
    function setTxFee(uint _fee) public onlyOwner {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        $._txFee = _fee;
    }

    function bulkTransfer(
        address[] calldata _receivers,
        uint[] calldata _values
    ) external payable onlyAllowedAccount {
        require(_receivers.length == _values.length, InvalidInput());
        for (uint i = 0; i < _receivers.length; i++) {
            payable(_receivers[i]).transfer(_values[i]);
        }
        emit LogBulkSent(address(0), _receivers.length);
    }

    /**
     * @dev bulk transfer erc20 tokens with same value
     * @param _tokenAddress address of the token
     * @param _receivers array of receivers
     * @param _value amount of tokens to send
     */
    function bulkTransferERC20(
        address _tokenAddress,
        address[] calldata _receivers,
        uint _value
    ) external payable onlyAllowedAccount {
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
    function bulkTransferERC20(
        address _tokenAddress,
        address[] calldata _receivers,
        uint[] calldata _values
    ) external payable onlyAllowedAccount {
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
    function bulkTransferERC721(
        address _tokenAddress,
        address[] calldata _receivers,
        uint[] calldata _tokenIds
    ) external payable onlyAllowedAccount {
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
    function bulkTransferERC1155(
        address _tokenAddress,
        address[] calldata _receivers,
        uint[] calldata _tokenIds,
        uint[] calldata _values
    ) external payable onlyAllowedAccount {
        require(
            _receivers.length == _tokenIds.length &&
                _receivers.length == _values.length,
            InvalidInput()
        );
        IERC1155 token = IERC1155(_tokenAddress);

        for (uint i = 0; i < _receivers.length; i++) {
            token.safeTransferFrom(
                msg.sender,
                _receivers[i],
                _tokenIds[i],
                _values[i],
                ""
            );
        }
        emit LogTokenBulkSent(_tokenAddress, _receivers.length);
    }

    function txFee() external view override returns (uint256) {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        return $._txFee;
    }

    function vipFee() external view override returns (uint256) {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        return $._vipFee;
    }

    function receiverAddress() external view override returns (address) {
        BulkSenderStorage storage $ = _getBulkSenderStorage();
        return $._receiverAddress;
    }
}
