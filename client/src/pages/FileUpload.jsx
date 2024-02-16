import React, { useState, useRef } from 'react';
import { useInfura } from '../../hooks/useInfura';

const AddAudit = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        consultingFirm: '',
        email: '',
        localGovernment: '',
        personnel: '',
        organizationGovernance: '',
        riskManagement: '',
        internalControl: '',
    });
    const [pdf, setPDF] = useState(null);

    const [showNext, setShowNext] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange=(e)=>{
        const file =e.target.files[0] ||null;
        setPDF(file);
    }

    const saveAudit = async (formData, fileInput, setShowAddModal, contract, account) => {
        try {
            // Validate form data
            if (!formData.consultingFirm || !formData.email || !formData.localGovernment || !formData.personnel || !formData.organizationGovernance || !formData.riskManagement || !formData.internalControl) {
                throw new Error('All fields are required.');
            }
    
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Invalid email format.');
            }
    
            ;
            if (!pdf || !pdf.type.includes('pdf')) {
                throw new Error('Please upload a valid PDF file.');
            }
    
            // Upload the PDF file to IPFS
            const { uploadFile } = useInfura();
            const pdfCid = await uploadFile(pdf);
    
            // Convert form data to JSON
            const jsonData = JSON.stringify(formData);
            const bufferData = Buffer.from(jsonData);
    
            // Upload the JSON file to IPFS
            const ipfsCid = await uploadFile(bufferData);
    
            // Save the data and PDF CID to the smart contract
            await contract.methods.addAudit(ipfsCid, pdfCid).send({ from: account });
    
            // Reset the form data
            console.log('Audit data saved successfully!');
            setShowAddModal(false);
    
            // Handle success
            handleSuccess('Audit has been added successfully');
        } catch (error) {
            const errorMessage = error.message || 'Error saving audit data.';
            console.error(errorMessage);
            
            // Handle error
            handleError(errorMessage);
        }
    };

    return (
        <div className='flex items-center gap-3'>
            <button
                className="bg-teal-700 text-white px-4 py-2 rounded-full font-semibold"
                onClick={() => setShowAddModal(true)}
            >
                Add Audit
            </button>

            {showAddModal && (
                <div className="bg-black/30 z-50 fixed top-0 h-full left-0 flex w-full items-center justify-center">
                    <div className="w-full max-w-3xl bg-white rounded-lg divide-y-2 divide-gray-400  max-h-[95vh] overflow-auto">
                    <div className={'bg-gray-200 sticky top-0'}>
                            <h2 className={'text-lg p-3'}>Add Audit</h2>
                        </div>
                        <div className="p-3 flex gap-y-3 flex-col">
                            <div>
                                <label htmlFor="consultingFirm" className="block mb-2 text-sm font-medium text-gray-900">
                                    Consulting Firm
                                </label>
                                <input
                                    type="text"
                                    id="consultingFirm"
                                    name="consultingFirm"
                                    value={formData.consultingFirm}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 block w-full p-2.5"
                                    placeholder="Example Firm"
                                />
                            </div>

                            <div className={''}>
                            <label htmlFor="helper-text"
                                       className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                                <input type="email" id="helper-text" aria-describedby="helper-text-explanation"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 block w-full p-2.5 "
                                       placeholder="example@mail.com"/>
                            </div>

                            <div className={''}>
                                <label htmlFor="helper-text"
                                       className="block mb-2 text-sm font-medium text-gray-900">Name of Local
                                    Government</label>
                                <input type="email" id="helper-text" aria-describedby="helper-text-explanation"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 block w-full p-2.5 "
                                       placeholder="Example LG"/>
                            </div>

                        </div>

                        <div className={'bg-gray-200'}>
                            <h2 className={'text-lg p-3'}>Auditor Observation</h2>
                        </div>
                        <div className={'p-3 flex gap-y-3 flex-col'}>
                            <div className={''}>
                                <label htmlFor="helper-text"
                                       className="block mb-2 text-sm font-medium text-gray-900">Personnel/Staff</label>
                                <input type="email" id="helper-text" aria-describedby="helper-text-explanation"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 block w-full p-2.5 "
                                       placeholder="John Doe"/>
                            </div>

                            <div className={''}>
                                <label htmlFor="helper-text"
                                       className="block mb-2 text-sm font-medium text-gray-900">Organization/Governance</label>
                                <input type="email" id="helper-text" aria-describedby="helper-text-explanation"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 block w-full p-2.5 "
                                       placeholder="Example Organization"/>
                            </div>

                            <div className={''}>
                                <label htmlFor="helper-text"
                                       className="block mb-2 text-sm font-medium text-gray-900">Risk Management</label>
                                <textarea name={'personnel'}
                                          className={'w-full border border-gray-300 rounded-lg h-20 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700'}></textarea>
                            </div>

                            <div className={''}>
                                <label htmlFor="helper-text"
                                       className="block mb-2 text-sm font-medium text-gray-900">Internal Control</label>
                                <textarea name={'personnel'}
                                          className={'w-full border border-gray-300 rounded-lg h-20 focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700'}></textarea>
                            </div>

                            <div className={''}>
                                <label htmlFor="helper-text"
                                       className="block mb-2 text-sm font-medium text-gray-900">Upload Audit File</label>
                                <input  onChange={handleFileChange} type="file" ref={file} accept='pdf' id="helper-text" aria-describedby="helper-text-explanation"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700 focus:border-teal-700 block w-full p-2.5 "
                                       placeholder="John Doe"/>
                            </div>

                        </div>
                            <div className="p-3 flex justify-between sticky bottom-0 bg-white">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-200 text-gray-800 shadow border border-gray-800 px-8 py-2 rounded-full font-semibold"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={saveAudit}
                                    className="bg-teal-700 text-white px-8 py-2 rounded-full font-semibold"
                                >
                                    Add Audit
                                </button>
                            </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAudit;
