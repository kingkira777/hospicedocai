'use client';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useNavigate } from 'react-router';
import { useSession, Session } from '../../SessionContext';
import { 
  Button, 
  Link, 
  TextField } from '@mui/material';
import api from '../../utils/axios';



const CustomEmailField = () => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id="email"
      label="Email Address"
      name="email"
      autoComplete="email"
      autoFocus
    />
  );
}

const CustomPAsswordField = () => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label="Password"
      type="password"
      id="password"
      autoComplete="current-password"
    />
  );
}

const CustomButton = () => {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{
        mt: 3,
        mb: 2,
        py: 1.2,
        textTransform: 'none',
        borderColor: '#2196f3',
        color: '#2196f3',
        '&:hover': {
          borderColor: '#1976d2',
          backgroundColor: 'rgba(33, 150, 243, 0.04)',
        },
      }}
    >
      LOG IN
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

      console.log("Login successful:", data);

      if(data?.employee){
        const employee:any = {
          id : data.employee.id,
          companyId : data.employee.company.id,
          company : data.employee.company.name,
          name : data.employee.firstName + ' ' + data.employee.lastName,
          email: data.email || '',
          image: data.image || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
          role : data.accessLevel
        }
        return {
          user : employee
        };
      }

      const user:any = {
        id : data.id,
        companyId : data.company.id,
        company : data.company.name,
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
        emailField: CustomEmailField,
        passwordField: CustomPAsswordField,
        submitButton: CustomButton,
        signUpLink: SignUpLink,
      }}
      signIn={async (provider, formData, callbackUrl) => {
        try {
          const session = await Login(formData);
          if (session) {
            setSession(session);
            navigate(callbackUrl || '/', { replace: true });
            return {};
          }
        } catch (error: any) {
          console.log(error?.message);
          return { error: 'Invalid Credentials' };
        }
        return {};
      }}
    />
  );
}
