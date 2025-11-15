// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract BusinessCard {
    mapping(address => string) public businessCardCID;

    // CID 업데이트 이벤트
    event CardUploaded(address indexed user, string cid);

    // 명함 업로드
    function uploadCard(string memory _cid) public {
        businessCardCID[msg.sender] = _cid;
        emit CardUploaded(msg.sender, _cid);
    }

    // 주소로 CID 조회
    function getCardCID(address _user) public view returns (string memory) {
        return businessCardCID[_user];
    }

    // 내 CID 조회
    function myCardCID() public view returns (string memory) {
        return businessCardCID[msg.sender];
    }
}
