const { expect } = require("chai");
const web3 = require("web3");
let teacher, score;
describe("Teacher", function () {
    async function init() {
        const Score = await ethers.getContractFactory("Score");
        const Teacher = await ethers.getContractFactory("Teacher");

        var Chinese = web3.utils.asciiToHex("Chinese");
        var Math = web3.utils.asciiToHex("Math");
        var English = web3.utils.asciiToHex("English");

        score = await Score.deploy([Chinese, Math, English]);
        await score.deployed();
        teacher = await Teacher.deploy(score.address);
        await teacher.deployed();

        console.log("Score deployed to:", score.address);
        console.log("Teacher deployed to:", teacher.address);
    };

    before(async function () {
        await init();
    });

    it("Add student and update test", async function () {
        const [owner, other] = await ethers.getSigners();
        await teacher.add(other.address, [10, 20, 30]);
        console.log("添加一名学生成绩(10,20,30):")

        expect(await score.scoreof(other.address, 1).then(console.log));
        expect(await score.scoreof(other.address, 2).then(console.log));
        expect(await score.scoreof(other.address, 3).then(console.log));

        await teacher.add(other.address, [40, 50, 60]);
        console.log("修改一名同学的所有成绩(40,50,60):")
        expect(await score.scoreof(other.address, 1).then(console.log));
        expect(await score.scoreof(other.address, 2).then(console.log));
        expect(await score.scoreof(other.address, 3).then(console.log));
        console.log("修改一名同学的某科成绩(Math:70):")
        var Math = web3.utils.asciiToHex("Math");
        await teacher.up(other.address, Math, 70);
        expect(await score.scoreof(other.address, 2).then(console.log));

    })

    it("Only the teacher can revise", async function () {
        const [owner, other] = await ethers.getSigners();
        await teacher.add(other.address, [10, 20, 30]);
        expect(await teacher.connect(other).add(other.address, [40, 50, 60]));
    });

    it("The score is not greater than 100", async function () {
        const [owner, other] = await ethers.getSigners();
        await teacher.add(other.address, [10, 110, 30]);
        await teacher.up(other.address, Math, 110);
    });

    it("Delete a student", async function () {
        const [owner, other] = await ethers.getSigners();
        await teacher.add(other.address, [10, 20, 30]);
        expect(await score.exist(other.address).then(res=>console.log("other.address是否存在:"+res)));
        await teacher.del(other.address);
        expect(await score.exist(other.address).then(res=>console.log("other.address是否存在:"+res)));
        await teacher.del(other.address);
    });

})



