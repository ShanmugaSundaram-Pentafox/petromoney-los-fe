import { useMutation, useQuery, useQueryClient } from 'react-query';
import { calculateEligibilityScore, createLoanInfo, forwardLoanForApproval, getLoanInfo, updateLoanInfo } from '../../../../services/customerOnboarding.service';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';


export const useLoan = (dealershipId) =>
  useQuery(['loan', dealershipId], () => getLoanInfo(dealershipId), {
    enabled: !!dealershipId,
    onSuccess: () => {
      displayNotification({
        message: 'Loan info fetched successfully',
        variant: 'success',
      });
    },
    onError: (message) => {
      displayNotification({
        message: `Error fetching loan info: ${message}`,
        variant: 'error',
      });
    },
  });

export const useEligibility = (dealershipId, applicantId) =>
  useMutation(() => calculateEligibilityScore(dealershipId, applicantId), {
    onSuccess: () => {
      displayNotification({
        message: 'Eligibility score calculated successfully',
        variant: 'success',
      });
    },
    onError: (message) => {
      displayNotification({
        message: `Error calculating eligibility score: ${message}`,
        variant: 'error',
      });
    },
  });

export const useForwardLoan = () => {
  return useMutation(
    ({ loanId, remarks }) => forwardLoanForApproval(loanId, remarks),
    {
      onSuccess: () => {
        displayNotification({
          message: 'Loan forwarded successfully',
          variant: 'success',
        });
      },
      onError: (message) => {
        displayNotification({
          message: `Error forwarding loan: ${message}`,
          variant: 'error',
        });
      },
    }
  );
};

export const useCreateLoan = (dealershipId) => {
  const qc = useQueryClient();

  return useMutation((payload) => createLoanInfo(dealershipId, payload), {
    onSuccess: () => {
      qc.invalidateQueries('loan');
      displayNotification({
        message: 'Loan created successfully',
        variant: 'success',
      });
    },
    onError: (message) => {
      displayNotification({
        message: `Error creating loan: ${message}`,
        variant: 'error',
      });
    },
  });
};

export const useUpdateLoan = (dealershipId) => {
  const qc = useQueryClient();

  return useMutation((payload) => updateLoanInfo(dealershipId, payload), {
    onSuccess: () => {
      qc.invalidateQueries(['loan', dealershipId]);
      displayNotification({
        message: 'Loan updated successfully',
        variant: 'success',
      });
    },
    onError: (message) => {
      displayNotification({
        message: `Error updating loan: ${message}`,
        variant: 'error',
      });
    },
  });
};
