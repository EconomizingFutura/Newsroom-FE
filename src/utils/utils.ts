export const returnType = (type: string) => {
  let route: string;

  switch (type) {
    case "Text":
    case "Text Article":
      route = "textArticle";
      break;
    case "Audio Post":
      route = "audio";
      break;
    case "Video Post":
      route = "video";
      break;
    default:
      route = "textArticle";
  }
  return route;
};
