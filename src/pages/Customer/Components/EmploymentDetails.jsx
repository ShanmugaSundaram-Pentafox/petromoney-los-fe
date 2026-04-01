/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Text,
  TextInput,
  Select,
  Group,
  Button,
  Checkbox
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBriefcase, IconCheck } from "@tabler/icons-react";
import {
  saveEmploymentDetails
} from "../../../services/customerOnboarding.service";

const formatToINR = (value) => {
  if (value === null || value === undefined) return '';
  // Remove everything except digits
  const cleaned = value.toString().replace(/[^\d]/g, '');
  if (!cleaned) return '';
  return Number(cleaned).toLocaleString('en-IN');
};

function EmploymentDetails({ viewMode = false, applicantId, employmentData }) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    employmentType: "",
    yearsInBusiness: "",
    businessName: "",
    monthlyIncome: "",
    businessType: "",
    annualIncome: "",
    itrFiled: false
  });

  const employmentTypes = [
    { value: "Self Employed Professional (SEP)", label: "Self Employed Professional (SEP)" },
    { value: "Self Employed Non-Professional (SENP)", label: "Self Employed Non-Professional (SENP)" }
  ];

  // Handle Change
  const handleChange = (field, value) => {
    if (viewMode && !isEditing) return;
    let newValue = value;

    if (
      field === "yearsInBusiness" ||
      field === "monthlyIncome" ||
      field === "annualIncome"
    ) {
      newValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: newValue
    }));

    if (isSaved) setIsSaved(false);
  };

  // Validate Form (Only Edit Mode)
  useEffect(() => {
    if (viewMode && !isEditing) return;

    const isValid =
      formData.employmentType &&
      formData.businessName &&
      formData.businessType &&
      formData.yearsInBusiness &&
      formData.monthlyIncome &&
      formData.annualIncome;

    setIsFormValid(isValid);
  }, [formData, viewMode, isEditing]);


  // Fetch Employment (View Mode)
  useEffect(() => {
    if (!employmentData) return;

    setFormData({
      employmentType:
        employmentData.employment_type?.includes("Professional")
          ? "Self Employed Professional (SEP)"
          : "Self Employed Non-Professional (SENP)",
      businessName: employmentData.business_name || "",
      businessType: employmentData.business_type || "",
      yearsInBusiness: employmentData.years_in_business?.toString() || "",
      monthlyIncome: employmentData.monthly_income?.toString() || "",
      annualIncome: employmentData.annual_income?.toString() || "",
      itrFiled: employmentData.itr_filed === 1
    });

    setIsSaved(true);
  }, [employmentData]);

  // Save Employment
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const id = applicantId;

      if (!id) {
        notifications.show({
          title: "Error",
          message: "Applicant ID not found",
          color: "red"
        });
        return;
      }

      const payload = {
        employment_type: formData.employmentType,
        business_name: formData.businessName,
        business_type: formData.businessType,
        years_in_business: Number(formData.yearsInBusiness),
        monthly_income: Number(formData.monthlyIncome),
        annual_income: Number(formData.annualIncome),
        itr_filed: formData.itrFiled ? 1 : 0
      };

      const res = await saveEmploymentDetails(payload, id);

      setIsSaved(true);
      setIsEditing(false);

      notifications.show({
        title: "Success",
        message: res?.message || "Employment saved successfully",
        color: "green",
        icon: <IconCheck size={18} />
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to save employment details",
        color: "red"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card withBorder radius="md" mt="lg">
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconBriefcase size={22} />
          <Text fw={700} size="lg">
            Employment Details
          </Text>
        </Group>

        {viewMode && !isEditing && (
          <Button size="xs" variant="light" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}

        {isEditing && (
          <Button size="xs" color="gray" variant="light" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </Group>

      <Grid>
        <Grid.Col span={4}>
          <Select
            label="Employment Type"
            placeholder="Select type"
            data={employmentTypes}
            value={formData.employmentType}
            onChange={(value) =>
              handleChange("employmentType", value)
            }
            disabled={viewMode && !isEditing}
            required
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Company Name"
            placeholder="Enter company name"
            value={formData.businessName}
            onChange={(e) =>
              handleChange("businessName", e.target.value)
            }
            disabled={viewMode && !isEditing}
            required
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Company Type"
            placeholder="e.g. Retail, Manufacturing"
            value={formData.businessType}
            onChange={(e) =>
              handleChange("businessType", e.target.value)
            }
            disabled={viewMode && !isEditing}
            required
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Years in Business"
            placeholder="e.g. 5"
            value={formData.yearsInBusiness}
            onChange={(e) =>
              handleChange("yearsInBusiness", e.target.value)
            }
            inputMode="numeric"
            disabled={viewMode && !isEditing}
            required
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Monthly Income (₹)"
            placeholder="e.g. 1,50,000"
            leftSection="₹"
            value={formatToINR(formData.monthlyIncome)}
            onChange={(e) =>
              handleChange("monthlyIncome", e.target.value)
            }
            inputMode="numeric"
            disabled={viewMode && !isEditing}
            required
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Annual Income (₹)"
            placeholder="e.g. 10,000"
            leftSection="₹"
            value={formatToINR(formData.annualIncome)}
            onChange={(e) =>
              handleChange("annualIncome", e.target.value)
            }

            inputMode="numeric"
            disabled={viewMode && !isEditing}
            required
          />
        </Grid.Col>
      </Grid>

      <Group mt="md">
        <Checkbox
          label="ITR Filed"
          checked={formData.itrFiled}
          onChange={(event) =>
            handleChange(
              "itrFiled",
              event.currentTarget.checked
            )
          }
          disabled={viewMode && !isEditing}
          required
        />
      </Group>

      {/* Hide Save Button in View Mode */}
      {((!viewMode) || (viewMode && isEditing)) && isFormValid && (
        <Group justify="flex-end" mt="md">
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={isSaved}
          >
            {isSaved ? "Saved" : "Save Employment Details"}
          </Button>
        </Group>
      )}
    </Card>
  );
}

export default EmploymentDetails;
