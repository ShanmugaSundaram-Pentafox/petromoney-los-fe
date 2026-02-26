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
  saveEmploymentDetails,
  getEmploymentDetails
} from "../../../services/customerOnboarding.service";

function EmploymentDetails({ viewMode = false, applicantId }) {
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    employmentType: "Self Employed Non-Professional (SENP)",
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
    if (viewMode) return;

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
    if (viewMode) return;

    const isValid =
      formData.employmentType &&
      formData.businessName &&
      formData.businessType &&
      formData.yearsInBusiness &&
      formData.monthlyIncome &&
      formData.annualIncome;

    setIsFormValid(isValid);
  }, [formData, viewMode]);


  // Fetch Employment (View Mode)
  useEffect(() => {
    if (!applicantId) return;

    console.log("EMP fetching for:", applicantId);

    const fetchEmployment = async () => {
      try {
        const res = await getEmploymentDetails(applicantId);

        if (res?.status === "SUCCESS") {
          const data = res.data;

          setFormData({
            employmentType:
              data.employment_type?.includes("Professional")
                ? "Self Employed Professional (SEP)"
                : "Self Employed Non-Professional (SENP)",
            businessName: data.business_name || "",
            businessType: data.business_type || "",
            yearsInBusiness: data.years_in_business?.toString() || "",
            monthlyIncome: data.monthly_income?.toString() || "",
            annualIncome: data.annual_income?.toString() || "",
            itrFiled: data.itr_filed === 1
          });

          setIsSaved(true);
        }
      } catch (err) {
        console.log("Employment fetch error", err);
      }
    };

    fetchEmployment();
  }, [applicantId]);


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
      </Group>

      <Grid>
        <Grid.Col span={4}>
          <Select
            label="Employment Type"
            data={employmentTypes}
            value={formData.employmentType}
            onChange={(value) =>
              handleChange("employmentType", value)
            }
            disabled={viewMode}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Business Name"
            placeholder="Enter business name"
            value={formData.businessName}
            onChange={(e) =>
              handleChange("businessName", e.target.value)
            }
            disabled={viewMode}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Business Type"
            placeholder="e.g. Retail, Manufacturing"
            value={formData.businessType}
            onChange={(e) =>
              handleChange("businessType", e.target.value)
            }
            disabled={viewMode}
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
            disabled={viewMode}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Monthly Income (₹)"
            placeholder="e.g. 150000"
            value={formData.monthlyIncome}
            onChange={(e) =>
              handleChange("monthlyIncome", e.target.value)
            }
            inputMode="numeric"
            disabled={viewMode}
          />
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Annual Income (₹)"
            placeholder="e.g. 10000"
            value={formData.annualIncome}
            onChange={(e) =>
              handleChange("annualIncome", e.target.value)
            }
            inputMode="numeric"
            disabled={viewMode}
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
          disabled={viewMode}
        />
      </Group>

      {/* Hide Save Button in View Mode */}
      {!viewMode && isFormValid && (
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
