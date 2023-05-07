//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVault {
    function collect() external;
}

contract VaultResolver {
    address public immutable token;
    address public immutable vault;

    constructor(address _token, address _vault) {
        token = _token;
        vault = _vault;
    }

    function checker()
        external       
        returns (bool canExec)
    {
        canExec = IERC20(token).balanceOf(vault) > 100e18;
        IVault(vault).collect();
    }


}
