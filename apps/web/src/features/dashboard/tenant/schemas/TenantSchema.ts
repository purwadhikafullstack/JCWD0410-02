import * as Yup from 'yup';

export const TenantSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.number().required('Phone number is required').min(10),
  bankName: Yup.string().required('Bank Name is required').min(3),
  bankNumber: Yup.number().required('Bank Number is required').min(5),
});
