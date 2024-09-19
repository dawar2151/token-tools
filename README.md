Here's a well-structured GitHub README for the `BulkSender` smart contract:

---

# BulkSender Smart Contract

`BulkSender` is a Solidity smart contract that facilitates bulk transfers of ETH, ERC20, ERC721, and ERC1155 tokens. It includes a VIP system for reduced transaction fees and can be used for mass payouts or airdrops.

## Features
- **Bulk ETH Transfers**: Transfer ETH to multiple addresses in one transaction.
- **Bulk ERC20 Transfers**: Send ERC20 tokens to multiple addresses, either with the same or varying amounts.
- **Bulk ERC721 Transfers**: Send multiple ERC721 tokens to different addresses.
- **Bulk ERC1155 Transfers**: Send multiple ERC1155 tokens (with different token IDs and values) to multiple recipients.
- **VIP System**: Register as a VIP for reduced transaction fees.
- **Customizable Fees**: Set the transaction fee and VIP registration fee.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Register as VIP](#register-as-vip)
  - [Bulk Transfer ETH](#bulk-transfer-eth)
  - [Bulk Transfer ERC20 Tokens](#bulk-transfer-erc20-tokens)
  - [Bulk Transfer ERC721 Tokens](#bulk-transfer-erc721-tokens)
  - [Bulk Transfer ERC1155 Tokens](#bulk-transfer-erc1155-tokens)
- [Owner Functions](#owner-functions)
- [Events](#events)
- [License](#license)

## Installation
Clone this repository and install the necessary dependencies:

```bash
git clone https://github.com/dawar2151/x-wallet-bulksender-smart-contracts
cd x-wallet-bulksender-smart-contracts
```


## Usage

### Register as VIP
To register as a VIP, users must send at least the `VIPFee`. This will give them access to lower transaction fees.

```solidity
function registerVIP() public payable;
```

### Bulk Transfer ETH
To send ETH to multiple addresses, use the `bulkTransfer` function. Ensure that the lengths of `_receivers` and `_values` match.

```solidity
function bulkTransfer(address[] calldata _receivers, uint[] calldata _values) external payable;
```

### Bulk Transfer ERC20 Tokens
To transfer ERC20 tokens, there are two functions:
- **Same Value Transfer**: Send the same amount of tokens to multiple addresses.
- **Different Values Transfer**: Send different amounts of tokens to multiple addresses.

```solidity
function bulkTransferERC20(address _tokenAddress, address[] calldata _receivers, uint _value) external payable;

function bulkTransferERC20(address _tokenAddress, address[] calldata _receivers, uint[] calldata _values) external payable;
```

### Bulk Transfer ERC721 Tokens
To send multiple ERC721 tokens to different addresses, use the following function:

```solidity
function bulkTransferERC721(address _tokenAddress, address[] calldata _receivers, uint[] calldata _tokenIds) external payable;
```

### Bulk Transfer ERC1155 Tokens
For bulk transfers of ERC1155 tokens, use:

```solidity
function bulkTransferERC1155(address _tokenAddress, address[] calldata _receivers, uint[] calldata _tokenIds, uint[] calldata _values) external payable;
```

## Owner Functions
The contract owner can perform several administrative tasks:
- **Remove from VIP List**: Remove addresses from the VIP list.
  ```solidity
  function removeFromVIPList(address[] calldata _vipList) public onlyOwner;
  ```
- **Set Receiver Address**: Change the address to which the fees are sent.
  ```solidity
  function setReceiverAddress(address _addr) public onlyOwner;
  ```
- **Set VIP Fee**: Modify the VIP registration fee.
  ```solidity
  function setVIPFee(uint _fee) public onlyOwner;
  ```
- **Set Transaction Fee**: Modify the general transaction fee.
  ```solidity
  function setTxFee(uint _fee) public onlyOwner;
  ```

## Events
- `LogViPRegistered(address indexed vip, uint amount)` - Emitted when a VIP is registered.
- `LogBulkSent(address indexed tokenAddress, uint count)` - Emitted when a bulk transfer is completed.
- `LogTokenBulkSent(address indexed tokenAddress, uint count)` - Emitted after bulk token transfers (ERC20, ERC721, ERC1155).

## License
This project is licensed under the MIT License.

---

This README provides an overview of the `BulkSender` contract, highlighting its functions, usage, and administrative capabilities.