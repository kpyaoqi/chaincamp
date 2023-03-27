// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "./IScore.sol";

contract Teacher {
    IScore iscore;
    address owner;

    constructor(address addr) {
        iscore = IScore(addr);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the teacher can revise");
        _;
    }

    function add(address addr, uint[] memory scores) external onlyOwner {
        for (uint256 index = 0; index < scores.length; index++) {
            if (scores[index] > 100)
                revert("The score is not greater than 100");
        }
        iscore.addOrUpdateAllsubject(addr, scores);
    }

    function del(address addr) external onlyOwner {
        iscore.remove(addr);
    }

    function up(
        address addr,
        bytes memory subject,
        uint score
    ) external onlyOwner {
        iscore.update(addr, subject, score);
    }
}
