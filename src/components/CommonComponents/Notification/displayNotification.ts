import { notifications } from "@mantine/notifications";
import notificationVariant from "./notificationVarient";

interface optionsType {
  message: string;
  variant: string;
  id?: string;
  loading?: boolean;
  description?: string;
  autoClose?: boolean;
}

/**
 * A function to display a notification with a message, variant, and other optional properties.
 *
 * @param {string} message - The message to display in the notification.
 * @param {string} variant - The variant of the notification, which determines its appearance.
 * @param {string} [id="notification"] - The ID to assign to the notification element.
 * @param {boolean} [loading=false] - Whether to display a loading spinner in the notification.
 * @param {string|null} [description=null] - The description to display in the notification.
 * @param {boolean} [autoClose=true] - Whether the notification should automatically close after 5 seconds.
 */
export const displayNotification = (
  options: optionsType
) => {

  let defaultValues: optionsType = {
    id: `notification-${Math.random()}`,
    autoClose: true,
    ...options,
  }

  var color = notificationVariant[defaultValues?.variant];

  return notifications.show({
    id: defaultValues?.id,
    message: defaultValues?.message,
    title: defaultValues?.description,
    loading: defaultValues?.loading,
    autoClose: defaultValues?.autoClose ? 5000 : false,
    styles: (theme) => ({
      root: {
        backgroundColor: color,
        borderColor: color,

        "&::before": { backgroundColor: theme.white },
      },

      title: { color: theme.white },
      description: { color: theme.white },
      closeButton: {
        color: theme.white,
        '&:hover': { backgroundColor: color }
      },
    }),
  });
};
