import { useMutation } from 'react-query';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';
import { generateCreditReport, getCibilFile, getCreditReport } from '../../../../services/customerOnboarding.service';


export const useFetchCreditReport = () => {
  return useMutation(
    ({ dealershipId, applicantId }) =>
      getCreditReport(dealershipId, applicantId),
    {
      onSuccess: () => {
        displayNotification({
          message: 'CIBIL report fetched successfully',
          variant: 'success',
        });
      },
      onError: (message) => {
        displayNotification({
          message: `Error fetching CIBIL report: ${message}`,
          variant: 'error',
        });
      },
    }
  );
};

export const useGetCibiFile = () => {
  return useMutation((fileId) => getCibilFile(fileId), {
    onSuccess: () => {
      displayNotification({
        message: 'CIBIL file fetched successfully',
        variant: 'success',
      });
    },
    onError: (error) => {
      displayNotification({
        message: `Error fetching CIBIL file: ${error?.message}`,
        variant: 'error',
      });
    },
  });
};

export const useGenerateCreditReport = () => {
  return useMutation(
    ({ dealershipId, applicantId }) =>
      generateCreditReport(dealershipId, applicantId),
    {
      onSuccess: () => {
        displayNotification({
          message: 'CIBIL report generated successfully',
          variant: 'success',
        });
      },
      onError: (message) => {
        displayNotification({
          message: `Error generating CIBIL report: ${message}`,
          variant: 'error',
        });
      },
    }
  );
};
