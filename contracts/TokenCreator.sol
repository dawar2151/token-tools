import "./tokens/ERC20.sol";
import "./tokens/ERC721.sol";
import "./tokens/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenCreator is Ownable {
    uint256 public creationFee;

    event ERC20Created(address tokenAddress);
    event ERC721Created(address tokenAddress);
    event ERC1155Created(address tokenAddress);

    error InsufficientFee();

    constructor(uint256 _creationFee, address _owner) Ownable(_owner) {
        creationFee = _creationFee;
    }

    modifier requiresFee() {
        if (msg.value != creationFee) {
            revert InsufficientFee();
        }
        payable(owner()).transfer(msg.value);
        _;
    }

    function createERC20(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply
    ) external payable requiresFee {
        ERC20Token newToken = new ERC20Token(name, symbol, decimals, initialSupply, msg.sender);
        emit ERC20Created(address(newToken));
    }

    function createERC721(string memory name, string memory symbol) external payable requiresFee {
        ERC721Token newToken = new ERC721Token(name, symbol, msg.sender);
        emit ERC721Created(address(newToken));
    }

    function createERC1155(string memory uri) external payable requiresFee {
        ERC1155Token newToken = new ERC1155Token(uri, msg.sender);
        emit ERC1155Created(address(newToken));
    }
}
