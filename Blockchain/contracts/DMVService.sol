pragma solidity >=0.6.0 <0.9.0;

contract DMVService {
  address public owner;

  // string action = "";
  string public data = "";

  // A function with the signature `last_completed_migration()`, returning a uint, is required.
  uint public last_completed_migration;

  constructor() public {
  }

  event PostEvent(address originAddress, string data);

  // A function with the signature `setCompleted(uint)` is required.
  function postEvent(address _from, string memory value) public {
    data = value;
    emit PostEvent(_from, value);
  }
}