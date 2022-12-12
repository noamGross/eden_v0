// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SettlementV1 is Ownable {
    
    // NOTES:
    // Attribute volume to different Dapps using msg.sender vs tx.origin, allowing custom fee structures (think augur/gnosis integration)
    // Partial fills: divisibility of valueA & valueB
    // Token registry (symbol, name, address, decimals)
    // Separate storage from logic
    
    mapping (bytes32 => bool) public claimed;
    

   
    event LogClaim(address indexed signer, address indexed taker, bytes32 indexed hash, address tokenA, address tokenB, uint valueA, uint valueB);

    error InsufficientBalance(address token, address owner, uint256 required);
    
    function settelment(
        address _st,
        address _pt,
        address _from_p1,
        address _to_p2,
        uint256 _value_st,
        uint256 _value_pt
        ) public onlyOwner returns(bool success) {

        
        // verify token balances and approvals
        if (!verifyBalance(_from_p1,_st,_value_st)) {
            revert InsufficientBalance(_st, _from_p1, _value_st);
        }

        if (!verifyBalance(_to_p2,_pt,_value_pt) ) {
            revert InsufficientBalance(_pt, _to_p2, _value_pt);
        }

        require(verifyApproval(_from_p1,_st,_value_st),"ST NOT ALLOWED");
        require(verifyApproval(_to_p2,_pt,_value_pt),"PT NOT ALLOWED");
        // check that offer hasn't already been claimed
        // if ( claimed[hash] ) {
        //     return false;
        // }
        // claimed[hash] = true;

        // execute transfer of tokens
        console.log("transfer ST");
        require(IERC20(_st).transferFrom(_from_p1,_to_p2,_value_st) , "settlement ST failed" ) ;
        console.log("transfer PT");
        require(IERC20(_pt).transferFrom(_to_p2,_from_p1,_value_pt) , "settlement PT failed" ) ;

        // LogClaim();
        return true;
    }

    function verifySignature(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s) private pure returns(bool) {
        return ecrecover(hash, v, r, s) == signer;
	}

	function verifyBalance(address _owner, address _token, uint _amount) private view returns(bool) {
	    return IERC20(_token).balanceOf(_owner) >= _amount;
	}
	
	function verifyApproval(address _owner, address token, uint amount)  private view returns(bool) {
        //console.log("(token %s).allowance(_owner %s ,owner %s ) " , token , _owner,owner);
	    return IERC20(token).allowance(_owner,address(this)) >= amount;
	}

}

/*
pragma solidity ^0.4.1;
import "Token.sol";

contract p2pExchange {
    
    // NOTES:
    // Attribute volume to different Dapps using msg.sender vs tx.origin, allowing custom fee structures (think augur/gnosis integration)
    // Partial fills: divisibility of valueA & valueB
    // Token registry (symbol, name, address, decimals)
    // Separate storage from logic
    
    mapping (bytes32 => bool) public claimed;

    event LogClaim(address indexed signer, address indexed taker, bytes32 indexed hash, address tokenA, address tokenB, uint valueA, uint valueB);

    // Expiring limit order
    /// @notice Mutual exchange of `_tokenA` for `_tokenB` between `_signer` (market maker) and `tx.origin` (taker)
    /// @param _v ECDSA signature provided by `_signer`
    /// @param _r ECDSA signature provided by `_signer`
    /// @param _s ECDSA signature provided by `_signer`
    /// @param _signer Address of the market maker
    /// @param _tokenA Address of an ERC20 Token contract
    /// @param _tokenB Address of an ERC20 Token contract
    /// @param _valueA Total units of `_tokenA` offered by `_signer`
    /// @param _valueB Total units of `_tokenB` requested by `_signer`
    /// @param _expiration block number at which the offer provided by `_signer` expires
    /// @return 
    function claim(
        uint8 _v,
        bytes32 _r,
        bytes32 _s,
        address _signer,
        address _tokenA,
        address _tokenB,
        uint256 _valueA,
        uint256 _valueB,
        uint256 _expiration
        ) returns(bool success) {

        bytes32 hash = sha3(_signer,_tokenA,_tokenB,_valueA,_valueB,_expiration);

        // verify signature
        if ( !verifySignature(_signer,hash,_v,_r,_s) ) {
            return false;
        }

        // check expiration
        if ( block.number > _expiration ) {
            return false;
        }

        // verify token balances and approvals
        if ( !verifyApproval(_signer,_tokenA,_valueA)
            || !verifyBalance(_signer,_tokenA,_valueA)
            || !verifyApproval(tx.origin,_tokenB,_valueB) 
            || !verifyBalance(tx.origin,_tokenB,_valueB) ) {
            return false;
        }

        // check that offer hasn't already been claimed
        if ( claimed[hash] ) {
            return false;
        }
        claimed[hash] = true;

        // execute transfer of tokens
        if ( !Token(_tokenA).transferFrom(_signer,tx.origin,_valueA)
            || !Token(_tokenB).transferFrom(tx.origin,_signer,_valueB) ) {
            throw;
        }

        // LogClaim();
        return true;
    }

    function verifySignature(address signer, bytes32 hash, uint8 v, bytes32 r, bytes32 s) constant returns(bool) {
        return ecrecover(hash, v, r, s) == signer;
	}

	function verifyBalance(address owner, address token, uint amount) constant returns(bool) {
	    return Token(token).balanceOf(owner) >= amount;
	}
	
	function verifyApproval(address owner, address token, uint amount) constant returns(bool) {
	    return Token(token).allowance(owner,this) >= amount;
	}

}
*/