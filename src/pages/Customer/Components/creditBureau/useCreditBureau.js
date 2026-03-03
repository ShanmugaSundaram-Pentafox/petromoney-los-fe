import { useMutation } from 'react-query';
import { displayNotification } from '../../../../components/CommonComponents/Notification/displayNotification';
import { generateCreditReport, getCibilFile, getCreditReport } from '../../../../services/customerOnboarding.service';


export const useFetchCreditReport = () => {
  return useMutation(
    ({ dealershipId, applicantId }) =>
      getCreditReport(dealershipId, applicantId),
  );
};

export const useGetCibiFile = () => {
  return useMutation((fileId) => getCibilFile(fileId), {
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
