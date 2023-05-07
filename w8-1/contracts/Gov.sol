// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./console.sol";

contract Gov  {
    // 谁可以进行投票
    mapping(address=>bool) public votes;
    // 总投票人
    uint public allVote;
    // 是否已经投过票
    mapping(address => mapping(uint => bool)) public receipts;
    // 编号对应提案
    mapping(uint => Proposal) public proposals;
    // 编号
    uint public proposalCount;
    
    // 构造函数
    constructor(address[] memory addrs) {
        allVote=addrs.length;
        for (uint256 index = 0; index < addrs.length; index++) {
            votes[addrs[index]]=true;
        }
    }

    // 判断是否为投票人
    modifier isVote(address addr){
        require(votes[addr],"You are not a voter");
        _;
    }

    struct Proposal {
        // 提案的创建者
        address proposer;
        // 要调用合约的地址
        address targets;
        // 要调用合约地址时发送的以太
        uint values;
        // 要传递给每个调用的有序调用数据
        bytes calldatas;
        // 赞成票
        uint forVotes;
        // 拒绝票
        uint againstVotes;
        // 标记提案是否已被执行
        bool executed;
        // 提案结束时间
        uint endTime;
        // 提案描述
        string description;
    }

    // 发起提案
    function propose(address targets,uint values,bytes memory calldatas,uint endTime,string memory description) public isVote(msg.sender) returns(uint){  
        // 发起一个合法有效提案
        require(targets != address(0),"Fail address");
        require(endTime>block.timestamp,"Wrong time");
        proposalCount++;     
        uint proposalId = proposalCount;
        Proposal storage newProposal = proposals[proposalId];
        newProposal.proposer = msg.sender;
        newProposal.targets = targets;
        newProposal.values = values;
        newProposal.calldatas = calldatas;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.executed = false;
        newProposal.endTime = endTime;
        newProposal.description = description;
        return proposalCount;
    }

    // 进行投票
    function vote(uint proposalId, bool support) isVote(msg.sender) public {
        // 判断是否已经投票了该提案
        require(!receipts[msg.sender][proposalId], "The vote has been taken");
        // 判断该提案是否已经截止
        require(block.timestamp < proposals[proposalId].endTime, "The proposal has been closed.");
        Proposal storage proposal=proposals[proposalId];
        if (support){
            proposal.forVotes+=1;
        }else{
            proposal.againstVotes+=1;
        }
        // 提案通过
        if (proposal.forVotes > allVote / 2) {
           (bool success, bytes memory returnData)= executeTransaction(proposal.targets,proposal.values,proposal.calldatas);
            require(success, "Timelock::executeTransaction: Transaction execution reverted.");
            // console.log("returnData:",returnData);
            proposal.executed=true;
        }
    }

    // 执行交易
    function executeTransaction(address target, uint value,  bytes memory data ) public payable returns (bool,bytes memory) {
        (bool success, bytes memory returnData) = target.call{value: value}(data);
        return (success,returnData);
    }
}
