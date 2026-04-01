const STORAGE_KEY = 'customer_onboard';

const CustomerOnboardStorage = {
  // Get full onboard object
  get() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading customer onboard storage:', error);
      return {};
    }
  },

  // Replace full object
  set(dataObject) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataObject));
    } catch (error) {
      console.error('Error writing customer onboard storage:', error);
    }
  },

  // Merge root level update
  update(updatedFields) {
    try {
      const existing = this.get();
      const merged = { ...existing, ...updatedFields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (error) {
      console.error('Error updating customer onboard storage:', error);
    }
  },

  addCoApplicant(data) {
    try {
      const existing = this.get();

      const updated = {
        ...existing,
        co_applicants: [...(existing.co_applicants || []), data],
      };

      this.set(updated);
      return updated;
    } catch (error) {
      console.error('Error adding co-applicant:', error);
    }
  },

  // -----------------------------
  // 🔹 Update Applicant Object
  // -----------------------------
  updateApplicant(data) {
    try {
      const existing = this.get();

      const updated = {
        ...existing,
        applicant: {
          ...(existing.applicant || {}),
          ...data,
        },
      };

      this.set(updated);
      return updated;
    } catch (error) {
      console.error('Error updating applicant:', error);
    }
  },

  // -----------------------------
  // 🔹 Add / Update Co-Applicant
  // -----------------------------
  updateCoApplicant(index, data) {
    try {
      const existing = this.get();
      const coApplicants = [...(existing.co_applicants || [])];

      if (!coApplicants[index]) return existing;

      coApplicants[index] = {
        ...coApplicants[index],
        ...data,
      };

      const updated = {
        ...existing,
        co_applicants: coApplicants,
      };

      this.set(updated);
      return updated;
    } catch (error) {
      console.error('Error updating co-applicant:', error);
    }
  },

  // -----------------------------
  // 🔹 Remove Co-Applicant
  // -----------------------------
  removeCoApplicant(index) {
    try {
      const existing = this.get();
      const coApplicants = existing.co_applicants || [];

      const updatedList = coApplicants.filter((_, i) => i !== index);

      const updated = {
        ...existing,
        co_applicants: updatedList,
      };

      this.set(updated);
      return updated;
    } catch (error) {
      console.error('Error removing co-applicant:', error);
    }
  },

  // Remove one root field
  removeField(fieldName) {
    try {
      const existing = this.get();
      delete existing[fieldName];
      this.set(existing);
      return existing;
    } catch (error) {
      console.error('Error removing field:', error);
    }
  },

  // Clear everything
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};

export default CustomerOnboardStorage;
