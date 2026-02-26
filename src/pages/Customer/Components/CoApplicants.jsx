import React, { useState } from "react";
import {
    Container,
    Title,
    Button,
    Paper,
    Group,
    Select,
    TextInput,
    Grid,
    Badge,
    ActionIcon,
    Box,
    Text,
    Card,
    Alert,
    Divider,
    Stack,
    Skeleton,
    Table
} from "@mantine/core";
import {
    IconPlus,
    IconTrash,
    IconSearch,
    IconAlertCircle,
    IconCheck,
    IconPhone,
    IconId,
    IconFileText,
    IconMapPin,
    IconMail
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import {
    panVerfiy,
    aadhaarVerfiy,
    mobileVerfiy,
    validateKYCLinkage,
    saveCoApplicantDetails
} from "../../../services/customerOnboarding.service";
import AddressCard from "./AddressCard";
import CoEmploymentDetails from "./CoEmploymentDetails";
import CustomerOnboardStorage from "../../../store/CustomerOnboardStorage";

const CoApplicants = () => {
    const [coApplicants, setCoApplicants] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showEmployment, setShowEmployment] = useState(false);

    const [viewIndex, setViewIndex] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [loadingView, setLoadingView] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const addCoApplicant = () => {
        const newId = Date.now();
        setCoApplicants([
            ...coApplicants,
            {
                id: newId,
                relationship: "",
                fullName: "",
                mobile: "",
                aadhaar: "",
                pan: "",
                status: "Pending",
                showCustomerDetails: false,
                customerData: null,
                addressList: [],
                selectedAddresses: {
                    permanent: null,
                    communication: null
                },
                form: {
                    name: "",
                    mobile: "",
                    aadhaar: "",
                    pan: ""
                },
                verifyStatus: {
                    panVerified: false,
                    aadhaarVerified: false,
                    mobileVerified: false
                },
                verificationData: {
                    mobileData: null,
                    panData: null,
                    aadhaarData: null
                },
                messages: {
                    panMsg: "",
                    aadhaarMsg: "",
                    mobileMsg: ""
                },
                loading: false,
                validationLoading: false,
                fetched: false,
                hasApiError: false,
                formEdited: false,
                allFilled: false,
                allVerified: false,
                saved: false,
                employmentSaved: false,
                isNew: true,
            },
        ]);
        setExpandedIndex(coApplicants.length);
    };

    const handleChange = (index, field, value) => {
        const updated = [...coApplicants];
        updated[index][field] = value;

        if (field === 'fullName') {
            updated[index].form.name = value;
        } else if (field === 'mobile') {
            updated[index].form.mobile = value;
        } else if (field === 'aadhaar') {
            updated[index].form.aadhaar = value;
        } else if (field === 'pan') {
            updated[index].form.pan = value;
        }

        updated[index].formEdited = true;
        updated[index].fetched = false;

        if (field === 'pan') {
            updated[index].messages.panMsg = "";
            updated[index].verifyStatus.panVerified = false;
            updated[index].verificationData.panData = null;
        } else if (field === 'aadhaar') {
            updated[index].messages.aadhaarMsg = "";
            updated[index].verifyStatus.aadhaarVerified = false;
            updated[index].verificationData.aadhaarData = null;
        } else if (field === 'mobile') {
            updated[index].messages.mobileMsg = "";
            updated[index].verifyStatus.mobileVerified = false;
            updated[index].verificationData.mobileData = null;
        }

        const form = updated[index].form;
        updated[index].allFilled = form.name && form.mobile && form.pan && form.aadhaar;

        setCoApplicants(updated);
    };

    const removeCoApplicant = (index) => {
        setCoApplicants(coApplicants.filter((_, i) => i !== index));
        if (expandedIndex === index) {
            setExpandedIndex(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getAddressTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'primary': return 'blue';
            case 'permanent': return 'green';
            default: return 'gray';
        }
    };

    const handleFetch = async (index) => {
        const applicant = coApplicants[index];
        const { mobile, aadhaar, pan, name } = applicant.form;

        if (!mobile || !aadhaar || !pan) {
            notifications.show({
                title: "Error",
                message: "Enter Mobile, Aadhaar & PAN",
                color: "red",
            });
            return;
        }

        try {
            const updated = [...coApplicants];
            updated[index].loading = true;
            updated[index].fetched = false;
            updated[index].hasApiError = false;
            updated[index].formEdited = false;
            updated[index].selectedAddresses = { permanent: null, communication: null };
            updated[index].verificationData = {
                mobileData: null,
                panData: null,
                aadhaarData: null
            };
            updated[index].messages = {
                panMsg: "",
                aadhaarMsg: "",
                mobileMsg: ""
            };
            updated[index].verifyStatus = {
                panVerified: false,
                aadhaarVerified: false,
                mobileVerified: false
            };
            setCoApplicants(updated);

            let hasError = false;
            let successfulCalls = 0;

            // Mobile Verification
            try {
                const mobileRes = await mobileVerfiy({ mobile });
                console.log(`Co-Applicant ${index + 1} Mobile Response:`, mobileRes);

                if (mobileRes?.status === "SUCCESS" && mobileRes?.data) {
                    updated[index].verificationData.mobileData = mobileRes;
                    updated[index].messages.mobileMsg = mobileRes?.message || "Mobile verified successfully";
                    updated[index].verifyStatus.mobileVerified = true;
                    successfulCalls++;
                } else {
                    updated[index].messages.mobileMsg = mobileRes?.message || "Mobile verification failed";
                    hasError = true;
                }
            } catch (err) {
                console.error(`Co-Applicant ${index + 1} Mobile Error:`, err);
                updated[index].messages.mobileMsg = err?.response?.data?.message || "Mobile verification failed";
                hasError = true;
            }

            // PAN Verification
            try {
                const panRes = await panVerfiy({ pan });
                console.log(`Co-Applicant ${index + 1} PAN Response:`, panRes);

                if (panRes?.status === "SUCCESS" && panRes?.data) {
                    updated[index].verificationData.panData = panRes;
                    updated[index].messages.panMsg = panRes?.message || "PAN verified successfully";
                    updated[index].verifyStatus.panVerified = true;
                    successfulCalls++;
                } else {
                    updated[index].messages.panMsg = panRes?.message || "Invalid PAN number";
                    hasError = true;
                }
            } catch (err) {
                console.error(`Co-Applicant ${index + 1} PAN Error:`, err);
                updated[index].messages.panMsg = err?.response?.data?.message || "Invalid PAN number";
                hasError = true;
            }

            // Aadhaar Verification
            try {
                const aadhaarRes = await aadhaarVerfiy({ aadhar: aadhaar });
                console.log(`Co-Applicant ${index + 1} Aadhaar Response:`, aadhaarRes);

                if (aadhaarRes?.status === "SUCCESS" && aadhaarRes?.data) {
                    updated[index].verificationData.aadhaarData = aadhaarRes;
                    updated[index].messages.aadhaarMsg = aadhaarRes?.message || "Aadhaar verified successfully";
                    updated[index].verifyStatus.aadhaarVerified = true;
                    successfulCalls++;
                } else {
                    updated[index].messages.aadhaarMsg = aadhaarRes?.message || "Invalid Aadhaar number";
                    hasError = true;
                }
            } catch (err) {
                console.error(`Co-Applicant ${index + 1} Aadhaar Error:`, err);
                updated[index].messages.aadhaarMsg = err?.response?.data?.message || "Invalid Aadhaar number";
                hasError = true;
            }

            const { panVerified, aadhaarVerified, mobileVerified } = updated[index].verifyStatus;
            updated[index].allVerified = panVerified && aadhaarVerified && mobileVerified;

            if (successfulCalls > 0) {
                updated[index].fetched = true;
                updated[index].hasApiError = hasError;

                try {
                    const mobileData = updated[index].verificationData.mobileData;
                    const panData = updated[index].verificationData.panData;

                    const mobileAddresses = mobileData?.data?.data?.address_details || mobileData?.data?.address_details || [];
                    const panAddrStr = panData?.data?.data?.details?.address || panData?.data?.details?.address || null;
                    const panPostal = panData?.data?.data?.details?.zip || panData?.data?.details?.zip || '';
                    const panState = panData?.data?.data?.details?.state || panData?.data?.details?.state || '';

                    let prefillAddresses = [];
                    if (Array.isArray(mobileAddresses) && mobileAddresses.length) {
                        prefillAddresses.push(...mobileAddresses.map(a => ({ ...a, source: a.source || 'Mobile', fromApi: true })));
                    }
                    if (panAddrStr) {
                        prefillAddresses.push({
                            address: panAddrStr,
                            postal: panPostal,
                            state: panState,
                            reported_date: null,
                            type: 'PAN',
                            source: 'PAN',
                            fromApi: true
                        });
                    }

                    const seen = new Set();
                    prefillAddresses = prefillAddresses.filter(a => {
                        const key = (a.address || '').trim();
                        if (!key) return false;
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });

                    if (prefillAddresses.length > 0) {
                        const previewCustomer = {
                            full_name: mobileData?.data?.data?.full_name || panData?.data?.data?.details?.full_name || name,
                            mobile: mobile,
                            pan: pan,
                            aadhar: aadhaar,
                            dob: mobileData?.data?.data?.date_of_birth || panData?.data?.data?.details?.date_of_birth || '',
                            age: mobileData?.data?.data?.age || '',
                            gender: mobileData?.data?.data?.gender || panData?.data?.data?.details?.gender || '',
                            email: mobileData?.data?.data?.email_details?.[0]?.email_address || panData?.data?.data?.details?.email || '',
                            address_list: prefillAddresses
                        };

                        updated[index].customerData = previewCustomer;
                        updated[index].addressList = prefillAddresses;

                    }
                } catch (e) {
                    console.log("Preview error:", e);
                }

                notifications.show({
                    title: "Success",
                    message: `Co-Applicant ${index + 1}: ${successfulCalls} verification(s) completed`,
                    color: "green",
                });
            } else {
                updated[index].hasApiError = true;
                notifications.show({
                    title: "Error",
                    message: `Co-Applicant ${index + 1}: All verifications failed`,
                    color: "red",
                });
            }

            setCoApplicants(updated);

        } catch (err) {
            console.error(`Co-Applicant ${index + 1} General Error:`, err);
            const updated = [...coApplicants];
            updated[index].hasApiError = true;
            setCoApplicants(updated);

            notifications.show({
                title: "Error",
                message: "Something went wrong",
                color: "red",
            });
        } finally {
            const updated = [...coApplicants];
            updated[index].loading = false;
            setCoApplicants(updated);
        }
    };

    const handleValidateKYC = async (index) => {
        const applicant = coApplicants[index];
        const { mobile, aadhaar, pan } = applicant.form;
        const { mobileData, panData, aadhaarData } = applicant.verificationData;

        if (!applicant.allVerified) {
            notifications.show({
                title: "Error",
                message: "Please verify all details before validation",
                color: "red",
            });
            return;
        }

        try {
            const updated = [...coApplicants];
            updated[index].validationLoading = true;
            setCoApplicants(updated);

            const response = await validateKYCLinkage(
                mobile,
                aadhaar,
                pan,
                mobileData,
                panData,
                aadhaarData
            );

            if (response?.status === "SUCCESS") {
                const data = response.data;

                const rawAddresses =
                    data?.mobile_details?.data?.data?.address_details ||
                    data?.mobile_details?.data?.address_details ||
                    mobileData?.data?.data?.address_details ||
                    mobileData?.data?.address_details ||
                    data?.address_list ||
                    data?.address_details ||
                    [];

                const addresses = rawAddresses.map((addr) => ({
                    ...addr,
                    fromApi: true,
                    source: addr.source || addr.type || 'API'
                }));

                const normalizedCustomer = {
                    full_name:
                        data?.pan_details?.data?.details?.full_name ||
                        data?.mobile_details?.data?.full_name ||
                        mobileData?.data?.data?.full_name ||
                        panData?.data?.data?.details?.full_name ||
                        applicant.form.name,
                    mobile: mobile,
                    pan: pan,
                    aadhar: aadhaar,
                    dob:
                        data?.pan_details?.data?.details?.date_of_birth ||
                        data?.mobile_details?.data?.date_of_birth ||
                        mobileData?.data?.data?.date_of_birth ||
                        panData?.data?.data?.details?.date_of_birth ||
                        "",
                    age:
                        data?.mobile_details?.data?.age ||
                        mobileData?.data?.data?.age ||
                        "",
                    gender:
                        data?.pan_details?.data?.details?.gender ||
                        data?.mobile_details?.data?.gender ||
                        panData?.data?.data?.details?.gender ||
                        mobileData?.data?.data?.gender ||
                        "",
                    email:
                        data?.pan_details?.data?.details?.email ||
                        data?.mobile_details?.data?.email_details?.[0]?.email_address ||
                        mobileData?.data?.data?.email_details?.[0]?.email_address ||
                        panData?.data?.data?.details?.email ||
                        "",
                    address_list: addresses
                };

                updated[index].customerData = normalizedCustomer;
                updated[index].showCustomerDetails = true;
                updated[index].addressList = addresses;
                updated[index].selectedAddresses = { permanent: null, communication: null };
                updated[index].validationResult = {
                    success: true,
                    message: response.message,
                    data: response.data
                };

                notifications.show({
                    title: "Success",
                    message: "KYC validation completed successfully",
                    color: "green",
                });
            } else {
                updated[index].validationResult = {
                    success: false,
                    message: response?.message,
                    data: response?.data || null
                };

                notifications.show({
                    title: "Error",
                    message: response?.message || "KYC validation failed",
                    color: "red",
                });
            }

            setCoApplicants(updated);

        } catch (err) {
            console.error("Validation Error:", err);
            notifications.show({
                title: "Error",
                message: err?.message || "KYC validation failed",
                color: "red",
            });
        } finally {
            const updated = [...coApplicants];
            updated[index].validationLoading = false;
            setCoApplicants(updated);
        }
    };

    const handleSaveCoApplicant = async (index) => {
        const applicant = coApplicants[index];
        const { selectedAddresses, customerData, form, verificationData } = applicant;

        if (!selectedAddresses.permanent && !selectedAddresses.communication) {
            notifications.show({
                title: "Error",
                message: "Please select at least one address",
                color: "red",
            });
            return;
        }

        try {
            const updated = [...coApplicants];
            updated[index].validationLoading = true;
            setCoApplicants(updated);

            let selectedAddr = null;
            let isPermanent = false;
            let isCommunication = false;

            if (selectedAddresses.permanent) {
                selectedAddr = selectedAddresses.permanent;
                isPermanent = true;
            }

            if (selectedAddresses.communication) {
                selectedAddr = selectedAddresses.communication;
                isCommunication = true;
            }

            // Get mobile details in the correct format
            const mobileDetails = verificationData.mobileData?.data?.data || verificationData.mobileData?.data || {};

            // Format mobile details with address_details array
            const formattedMobileDetails = {
                ...mobileDetails,
                address_details: mobileDetails.address_details ||
                    (selectedAddr ? [{
                        address_line_1: selectedAddr.address?.split(',')[0] || selectedAddr.address || "",
                        address_line_2: selectedAddr.address?.split(',').slice(1).join(',').trim() || "",
                        city: selectedAddr.city || "",
                        postal_code: selectedAddr.postal || "",
                        state: selectedAddr.state || "",
                        country: "INDIA"
                    }] : [])
            };

            // Get PAN details
            const panDetails = verificationData.panData?.data?.data?.details ||
                verificationData.panData?.data?.details || {};

            // Get Aadhaar details
            const aadhaarDetails = verificationData.aadhaarData?.data?.data?.details ||
                verificationData.aadhaarData?.data?.details || {};

            const payload = {
                full_name: customerData?.full_name || form.name,
                mobile: form.mobile,
                dob: customerData?.dob || "",
                age: customerData?.age ? parseInt(customerData.age) : 0,
                gender: customerData?.gender || "",
                category: "CO-APPLICANT",
                address: selectedAddr?.address || "",
                city: selectedAddr?.city || "",
                state: selectedAddr?.state || "",
                is_communication_address: isCommunication,
                is_permanent_address: isPermanent,
                aadhar: form.aadhaar,
                aadhar_details: {
                    aadhaar_number: aadhaarDetails.aadhaar_number || aadhaarDetails.masked_aadhaar || form.aadhaar,
                    age_range: aadhaarDetails.age_range || "",
                    gender: aadhaarDetails.gender || customerData?.gender || "",
                    is_mobile: aadhaarDetails.is_mobile || false,
                    last_digits_of_mobile: aadhaarDetails.last_digits_of_mobile || 0,
                    remarks: aadhaarDetails.remarks || "success",
                    state: aadhaarDetails.state || selectedAddr?.state || ""
                },
                pan: form.pan,
                pan_details: {
                    aadhaar_linked: panDetails.aadhaar_linked || false,
                    masked_aadhaar: panDetails.masked_aadhaar || "",
                    address: panDetails.address || selectedAddr?.address || "",
                    city: panDetails.city || selectedAddr?.city || "",
                    country: panDetails.country || "INDIA",
                    date_of_birth: panDetails.date_of_birth || customerData?.dob || "",
                    email: panDetails.email || customerData?.email || "",
                    first_name: panDetails.first_name || (customerData?.full_name?.split(' ')[0] || ""),
                    full_name: panDetails.full_name || customerData?.full_name || form.name,
                    gender: panDetails.gender || customerData?.gender || "",
                    last_name: panDetails.last_name || (customerData?.full_name?.split(' ').slice(1).join(' ') || ""),
                    pan_number: panDetails.pan_number || panDetails.pan || form.pan,
                    phone_number: panDetails.phone_number || "",
                    state: panDetails.state || selectedAddr?.state || "",
                    street_name: panDetails.street_name || selectedAddr?.address?.split(',')[0] || "",
                    zip: panDetails.zip || selectedAddr?.postal || ""
                },
                mobile_details: formattedMobileDetails
            };

            const dealershipId = CustomerOnboardStorage.get()?.dealership_id;
            const response = await saveCoApplicantDetails(payload, dealershipId);

            if (response?.status === "SUCCESS") {

                // Save co-applicant in local storage
                CustomerOnboardStorage.updateCoApplicant(index, {
                    applicant_id: response?.data?.coapplicant_id || null,
                    full_name: payload.full_name,
                    mobile: payload.mobile,
                    pan: payload.pan,
                    aadhaar: payload.aadhar,
                    dob: payload.dob,
                    gender: payload.gender,
                    age: payload.age,
                    address: payload.address,
                    city: payload.city,
                    state: payload.state,
                });

                updated[index].status = "Verified";
                updated[index].saved = true;
                updated[index].showCustomerDetails = false;

                // ✅ ADD THIS
                setViewIndex(index);
                setViewData(response.data);   // or payload if API doesn't return data

                const allSaved = updated.every(app => app.status === "Verified" || app.saved);
                setShowEmployment(allSaved && updated.length > 0);
                setExpandedIndex(null);

                notifications.show({
                    title: "Success",
                    message: "Co-applicant saved successfully",
                    color: "green",
                });
            } else {
                notifications.show({
                    title: "Error",
                    message: response?.message || "Save failed",
                    color: "red",
                });
            }

            setCoApplicants(updated);

        } catch (err) {
            console.error("Save Error:", err);
            notifications.show({
                title: "Error",
                message: "Failed to save co-applicant",
                color: "red",
            });
        } finally {
            const updated = [...coApplicants];
            updated[index].validationLoading = false;
            setCoApplicants(updated);
        }
    };

    const handleAddressSelect = (index, type, addrIndex) => {
        const updated = [...coApplicants];
        const selectedAddress = updated[index].addressList[addrIndex];

        updated[index].selectedAddresses = {
            permanent: null,
            communication: null
        };

        updated[index].selectedAddresses[type] = selectedAddress;

        notifications.show({
            title: "Success",
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} address selected`,
            color: "green",
        });

        setCoApplicants(updated);
    };

    const handleAddressEdit = (index, addrIndex, editedAddress) => {
        const updated = [...coApplicants];
        const prevAddress = updated[index].addressList[addrIndex];

        updated[index].addressList[addrIndex] = {
            ...prevAddress,
            ...editedAddress,
            fromApi: prevAddress?.fromApi ?? false
        };

        if (updated[index].customerData) {
            updated[index].customerData.address_list = updated[index].addressList;
        }

        const { selectedAddresses } = updated[index];
        if (selectedAddresses.permanent === prevAddress) {
            selectedAddresses.permanent = updated[index].addressList[addrIndex];
        }
        if (selectedAddresses.communication === prevAddress) {
            selectedAddresses.communication = updated[index].addressList[addrIndex];
        }

        notifications.show({
            title: "Success",
            message: "Address updated",
            color: "green",
        });

        setCoApplicants(updated);
    };

    const handleDeleteAddress = (index, addrIndex) => {
        const updated = [...coApplicants];
        const deletedAddress = updated[index].addressList[addrIndex];

        updated[index].addressList = updated[index].addressList.filter((_, i) => i !== addrIndex);

        if (updated[index].customerData) {
            updated[index].customerData.address_list = updated[index].addressList;
        }

        if (updated[index].selectedAddresses.permanent === deletedAddress) {
            updated[index].selectedAddresses.permanent = null;
        }
        if (updated[index].selectedAddresses.communication === deletedAddress) {
            updated[index].selectedAddresses.communication = null;
        }

        setCoApplicants(updated);
    };

    const addManualAddress = (index) => {
        const updated = [...coApplicants];
        const newAddress = {
            address: "",
            city: "",
            state: "",
            postal: "",
            country: "India",
            source: "Manual",
            fromApi: false
        };

        updated[index].addressList.push(newAddress);

        if (updated[index].customerData) {
            updated[index].customerData.address_list = updated[index].addressList;
        }

        setCoApplicants(updated);
    };

    const handleEmploymentSaved = (index) => {
        setCoApplicants(prev => {
            const updated = [...prev];

            updated[index].employmentSaved = true;
            updated[index].isNew = false;

            updated[index].showCustomerDetails = false;
            updated[index].validationLoading = false;
            updated[index].loading = false;

            return updated;
        });
    };
    const handleViewDetails = async (applicantId, index) => {
        try {
            setLoadingView(true);
            setViewIndex(index);

            const res = await fetch(`/los-poc/customer-details/${applicantId}`);
            const data = await res.json();

            if (data?.status === "SUCCESS") {
                setViewData(data.data);
                setEditMode(false);
            } else {
                notifications.show({
                    title: "Error",
                    message: "Failed to fetch details",
                    color: "red",
                });
            }
        } catch (err) {
            notifications.show({
                title: "Error",
                message: "API error",
                color: "red",
            });
        } finally {
            setLoadingView(false);
        }
    };
    const handleUpdateCustomer = async (index) => {
        try {
            const applicant = coApplicants[index];
            const { form, verificationData } = applicant;

            const panDetails =
                verificationData.panData?.data?.data?.details ||
                verificationData.panData?.data?.details || {};

            const aadhaarDetails =
                verificationData.aadhaarData?.data?.data?.details ||
                verificationData.aadhaarData?.data?.details || {};

            const mobileDetails =
                verificationData.mobileData?.data?.data ||
                verificationData.mobileData?.data || {};

            // 🔥 USE EDITED DATA FROM viewData
            const editedName = viewData.full_name;
            const editedAddress = viewData.address;
            const editedCity = viewData.city || "";
            const editedState = viewData.state || "";

            const payload = {
                full_name: editedName, // ✅ changed
                mobile: form.mobile,
                dob: viewData.dob || "",
                age: viewData.age ? parseInt(viewData.age) : 0,
                gender: viewData.gender || "",
                category: "CO-APPLICANT",

                address: editedAddress, // ✅ changed
                city: editedCity,       // ✅ changed
                state: editedState,     // ✅ changed

                is_communication_address: true,
                is_permanent_address: false,

                aadhar: form.aadhaar,
                aadhar_details: {
                    aadhaar_number:
                        aadhaarDetails.aadhaar_number ||
                        aadhaarDetails.masked_aadhaar ||
                        form.aadhaar,
                    age_range: aadhaarDetails.age_range || "",
                    gender: aadhaarDetails.gender || viewData.gender || "",
                    is_mobile: aadhaarDetails.is_mobile || false,
                    last_digits_of_mobile:
                        aadhaarDetails.last_digits_of_mobile || 0,
                    remarks: aadhaarDetails.remarks || "success",
                    state: aadhaarDetails.state || editedState
                },

                pan: form.pan,
                pan_details: {
                    ...panDetails,

                    // ✅ override only changed fields
                    full_name: editedName,
                    address: editedAddress,
                    city: editedCity,
                    state: editedState,
                },

                mobile_details: mobileDetails
            };

            const dealershipId = 30;

            const response = await saveCoApplicantDetails(payload, dealershipId);

            if (response?.status === "SUCCESS") {
                notifications.show({
                    title: "Success",
                    message: "Customer updated successfully",
                    color: "green",
                });

                setEditMode(false);

            } else {
                notifications.show({
                    title: "Error",
                    message: response?.message || "Update failed",
                    color: "red",
                });
            }

        } catch (error) {
            notifications.show({
                title: "Error",
                message: "Failed to update customer",
                color: "red",
            });
        }
    };

    const verifiedCoApplicants = coApplicants.filter(app => app.status === "Verified" || app.saved);
    return (
        <Container size="xl" py="lg">
            <Group justify="space-between" mb="lg">
                <Title order={3}>Co-Applicants ({coApplicants.length})</Title>
                <Button leftSection={<IconPlus size={18} />} onClick={addCoApplicant}>
                    Add Co-Applicant
                </Button>
            </Group>

            {coApplicants.map((item, index) => (
                <Paper key={item.id} withBorder radius="md" mb="md">
                    {/* Header Section - Always Visible */}

                    <Group justify="space-between" p="md" style={{ background: "#f9fafb" }}>
                        <Group gap="xs">
                            <Text fw={600}>Co-Applicant {index + 1}</Text>
                            {item.saved && <Badge color="green" size="sm" ml="xs">Saved</Badge>}
                        </Group>

                        <Group>
                            <Badge
                                color={item.allVerified ? "green" : item.verifyStatus?.panVerified || item.verifyStatus?.aadhaarVerified || item.verifyStatus?.mobileVerified ? "yellow" : "gray"}
                                variant="light"
                            >
                                {item.allVerified ? "Verified" : item.status}
                            </Badge>
                            {!item.saved && (
                                <ActionIcon color="red" variant="subtle" onClick={() => removeCoApplicant(index)}>
                                    <IconTrash size={18} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Group>

                    {/* Content Section - Always Visible when not saved */}
                    {!(item.saved && item.employmentSaved) && (
                        <Box p="md">
                            {/* Basic Details Section - Fixed at top with proper padding */}
                            <Card withBorder radius="md" mb="lg" p="lg">
                                <Text fw={700} size="lg" mb="md">Basic Details</Text>
                                <Grid gutter="md">
                                    <Grid.Col span={4}>
                                        <TextInput
                                            label="Full Name"
                                            placeholder="Enter full name"
                                            value={item.fullName}
                                            onChange={(e) => handleChange(index, "fullName", e.target.value)}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <TextInput
                                            label="Mobile"
                                            placeholder="10-digit mobile"
                                            maxLength={10}
                                            value={item.mobile}
                                            onChange={(e) => handleChange(index, "mobile", e.target.value.replace(/\D/g, ""))}
                                            required
                                        />
                                        {item.messages?.mobileMsg && (
                                            <Text size="sm" mt={5} c={item.verifyStatus?.mobileVerified ? "green" : "red"}>
                                                {item.verifyStatus?.mobileVerified ? "✔ " : "✖ "} {item.messages.mobileMsg}
                                            </Text>
                                        )}
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <TextInput
                                            label="PAN"
                                            placeholder="ABCPL1234D"
                                            maxLength={10}
                                            value={item.pan}
                                            onChange={(e) => handleChange(index, "pan", e.target.value.toUpperCase())}
                                            required
                                        />
                                        {item.messages?.panMsg && (
                                            <Text size="sm" mt={5} c={item.verifyStatus?.panVerified ? "green" : "red"}>
                                                {item.verifyStatus?.panVerified ? "✔ " : "✖ "} {item.messages.panMsg}
                                            </Text>
                                        )}
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <TextInput
                                            label="Aadhaar"
                                            placeholder="12-digit Aadhaar"
                                            maxLength={12}
                                            value={item.aadhaar}
                                            onChange={(e) => handleChange(index, "aadhaar", e.target.value.replace(/\D/g, ""))}
                                            required
                                        />
                                        {item.messages?.aadhaarMsg && (
                                            <Text size="sm" mt={5} c={item.verifyStatus?.aadhaarVerified ? "green" : "red"}>
                                                {item.verifyStatus?.aadhaarVerified ? "✔ " : "✖ "} {item.messages.aadhaarMsg}
                                            </Text>
                                        )}
                                    </Grid.Col>
                                </Grid>

                                <Group justify="space-between" mt="md">
                                    <Button
                                        leftSection={<IconSearch size={16} />}
                                        onClick={() => handleFetch(index)}
                                        loading={item.loading}
                                        disabled={!item.allFilled || item.loading || (item.fetched && !item.formEdited)}
                                    >
                                        {item.fetched && !item.formEdited ? "Fetched" : "Fetch & Verify KYC"}
                                    </Button>

                                    <Badge
                                        size="lg"
                                        color={item.allVerified ? "green" : item.verifyStatus?.panVerified || item.verifyStatus?.aadhaarVerified || item.verifyStatus?.mobileVerified ? "yellow" : "red"}
                                    >
                                        {item.allVerified ? "Fully Verified" : item.verifyStatus?.panVerified || item.verifyStatus?.aadhaarVerified || item.verifyStatus?.mobileVerified ? "Partially Verified" : "Not Verified"}
                                    </Badge>
                                </Group>
                            </Card>

                            {/* Loading State */}
                            {item.loading && (
                                <Card withBorder mb="lg" p="lg">
                                    <Skeleton height={25} width="40%" mb="md" />
                                    <Skeleton height={15} mb={10} />
                                    <Skeleton height={15} mb={10} />
                                    <Skeleton height={15} mb={10} />
                                    <Skeleton height={15} mb={10} />
                                    <Skeleton height={15} mb={10} />
                                    <Skeleton height={15} mb={10} />
                                    <Skeleton height={100} mb={10} />
                                </Card>
                            )}

                            {/* Error Alert */}
                            {!item.loading && item.hasApiError && !item.verificationData?.mobileData && !item.verificationData?.panData && (
                                <Alert icon={<IconAlertCircle size={16} />} title="Verification Failed" color="red" mb="lg">
                                    All verifications failed. Please check your inputs and try again.
                                </Alert>
                            )}

                            {/* Verification Details Section - Always visible in box format */}
                            {!item.loading && (item.verificationData?.mobileData || item.verificationData?.panData || item.verificationData?.aadhaarData) && (
                                <Box mb="lg">
                                    {/* Mobile Details */}
                                    {item.verificationData?.mobileData && (
                                        <Card withBorder radius="md" mb="md" p="lg">
                                            <Group mb="md">
                                                <IconPhone size={20} />
                                                <Text fw={600}>Mobile Details</Text>
                                                <Badge color="green">Verified</Badge>
                                            </Group>

                                            <Card withBorder p="md">
                                                <Grid>
                                                    <Grid.Col span={3}>
                                                        <Text size="sm" c="dimmed">Full Name</Text>
                                                        <Text fw={500}>{item.verificationData.mobileData?.data?.data?.full_name || item.verificationData.mobileData?.data?.full_name || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={3}>
                                                        <Text size="sm" c="dimmed">Mobile</Text>
                                                        <Text fw={500}>{item.verificationData.mobileData?.data?.data?.mobile || item.verificationData.mobileData?.data?.mobile || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={3}>
                                                        <Text size="sm" c="dimmed">DOB</Text>
                                                        <Text fw={500}>{formatDate(item.verificationData.mobileData?.data?.data?.date_of_birth || item.verificationData.mobileData?.data?.date_of_birth) || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={3}>
                                                        <Text size="sm" c="dimmed">Age</Text>
                                                        <Text fw={500}>{item.verificationData.mobileData?.data?.data?.age || item.verificationData.mobileData?.data?.age || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={3}>
                                                        <Text size="sm" c="dimmed">Gender</Text>
                                                        <Text fw={500}>{item.verificationData.mobileData?.data?.data?.gender || item.verificationData.mobileData?.data?.gender || "-"}</Text>
                                                    </Grid.Col>
                                                </Grid>

                                                {item.verificationData.mobileData?.data?.data?.identity_details && (
                                                    <>
                                                        <Divider my="sm" label="Identity Details" labelPosition="center" />
                                                        <Grid mb="md">
                                                            {Object.entries(item.verificationData.mobileData.data.data.identity_details).map(([key, value]) => (
                                                                value && (
                                                                    <Grid.Col span={3} key={key}>
                                                                        <Text size="sm" c="dimmed">{key.replace(/_/g, ' ').toUpperCase()}</Text>
                                                                        <Text fw={500}>{value}</Text>
                                                                    </Grid.Col>
                                                                )
                                                            ))}
                                                        </Grid>
                                                    </>
                                                )}

                                                {/* Email Details */}
                                                {item.verificationData.mobileData?.data?.data?.email_details?.length > 0 ? (
                                                    <>
                                                        <Divider my="sm" label="Email Details" labelPosition="center" />
                                                        <Table mb="md">
                                                            <Table.Thead>
                                                                <Table.Tr>
                                                                    <Table.Th>Email Address</Table.Th>
                                                                    <Table.Th>Reported Date</Table.Th>
                                                                </Table.Tr>
                                                            </Table.Thead>
                                                            <Table.Tbody>
                                                                {item.verificationData.mobileData.data.data.email_details.map((email, idx) => (
                                                                    <Table.Tr key={idx}>
                                                                        <Table.Td>
                                                                            <Group gap="xs">
                                                                                <IconMail size={16} />
                                                                                <Text>{email.email_address}</Text>
                                                                            </Group>
                                                                        </Table.Td>
                                                                        <Table.Td>{formatDate(email.reported_date)}</Table.Td>
                                                                    </Table.Tr>
                                                                ))}
                                                            </Table.Tbody>
                                                        </Table>
                                                    </>
                                                ) : (
                                                    <Alert color="blue" title="No Email Details" mb="md" icon={<IconMail size={16} />}>
                                                        No email details available for this mobile number.
                                                    </Alert>
                                                )}

                                                {/* Phone Details */}
                                                {item.verificationData.mobileData?.data?.data?.phone_details?.length > 0 ? (
                                                    <>
                                                        <Divider my="sm" label="Phone Details" labelPosition="center" />
                                                        <Table mb="md">
                                                            <Table.Thead>
                                                                <Table.Tr>
                                                                    <Table.Th>Phone Number</Table.Th>
                                                                    <Table.Th>Type</Table.Th>
                                                                    <Table.Th>Reported Date</Table.Th>
                                                                </Table.Tr>
                                                            </Table.Thead>
                                                            <Table.Tbody>
                                                                {item.verificationData.mobileData.data.data.phone_details.map((phone, idx) => (
                                                                    <Table.Tr key={idx}>
                                                                        <Table.Td>{phone.number}</Table.Td>
                                                                        <Table.Td>
                                                                            <Badge size="sm">
                                                                                {phone.type_code === 'M' ? 'Mobile' :
                                                                                    phone.type_code === 'H' ? 'Home' :
                                                                                        phone.type_code === 'W' ? 'Work' : phone.type_code}
                                                                            </Badge>
                                                                        </Table.Td>
                                                                        <Table.Td>{formatDate(phone.reported_date)}</Table.Td>
                                                                    </Table.Tr>
                                                                ))}
                                                            </Table.Tbody>
                                                        </Table>
                                                    </>
                                                ) : (
                                                    <Alert color="blue" title="No Phone Details" mb="md" icon={<IconPhone size={16} />}>
                                                        No phone details available for this mobile number.
                                                    </Alert>
                                                )}

                                                {/* Address Details - Array Display */}
                                                {item.verificationData.mobileData?.data?.data?.address_details?.length > 0 ? (
                                                    <>
                                                        <Divider my="sm" label="Address Details" labelPosition="center" />
                                                        <Stack>
                                                            {item.verificationData.mobileData.data.data.address_details.map((addr, idx) => (
                                                                <Card key={idx} withBorder p="sm">
                                                                    <Group mb="xs">
                                                                        <IconMapPin size={16} />
                                                                        <Text size="sm">
                                                                            Address {idx + 1}
                                                                            {addr.type && (
                                                                                <Badge size="sm" ml="xs" color={getAddressTypeColor(addr.type)}>
                                                                                    {addr.type}
                                                                                </Badge>
                                                                            )}
                                                                        </Text>
                                                                    </Group>
                                                                    <Grid>
                                                                        <Grid.Col span={8}>
                                                                            <Text size="sm" c="dimmed">Address</Text>
                                                                            <Text>{addr.address || "-"}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={2}>
                                                                            <Text size="sm" c="dimmed">Postal Code</Text>
                                                                            <Text>{addr.postal || "-"}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={2}>
                                                                            <Text size="sm" c="dimmed">State</Text>
                                                                            <Text>{addr.state || "-"}</Text>
                                                                        </Grid.Col>
                                                                        <Grid.Col span={3}>
                                                                            <Text size="sm" c="dimmed">Reported Date</Text>
                                                                            <Text>{formatDate(addr.reported_date)}</Text>
                                                                        </Grid.Col>
                                                                    </Grid>
                                                                </Card>
                                                            ))}
                                                        </Stack>
                                                    </>
                                                ) : (
                                                    <Alert color="blue" title="No Address Details" icon={<IconMapPin size={16} />}>
                                                        No address details available for this mobile number.
                                                    </Alert>
                                                )}
                                            </Card>
                                        </Card>
                                    )}

                                    {/* PAN Details */}
                                    {item.verificationData?.panData && (
                                        <Card withBorder radius="md" mb="md" p="lg">
                                            <Group mb="md">
                                                <IconId size={20} />
                                                <Text fw={600}>PAN Details</Text>
                                                <Badge color="green">Verified</Badge>
                                            </Group>

                                            <Card withBorder p="md">
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">PAN Number</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.pan || item.verificationData.panData?.data?.pan || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Full Name</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.full_name || item.verificationData.panData?.data?.details?.full_name || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Date of Birth</Text>
                                                        <Text fw={500}>{formatDate(item.verificationData.panData?.data?.data?.details?.date_of_birth || item.verificationData.panData?.data?.details?.date_of_birth) || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Gender</Text>
                                                        <Text fw={500}>
                                                            {item.verificationData.panData?.data?.data?.details?.gender === 'M' ? 'Male' :
                                                                item.verificationData.panData?.data?.data?.details?.gender === 'F' ? 'Female' :
                                                                    item.verificationData.panData?.data?.details?.gender || '-'}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Email</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.email || item.verificationData.panData?.data?.details?.email || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Phone Number</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.phone_number || item.verificationData.panData?.data?.details?.phone_number || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Aadhaar Linked</Text>
                                                        <Text fw={500}>
                                                            {(item.verificationData.panData?.data?.data?.details?.aadhaar_linked || item.verificationData.panData?.data?.details?.aadhaar_linked) ? "Yes" : "No"}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Masked Aadhaar</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.masked_aadhaar || item.verificationData.panData?.data?.details?.masked_aadhaar || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={8}>
                                                        <Text size="sm" c="dimmed">Address</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.address || item.verificationData.panData?.data?.details?.address || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Street</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.street_name || item.verificationData.panData?.data?.details?.street_name || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">City</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.city || item.verificationData.panData?.data?.details?.city || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">State</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.state || item.verificationData.panData?.data?.details?.state || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Zip Code</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.zip || item.verificationData.panData?.data?.details?.zip || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Country</Text>
                                                        <Text fw={500}>{item.verificationData.panData?.data?.data?.details?.country || item.verificationData.panData?.data?.details?.country || "-"}</Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Card>
                                        </Card>
                                    )}

                                    {/* Aadhaar Details */}
                                    {item.verificationData?.aadhaarData && (
                                        <Card withBorder radius="md" mb="md" p="lg">
                                            <Group mb="md">
                                                <IconFileText size={20} />
                                                <Text fw={600}>Aadhaar Details</Text>
                                                <Badge color="green">Verified</Badge>
                                            </Group>

                                            <Card withBorder p="md">
                                                <Grid>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Aadhaar Number</Text>
                                                        <Text fw={500}>{item.verificationData.aadhaarData?.data?.data?.aadhar || item.verificationData.aadhaarData?.data?.aadhar || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Age Range</Text>
                                                        <Text fw={500}>{item.verificationData.aadhaarData?.data?.data?.details?.age_range || item.verificationData.aadhaarData?.data?.details?.age_range || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Gender</Text>
                                                        <Text fw={500}>
                                                            {item.verificationData.aadhaarData?.data?.data?.details?.gender === 'M' ? 'Male' :
                                                                item.verificationData.aadhaarData?.data?.data?.details?.gender === 'F' ? 'Female' :
                                                                    item.verificationData.aadhaarData?.data?.details?.gender || '-'}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Is Mobile Verified</Text>
                                                        <Text fw={500}>
                                                            {(item.verificationData.aadhaarData?.data?.data?.details?.is_mobile || item.verificationData.aadhaarData?.data?.details?.is_mobile) ? "Yes" : "No"}
                                                        </Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">Last Digits of Mobile</Text>
                                                        <Text fw={500}>{item.verificationData.aadhaarData?.data?.data?.details?.last_digits_of_mobile || item.verificationData.aadhaarData?.data?.details?.last_digits_of_mobile || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={4}>
                                                        <Text size="sm" c="dimmed">State</Text>
                                                        <Text fw={500}>{item.verificationData.aadhaarData?.data?.data?.details?.state || item.verificationData.aadhaarData?.data?.details?.state || "-"}</Text>
                                                    </Grid.Col>
                                                    <Grid.Col span={12}>
                                                        <Text size="sm" c="dimmed">Remarks</Text>
                                                        <Text fw={500}>{item.verificationData.aadhaarData?.data?.data?.details?.remarks || item.verificationData.aadhaarData?.data?.details?.remarks || "-"}</Text>
                                                    </Grid.Col>
                                                </Grid>
                                            </Card>
                                        </Card>
                                    )}
                                </Box>
                            )}

                            {/* Validation Alert */}
                            {item.verificationData?.mobileData && item.verificationData?.panData && !item.allVerified && (
                                <Box mt="xl" mb="lg" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Alert color="yellow" style={{ maxWidth: '400px' }}>
                                        <Group>
                                            <IconAlertCircle size={20} />
                                            <Text size="sm">Please complete all verifications to enable KYC validation</Text>
                                        </Group>
                                    </Alert>
                                </Box>
                            )}

                            {/* Validate KYC Button */}
                            {item.verificationData?.mobileData && item.verificationData?.panData && item.allVerified && (
                                <Box mt="xl" mb="lg" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        color="green"
                                        size="md"
                                        leftSection={<IconCheck size={20} />}
                                        onClick={() => handleValidateKYC(index)}
                                        loading={item.validationLoading}
                                        disabled={item.validationLoading}
                                    >
                                        Validate KYC Linkage
                                    </Button>
                                </Box>
                            )}

                            {/* Customer Details Section */}
                            {item.showCustomerDetails && item.customerData && (
                                <Card withBorder radius="md" mt="xl" p="lg">
                                    <Group justify="space-between" mb="md">
                                        <Text fw={700} size="lg">Co-Applicant {index + 1} Details</Text>
                                        <Badge color="blue" size="lg">Verified</Badge>
                                    </Group>

                                    <Grid mb="xl">
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Full Name</Text>
                                            <TextInput
                                                value={item.customerData?.full_name ?? ""}
                                                onChange={(e) => {
                                                    const updated = [...coApplicants];
                                                    updated[index].customerData.full_name = e.target.value;
                                                    setCoApplicants(updated);
                                                }}
                                            />
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Mobile</Text>
                                            <Text fw={500}>{item.customerData.mobile || item.form.mobile}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Date of Birth</Text>
                                            <Text fw={500}>{formatDate(item.customerData.dob) || '-'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Age</Text>
                                            <Text fw={500}>{item.customerData.age || '-'}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Gender</Text>
                                            <Text fw={500}>
                                                {item.customerData.gender === 'M' ? 'Male' :
                                                    item.customerData.gender === 'F' ? 'Female' : item.customerData.gender || '-'}
                                            </Text>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Aadhaar</Text>
                                            <Text fw={500}>{item.customerData.aadhar || item.form.aadhaar}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">PAN</Text>
                                            <Text fw={500}>{item.customerData.pan || item.form.pan}</Text>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Email</Text>
                                            <Text fw={500}>{item.customerData.email || '-'}</Text>
                                        </Grid.Col>
                                    </Grid>

                                    <Divider my="lg" label="Address Details" labelPosition="center" />

                                    <Stack>
                                        <Group justify="flex-end">
                                            <Button size="xs" variant="light" onClick={() => addManualAddress(index)}>
                                                + Add Manual Address
                                            </Button>
                                        </Group>

                                        {item.addressList.map((addr, addrIndex) => (
                                            <AddressCard
                                                key={addrIndex}
                                                address={addr}
                                                index={addrIndex}
                                                source={addr.source || addr.type || "Manual"}
                                                isSelected={{
                                                    permanent: item.selectedAddresses?.permanent === addr,
                                                    communication: item.selectedAddresses?.communication === addr
                                                }}
                                                onSelect={(type) => handleAddressSelect(index, type, addrIndex)}
                                                onDelete={() => handleDeleteAddress(index, addrIndex)}
                                                onEdit={(editedAddr) => handleAddressEdit(index, addrIndex, editedAddr)}
                                                isEditable={!addr.fromApi}
                                            />
                                        ))}
                                    </Stack>

                                    <Box mt="xl">
                                        {!item.selectedAddresses?.permanent && !item.selectedAddresses?.communication && (
                                            <Alert color="yellow" mb="md">
                                                <Group>
                                                    <IconAlertCircle size={20} />
                                                    <Text size="sm">Please select at least one address (Permanent or Communication)</Text>
                                                </Group>
                                            </Alert>
                                        )}

                                        <Group justify="flex-end">
                                            <Button
                                                size="md"
                                                color="blue"
                                                onClick={() => handleSaveCoApplicant(index)}
                                                loading={item.validationLoading}
                                                disabled={item.validationLoading || (!item.selectedAddresses?.permanent && !item.selectedAddresses?.communication)}
                                            >
                                                Save Co-Applicant Details
                                            </Button>
                                        </Group>
                                    </Box>
                                </Card>
                            )}
                        </Box>
                    )}

                    {/* SHOW employment ONLY when customer saved but employment not saved */}
                    {item.saved && !item.employmentSaved && (
                        <Box p="md" style={{ borderTop: '1px solid #dee2e6' }}>
                            <CoEmploymentDetails
                                coApplicants={[item]}
                                onEmploymentSaved={() => handleEmploymentSaved(index)}
                            />
                        </Box>
                    )}
                    {/* Show summary when both saved */}
                    {item.saved && item.employmentSaved && !item.isNew && (
                        <Box p="md">
                            <Card withBorder radius="md">
                                <Group justify="space-between" mb="md">
                                    <Text fw={700}>Coapplicant Details</Text>

                                    <Group>
                                        <Button size="xs" onClick={() => setEditMode(!editMode)}>
                                            {editMode ? "Cancel" : "Edit"}
                                        </Button>
                                    </Group>
                                </Group>

                                <Grid>
                                    <Grid.Col span={4}>
                                        <Text size="sm">Full Name</Text>
                                        <TextInput
                                            value={viewData.full_name || ""}
                                            readOnly={!editMode}
                                            onChange={(e) => {
                                                setViewData({ ...viewData, full_name: e.target.value })
                                            }}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={4}>
                                        <Text size="sm">Mobile</Text>
                                        <TextInput value={viewData.mobile} readOnly />
                                    </Grid.Col>

                                    <Grid.Col span={4}>
                                        <Text size="sm">PAN</Text>
                                        <TextInput value={viewData.pan} readOnly />
                                    </Grid.Col>

                                    <Grid.Col span={12}>
                                        <Text size="sm">Address</Text>
                                        <TextInput
                                            value={viewData.address || ""}
                                            readOnly={!editMode}
                                            onChange={(e) => {
                                                setViewData({ ...viewData, address: e.target.value })
                                            }}
                                        />
                                    </Grid.Col>
                                </Grid>

                                {editMode && (
                                    <Group justify="flex-end" mt="md">
                                        <Button onClick={() => handleUpdateCustomer(viewIndex)}>
                                            Update
                                        </Button>
                                    </Group>
                                )}
                            </Card>
                        </Box>
                    )}
                </Paper>
            ))}
        </Container>
    );
};

export default CoApplicants;