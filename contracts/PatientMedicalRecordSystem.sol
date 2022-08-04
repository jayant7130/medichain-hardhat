// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

//imports
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {DoctorType} from "./DoctorType.sol";
import {HospitalType} from "./HospitalType.sol";
import {PatientType} from "./PatientType.sol";

//errors
error PatientMedicalRecords__NotOwner();
error PatientMedicalRecords__NotDoctor();
error PatientMedicalRecords__NotApproved();

contract PatientMedicalRecordSystem is ReentrancyGuard {
    //Type Declarations
    struct ApprovedDoctor {
        address doctorAddress;
        uint256 timestampOfApproval;
    }

    //Storage Variables
    mapping(address => PatientType.Patient) private s_patients;
    mapping(address => DoctorType.Doctor) private s_doctors;
    mapping(address => HospitalType.Hospital) private s_hospitals;
    mapping(address => string) private s_addressToPublicKey;

    address private immutable i_owner;

    //Events
    event AddedPatient(
        address indexed patientAddress,
        string name,
        string[] chronicHash,
        uint256 indexed dob,
        string bloodGroup,
        uint256 indexed dateOfRegistration,
        string publicKey,
        string[] vaccinationHash,
        string phoneNumber,
        string[] accidentHash,
        string[] acuteHash
    ); //added or modified

    event AddedPublicKey(address indexed patientAddress, string publicKey); //emitting when public key is added.

    event AddedDoctor(
        address indexed doctorAddress,
        string name,
        string doctorRegistrationId,
        uint256 indexed dateOfRegistration,
        string specialization,
        address indexed hospitalAddress
    ); //added or modified to the mapping
    event AddedHospital(
        address indexed hospitalAddress,
        string name,
        string hospitalRegistrationId,
        uint256 indexed dateOfRegistration,
        string email,
        string phoneNumber
    ); //added(mostly) or modified

    //modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert PatientMedicalRecords__NotOwner();
        }
        _;
    }

    modifier onlyDoctor() {
        if (s_doctors[msg.sender].doctorAddress != msg.sender) {
            revert PatientMedicalRecords__NotDoctor();
        }
        _;
    }

    // modifier onlyApproved(address _patientAddress, address _doctorAddress) {
    //     if (s_approvedDoctor[_patientAddress].doctorAddress != _doctorAddress) {
    //         //if approve timestamp is == 0 (same as epoch time)
    //         revert PatientMedicalRecords__NotApproved();
    //     }
    //     _;
    // }

    constructor() {
        i_owner = msg.sender;
    }

    //Functions
    //patients can themselves register to the system.
    function registerPatient(
        address _patientAddress,
        string memory _name,
        uint256 _dob,
        string memory _phoneNumber,
        string memory _bloodGroup,
        string memory _publicKey
    ) external nonReentrant {
        PatientType.Patient memory patient;
        patient.name = _name;
        patient.patientAddress = _patientAddress;
        patient.dob = _dob;
        patient.phoneNumber = _phoneNumber;
        patient.bloodGroup = _bloodGroup;
        patient.dateOfRegistration = block.timestamp;
        patient.publicKey = _publicKey; //public key is stored here.

        patient.vaccinationHash = new string[](0); //0
        patient.accidentHash = new string[](0); // 1
        patient.chronicHash = new string[](0); //2
        patient.acuteHash = new string[](0); //3

        s_patients[_patientAddress] = patient;
        s_addressToPublicKey[_patientAddress] = _publicKey;

        //emiting the events
        emit AddedPublicKey(_patientAddress, _publicKey);
        emit AddedPatient(
            _patientAddress,
            patient.name,
            patient.chronicHash,
            patient.dob,
            patient.bloodGroup,
            patient.dateOfRegistration,
            patient.publicKey,
            patient.vaccinationHash,
            patient.phoneNumber,
            patient.accidentHash,
            patient.acuteHash
        );
    }

    //Adds the patient details (treatment details). This IPFS hash contains all the information about the treatment in json format pinned to pinata.
    function addPatientDetails(
        address _patientAddress,
        uint8 _category,
        string memory _IpfsHash //This is the IPFS hash of the diagnostic report which contains an IPFS file hash (preferably PDF file)
    )
        external
        onlyDoctor
        /*onlyApproved(_patientAddress, msg.sender)*/
        nonReentrant
    {
        PatientType.Patient memory patient = s_patients[_patientAddress];

        if (_category == 0) {
            s_patients[_patientAddress].vaccinationHash.push(_IpfsHash);
        } else if (_category == 1) {
            s_patients[_patientAddress].accidentHash.push(_IpfsHash);
        } else if (_category == 2) {
            s_patients[_patientAddress].chronicHash.push(_IpfsHash);
        } else if (_category == 3) {
            s_patients[_patientAddress].acuteHash.push(_IpfsHash);
        }
        s_patients[_patientAddress] = patient;
        //emitting the event.
        emit AddedPatient(
            _patientAddress,
            patient.name,
            patient.chronicHash,
            patient.dob,
            patient.bloodGroup,
            patient.dateOfRegistration,
            patient.publicKey,
            patient.vaccinationHash,
            patient.phoneNumber,
            patient.accidentHash,
            patient.acuteHash
        );
    }

    //this will be done using script by the owner
    function addDoctorDetails(
        address _doctorAddress,
        string memory _name,
        string memory _doctorRegistrationId,
        uint256 _dateOfRegistration,
        string memory _specialization,
        address _hospitalAddress
    ) external onlyOwner nonReentrant {
        DoctorType.Doctor memory doctor;
        doctor.name = _name;
        doctor.doctorRegistrationId = _doctorRegistrationId;
        doctor.dateOfRegistration = _dateOfRegistration;
        doctor.specialization = _specialization;
        doctor.hospitalAddress = _hospitalAddress;
        s_doctors[_doctorAddress] = doctor;
        //emitting the event.
        emit AddedDoctor(
            _doctorAddress,
            doctor.name,
            doctor.doctorRegistrationId,
            doctor.dateOfRegistration,
            doctor.specialization,
            doctor.hospitalAddress
        );
    }

    //this will be done using script by the owner
    function addHospitalDetails(
        address _hospitalAddress,
        string memory _name,
        string memory _hospitalRegistrationId,
        string memory _email,
        string memory _phoneNumber
    ) external onlyOwner nonReentrant {
        HospitalType.Hospital memory hospital = s_hospitals[_hospitalAddress];
        hospital.name = _name;
        hospital.email = _email;
        hospital.phoneNumber = _phoneNumber;
        hospital.hospitalRegistrationId = _hospitalRegistrationId;
        hospital.dateOfRegistration = block.timestamp;
        s_hospitals[_hospitalAddress] = hospital;
        //emitting the event.
        emit AddedHospital(
            hospital.hospitalAddress,
            hospital.name,
            hospital.hospitalRegistrationId,
            hospital.dateOfRegistration,
            hospital.email,
            hospital.phoneNumber
        );
    }

    function getMyDetails() external view returns (PatientType.Patient memory) {
        return s_patients[msg.sender];
    }

    //authorized doctor viewing patient's records
    function getPatientDetails(address _patientAddress)
        external
        view
        onlyDoctor
        returns (
            PatientType.Patient memory
        )
    {
        return s_patients[_patientAddress];
    }

    function getDoctorDetails(address _doctorAddress)
        external
        view
        returns (DoctorType.Doctor memory)
    {
        return s_doctors[_doctorAddress];
    }

    function getHospitalDetails(address _hospitalAddress)
        external
        view
        returns (HospitalType.Hospital memory)
    {
        return s_hospitals[_hospitalAddress];
    }

    // //patients can check his approved doctor's list.
    // function getApprovedDoctor() external view returns (ApprovedDoctor memory) {
    //     return s_approvedDoctor[msg.sender];
    // }

    function getPatientRecordsByOwner(address _patientAddress)
        external
        view
        onlyOwner
        returns (PatientType.Patient memory)
    {
        return s_patients[_patientAddress];
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }
}
