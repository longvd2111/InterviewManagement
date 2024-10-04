import { toast } from "react-toastify";
import { loginApi } from "../../services/userService";

export const FETCH_USER_LOGIN = "FETCH_USER_LOGIN";
export const FETCH_USER_ERROR = "FETCH_USER_ERROR";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";

export const USER_LOGOUT = "USER_LOGOUT";

export const USER_REFRESH = "USER_REFRESH";

// const handleLoginRedux = (username, password) => {
//   return async (dispatch, getState) => {
//     dispatch({ type: FETCH_USER_LOGIN });
//     let res = await loginApi(username, password);
//     if (res && res.token) {
//       localStorage.setItem("token", res.token);
//       localStorage.setItem("email", email.trim());

//       dispatch({
//         type: FETCH_USER_SUCCESS,
//         data: { email: email.trim(), token: res.token },
//       });
//     } else {
//       //error
//       if (res && res.status === 400) {
//         toast.error(res.data.error);
//       }

//       dispatch({
//         type: FETCH_USER_ERROR,
//       });
//     }
//   };
// };
