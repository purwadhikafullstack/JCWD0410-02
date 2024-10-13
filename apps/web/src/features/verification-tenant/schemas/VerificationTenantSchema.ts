import * as Yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(Yup);

export const VerificationTenantSchema = Yup.object().shape({
  name: Yup.string().required('Business Name is required'),
  phone: Yup.number().required('Business Phone is required').min(10),
  bankName: Yup.string().required('Bank Name is required').min(3),
  bankNumber: Yup.number().required('Bank Number is required').min(5),
  password: Yup.string()
    .required('Password is required')
    .minLowercase(1)
    .minNumbers(1)
    .minUppercase(1)
    .minSymbols(1)
    .min(6),
  confirmPassword: Yup.string()
    .required('Confirm Password is Required')
    .oneOf([Yup.ref('password')], 'Your password do not match'),
});
