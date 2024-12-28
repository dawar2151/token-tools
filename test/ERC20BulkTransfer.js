"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const network_helpers_1 = require("@nomicfoundation/hardhat-toolbox-viem/network-helpers");
const chai_1 = require("chai");
const hardhat_1 = __importDefault(require("hardhat"));
const viem_1 = require("viem");
describe("ERC20 Bulk Transfer", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function depolyERC20AndERC20BulkSender() {
        // Contracts are deployed using the first signer/account by default
        const [owner, account1, account2, account3] = await hardhat_1.default.viem.getWalletClients();
        const erc20Tester = await hardhat_1.default.viem.deployContract("ERC20Token", ["Name", "Symbol", 18, 1000000], {});
        const erc20BulkSender = await hardhat_1.default.viem.deployContract("BulkSender", [owner.account.address]);
        const publicClient = await hardhat_1.default.viem.getPublicClient();
        return {
            erc20Tester,
            erc20BulkSender,
            owner,
            account1,
            account2,
            account3,
            publicClient,
        };
    }
    describe("Deployment", function () {
        it("Should make bulk transfer with the same value", async function () {
            const { erc20Tester, erc20BulkSender, owner, account1, account2, account3, publicClient, } = await (0, network_helpers_1.loadFixture)(depolyERC20AndERC20BulkSender);
            await erc20Tester.write.approve([erc20BulkSender.address, (0, viem_1.parseGwei)('1000')]);
            await erc20BulkSender.write.bulkTransferERC20([erc20Tester.address, [account1.account.address], (0, viem_1.parseGwei)('300')], {
                value: (0, viem_1.parseEther)('0.1')
            });
            (0, chai_1.expect)(await erc20Tester.read.balanceOf([account1.account.address])).to.eqls((0, viem_1.parseGwei)('300'));
        });
        it("Should make bulk transfer with different values", async function () {
            const { erc20Tester, erc20BulkSender, owner, account1, account2, account3, publicClient, } = await (0, network_helpers_1.loadFixture)(depolyERC20AndERC20BulkSender);
            await erc20Tester.write.approve([erc20BulkSender.address, (0, viem_1.parseGwei)('1000')]);
            await erc20BulkSender.write.bulkTransferERC20([erc20Tester.address, [account1.account.address], [(0, viem_1.parseGwei)('300')]], {
                value: (0, viem_1.parseEther)('0.1')
            });
            (0, chai_1.expect)(await erc20Tester.read.balanceOf([account1.account.address])).to.eqls((0, viem_1.parseGwei)('300'));
        });
    });
});
