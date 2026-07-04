// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FiduciaryAuditTrail {
    address public manager;

    struct DocumentRecord {
        bytes32 docHash;
        uint256 timestamp;
        string metadata; // Metadata string representing document source
    }

    // Mapping property ID string to corresponding document history
    mapping(string => DocumentRecord[]) private propertyRecords;

    event DocumentRegistered(string indexed propertyId, bytes32 indexed docHash, string metadata);

    constructor() {
        manager = msg.sender;
    }

    function registerDocument(string calldata _propertyId, bytes32 _docHash, string calldata _metadata) external {
        propertyRecords[_propertyId].push(DocumentRecord(_docHash, block.timestamp, _metadata));
        emit DocumentRegistered(_propertyId, _docHash, _metadata);
    }

    function getDocumentHistory(string calldata _propertyId) external view returns (DocumentRecord[] memory) {
        return propertyRecords[_propertyId];
    }
}
