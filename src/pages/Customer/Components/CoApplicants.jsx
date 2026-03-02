/* eslint-disable max-len */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import {
    Container,
    Title,
    Button,
    Paper,
    Group,
    Autocomplete,
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
    Table,
    Accordion,
    Loader,
    Center
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
    saveCoApplicantDetails,
    deleteCustomerDetails,
    getCoapplicantDetails,
    getCoApplicantsByDealership
} from "../../../services/customerOnboarding.service";
import AddressCard from "./AddressCard";
import CoApplicantEmploymentDetails from "./CoApplicantEmploymentDetails";
import CustomerOnboardStorage from "../../../store/CustomerOnboardStorage";

const CoApplicants = ({ viewMode = false, applicantId: parentApplicantId }) => {
    const [coApplicants, setCoApplicants] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [loading, setLoading] = useState(false);

    const relationshipOptions = ["Father", "Mother", "Business Partner", "Friend", "Other"];

    const addCoApplicant = () => {
        const newId = Date.now();
        setCoApplicants([
            ...coApplicants,
            {
                id: newId,
                showCustomerDetails: false,
                customerData: null,
                addressList: [],
                selectedAddresses: {
                    permanent: null,
                    communication: null
                },
                form: {
                    name: "",
                    relationship: "",
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
                saveLoading: false,
                deleteLoading: false,
                fetched: false,
                hasApiError: false,
                formEdited: false,
                allFilled: false,
                allVerified: false,
                saved: false,
                employmentSaved: false,
                isEditing: false,
                accordionValue: ["mobile", "pan", "aadhaar"]
            },
        ]);
        setExpandedIndex(coApplicants.length);
    };

    const handleChange = (index, field, value) => {
        const updated = [...coApplicants];

        if (field === 'relationship') {
            updated[index].form.relationship = value;
        } else if (field === 'name') {
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

            let mobileRes, panRes, aadhaarRes;
            let successfulCalls = 0;
            let hasError = false;

            // Mobile Verification
            try {
                mobileRes = await mobileVerfiy({ mobile });
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
                updated[index].messages.mobileMsg = err?.response?.data?.message || "Mobile verification failed";
                hasError = true;
            }

            // PAN Verification
            try {
                panRes = await panVerfiy({ pan });
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
                updated[index].messages.panMsg = err?.response?.data?.message || "Invalid PAN number";
                hasError = true;
            }

            // Aadhaar Verification
            try {
                aadhaarRes = await aadhaarVerfiy({ aadhar: aadhaar });
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
                updated[index].messages.aadhaarMsg = err?.response?.data?.message || "Invalid Aadhaar number";
                hasError = true;
            }

            const { panVerified, aadhaarVerified, mobileVerified } = updated[index].verifyStatus;
            updated[index].allVerified = panVerified && aadhaarVerified && mobileVerified;

            if (successfulCalls > 0) {
                updated[index].fetched = true;
                updated[index].hasApiError = hasError;

                // Build address list from verifications
                try {
                    const mobileData = updated[index].verificationData.mobileData;
                    const panData = updated[index].verificationData.panData;
                    const aadhaarData = updated[index].verificationData.aadhaarData;

                    const mobileObj = mobileData?.data?.data || mobileData?.data || {};
                    const panObj = panData?.data?.data?.details || panData?.data?.details || {};
                    const aadhaarObj = aadhaarData?.data?.data?.details || aadhaarData?.data?.details || {};

                    const addresses = [];

                    // Mobile addresses
                    const mobileAddresses = mobileObj?.address_details || [];
                    if (Array.isArray(mobileAddresses) && mobileAddresses.length) {
                        mobileAddresses.forEach(a => {
                            if (a?.address) addresses.push({ ...a, source: a.source || "Mobile", fromApi: true });
                        });
                    }

                    // PAN address
                    const panAddressStr = panObj?.address || panObj?.street_name || null;
                    const panPostal = panObj?.zip || panObj?.postal || "";
                    const panState = panObj?.state || "";
                    if (panAddressStr) {
                        addresses.push({
                            address: panAddressStr,
                            city: panObj?.city || "",
                            state: panState,
                            postal: panPostal,
                            type: "PAN",
                            source: "PAN",
                            fromApi: true
                        });
                    }

                    // Aadhaar address
                    const aadhaarAddressStr = aadhaarObj?.address || aadhaarObj?.addr || null;
                    if (aadhaarAddressStr) {
                        addresses.push({
                            address: aadhaarAddressStr,
                            city: aadhaarObj?.city || "",
                            state: aadhaarObj?.state || "",
                            postal: aadhaarObj?.postal || "",
                            type: "AADHAAR",
                            source: "Aadhaar",
                            fromApi: true
                        });
                    }

                    // Deduplicate addresses
                    const seen = new Set();
                    const deduped = addresses.filter(a => {
                        const key = (a.address || "").trim();
                        if (!key) return false;
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });

                    const previewCustomer = {
                        full_name:
                            mobileObj?.full_name ||
                            panObj?.full_name ||
                            name,
                        mobile: mobile,
                        pan: pan,
                        aadhar: aadhaar,
                        dob:
                            mobileObj?.date_of_birth ||
                            panObj?.date_of_birth ||
                            aadhaarObj?.dob ||
                            "",
                        age:
                            mobileObj?.age ||
                            aadhaarObj?.age_range ||
                            "",
                        gender:
                            mobileObj?.gender ||
                            panObj?.gender ||
                            aadhaarObj?.gender ||
                            "",
                        email:
                            mobileObj?.email_details?.[0]?.email_address ||
                            panObj?.email ||
                            ""
                    };

                    updated[index].customerData = previewCustomer;
                    updated[index].addressList = deduped;
                    updated[index].showCustomerDetails = true;

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
            console.error(`Co-Applicant ${index + 1} Error:`, err);
            const updated = [...coApplicants];
            updated[index].hasApiError = true;
            setCoApplicants(updated);

            notifications.show({
                title: "Error",
                message: "Something went wrong",
                color: "red",
            });
        } finally {
            setCoApplicants((prev) => {
                const updated = [...prev];
                if (!updated[index]) return prev;
                updated[index].loading = false;
                return updated;
            });
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
            setCoApplicants((prev) => {
                const updated = [...prev];
                if (!updated[index]) return prev;
                updated[index].validationLoading = true;
                updated[index].showCustomerDetails = true;
                return updated;
            });

            const updated = [...coApplicants];

            const response = await validateKYCLinkage(
                mobile,
                aadhaar,
                pan,
                mobileData,
                panData,
                aadhaarData
            );

            if (response?.status === "SUCCESS") {
                const data = response.data || {};

                let addresses = [];

                // Mobile addresses
                let mobileAddr =
                    data?.mobile_details?.data?.data?.address_details ||
                    data?.mobile_details?.data?.address_details ||
                    mobileData?.data?.data?.address_details ||
                    mobileData?.data?.address_details ||
                    [];

                if (!Array.isArray(mobileAddr)) {
                    mobileAddr = mobileAddr ? [mobileAddr] : [];
                }

                mobileAddr.forEach(a => {
                    if (a?.address) {
                        addresses.push({
                            address: a.address || "",
                            city: a.city || "",
                            state: a.state || "",
                            postal: a.postal || "",
                            fromApi: true,
                            source: "Mobile"
                        });
                    }
                });

                // PAN address
                const panAddress =
                    data?.pan_details?.data?.details?.address ||
                    panData?.data?.data?.details?.address ||
                    panData?.data?.details?.address;

                if (panAddress) {
                    addresses.push({
                        address: panAddress,
                        city: data?.pan_details?.data?.details?.city || panData?.data?.data?.details?.city || "",
                        state: data?.pan_details?.data?.details?.state || panData?.data?.data?.details?.state || "",
                        postal: data?.pan_details?.data?.details?.zip || panData?.data?.data?.details?.zip || "",
                        fromApi: true,
                        source: "PAN"
                    });
                }

                // Aadhaar address
                const aadhaarAddress =
                    data?.aadhaar_details?.data?.details?.address ||
                    aadhaarData?.data?.data?.details?.address ||
                    aadhaarData?.data?.details?.address;

                if (aadhaarAddress) {
                    addresses.push({
                        address: aadhaarAddress,
                        city: "",
                        state: data?.aadhaar_details?.data?.details?.state || aadhaarData?.data?.data?.details?.state || "",
                        postal: "",
                        fromApi: true,
                        source: "Aadhaar"
                    });
                }

                addresses = addresses.filter(a => a.address);

                // Deduplicate
                const seen = new Set();
                addresses = addresses.filter(a => {
                    const key = (a.address || "").trim();
                    if (!key) return false;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });

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
                        data?.mobile_details?.data?.date_of_birth ||
                        data?.pan_details?.data?.details?.date_of_birth ||
                        mobileData?.data?.date_of_birth ||
                        panData?.data?.data?.details?.date_of_birth ||
                        aadhaarData?.data?.data?.details?.dob ||
                        "",
                    age:
                        data?.mobile_details?.data?.age ||
                        mobileData?.data?.age ||
                        aadhaarData?.data?.data?.details?.age_range ||
                        "",
                    gender:
                        data?.mobile_details?.data?.gender ||
                        mobileData?.data?.gender ||
                        panData?.data?.gender ||
                        aadhaarData?.data?.data?.details?.gender ||
                        "",
                    email:
                        data?.mobile_details?.data?.email_details?.[0]?.email_address ||
                        mobileData?.data?.email_details?.[0]?.email_address ||
                        data?.pan_details?.data?.details?.email ||
                        panData?.data?.data?.details?.email ||
                        "",
                    address_list: addresses
                };

                // Update verification data
                if (data?.mobile_details) updated[index].verificationData.mobileData = data.mobile_details;
                if (data?.pan_details) updated[index].verificationData.panData = data.pan_details;
                if (data?.aadhaar_details) updated[index].verificationData.aadhaarData = data.aadhaar_details;

                updated[index].customerData = normalizedCustomer;
                updated[index].showCustomerDetails = true;
                updated[index].addressList = addresses;
                updated[index].selectedAddresses = { permanent: null, communication: null };
updated[index].kycValidated = true;   // optional
                notifications.show({
                    title: "Success",
                    message: "KYC validation completed successfully",
                    color: "green",
                });
            } else {
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
            setCoApplicants((prev) => {
                const updated = [...prev];
                if (!updated[index]) return prev;
                updated[index].validationLoading = false;
                return updated;
            });
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
            updated[index].saveLoading = true;
            setCoApplicants(updated);

            let selectedAddr = null;
            let isPermanent = "0";
            let isCommunication = "0";

            if (selectedAddresses.permanent) {
                selectedAddr = selectedAddresses.permanent;
                isPermanent = "1";
            }

            if (selectedAddresses.communication) {
                selectedAddr = selectedAddresses.communication;
                isCommunication = "1";
            }

            const mobileDetails =
                verificationData.mobileData?.data?.data ||
                verificationData.mobileData?.data || {};

            const panDetails =
                verificationData.panData?.data?.data?.details ||
                verificationData.panData?.data?.details || {};

            const aadhaarDetails =
                verificationData.aadhaarData?.data?.data?.details ||
                verificationData.aadhaarData?.data?.details || {};

            const payload = {
                full_name: customerData?.full_name || form.name,
                mobile: form.mobile,
                dob: customerData?.dob || "",
                age: customerData?.age ? parseInt(customerData.age) : 0,
                gender: customerData?.gender || "",
                relationships: form.relationship,
                category: "CO-APPLICANT",
                address: selectedAddr?.address || "",
                city: selectedAddr?.city || "",
                state: selectedAddr?.state || "",
                is_communication_address: isCommunication,
                is_permanent_address: isPermanent,
                aadhar: form.aadhaar,
                pan: form.pan,
                mobile_details: mobileDetails,
                pan_details: panDetails,
                aadhar_details: aadhaarDetails
            };

            const dealershipId = CustomerOnboardStorage.get()?.dealership_id;
            const applicantId = CustomerOnboardStorage.get()?.applicant?.applicant_id;
            const response = await saveCoApplicantDetails(payload, dealershipId);

            if (response?.status === "SUCCESS") {
                const applicantId = response?.data?.id || response?.data?.customer_id || response?.data?.applicant_id;

                if (applicantId) {
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
                }
                if (applicantId) {
                    updated[index].id = applicantId;
                }
                updated[index].saved = true;
                updated[index].showCustomerDetails = true;
                updated[index].isEditing = false;
                notifications.show({
                    title: "Success",
                    message: "Co-applicant saved successfully",
                    color: "green",
                });

                setExpandedIndex(null);
            } else {
                notifications.show({
                    title: "Error",
                    message: response?.message || "Save failed",
                    color: "red",
                });
            }

            setCoApplicants(updated);

        } catch (err) {
            console.log("Save Error:", err);
            notifications.show({
                title: "Error",
                message: "Failed to save co-applicant",
                color: "red",
            });
        } finally {
            setCoApplicants((prev) => {
                const updated = [...prev];
                if (!updated[index]) return prev;
                updated[index].saveLoading = false;
                return updated;
            });
        }
    };

    const handleDeleteCoApplicant = async (index) => {
        const applicant = coApplicants[index];
       const applicantId = CustomerOnboardStorage.get()?.applicant?.applicant_id;
     
        if (!applicantId) {
            notifications.show({
                title: "Error",
                message: "Applicant id not found",
                color: "red",
            });
            return;
        }

        try {
            setCoApplicants((prev) => {
                const updated = [...prev];
                if (!updated[index]) return prev;
                updated[index].deleteLoading = true;
                return updated;
            });

            await deleteCustomerDetails(applicantId);

            setCoApplicants((prev) => prev.filter((_, i) => i !== index));
            notifications.show({
                title: "Success",
                message: "Co-applicant deleted successfully",
                color: "green",
            });
        } catch (err) {
            notifications.show({
                title: "Error",
                message: err?.message || "Failed to delete co-applicant",
                color: "red",
            });
        } finally {
            setCoApplicants((prev) => {
                const updated = [...prev];
                if (!updated[index]) return prev;
                updated[index].deleteLoading = false;
                return updated;
            });
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
            updated[index].showCustomerDetails = false;
            return updated;
        });
    };

    const loadCoApplicants = async () => {
        if (!viewMode || !parentApplicantId) return;

        try {
            setLoading(true);

            const response = await getCoApplicantsByDealership(parentApplicantId);

            // ✅ Extract correct array
            const applicants = response?.coapplicants || [];

            if (!applicants.length) {
                setCoApplicants([]);
                return;
            }

            const formattedApplicants = applicants.map((app) => {
                // Build address list from mobile_details if available
                const mobileAddresses =
                    app.mobile_details?.details?.address_details || [];

                const addressList =
                    mobileAddresses.length > 0
                        ? mobileAddresses.map((addr) => ({
                            address: addr.address,
                            city: "",
                            state: addr.state,
                            postal: addr.postal,
                            source: addr.type || "Mobile",
                            fromApi: true,
                        }))
                        : app.address
                            ? [
                                {
                                    address: app.address,
                                    city: app.city,
                                    state: app.state,
                                    postal: "",
                                    source: "Saved",
                                    fromApi: true,
                                },
                            ]
                            : [];

                return {
                    id: app.applicant_id, // ✅ use correct id

                    showCustomerDetails: false,
                    saved: true,
                    employmentSaved: true,

                    allVerified: true,

                    form: {
                        name: app.full_name || "",
                        relationship: app.relationships || "",
                        mobile: app.mobile?.toString() || "",
                        aadhaar: app.aadhar || "",
                        pan: app.pan || "",
                    },

                    customerData: {
                        full_name: app.full_name,
                        mobile: app.mobile?.toString(),
                        pan: app.pan,
                        aadhar: app.aadhar,
                        dob: app.dob,
                        age: app.age,
                        gender: app.gender,
                        email:
                            app.mobile_details?.details?.email_details?.[0]
                                ?.email_address || "",
                    },

                    addressList,

                    selectedAddresses: {
                        permanent:
                            app.is_permanent_address === 1
                                ? addressList[0] || null
                                : null,

                        communication:
                            app.is_communication_address === 1
                                ? addressList[0] || null
                                : null,
                    },

                    verifyStatus: {
                        panVerified: app.pan_details?.is_verified === 1,
                        aadhaarVerified: app.aadhar_details?.is_verified === 1,
                        mobileVerified: app.mobile_details?.is_verified === 1,
                    },

                    verificationData: {
                        mobileData: app.mobile_details || null,
                        panData: app.pan_details || null,
                        aadhaarData: app.aadhar_details || null,
                    },
                };
            });

            setCoApplicants(formattedApplicants);
        } catch (err) {
            console.error("Error loading co-applicants:", err);
            setCoApplicants([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoApplicants();
    }, [viewMode, parentApplicantId]);

    if (loading) {
        return (
            <Center style={{ height: "60vh" }}>
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <Container size="xl" py="lg">
            <Group justify="space-between" mb="lg">
                {/* <Title order={3}>Co-Applicants ({coApplicants.length})</Title> */}
                <Title order={3}>Co-Applicant Details</Title>
             
                    <Button leftSection={<IconPlus size={18} />} onClick={addCoApplicant}>
                        {viewMode ? "Add Section" : "Add Co-Applicant"}
                    </Button>
                         </Group>

            {coApplicants.map((item, index) => (
                <Paper key={item.id} withBorder radius="md" mb="md">
                    {/* Header Section */}
                    <Group justify="space-between" p="md" style={{ background: "#f9fafb" }}>
                        <Group gap="xs">
                            <Text fw={600}>Basic Information Form {index + 1}</Text>
                            {item.saved && <Badge color="green" size="sm" ml="xs">Saved</Badge>}
                        </Group>

                        <Group>
                            <Badge
                                color={item.allVerified ? "green" :
                                    item.verifyStatus?.panVerified || item.verifyStatus?.aadhaarVerified || item.verifyStatus?.mobileVerified ? "yellow" : "gray"}
                                variant="light"
                            >
                                {item.allVerified ? "Fully Verified" :
                                    item.verifyStatus?.panVerified || item.verifyStatus?.aadhaarVerified || item.verifyStatus?.mobileVerified ? "Partially Verified" : "Not Verified"}
                            </Badge>
                            {!item.saved && (
                                <ActionIcon color="red" variant="subtle" onClick={() => removeCoApplicant(index)}>
                                    <IconTrash size={18} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Group>

                    {/* Content Section */}
                    {!item.employmentSaved && (
                        <Box p="md">
                            {/* Basic Details Section */}
                            <Card withBorder radius="md" mb="lg" p="lg">
                                <Text fw={700} size="lg" mb="md">Basic Details</Text>
                                <Grid gutter="md">
                                    <Grid.Col span={4}>
                                        <Autocomplete
                                            label="Relationship"
                                            placeholder="Select relationship"
                                            data={relationshipOptions}
                                            value={item.form.relationship}
                                            onChange={(value) => handleChange(index, "relationship", value)}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <TextInput
                                            label="Full Name"
                                            placeholder="Enter full name"
                                            value={item.form.name}
                                            onChange={(e) => handleChange(index, "name", e.target.value)}
                                            required
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <TextInput
                                            label="Mobile"
                                            placeholder="10-digit mobile"
                                            maxLength={10}
                                            value={item.form.mobile}
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
                                            value={item.form.pan}
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
                                            value={item.form.aadhaar}
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
                                        {item.fetched && !item.formEdited ? "Fetched" : "Fetch Details"}
                                    </Button>
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
                            {!item.loading && item.hasApiError && !item.verificationData?.mobileData && (
                                <Alert icon={<IconAlertCircle size={16} />} title="Verification Failed" color="red" mb="lg">
                                    All verifications failed. Please check your inputs and try again.
                                </Alert>
                            )}

                            {/* Accordion for Verification Details */}
                            {!item.loading && (item.verificationData?.mobileData || item.verificationData?.panData || item.verificationData?.aadhaarData) && (
                                <Accordion defaultValue={item.accordionValue} multiple mb="lg">
                                    {/* Mobile Details Accordion */}
                                    {item.verificationData?.mobileData && (
                                        <Accordion.Item value="mobile">
                                            <Accordion.Control>
                                                <Group>
                                                    <IconPhone size={20} />
                                                    <Text fw={600}>Mobile Details</Text>
                                                    <Badge color="green">Verified</Badge>
                                                </Group>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <Card withBorder mb="lg">
                                                    <Grid mb="md">
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
                                                        <Grid.Col span={3}>
                                                            <Text size="sm" c="dimmed">Total Income</Text>
                                                            <Text fw={500}>₹ {item.verificationData.mobileData?.data?.data?.total_income || item.verificationData.mobileData?.data?.total_income || "-"}</Text>
                                                        </Grid.Col>
                                                    </Grid>
                                                    {item.verificationData.mobileData?.data?.identity_details && (
                                                        <>
                                                            <Divider my="sm" label="Identity Details" labelPosition="center" />
                                                            <Grid mb="md">
                                                                {Object.entries(item.verificationData.mobileData?.data?.identity_details || {}).map(([key, value]) => (
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
                                                    {item.verificationData.mobileData?.data?.email_details?.length > 0 ? (
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
                                                                    {item.verificationData.mobileData?.data?.email_details.map((email, idx) => (
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

                                                    {/* Address Details */}
                                                    {item.verificationData.mobileData?.data?.address_details?.length > 0 ? (
                                                        <>
                                                            <Divider my="sm" label="Address Details" labelPosition="center" />
                                                            <Accordion variant="separated">
                                                                {item.verificationData.mobileData?.data?.address_details.map((addr, idx) => (
                                                                    <Accordion.Item key={idx} value={`addr-${idx}`}>
                                                                        <Accordion.Control>
                                                                            <Group>
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
                                                                        </Accordion.Control>
                                                                        <Accordion.Panel>
                                                                            <Card withBorder p="sm">
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
                                                                        </Accordion.Panel>
                                                                    </Accordion.Item>
                                                                ))}
                                                            </Accordion>
                                                        </>
                                                    ) : (
                                                        <Alert color="blue" title="No Address Details" icon={<IconMapPin size={16} />}>
                                                            No address details available for this mobile number.
                                                        </Alert>
                                                    )}
                                                </Card>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    )}

                                    {/* PAN Details Accordion */}
                                    {item.verificationData?.panData && (
                                        <Accordion.Item value="pan">
                                            <Accordion.Control>
                                                <Group>
                                                    <IconId size={20} />
                                                    <Text fw={600}>PAN Details</Text>
                                                    <Badge color="green">Verified</Badge>
                                                </Group>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <Card withBorder mb="lg">
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
                                                            <Text fw={500}> {item.verificationData.panData?.data?.data?.details?.street_name || item.verificationData.panData?.data?.details?.street_name || "-"}</Text>
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
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    )}

                                    {/* Aadhaar Details Accordion */}
                                    {item.verificationData?.aadhaarData && (
                                        <Accordion.Item value="aadhaar">
                                            <Accordion.Control>
                                                <Group>
                                                    <IconFileText size={20} />
                                                    <Text fw={600}>Aadhaar Details</Text>
                                                    <Badge color="green">Verified</Badge>
                                                </Group>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <Card withBorder mb="lg">
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
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    )}
                                </Accordion>
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
 disabled={
    item.validationLoading ||
    !item.allVerified ||
    item.kycValidated
  }
                                    >
                                        Validate KYC Linkage
                                    </Button>
                                </Box>
                            )}

                            {/* Customer Details Section */}
                            {item.showCustomerDetails && item.customerData && (
                                <Card withBorder radius="md" mt="xl" p="lg">
                                    <Group justify="space-between" mb="md">
                                        <Text fw={700} size="lg">Co-Applicant {index + 1} Basic Details</Text>
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
                                           <TextInput
    value={item.customerData?.dob ?? ""}
    onChange={(e) => {
        const updated = [...coApplicants];
        updated[index].customerData.dob = e.target.value;
        setCoApplicants(updated);
    }}
/>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Age</Text>
                                           <TextInput
    value={item.customerData?.age ?? ""}
    onChange={(e) => {
        const updated = [...coApplicants];
        updated[index].customerData.age = e.target.value;
        setCoApplicants(updated);
    }}
/>
                                        </Grid.Col>
                                        <Grid.Col span={3}>
                                            <Text size="sm" c="dimmed">Gender</Text>
                                           <TextInput
    value={item.customerData?.gender ?? ""}
    onChange={(e) => {
        const updated = [...coApplicants];
        updated[index].customerData.gender = e.target.value;
        setCoApplicants(updated);
    }}
/>
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
                                         <TextInput
    value={item.customerData?.email ?? ""}
    onChange={(e) => {
        const updated = [...coApplicants];
        updated[index].customerData.email = e.target.value;
        setCoApplicants(updated);
    }}
/>
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
                                                loading={item.saveLoading}
                                                disabled={item.saveLoading || (!item.selectedAddresses?.permanent && !item.selectedAddresses?.communication)}
                                            >
                                                Save Co-Applicant Details
                                            </Button>
                                        </Group>
                                    </Box>
                                </Card>
                            )}
                            {!item.employmentSaved && (
                                <CoApplicantEmploymentDetails
                                    coApplicants={[item]}
                                    onEmploymentSaved={() => handleEmploymentSaved(index)}
                                />
                            )}
                        </Box>
                    )}


                    {/* View Mode - Summary */}
                    {item.saved && item.employmentSaved && (
                        <Box p="md">
                            <Card withBorder radius="md">
                                <Group justify="space-between" mb="md">
                                    <Text fw={700}>Co-applicant Details</Text>

                                    {!item.isEditing ? (
                                        <Group gap="xs">
                                            <Button
                                                size="xs"
                                                color="red"
                                                variant="light"
                                                onClick={() => handleDeleteCoApplicant(index)}
                                                loading={item.deleteLoading}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                size="xs"
                                                variant="light"
                                                onClick={() => {
                                                    const updated = [...coApplicants];
                                                    updated[index].isEditing = true;
                                                    setCoApplicants(updated);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </Group>
                                    ) : (
                                        <Button
                                            size="xs"
                                            color="blue"
                                            onClick={() => handleSaveCoApplicant(index)}
                                        >
                                            Save
                                        </Button>
                                    )}
                                </Group>
                                <Grid>
                                    <Grid.Col span={4}>
                                        <Text size="sm" c="dimmed">Relationship</Text>
                                        <Text>{item.form.relationship || '-'}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text size="sm" c="dimmed">Full Name</Text>
                                        <Text>{item.isEditing ? (
                                            <TextInput
                                                value={item.customerData?.full_name || ""}
                                                onChange={(e) => {
                                                    const updated = [...coApplicants];
                                                    updated[index].customerData.full_name = e.target.value;
                                                    setCoApplicants(updated);
                                                }}
                                            />
                                        ) : (
                                            <Text>{item.customerData?.full_name || item.form.name}</Text>
                                        )}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text size="sm" c="dimmed">Mobile</Text>
                                        <Text>{item.form.mobile}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text size="sm" c="dimmed">PAN</Text>
                                        <Text>{item.form.pan}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <Text size="sm" c="dimmed">Aadhaar</Text>
                                        <Text>{item.form.aadhaar}</Text>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Text size="sm" c="dimmed">Address</Text>
                                        <Text>{item.isEditing ? (
                                            <TextInput
                                                value={item.addressList[0]?.address || ""}
                                                onChange={(e) => {
                                                    const updated = [...coApplicants];
                                                    updated[index].addressList[0].address = e.target.value;
                                                    setCoApplicants(updated);
                                                }}
                                            />
                                        ) : (
                                            <Text>{item.addressList[0]?.address || '-'}</Text>
                                        )}</Text>
                                    </Grid.Col>
                                </Grid>
                            </Card>
                        </Box>
                    )}
                </Paper>
            ))}

            {coApplicants.length === 0 && !viewMode && (
                <Card withBorder p="xl" style={{ textAlign: 'center' }}>
                    <Text c="dimmed" mb="md">No co-applicants added yet</Text>
                </Card>
            )}

            {coApplicants.length === 0 && viewMode && (
                <Card withBorder p="xl" style={{ textAlign: 'center' }}>
                    <Text c="dimmed">No co-applicants found</Text>
                </Card>
            )}
        </Container>
    );
};

export default CoApplicants;