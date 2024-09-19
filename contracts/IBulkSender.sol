pragma solidity ^0.8.26;

interface IBulkSender {

    error Unauthorized();
    error InvalidInput();
    error NotAllowedAccount();
    error InsufficientAllowance(address token, uint256 available, uint256 required);
    error InsufficientFunds(uint256 available, uint256 required);
    error NotEnoughTokens(uint256 available, uint256 required);
    error NotEnoughEther(uint256 available, uint256 required);
    error NotVIP();
    error AlreadyVIP();
    error NotOwner();
    error AlreadyOwner();
    error ZeroAddress();
    error NotContract();
    error AlreadyContract();
    error NotNormalAddress();
    error AlreadyNormalAddress();
    error NotToken();
    error AlreadyToken();
    

    event LogTokenBulkSent(address token, uint256 total);
    event LogBulkSent(address token, uint256 total);
    event LogGetToken(address token, address receiver, uint256 balance);
    event LogViPRegistered(address sender, uint256 value);

    function registerVIP() external payable;
    function removeFromVIPList(address[] calldata _vipList) external;
    
}