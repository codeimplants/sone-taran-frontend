import axios from "axios";

export interface RequestOtpResponse {
  fullhash: string;
  otpToken: string;
  otp?: number
}

interface RequestEmailOtpResponse {
  token: string;
}

//For creating a new user
export interface VerifiedUserResponse {
  token: string;
  success: boolean;
  user: {
    _id: string;
    phone?: string;
    email?: string;
    createdAt?: string;
  };
}


const apiClient = axios.create({
  baseURL: "https://sone-taran-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const getAuthHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// fro phone 
export const requestPhoneOtpApi = async (phone: string | { phoneNo: string }): Promise<RequestOtpResponse> => {

  const phoneNumber = typeof phone === "object" ? phone.phoneNo : phone;

  const response = await apiClient.post("/user/sendPhoneOtp", { phone: phoneNumber });
  console.log(`OTP requested for phone: ${phoneNumber}`);

  console.log(response.data.otp)

  return response.data as RequestOtpResponse;

};

// for verifing the phone otp

export const verifyPhoneOtpApi = async (
  phone: string,
  otp: number,
  fullhash: string,
): Promise<VerifiedUserResponse | null> => {
  try {
    const response = await apiClient.post(
      '/user/verifyPhoneOtp',
      { phone, otp, fullhash },
    );

    if (response.status === 200 && response.data.success && response.data.user) {
      return response.data as VerifiedUserResponse;
    }

    return null;
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    return null;
  }
};


// For Email

export const requestEmailOtpApi = async (email: string | { email: string }): Promise<RequestEmailOtpResponse> => {

  const enteredEmail = typeof email === "object" ? email.email : email;

  const response = await apiClient.post("/user/sendEmailOtp", { email: enteredEmail });

  console.log(`OTP requested for email: ${enteredEmail}`);

  return response.data as RequestEmailOtpResponse;
};


export const verifyEmailOtpApi = async (
  otp: string,
  otpToken: string
): Promise<VerifiedUserResponse | null> => {
  try {
    const response = await apiClient.post(
      '/user/verifyEmailOtp',
      { otp },
      getAuthHeaders(otpToken),
    );

    if (response.status === 200 && response.data.success && response.data.user) {
      return response.data as VerifiedUserResponse;
    }

    return null;
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    return null;
  }
};

