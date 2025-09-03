import { useNavigate } from "react-router";

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

export const TOKEN = () => {
  return localStorage.getItem("token");
};

export const USER_ROLE = () => {
  return localStorage.getItem("role");
};

export const LOGOUT = () => {
  localStorage.clear();
  window.location.href = "/login";
};
