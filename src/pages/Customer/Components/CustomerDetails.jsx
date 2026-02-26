/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import {
    Card,
    Grid,
    Text,
    TextInput,
    Button,
    Group,
    Skeleton,
    Badge,
    Alert,
    Table,
    Accordion,
    Divider,
    Stack,
    Box
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
    IconSearch,
    IconId,
    IconAlertCircle,
    IconMapPin,
    IconMail,
    IconPhone,
    IconFileText,
    IconCheck
} from "@tabler/icons-react";
import {
    panVerfiy,
    aadhaarVerfiy,
    mobileVerfiy,
    validateKYCLinkage,
    saveCustomerDetails,
    getCustomerDetails
} from "../../../services/customerOnboarding.service";
import AddressCard from "./AddressCard"
import EmploymentDetails from "./EmploymentDetails";
import CustomerOnboardStorage from "../../../store/CustomerOnboardStorage";

function CustomerDetails({ viewMode: viewModeProp = false, applicantId }) {
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const [applicant_id, setApplicant_id] = useState();
    const [addressList, setAddressList] = useState([]);

    // LOCAL STATE for selected addresses (NOT in Redux)
    const [selectedAddresses, setSelectedAddresses] = useState({
        permanent: null,
        communication: null
    });

    const [form, setForm] = useState({
        name: "",
        mobile: "",
        aadhaar: "",
        pan: ""
    });

    const [loading, setLoading] = useState(false);
    const [validationLoading, setValidationLoading] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [hasApiError, setHasApiError] = useState(false);

    const [panData, setPanData] = useState(null);
    const [aadhaarData, setAadhaarData] = useState(null);
    const [mobileData, setMobileData] = useState(null);

    const [panMsg, setPanMsg] = useState("");
    const [aadhaarMsg, setAadhaarMsg] = useState("");
    const [mobileMsg, setMobileMsg] = useState("");

    const [verifyStatus, setVerifyStatus] = useState({
        panVerified: false,
        aadhaarVerified: false,
        mobileVerified: false
    });

    const [viewMode, setViewMode] = useState(viewModeProp);
    const allFilled = form.name && form.mobile && form.pan && form.aadhaar;
    const allVerified = verifyStatus.panVerified && verifyStatus.aadhaarVerified && verifyStatus.mobileVerified;
  
    // Track if form fields have been edited after fetch
const [formEdited, setFormEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState(null);

    useEffect(() => {

        CustomerOnboardStorage.updateApplicant({
            ...(form.mobile && { mobile: form.mobile }),
            ...(form.pan && { pan: form.pan }),
            ...(form.aadhaar && { aadhaar: form.aadhaar }),
        });

        if (!form.mobile || !form.pan || !form.aadhaar) {
            CustomerOnboardStorage.clear();

            setCustomerData(null);
            setAddressList([]);
            setShowCustomerDetails(false);
            setFetched(false);
            setHasApiError(false);

            setPanData(null);
            setAadhaarData(null);
            setMobileData(null);

            setPanMsg("");
            setAadhaarMsg("");
            setMobileMsg("");

            setVerifyStatus({
                panVerified: false,
                aadhaarVerified: false,
                mobileVerified: false
            });

            setSelectedAddresses({
                permanent: null,
                communication: null
            });
        }

    }, [form.mobile, form.pan, form.aadhaar]);

    useEffect(() => {
        setViewMode(viewModeProp);
    }, [viewModeProp]);

    const handleFieldChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setFetched(false);
        setHasApiError(false);
        setFormEdited(true);

        if (field === 'pan') {
            setPanMsg("");
            setVerifyStatus(prev => ({ ...prev, panVerified: false }));
            setPanData(null);
        } else if (field === 'aadhaar') {
            setAadhaarMsg("");
            setVerifyStatus(prev => ({ ...prev, aadhaarVerified: false }));
            setAadhaarData(null);
        } else if (field === 'mobile') {
            setMobileMsg("");
            setVerifyStatus(prev => ({ ...prev, mobileVerified: false }));
            setMobileData(null);
        }
    };

    const handleFetch = async () => {
        if (!form.mobile || !form.aadhaar || !form.pan) {
            notifications.show({
                title: "Error",
                message: "Enter Mobile, Aadhaar & PAN",
                color: "red",
            });
            return;
        }

        try {
            setLoading(true);
            setFetched(false);
            setHasApiError(false);
            setFormEdited(false);
            setSelectedAddresses({ permanent: null, communication: null });

            // reset local verification state/messages
            setPanData(null);
            setAadhaarData(null);
            setMobileData(null);
            setPanMsg("");
            setAadhaarMsg("");
            setMobileMsg("");
            setVerifyStatus({
                panVerified: false,
                aadhaarVerified: false,
                mobileVerified: false
            });

            let mobileRes, panRes, aadhaarRes;
            try {
                mobileRes = await mobileVerfiy({ mobile: form.mobile });
            } catch (e) {
                mobileRes = { __error: e };
            }
            try {
                panRes = await panVerfiy({ pan: form.pan });
            } catch (e) {
                panRes = { __error: e };
            }
            try {
                aadhaarRes = await aadhaarVerfiy({ aadhar: form.aadhaar });
            } catch (e) {
                aadhaarRes = { __error: e };
            }
            let successfulCalls = 0;
            let hasError = false;

            // normalize helper
            const isSuccess = (res) => res && !res.__error && (res.status === "SUCCESS" || res.data);

            // MOBILE
            if (isSuccess(mobileRes)) {
                setMobileData(mobileRes);
                setMobileMsg(mobileRes?.message || "Mobile verified");
                setVerifyStatus(prev => ({ ...prev, mobileVerified: true }));
                successfulCalls++;
            } else {
                hasError = true;
                setMobileMsg(mobileRes?.message || mobileRes?.__error?.message || "Mobile verification failed");
            }

            // PAN
            if (isSuccess(panRes)) {
                setPanData(panRes);
                setPanMsg(panRes?.message || "PAN verified");
                setVerifyStatus(prev => ({ ...prev, panVerified: true }));
                successfulCalls++;
            } else {
                hasError = true;
                setPanMsg(panRes?.message || panRes?.__error?.message || "PAN verification failed");
            }

            // AADHAAR
            if (isSuccess(aadhaarRes)) {
                setAadhaarData(aadhaarRes);
                setAadhaarMsg(aadhaarRes?.message || "Aadhaar verified");
                setVerifyStatus(prev => ({ ...prev, aadhaarVerified: true }));
                successfulCalls++;
            } else {
                hasError = true;
                setAadhaarMsg(aadhaarRes?.message || aadhaarRes?.__error?.message || "Aadhaar verification failed");
            }

            if (successfulCalls === 0) {
                setHasApiError(true);
                notifications.show({
                    title: "Error",
                    message: "All verifications failed. Please check your inputs.",
                    color: "red",
                });
                return;
            }

            const mobileObj = (mobileRes && !mobileRes.__error) ? (mobileRes.data?.data || mobileRes.data || mobileRes) : {};
            const panObj = (panRes && !panRes.__error) ? (panRes.data?.data?.details || panRes.data?.details || panRes.data || panRes) : {};
            const aadhaarObj = (aadhaarRes && !aadhaarRes.__error) ? (aadhaarRes.data?.data?.details || aadhaarRes.data?.details || aadhaarRes.data || aadhaarRes) : {};

            const addresses = [];
            const mobileAddresses = mobileObj?.address_details || mobileObj?.data?.address_details || [];
            if (Array.isArray(mobileAddresses) && mobileAddresses.length) {
                mobileAddresses.forEach(a => {
                    if (a?.address) addresses.push({ ...a, source: a.source || "Mobile", fromApi: true });
                });
            }

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
                        mobileObj?.data?.full_name ||
                        panObj?.full_name ||
                        panObj?.first_name ? `${panObj.first_name || ""}${panObj.last_name ? " " + panObj.last_name : ""}`.trim() :
                        form.name,
                mobile: form.mobile,
                pan: form.pan,
                aadhar: form.aadhaar,
                dob:
                    mobileObj?.date_of_birth ||
                    mobileObj?.data?.date_of_birth ||
                    panObj?.date_of_birth ||
                    aadhaarObj?.dob ||
                    "",
                age:
                    mobileObj?.age || mobileObj?.data?.age || aadhaarObj?.age || "",
                gender:
                    mobileObj?.gender || mobileObj?.data?.gender || panObj?.gender || panObj?.data?.gender || aadhaarObj?.gender || "",
                email:
                    mobileObj?.email_details?.[0]?.email_address ||
                    mobileObj?.data?.email_details?.[0]?.email_address ||
                    panObj?.email ||
                    panObj?.data?.email ||
                    ""
            };

            setCustomerData({ ...previewCustomer, mobile_details: mobileRes, pan_details: panRes, aadhaar_details: aadhaarRes });
            setAddressList(deduped);
            setFetched(true);
            setHasApiError(hasError);

            notifications.show({
                title: "Success",
                message: `${successfulCalls} verification(s) completed successfully`,
                color: "green",
            });

        } catch (err) {
            console.error("Fetch Error:", err);
            setHasApiError(true);
            notifications.show({
                title: "Error",
                message: "Something went wrong",
                color: "red",
            });
        } finally {
            setLoading(false);
        }
    };


    // ================= VALIDATE KYC LINKAGE =================
    const handleValidateKYC = async () => {
        if (!allVerified) {
            notifications.show({
                title: "Error",
                message: "Please verify all details before validation",
                color: "red",
            });
            return;
        }

        try {
            setValidationLoading(true);

            setShowCustomerDetails(false);
            setAddressList([]);

            const response = await validateKYCLinkage(
                form.mobile,
                form.aadhaar,
                form.pan,
                mobileData,
                panData,
                aadhaarData
            );

            if (response?.status === "SUCCESS") {
                const data = response.data || {};

                let addresses = [];

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
                            fromApi: true
                        });
                    }
                });

                const panAddress =
                    data?.pan_details?.data?.details?.address ||
                    panData?.data?.data?.details?.address ||
                    panData?.data?.details?.address ||
                    panData?.data?.address;

                if (panAddress) {
                    addresses.push({
                        address: panAddress,
                        city:
                            data?.pan_details?.data?.details?.city ||
                            panData?.data?.data?.details?.city ||
                            "",
                        state:
                            data?.pan_details?.data?.details?.state ||
                            panData?.data?.data?.details?.state ||
                            "",
                        postal:
                            data?.pan_details?.data?.details?.zip ||
                            panData?.data?.data?.details?.zip ||
                            "",
                        fromApi: true
                    });
                }

                const aadhaarAddress =
                    data?.aadhaar_details?.data?.details?.address ||
                    aadhaarData?.data?.data?.details?.address ||
                    aadhaarData?.data?.details?.address ||
                    aadhaarData?.data?.address;

                if (aadhaarAddress) {
                    addresses.push({
                        address: aadhaarAddress,
                        city: "",
                        state:
                            data?.aadhaar_details?.data?.details?.state ||
                            aadhaarData?.data?.data?.details?.state ||
                            "",
                        postal: "",
                        fromApi: true
                    });
                }

                addresses = addresses.filter(a => a.address);

                // Build normalized customer including dob, age, gender, email so UI shows immediately
                const normalizedCustomer = {
                    full_name:
                        data?.pan_details?.data?.details?.full_name ||
                        data?.mobile_details?.data?.full_name ||
                        mobileData?.data?.data?.full_name ||
                        panData?.data?.data?.details?.full_name ||
                        form.name,
                    mobile: form.mobile,
                    pan: form.pan,
                    aadhar: form.aadhaar,
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

                // Update local detail objects if response provides them so panels render immediately
                if (data?.mobile_details) setMobileData(data.mobile_details);
                if (data?.pan_details) setPanData(data.pan_details);
                if (data?.aadhaar_details) setAadhaarData(data.aadhaar_details);

                // Set customer data directly (don't merge with possibly null prev)
                setCustomerData(normalizedCustomer);
                setAddressList(addresses);
                setSelectedAddresses({ permanent: null, communication: null });
                setShowCustomerDetails(true);

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
        } catch (err) {
            console.log(err);
            notifications.show({
                title: "Error",
                message: "KYC validation failed",
                color: "red",
            });
        } finally {
            setValidationLoading(false);
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

    const handleSaveCustomerDetails = async () => {

        if (!selectedAddresses.permanent && !selectedAddresses.communication) {
            notifications.show({
                title: "Error",
                message: "Select one address",
                color: "red",
            });
            return;
        }

        try {
            setValidationLoading(true);

            // ================= SELECT ADDRESS =================
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

            // ================= FINAL PAYLOAD =================
            const payload = {
                full_name: customerData?.full_name || form.name,
                mobile: form.mobile,
                address: selectedAddr?.address || "",
                city: selectedAddr?.city || "",
                state: selectedAddr?.state || "",
                district: selectedAddr?.city || "",
                dob: customerData?.dob || "",
                gender: customerData?.gender || "",
                age: customerData?.age || "",
                is_communication_address: isCommunication,
                is_permanent_address: isPermanent,
                aadhar: form.aadhaar,
                pan: form.pan,
                aadhar_details: aadhaarData?.data?.data?.details || aadhaarData?.data?.details || {},
                pan_details: panData?.data?.data?.details || panData?.data?.details || {},
                mobile_details: mobileData?.data?.data || mobileData?.data || {}
            };

            const response = await saveCustomerDetails(payload);


            if (response?.status === "SUCCESS") {

                const applicantId = response?.data?.applicant_id;
                const dealershipId = response?.data?.dealership_id;

                setApplicant_id(applicantId);

                CustomerOnboardStorage.update({
                    dealership_id: dealershipId,
                });

                CustomerOnboardStorage.updateApplicant({
                    applicant_id: applicantId,
                    full_name: payload.full_name,
                    mobile: payload.mobile,
                    pan: payload.pan,
                    aadhaar: payload.aadhar,
                    address: payload.address,
                    city: payload.city,
                    state: payload.state,
                    dob: payload.dob,
                    gender: payload.gender,
                    age: payload.age,
                    email: form.email || "",
                });

                notifications.show({
                    title: "Success",
                    message: "Customer saved successfully",
                    color: "green",
                });
setIsEditing(false)
            } else {
                notifications.show({
                    title: "Error",
                    message: response?.message || "Save failed",
                    color: "red",
                });
            }
        } finally {
            setValidationLoading(false);
        }
    };
const handleStartEdit = () => {
    // snapshot current state so user can cancel
    setEditSnapshot({
      form: { ...form },
      addressList: [...addressList],
      selectedAddresses: { ...selectedAddresses },
      customerData: customerData ? { ...customerData } : null
    });
    setIsEditing(true);
  };
 
  const handleCancelEdit = () => {
    if (editSnapshot) {
      setForm(editSnapshot.form || { name: "", mobile: "", aadhaar: "", pan: "" });
      setAddressList(editSnapshot.addressList || []);
      setSelectedAddresses(editSnapshot.selectedAddresses || { permanent: null, communication: null });
      setCustomerData(editSnapshot.customerData || null);
    }
    setIsEditing(false);
    setEditSnapshot(null);
  };

    const handleAddressSelect = (type, index) => {
        const selectedAddress = addressList[index];

        setSelectedAddresses(prev => {
            const newState = { permanent: null, communication: null };

            if (prev[type] === selectedAddress) {
                notifications.show({
                    title: "Info",
                    message: "Address deselected",
                    color: "blue",
                });

                return newState;
            } else {
                // select
                newState[type] = selectedAddress;

                notifications.show({
                    title: "Success",
                    message: "Address selected",
                    color: "green",
                });

                return newState;
            }
        });
    };

    const handleAddressEdit = (index, editedAddress) => {
        const prevAddress = addressList[index];

        const updatedAddresses = [...addressList];

        updatedAddresses[index] = {
            ...prevAddress,
            ...editedAddress,
            fromApi: prevAddress?.fromApi ?? false
        };

        setAddressList(updatedAddresses);

        setSelectedAddresses(prev => {
            const newState = { ...prev };

            if (prev.permanent === prevAddress) {
                newState.permanent = updatedAddresses[index];
            }
            if (prev.communication === prevAddress) {
                newState.communication = updatedAddresses[index];
            }

            return newState;
        });

        notifications.show({
            title: "Success",
            message: "Address updated",
            color: "green",
        });
    };

    const hasAnyData = mobileData || panData || aadhaarData;

    const fetchCustomerById = async (id) => {
        try {
            setLoading(true);

            const result = await getCustomerDetails(id);

            if (result?.status === "SUCCESS") {
                const data = result.data;

                setForm({
                    name: data.full_name || "",
                    mobile: data.mobile?.toString() || "",
                    aadhaar: data.aadhar || "",
                    pan: data.pan || ""
                });

                setVerifyStatus({
                    panVerified: !!data.pan_details?.is_verified,
                    aadhaarVerified: !!data.aadhar_details?.is_verified,
                    mobileVerified: !!data.mobile_details?.is_verified
                });

                setPanData({
                    data: {
                        details: data.pan_details?.details || {},
                        is_verified: data.pan_details?.is_verified,
                        pan: data.pan
                    }
                });

                setAadhaarData({
                    data: {
                        details: data.aadhar_details?.details || {},
                        is_verified: data.aadhar_details?.is_verified,
                        aadhar: data.aadhar
                    }
                });

                setMobileData({
                    data: {
                        ...data.mobile_details?.details,
                        address_details: data.mobile_details?.details?.address_details || [],
                        email_details: data.mobile_details?.details?.email_details || [],
                        phone_details: data.mobile_details?.details?.phone_details || []
                    },
                    is_verified: data.mobile_details?.is_verified
                });

                setCustomerData({
                    full_name: data.full_name,
                    mobile: data.mobile,
                    pan: data.pan,
                    aadhar: data.aadhar,
                    dob: data.dob,
                    gender: data.gender,
                    age: data.age,
                    email:
                        data.mobile_details?.details?.email_details?.[0]?.email_address || ""
                });

                let addressListFromApi = [];
                const mobileAddrs = data.mobile_details?.details?.address_details;
                if (Array.isArray(mobileAddrs) && mobileAddrs.length) {
                    addressListFromApi = mobileAddrs.map((addr) => ({
                        address: addr.address,
                        city: data.city || "",
                        state: addr.state,
                        postal: addr.postal,
                        fromApi: true
                    }));
                } else if (data.address) {
                    addressListFromApi = [{
                        address: data.address,
                        city: data.city || "",
                        state: data.state || "",
                        postal: data.postal || "",
                        fromApi: true,
                        source: 'Stored'
                    }];
                }

                setAddressList(addressListFromApi);

                if (data.is_communication_address === 1 && addressListFromApi.length) {
                    setSelectedAddresses({ permanent: null, communication: addressListFromApi[0] });
                } else if (data.is_permanent_address === 1 && addressListFromApi.length) {
                    setSelectedAddresses({ permanent: addressListFromApi[0], communication: null });
                }

                setFetched(true);
                setHasApiError(false);
                setShowCustomerDetails(true);

                CustomerOnboardStorage.update({
                    dealership_id: data.dealership_id,
                });

                CustomerOnboardStorage.updateApplicant({
                    applicant_id: applicantId,
                    full_name: data.full_name,
                    mobile: data.mobile,
                    pan: data.pan,
                    aadhaar: data.aadhar,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    dob: data.dob,
                    gender: data.gender,
                    age: data.age,
                    email:
                        data.mobile_details?.details?.email_details?.[0]?.email_address || ""
                });
            }

        } catch (err) {
            console.error("View Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode && applicantId) {
            fetchCustomerById(applicantId);
        }
    }, [viewMode, applicantId]);

    return (
        <>
            <Card withBorder radius="md" mb="lg">
                <Group justify="space-between" mb="md">
                    <Text fw={700} size="lg">Primary Applicant</Text>
                    <Badge
                        size="lg"
                        color={
                            allVerified
                                ? "green"
                                : verifyStatus.panVerified || verifyStatus.aadhaarVerified || verifyStatus.mobileVerified
                                    ? "yellow"
                                    : "red"
                        }
                    >
                        {allVerified
                            ? "Fully Verified"
                            : verifyStatus.panVerified || verifyStatus.aadhaarVerified || verifyStatus.mobileVerified
                                ? "Partially Verified"
                                : "Not Verified"}
                    </Badge>
                </Group>

                <Grid>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Full Name"
                            placeholder="Enter full name"
                            value={form.name}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                            disabled={viewMode}
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Mobile Number"
                            placeholder="10-digit mobile"
                            maxLength={10}
                            value={form.mobile}
                            onChange={(e) =>
                                handleFieldChange("mobile", e.target.value.replace(/\D/g, ""))
                            }
                            disabled={viewMode}
                        />
                        {mobileMsg && (
                            <Text size="sm" mt={5} c={verifyStatus.mobileVerified ? "green" : "red"}>
                                {verifyStatus.mobileVerified ? "✔ " : "✖ "}
                                {mobileMsg}
                            </Text>
                        )}
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="PAN Number"
                            placeholder="ABCPL1234D"
                            maxLength={10}
                            value={form.pan}
                            onChange={(e) =>
                                handleFieldChange("pan", e.target.value.toUpperCase())
                            }
                            disabled={viewMode}
                        />
                        {panMsg && (
                            <Text size="sm" mt={5} c={verifyStatus.panVerified ? "green" : "red"}>
                                {verifyStatus.panVerified ? "✔ " : "✖ "}
                                {panMsg}
                            </Text>
                        )}
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Aadhaar Number"
                            placeholder="12-digit Aadhaar"
                            maxLength={12}
                            value={form.aadhaar}
                            onChange={(e) =>
                                handleFieldChange("aadhaar", e.target.value.replace(/\D/g, ""))
                            }
                            disabled={viewMode}
                        />
                        {aadhaarMsg && (
                            <Text size="sm" mt={5} c={verifyStatus.aadhaarVerified ? "green" : "red"}>
                                {verifyStatus.aadhaarVerified ? "✔ " : "✖ "}
                                {aadhaarMsg}
                            </Text>
                        )}
                    </Grid.Col>
                </Grid>

                <Group justify="space-between" mt="md" mb="lg">
                    <Button
                        leftSection={<IconSearch size={16} />}
                        onClick={handleFetch}
                        loading={loading}
                        disabled={!allFilled || loading || (fetched && !formEdited) || viewMode}
                    >
                        {fetched && !formEdited ? "Fetched" : "Fetch Details"}
                    </Button>
                </Group>

                {/* ===== SKELETON LOADING ===== */}
                {loading && (
                    <Card withBorder mb="lg">
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


                {/* ===== ERROR STATE ===== */}
                {!loading && hasApiError && !hasAnyData && (
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        title="Verification Failed"
                        color="red"
                        mb="lg"
                    >
                        All verifications failed. Please check your inputs and try again.
                    </Alert>
                )}

                {/* ===== FETCHED DETAILS ===== */}
                {!loading && hasAnyData && (
                    <Accordion defaultValue={["mobile", "pan", "aadhaar"]} multiple>
                        {/* MOBILE DETAILS */}
                        {mobileData && (
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
                                        {/* Basic Information */}
                                        <Grid mb="md">
                                            <Grid.Col span={3}>
                                                <Text size="sm" c="dimmed">Full Name</Text>
                                                <Text fw={500}>{mobileData?.data?.data?.full_name || mobileData?.data?.full_name || "-"}</Text>
                                            </Grid.Col>

                                            <Grid.Col span={3}>
                                                <Text size="sm" c="dimmed">Mobile</Text>
                                                <Text fw={500}>{mobileData?.data?.data?.mobile || mobileData?.data?.mobile || "-"}</Text>
                                            </Grid.Col>

                                            <Grid.Col span={3}>
                                                <Text size="sm" c="dimmed">DOB</Text>
                                                <Text fw={500}>{formatDate(mobileData?.data?.data?.date_of_birth || mobileData?.data?.date_of_birth) || "-"}</Text>
                                            </Grid.Col>

                                            <Grid.Col span={3}>
                                                <Text size="sm" c="dimmed">Age</Text>
                                                <Text fw={500}>{mobileData?.data?.data?.age || mobileData?.data?.age || "-"}</Text>
                                            </Grid.Col>

                                            <Grid.Col span={3}>
                                                <Text size="sm" c="dimmed">Gender</Text>
                                                <Text fw={500}>{mobileData?.data?.data?.gender || mobileData?.data?.gender || "-"}</Text>
                                            </Grid.Col>

                                            <Grid.Col span={3}>
                                                <Text size="sm" c="dimmed">Total Income</Text>
                                                <Text fw={500}>₹ {mobileData?.data?.data?.total_income || mobileData?.data?.total_income || "-"}</Text>
                                            </Grid.Col>
                                        </Grid>

                                        {/* Identity Details */}
                                        {mobileData?.data?.data?.identity_details && (
                                            <>
                                                <Divider my="sm" label="Identity Details" labelPosition="center" />
                                                <Grid mb="md">
                                                    {Object.entries(mobileData.data.data.identity_details).map(([key, value]) => (
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
                                        {mobileData?.data?.email_details?.length > 0 ? (
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
                                                        {mobileData?.data?.email_details.map((email, index) => (
                                                            <Table.Tr key={index}>
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
                                        {mobileData?.data?.phone_details?.length > 0 ? (
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
                                                        {mobileData?.data?.phone_details.map((phone, index) => (
                                                            <Table.Tr key={index}>
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
                                        {mobileData?.data?.address_details?.length > 0 ? (
                                            <>
                                                <Divider my="sm" label="Address Details" labelPosition="center" />
                                                <Accordion variant="separated">
                                                    {mobileData?.data?.address_details.map((addr, index) => (
                                                        <Accordion.Item key={index} value={`addr-${index}`}>
                                                            <Accordion.Control>
                                                                <Group>
                                                                    <IconMapPin size={16} />
                                                                    <Text size="sm">
                                                                        Address {index + 1}
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

                        {/* PAN DETAILS */}
                        {panData && (
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
                                                <Text fw={500}>{panData?.data?.data?.pan || panData?.data?.pan || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Full Name</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.full_name || panData?.data?.details?.full_name || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">First Name</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.first_name || panData?.data?.details?.first_name || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Last Name</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.last_name || panData?.data?.details?.last_name || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Date of Birth</Text>
                                                <Text fw={500}>{formatDate(panData?.data?.data?.details?.date_of_birth || panData?.data?.details?.date_of_birth) || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Gender</Text>
                                                <Text fw={500}>
                                                    {(panData?.data?.data?.details?.gender === 'M' || panData?.data?.details?.gender === 'M') ? 'Male' :
                                                        (panData?.data?.data?.details?.gender === 'F' || panData?.data?.details?.gender === 'F') ? 'Female' :
                                                            panData?.data?.data?.details?.gender || panData?.data?.details?.gender || "-"}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Email</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.email || panData?.data?.details?.email || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Phone Number</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.phone_number || panData?.data?.details?.phone_number || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Aadhaar Linked</Text>
                                                <Text fw={500}>
                                                    {(panData?.data?.data?.details?.aadhaar_linked || panData?.data?.details?.aadhaar_linked) ? "Yes" : "No"}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Masked Aadhaar</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.masked_aadhaar || panData?.data?.details?.masked_aadhaar || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={8}>
                                                <Text size="sm" c="dimmed">Address</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.address || panData?.data?.details?.address || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Street</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.street_name || panData?.data?.details?.street_name || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">City</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.city || panData?.data?.details?.city || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">State</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.state || panData?.data?.details?.state || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Zip Code</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.zip || panData?.data?.details?.zip || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Country</Text>
                                                <Text fw={500}>{panData?.data?.data?.details?.country || panData?.data?.details?.country || "-"}</Text>
                                            </Grid.Col>
                                        </Grid>
                                    </Card>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )}

                        {/* AADHAAR DETAILS */}
                        {aadhaarData && (
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
                                                <Text fw={500}>{aadhaarData?.data?.data?.aadhar || aadhaarData?.data?.aadhar || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Age Range</Text>
                                                <Text fw={500}>{aadhaarData?.data?.data?.details?.age_range || aadhaarData?.data?.details?.age_range || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Gender</Text>
                                                <Text fw={500}>
                                                    {(aadhaarData?.data?.data?.details?.gender === 'M' || aadhaarData?.data?.details?.gender === 'M') ? 'Male' :
                                                        (aadhaarData?.data?.data?.details?.gender === 'F' || aadhaarData?.data?.details?.gender === 'F') ? 'Female' :
                                                            aadhaarData?.data?.data?.details?.gender || aadhaarData?.data?.details?.gender || "-"}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Is Mobile Verified</Text>
                                                <Text fw={500}>
                                                    {(aadhaarData?.data?.data?.details?.is_mobile || aadhaarData?.data?.details?.is_mobile) ? "Yes" : "No"}
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">Last Digits of Mobile</Text>
                                                <Text fw={500}>{aadhaarData?.data?.data?.details?.last_digits_of_mobile || aadhaarData?.data?.details?.last_digits_of_mobile || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <Text size="sm" c="dimmed">State</Text>
                                                <Text fw={500}>{aadhaarData?.data?.data?.details?.state || aadhaarData?.data?.details?.state || "-"}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={12}>
                                                <Text size="sm" c="dimmed">Remarks</Text>
                                                <Text fw={500}>{aadhaarData?.data?.data?.details?.remarks || aadhaarData?.data?.details?.remarks || "-"}</Text>
                                            </Grid.Col>
                                        </Grid>
                                    </Card>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )}
                    </Accordion>
                )}

                {/* ===== BOTTOM VALIDATE BUTTON ===== */}
                {hasAnyData && !allVerified && (
                    <Box mt="xl" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Alert color="yellow" style={{ maxWidth: '400px' }}>
                            <Group>
                                <IconAlertCircle size={20} />
                                <Text size="sm">Please complete all verifications to enable KYC validation</Text>
                            </Group>
                        </Alert>
                    </Box>
                )}

                {hasAnyData && allVerified && (
                    <Box mt="xl" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            color="green"
                            size="md"
                            leftSection={<IconCheck size={20} />}
                            onClick={handleValidateKYC}
                            loading={validationLoading}
                            disabled={validationLoading || viewMode}
                            styles={{
                                root: {
                                    minWidth: '30px',
                                    height: '50px',
                                    fontSize: '16px'
                                }
                            }}
                        >
                            Validate KYC Linkage
                        </Button>
                    </Box>
                )}
            </Card>

            {showCustomerDetails && customerData && (
                <Card withBorder radius="md" mt="xl" p="lg">
                    <Group justify="space-between" mb="md">
                        <Text fw={700} size="lg">Customer Basic Details</Text>
                        <Group>
                    <Badge color="blue" size="lg">Verified</Badge>
                    {viewMode && !isEditing && (
                      <Button size="xs" variant="light" onClick={handleStartEdit} style={{ marginLeft: 8 }}>
                        Edit
                      </Button>
                    )}
                    {isEditing && (
                      <Button size="xs" color="red" variant="light" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                        Cancel
                      </Button>
                    )}
                </Group>
                    </Group>

                    <Grid mb="xl">
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">Full Name</Text>
                            <Text fw={500}>
                                <TextInput
                                    value={form?.name || ""}
                                    onChange={(e) =>
                                        setForm(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))
                                    }
                                    disabled={viewMode && !isEditing}
                                />
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">Mobile</Text>
                            <Text fw={500}>{customerData.mobile || form.mobile}</Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">Date of Birth</Text>
                            <Text fw={500}>{formatDate(customerData.dob) || '-'}</Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">Age</Text>
                            <Text fw={500}>{customerData?.age || '-'}</Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">Gender</Text>
                            <Text fw={500}>
                                {customerData.gender === 'M' ? 'Male' :
                                    customerData.gender === 'F' ? 'Female' : customerData.gender || '-'}
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">Aadhaar Number</Text>
                            <Text fw={500}>{customerData.aadhar || form.aadhaar}</Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">PAN Number</Text>
                            <Text fw={500}>{customerData.pan || form.pan}</Text>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text size="sm" c="dimmed">Email</Text>
                            <Text fw={500}>{customerData.email || '-'}</Text>
                        </Grid.Col>
                    </Grid>

                    {/* Address Section */}
                    <Divider my="lg" label="Address Details" labelPosition="center" />

                    <Stack>
                        <Group justify="flex-end">
                            <Button
                                size="xs"
                                variant="light"
                                onClick={() =>
                                    setAddressList(prev => [
                                        ...prev,
                                        {
                                            address: "",
                                            city: "",
                                            state: "",
                                            postal: "",
                                            country: "India",
                                            source: "Manual",
                                            fromApi: false
                                        }
                                    ])
                                }
                                disabled={viewMode && !isEditing}
                            >
                                + Manual
                            </Button>
                        </Group>
                       {addressList.map((addr, index) => (
                  <AddressCard
                    key={index}
                    address={addr}
                    index={index}
                    source={addr.source || addr.type || "Manual"}
                    isSelected={{
                      permanent: selectedAddresses.permanent === addr,
                      communication: selectedAddresses.communication === addr
                    }}
                    onSelect={!viewMode || isEditing ? (type) => handleAddressSelect(type, index) : undefined}
                    onDelete={!viewMode || isEditing ? () => {
                      setAddressList(prev => {
                        const newList = prev.filter((_, i) => i !== index);
                        setSelectedAddresses({
                          permanent: null,
                          communication: null
                        });
 
                        return newList;
                      });
                    } : undefined}
                    onEdit={!viewMode || isEditing ? (editedAddr) => handleAddressEdit(index, editedAddr) : undefined}
                    isEditable={(!viewMode || isEditing) && !addr.fromApi}
                  />
                ))}

                    </Stack>

                    {/* Save Button */}
                    <Box mt="xl">
                        {!selectedAddresses.permanent && !selectedAddresses.communication && (
                            <Alert color="yellow" mb="md">
                                <Group>
                                    <IconAlertCircle size={20} />
                                    <Text size="sm">Please select at least one address (Permanent or Communication)</Text>
                                </Group>
                            </Alert>
                        )}

<Group justify="flex-end">
                  {isEditing && (
                    <Button size="sm" variant="outline" color="gray" onClick={handleCancelEdit} style={{ marginRight: 8 }}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    size="md"
                    color="blue"
                    onClick={handleSaveCustomerDetails}
                    loading={validationLoading}
                    disabled={validationLoading || (!selectedAddresses.permanent && !selectedAddresses.communication) || (viewMode && !isEditing)}
                  >
                    Save Customer Details
                  </Button>
                </Group>
                    </Box>
                </Card>
            )}
            <EmploymentDetails
                viewMode={viewModeProp}
                applicantId={applicantId ?? applicant_id}
            />
        </>
    );
}

export default CustomerDetails;