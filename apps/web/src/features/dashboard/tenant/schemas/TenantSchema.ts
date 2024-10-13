import * as Yup from 'yup';

export const TenantSchema = Yup.object().shape({
  name: Yup.string().required('Business Name is required'),
  phone: Yup.number().required('Business Phone is required').min(10),
  bankName: Yup.string().required('Bank Name is required').min(3),
  bankNumber: Yup.number().required('Bank Number is required').min(5),
});
