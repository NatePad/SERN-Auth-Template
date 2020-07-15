import useUsernameModel from './usernameModel';
import useEmailModel from './emailModel';
import useNewPasswordModel from './newPasswordModel';

const useProfileModel = () => {
  const { username } = useUsernameModel();
  const { email } = useEmailModel();
  const { newPassword, confirmPassword } = useNewPasswordModel();

  return {
    username,
    email,
    newPassword,
    confirmPassword
  }
}

export default useProfileModel;