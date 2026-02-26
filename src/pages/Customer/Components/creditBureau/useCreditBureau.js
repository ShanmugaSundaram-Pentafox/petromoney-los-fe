import { useMutation } from 'react-query';
import { generateCreditReport, getCreditReport } from '../../../../services/customerOnboarding.service';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';

export const useFetchCreditReport = () => {
  return useMutation(
    ({ dealershipId, applicantId }) =>
      getCreditReport(dealershipId, applicantId),
    {
      onSuccess: () => {
        displayNotification({
          message: 'Credit report fetched successfully',
          variant: 'success',
        });
      },
      onError: (message) => {
        displayNotification({
          message: `Error fetching credit report: ${message}`,
          variant: 'error',
        });
      },
    }
  );
};

export const useGenerateCreditReport = () => {
  return useMutation(
    ({ dealershipId, applicantId }) =>
      generateCreditReport(dealershipId, applicantId),
    {
      onSuccess: () => {
        displayNotification({
          message: 'Credit report generated successfully',
          variant: 'success',
        });
      },
      onError: (message) => {
        displayNotification({
          message: `Error generating credit report: ${message}`,
          variant: 'error',
        });
      },
    }
  );
};
