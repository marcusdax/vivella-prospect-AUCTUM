// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EstateEscrow {
    address public executor;
    address public contractor;
    address public arbiter; // Legal inspector verifying work in progress

    uint256 public totalBudget;
    uint256 public balance;
    
    enum MilestoneStatus { PENDING, APPROVED, DISPUTED, RELEASED }
    
    struct Milestone {
        string description;
        uint256 value;
        MilestoneStatus status;
    }
    
    Milestone[] public milestones;

    modifier onlyExecutor() {
        require(msg.sender == executor, "Only executor permitted");
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Only arbiter permitted");
        _;
    }

    constructor(address _contractor, address _arbiter) payable {
        executor = msg.sender;
        contractor = _contractor;
        arbiter = _arbiter;
        totalBudget = msg.value;
        balance = msg.value;
    }

    function addMilestone(string memory _desc, uint256 _value) external onlyExecutor {
        require(_value <= balance, "Insufficient budget remaining");
        milestones.push(Milestone(_desc, _value, MilestoneStatus.PENDING));
        balance -= _value;
    }

    function approveMilestone(uint256 _index) external onlyArbiter {
        require(milestones[_index].status == MilestoneStatus.PENDING, "Invalid status");
        milestones[_index].status = MilestoneStatus.APPROVED;
    }

    function releasePayment(uint256 _index) external onlyExecutor {
        require(milestones[_index].status == MilestoneStatus.APPROVED, "Work not verified");
        milestones[_index].status = MilestoneStatus.RELEASED;
        
        uint256 amount = milestones[_index].value;
        (bool success, ) = payable(contractor).call{value: amount}("");
        require(success, "Payment execution failed");
    }
}
