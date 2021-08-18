/* AXIOS */
import axios from "axios";

/* ACTION TYPES */
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from "../constants/userConstants";

/* ACTION CREATOR USED IN USER LOGIN IN LoginScreen COMPONENT & HEADER */
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    /* MAKE POST REQUEST TO GET BACK THE USER TOKEN */
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login/",
      { username: email, password: password },
      config
    );

    /* IF POST REQUEST SUCCESSFULL WE DISPATCH & SEND THE PAYLOAD TO OUR REDUCER */
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    /* SETTING VALUE OF USER INFO IN LOCAL STORAGE SO WE KNOW USER IS LOGGED IN */
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* ACTION CREATOR USED IN USER LOGOUT IN LoginScreen COMPONENT & HEADER */
export const logout = () => (dispatch) => {
  /* REMOVE USER INFO FORM LOCAL STORAGE */
  localStorage.removeItem("userInfo");

  /* DISPATCH TO REMOVE USER INFO FORM STORE */
  dispatch({
    type: USER_LOGOUT,
  });
  dispatch({
    type: USER_DETAILS_RESET,
  });
};

/* ACTION CREATOR USED IN USER REGISTRATION IN RegisterScreen COMPONENT & HEADER */
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    /* MAKE POST REQUEST TO GET BACK THE USER TOKEN */
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/register/",
      { name: name, email: email, password: password },
      config
    );

    /* IF POST REQUEST SUCCESSFULL WE DISPATCH & SEND THE PAYLOAD TO OUR REDUCER */
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    /* AFTER REGISTRATION WE WANT TO IMMEDIATELY LOGIN THE USER */
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    /* SETTING VALUE OF USER INFO IN LOCAL STORAGE SO WE KNOW USER IS LOGGED IN */
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* ACTION CREATOR USED IN GETTING USER DETAILS IN ProfileScreen COMPONENT  */
export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    // PULLING OUT THE CURRENT USER WE ARE LOGGED IN AS
    const {
      userLogin: { userInfo },
    } = getState();

    /* MAKE GET REQUEST TO GET BACK THE USER DATA */
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}` /* PASSING IN USER TOKEN AND IF THE USER IN AUTHORISED HE'LL HAVE FULL ACCESS TO HIS PROFILE INFORMATION */,
      },
    };

    // USING ${id} BECAUSE WHILE ACCESSING NORMAL USER WE'LL PASS STRING 'profile' BUT WHILE ACCESSING ADMIN PANEL WE'LL PASS THE 'id' SO LINK HAS TO BE DYNAMIC
    const { data } = await axios.get(`/api/users/${id}/`, config);

    /* IF GET REQUEST SUCCESSFULL WE DISPATCH & SEND THE PAYLOAD TO OUR REDUCER */
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });

    /* AFTER REGISTRATION WE WANT TO IMMEDIATELY LOGIN THE USER */
    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

/* ACTION CREATOR USED IN UPDATING USER DETAILS IN ProfileScreen COMPONENT  */
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    // PULLING OUT THE CURRENT USER WE ARE LOGGED IN AS
    const {
      userLogin: { userInfo },
    } = getState();

    /* MAKE PUT REQUEST TO SET THE THE USER DATA */
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}` /* PASSING IN USER TOKEN AND IF THE USER IN AUTHORISED HE'LL HAVE FULL ACCESS TO HIS PROFILE INFORMATION */,
      },
    };

    // USING ${id} BECAUSE WHILE ACCESSING NORMAL USER WE'LL PASS STRING 'profile' BUT WHILE ACCESSING ADMIN PANEL WE'LL PASS THE 'id' SO LINK HAS TO BE DYNAMIC
    const { data } = await axios.put(`/api/users/profile/update`, user, config);

    /* IF PUT REQUEST SUCCESSFULL WE DISPATCH & SEND THE PAYLOAD TO OUR REDUCER */
    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    /* AFTER UPDATING PROFILE INFORMATION WE WANT TO LOG THE USER IN WITH THE UPDATED INFO */
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    /* SETTING UPDATED VALUE OF USER INFO IN LOCAL STORAGE */
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
