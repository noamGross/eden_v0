const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const {GlobalParams} = require("../scripts/settings.js");
const { Utils } = require("../scripts/utils.js");


describe("Settlment", function(){

    it.only("print config and balance",async function(){

        console.log("parameters");
        console.log(`PaymentTokenAddress ${ GlobalParams.PaymentTokenAddress}`);
        console.log(`ST1TokenAddress ${ GlobalParams.ST1TokenAddress}`);
        console.log(`SettlementAddress ${ GlobalParams.SettlementAddress}`);

        await Utils.printBalance();
       
    });

    it("approve ST in MOF ",async function(){
        [tase, mof,p1,p2] = await ethers.getSigners();

        const ST1 = await ethers.getContractFactory('ST1');
        const st1 = ST1.attach(GlobalParams.ST1TokenAddress);

        //st1.connect(MofWalletAddress).approve(addressSettlementContract,1);
        //st1.connect(MofWalletAddress).approve(PD1WalletAddress,1);
        await st1.connect(mof).approve(GlobalParams.SettlementAddress,2);
        
    });

    it("approve PT in PD1 ",async function(){
        [tase, mof,p1,p2] = await ethers.getSigners();
        const TIS = await ethers.getContractFactory('TIS');
        const tis = TIS.attach(GlobalParams.PaymentTokenAddress);

        //tis.connect(PD1WalletAddress).approve(addressSettlementContract,1);
        //tis.connect(PD1WalletAddress).approve(MofWalletAddress,1);
        await tis.connect(p1).approve(GlobalParams.SettlementAddress,1);
        await tis.connect(p2).approve(GlobalParams.SettlementAddress,1);
     
    });

    it("print allownce ",async function(){
        [tase, mof,p1,p2] = await ethers.getSigners();
        const TIS = await ethers.getContractFactory('TIS');
        const tis = TIS.attach(GlobalParams.PaymentTokenAddress);

        console.log(`address tase ${tase.address}`);
        console.log(`address mof ${mof.address}`);
        console.log(`address p1 ${p1.address}`);
        console.log(`address p2 ${p2.address}`);
        //tis.connect(PD1WalletAddress).approve(addressSettlementContract,1);
        //tis.connect(PD1WalletAddress).approve(MofWalletAddress,1);
        console.log(`allowance TIS in p1 for tase ${await tis.connect(tase).allowance(p1.address,GlobalParams.SettlementAddress)}`);
        console.log(`allowance TIS in p2 for tase ${await tis.connect(tase).allowance(p2.address,GlobalParams.SettlementAddress)}`);
       


        const ST1 = await ethers.getContractFactory('ST1');
        const st1 = ST1.attach(GlobalParams.ST1TokenAddress);
        
        console.log(`allowance ST1 in mof for tase ${await st1.connect(tase).allowance(mof.address,GlobalParams.SettlementAddress)}`);


    });


    it("FromMofToParticipat",async function(){
        const Sett = await ethers.getContractFactory('SettlementV1');
        const sett = await Sett.attach(GlobalParams.SettlementAddress);
        
        [tase, mof,p1,p2] = await ethers.getSigners();

        console.log('balance before settlement');
        await Utils.printBalance();
        await sett.connect(tase).settelment(GlobalParams.ST1TokenAddress,GlobalParams.PaymentTokenAddress,mof.address,p1.address,1,1);
        await sett.connect(tase).settelment(GlobalParams.ST1TokenAddress,GlobalParams.PaymentTokenAddress,mof.address,p2.address,1,1);
        console.log('balance after settlement');
        await Utils.printBalance();
        
    });
});