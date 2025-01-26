// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

interface ITokenLocker {

    error LockEndMustBeInTheFuture();
    error InsufficientLockedTokens();
    error LockPeriodHasNotEnded();
    error OnlyFreeCollectorAllowed();
    error InsufficientFee();
    error UserHasOngoingLock();

    struct Lock {
        uint256 amount;
        uint256 endLockTime;
    }

    function lockERC20(address token, uint256 amount, uint256 endLockTime) external payable;
    function unlockERC20(address token, uint256 amount) external;

    event Locked(address indexed user, address indexed token, uint256 amount, uint256 endLockTime);
    event Unlocked(address indexed user, address indexed token, uint256 amount);
    event LockFeeUpdated(uint256 newFee);
}