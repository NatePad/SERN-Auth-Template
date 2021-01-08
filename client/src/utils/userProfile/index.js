import usePasswordModel from './passwordModel';

const useProfileModel = () => {
  const { password, confirmPassword } = usePasswordModel();

  return {
    password,
    confirmPassword
  }
}

export default useProfileModel;
