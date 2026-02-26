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

export const useGetCibiFile = (fileID) => {
  return useMutation(() => getCibilFile(fileID), {
    onSuccess: (res) => {
      const fileUrl = res?.file_url;

      if (fileUrl) {
        // Trigger browser download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank'; // optional
        link.download = 'CIBIL'; // let browser infer filename
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      displayNotification({
        message: 'CIBIL file downloaded successfully',
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
