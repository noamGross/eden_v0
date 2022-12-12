const {GlobalParams} = require('./settings');


class Utils{

    first = true;
    
    async loadNames(){
        
        var [tase,mof,p1,p2] = await ethers.getSigners();
        this.signerNames = {};
        this.signerNames[tase.address] = "TASE";
        this.signerNames[mof.address] = "MOF";
        this.signerNames[p1.address] = "PD1";
        this.signerNames[p2.address] = "PD2";
    }

    async printBalance()
    {
        console.log("printBalance Started");
        if(this.first)
            await this.loadNames();

        this.first=false;

        var signers = await ethers.getSigners();
            
        const TIS = await ethers.getContractFactory('TIS');
        const tis = TIS.attach(GlobalParams.PaymentTokenAddress);

        const ST1 = await ethers.getContractFactory('ST1');
        const st1 = ST1.attach(GlobalParams.ST1TokenAddress);

        for (let i=0;i<4;i++){
            var signer = signers[i];

            
            console.log(`balance of ${this.signerNames[signer.address]}, ${signer.address}`);
            console.log(`balance tis ${await tis.balanceOf(signer.address)}`);
            console.log(`balance st1 ${await st1.balanceOf(signer.address)}`);
            
        }
    }

}
module.exports = {Utils:new Utils()}