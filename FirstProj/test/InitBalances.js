const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const GlobalParams = require("../scripts/settings.js");


describe("initBalance",function(){

    it("transfer ST1 Balance to mof",async function(){
       
        [tase, mof,p1,p2] = await ethers.getSigners();
        
        const ST1 = await ethers.getContractFactory('ST1');
        const st1 = ST1.attach(GlobalParams.ST1TokenAddress);
       
        console.log(`balance MOF before ${await st1.balanceOf(mof.address)}`);
      
        await st1.connect(tase).transfer(mof.address,10);
        console.log(`balance MOF after ${await st1.balanceOf(mof.address)}`);
    });

    it("transfer PT Balance to p1,p2",async function(){
       
        [tase, mof,p1,p2] = await ethers.getSigners();
        
        const TIS = await ethers.getContractFactory('TIS');
        const tis = TIS.attach(GlobalParams.PaymentTokenAddress);
       
        console.log(`balance PD1 before ${await tis.balanceOf(p1.address)}`);
        await tis.connect(tase).transfer(p1.address,10);
        console.log(`balance PD1 after ${await tis.balanceOf(p1.address)}`);

        console.log(`balance PD2 before ${await tis.balanceOf(p2.address)}`);
        await tis.connect(tase).transfer(p2.address,10);
        console.log(`balance PD2 after ${await tis.balanceOf(p2.address)}`);
    });

    it.only("get balances",async function(){
       
        var signers = await ethers.getSigners();
        
        const TIS = await ethers.getContractFactory('TIS');
        const tis = TIS.attach(GlobalParams.PaymentTokenAddress);

        const ST1 = await ethers.getContractFactory('ST1');
        const st1 = ST1.attach(GlobalParams.ST1TokenAddress);

        for (i=0;i<4;i++){
            var signer = signers[i];

            
            console.log(`balance of ${signer.address}`);
            console.log(`balance tis ${await tis.balanceOf(signer.address)}`);
            console.log(`balance st1 ${await st1.balanceOf(signer.address)}`);
            
        }
    });



});