import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

const StudentAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricNo: '',
    department: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with credential validation
    setTimeout(() => {
      setIsLoading(false);
      
      // Check for valid credentials (demo credentials)
      const validEmail = 'student@afebabalola.edu.ng';
      const validPassword = 'password123';
      
      if (loginData.email === validEmail && loginData.password === validPassword) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back to ComplaintPortal!',
        });
        navigate('/student-dashboard');
      } else {
        toast({
          title: 'Incorrect Credentials',
          description: 'Please check your email and password and try again.',
          variant: 'destructive',
        });
      }
    }, 1500);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      localStorage.setItem('studentProfile', JSON.stringify({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        matricNo: signupData.matricNo,
        department: signupData.department
      }));
      
      toast({
        title: 'Account Created',
        description: 'Your student account has been created successfully!',
      });
      navigate('/student-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <div className="hidden lg:block">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="mb-8">
            <Logo size="lg" className="mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Student Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Access your complaint dashboard, submit new complaints, and track the status of your existing requests.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Submit complaints easily with attachments' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Track complaint status in real-time' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Receive notifications on updates' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'View your complaint history' },
            ].map((item, index) => (
              <div key={index} className="flex items-center text-muted-foreground">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-4">
                  {item.icon}
                </div>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center lg:text-left">
            <div className="lg:hidden flex flex-col items-center mb-6">
              <Logo size="md" className="mb-4" />
            </div>
            <CardTitle className="text-2xl">Welcome Student</CardTitle>
            <CardDescription>
              Login to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="student@university.edu"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) => 
                          setLoginData({ ...loginData, rememberMe: checked as boolean })
                        }
                      />
                      <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Signup Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="pl-10"
                          value={signupData.firstName}
                          onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="student@university.edu"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="matricNo">Matric No</Label>
                      <Input
                        id="matricNo"
                        placeholder="e.g. 18/52HA016"
                        value={signupData.matricNo}
                        onChange={(e) => setSignupData({ ...signupData, matricNo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="department"
                          placeholder="e.g. Computer Science"
                          className="pl-10"
                          value={signupData.department}
                          onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signupData.agreeTerms}
                      onCheckedChange={(checked) => 
                        setSignupData({ ...signupData, agreeTerms: checked as boolean })
                      }
                      required
                    />
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAuth;
