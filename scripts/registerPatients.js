const { ether, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
const Patients = require("../initialPatientInformation.json")

async function registerPatients() {
    const patientMedicalRecordSystem = await ethers.getContract("PatientMedicalRecordSystem")

    for (let i in Patients) {
        const patient = Patients[i]
        console.log(patient)
        const tx = await patientMedicalRecordSystem.registerPatient(
            patient.patientAddress, 
            patient.name,
            patient.profilePicture,
            patient.dob,
            patient.phoneNumber,
            patient.bloodGroup
        )
        await tx.wait(1)
        console.log(`Patient ${patient.name} added to PatientMedicalRecordSystem`)
        if (network.config.chainId == 31337) {
            moveBlocks(2, (sleepAmount = 1000)) //1s
        }
    }
}

registerPatients()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })