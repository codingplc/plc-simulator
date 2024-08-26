import { store } from "../../store/store";
import { OPEN_ALERT_SNACKBAR } from "../../store/types";

const shareLink = (link: string) => {
  if (navigator.share === undefined)
    return store.dispatch({
      type: OPEN_ALERT_SNACKBAR,
      payload: {
        color: "info",
        open: true,
        text: "Your browser does not support share API. Copy the link from address bar to share the diagram.",
      },
    });
  navigator
    .share({
      title: "Share your ladder diagram",
      url: link,
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Thanks for sharing!");
    })
    .catch(console.error);
};

export default shareLink;
