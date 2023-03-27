// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IScore {
    function addOrUpdateAllsubject(address addr, uint[] memory scores)
        external;

    function remove(address addr) external;

    function update(
        address addr,
        bytes memory subject,
        uint score
    ) external;
}
