//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// Deployed to Goerli @0x712F0b5d3fe7B24FCd742F0ff43beD42c610c42B

contract buyMeACoffee {
    // evnt to emit when a Memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // list of all Memos received
    Memo[] memos;

    // address of contract deployer
    address payable Owner;

    constructor() {
        Owner = payable(msg.sender);
    }

    function buyCoffe(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "You Can't send 0ETH mate!");

        // add Memo to storage
        memos.push(Memo(
           msg.sender,
           block.timestamp,
           _name,
           _message 
        ));

        // emit a log event when a new Memo is created
        emit NewMemo(
            msg.sender,
           block.timestamp,
           _name,
           _message
        );
    }

    /**
    * @dev send the entire stored balance to Owner
    **/
    function withdrawTips() public {
        require(Owner.send(address(this).balance));
    }

    /**
    * @dev retrieve all stored Memos
    **/
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
}
