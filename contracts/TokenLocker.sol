// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./ITokenLocker.sol";

contract TokenLocker is ITokenLocker {
    mapping(address => mapping(address => Lock)) private locks;

    uint256 public lockFee;

    address public feeCollector;

    constructor(uint256 _lockFee, address _feeCollector) {
        lockFee = _lockFee;
        feeCollector = _feeCollector;
    }

    modifier onlyValidLock(uint256 endLockTime) {
        require(endLockTime > block.timestamp, LockEndMustBeInTheFuture());
        _;
    }

    modifier onlyExistingLock(address token, uint256 amount) {
        Lock memory userLock = locks[msg.sender][token];
        require(userLock.amount >= amount, InsufficientLockedTokens());
        require(
            userLock.endLockTime <= block.timestamp,
            LockPeriodHasNotEnded()
        );
        _;
    }

    function setLockFee(uint256 _lockFee) external {
        require(msg.sender == feeCollector, OnlyFreeCollectorAllowed());
        lockFee = _lockFee;
        emit LockFeeUpdated(_lockFee);
    }

    function lockERC20(
        address token,
        uint256 amount,
        uint256 endLockTime
    ) external payable onlyValidLock(endLockTime) {
        require(msg.value >= lockFee, InsufficientFee());
        Lock storage userLock = locks[msg.sender][token];
        require(userLock.amount == 0, UserHasOngoingLock());
        // Transfer fee to fee collector
        payable(feeCollector).transfer(msg.value);

        // Transfer tokens from the user to the contract
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Update lock details

        userLock.amount += amount;
        userLock.endLockTime = endLockTime;

        emit Locked(msg.sender, token, amount, endLockTime);
    }

    function unlockERC20(
        address token,
        uint256 amount
    ) external onlyExistingLock(token, amount) {
        // Update lock details
        Lock storage userLock = locks[msg.sender][token];
        userLock.amount -= amount;

        // Transfer tokens back to the user
        IERC20(token).transfer(msg.sender, amount);
        emit Unlocked(msg.sender, token, amount);
    }

    function getLockDetails(
        address user,
        address token
    ) external view returns (uint256 amount, uint256 endLockTime) {
        Lock memory userLock = locks[user][token];
        return (userLock.amount, userLock.endLockTime);
    }
}
