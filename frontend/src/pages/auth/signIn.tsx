'use client';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useNavigate } from 'react-router';
import { useSession, Session } from '../../SessionContext';
import { Button } from '@mui/material';
import { Link } from '@mui/material';
import api from '../../utils/axios';

const CustomButton = () => {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  );
}

const SignUpLink = () => {
  return (
    <Link href="/sign-up" variant="body2">
      Sign up
    </Link>
  );
}



export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();


  const Login = async (formData: any): Promise<Session> => {
    try {
      const { data } = await api.post('/auth/login', {
        email: formData.get('email'),
        password: formData.get('password'),
      });

      const user:any = {
        id : data.id,
        companyId : data.company.id,
        name : data.email,
        email: data.email,
        image: data.image || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
        role: data.role
      };
      return {
        user
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };





  return (
    <SignInPage
      title="Sign in"
      description="Please sign in to continue"
      actionText="Login"
      providers={[{ id: 'credentials', name: 'Login' }]}
      slots={{
        submitButton: CustomButton,
        signUpLink: SignUpLink,
      }}
      signIn={async (provider, formData, callbackUrl) => {
        // Demo session
        try {
          const session = await Login(formData);
          console.log("Logged in session:", session);
          if (session) {
            setSession(session);
            navigate(callbackUrl || '/', { replace: true });
            return {};
          }
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'An error occurred' };
        }
        return {};
      }}
    />
  );
}
