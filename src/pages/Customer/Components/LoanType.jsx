import React, { useState } from "react";
import {
    Container,
    Select,
    Button
} from "@mantine/core";
import {storage} from '../../../store/storage';


const LoanType = () => {
    const [selectedtype, setSelectedType] = useState("");
    const onboardData = storage.get('LOAN_TYPE');
    const loanTypes = [
        { value: "Personal Loan", label: "Personal Loan" },
        { value: "Home Loan", label: "Home Loan" }
    ];
    console.log("selectedtype", selectedtype,onboardData && onboardData)
    return (
        <Container size="xl" py="lg" className="bg-white border">
            <Select
                label="Select a loan type"
                placeholder="Select type"
                data={loanTypes}
                value={selectedtype}
                onChange={(value) => {
                    setSelectedType(value)
                    storage.set("LOAN_TYPE", value)
                }
                }
                required
            />

        </Container>
    );
};

export default LoanType;