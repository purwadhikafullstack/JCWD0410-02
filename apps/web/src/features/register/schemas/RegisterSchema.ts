import * as Yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(Yup);

export const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});
