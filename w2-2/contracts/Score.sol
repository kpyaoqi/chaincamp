// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Score {
    // 一个uint8数对应一个科目
    mapping(bytes => uint) public subjectof;
    // 映射：学生 -> 科目 -> 成绩
    mapping(address => mapping(uint => uint)) public scoreof;
    // 学生是否已存在
    mapping(address => bool) public exist;
    // 总科目数量
    uint public subjectlength;
    // 各科成绩总分(可用于计算学生总成绩平均分数等)
    mapping(uint => uint) public allscoreofsubject;
    // 总学生数
    uint8 public studentNum=0;

    constructor(bytes[] memory subjects) {
        for (uint index = 0; index < subjects.length; index++) {
            subjectof[subjects[index]] = index + 1;
        }
        subjectlength = subjects.length;
    }

    /**
     * @notice 检查学生是否存在
     * @param addr: 需要判断学生地址
     * @dev   判断学生是否存在的函数修改器
     */
    modifier isexist(address addr) {
        require(exist[addr] == true, "Student nonexistence");
        _;
    }

    /**
     * @notice 添加/更新某位学生的所有科目成绩
     * @param addr: 需要添加/更新学生地址
     * @param scores: 成绩列表，一一对应构造函数传入的科目列表
     * @dev   根据传入的学生地址，判断是否存在，存在则更新成绩，不存在则添加这位学生以及他的成绩
     */
    function addOrUpdateAllsubject(address addr, uint[] memory scores)
        public
    {
        require(
            scores.length == subjectlength,
            "The number of subjects is not complete"
        );
        if (!exist[addr]) {
            studentNum++;
            exist[addr] = true;
            for (uint index = 1; index <= subjectlength; index++) {
                scoreof[addr][index] = scores[index - 1];
                allscoreofsubject[index] += scores[index - 1];
            }
        } else {
            for (uint index = 1; index <= subjectlength; index++) {
                allscoreofsubject[index] =
                    allscoreofsubject[index] +
                    scores[index - 1] -
                    scoreof[addr][index];
                scoreof[addr][index] = scores[index - 1];
            }
        }
    }

    /**
     * @notice 删除某位学生
     * @param addr: 需要删除的学生地址
     * @dev   根据传入的学生地址，判断是否存在，若存在则删除某位学生所有科目成绩，总成绩也一并减去这位同学的成绩
     */
    function remove(address addr) public isexist(addr) {
        exist[addr] = false;
        studentNum--;
        for (uint index = 1; index <= subjectlength; index++) {
            allscoreofsubject[index] -= scoreof[addr][index];
        }
    }

    /**
     * @notice 更改某位学生的某科成绩
     * @param addr: 需要更改的学生地址
     * @param subject: 需要更改的科目
     * @param score: 需要更改的成绩
     * @dev   根据传入的学生地址和科目，判断地址和科目是否存在，若都存在则修改这位同学的这科成绩
     */
    function update(
        address addr,
        bytes memory subject,
        uint score
    ) public isexist(addr) {
        require(score <= 100, "The score is not greater than 100");
        require(subjectof[subject] != 0, "Subject does not exist");
        uint index = subjectof[subject];
        allscoreofsubject[index] =
            allscoreofsubject[index] +
            score -
            scoreof[addr][index];
        scoreof[addr][index] = score;
    }
}
