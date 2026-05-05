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
  Building,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { useUsers } from '@/lib/UserContext';

const AdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { users, addUser } = useUsers();
  
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
    adminCode: '',
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
      
      // Check for main admin credentials
      const validMainEmail = 'admin@afebabalola.edu.ng';
      const validMainPassword = 'admin123';
      
      if (loginData.email === validMainEmail && loginData.password === validMainPassword) {
        const mainAdminProfile = {
          name: 'Main Administrator',
          email: validMainEmail,
          role: 'admin' as const,
          department: 'Central Administration',
          institution: 'Afe Babalola University',
          status: 'active' as const
        };
        localStorage.setItem('adminProfile', JSON.stringify(mainAdminProfile));
        toast({
          title: 'Admin Login Successful',
          description: 'Welcome to the Main Admin Dashboard!',
        });
        navigate('/admin-dashboard');
        return;
      }
      
      // Check if user is in users context (for newly registered admins/staff)
      const foundUser = users.find(u => u.email === loginData.email);
      if (foundUser) {
        localStorage.setItem('adminProfile', JSON.stringify({
          ...foundUser,
          institution: (foundUser as any).institution || 'State University'
        }));
        toast({
          title: 'Staff Login Successful',
          description: `Welcome back, ${foundUser.name}!`,
        });
        navigate('/admin-dashboard');
        return;
      }
      
      toast({
        title: 'Incorrect Credentials',
        description: 'Please check your email and password and try again.',
        variant: 'destructive',
      });
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
      
      const newAdminName = `${signupData.firstName} ${signupData.lastName}`;
      const newAdminProfile = {
        name: newAdminName,
        email: signupData.email,
        role: 'staff' as const, // Treat new signups as staff so they can be assigned complaints
        department: signupData.department,
        status: 'active' as const
      };
      
      addUser(newAdminProfile);
      localStorage.setItem('adminProfile', JSON.stringify(newAdminProfile));
      
      toast({
        title: 'Admin Account Created',
        description: 'Your administrator account has been created successfully!',
      });
      navigate('/admin-dashboard');
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
              Administrator Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage student complaints, track resolution metrics, and streamline your institution's feedback process.
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Manage and assign complaints to departments' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Generate detailed reports and analytics' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Track resolution times and performance' },
              { icon: <CheckCircle2 className="w-5 h-5" />, text: 'Communicate directly with students' },
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
            <CardTitle className="text-2xl">Administrator Access</CardTitle>
            <CardDescription>
              Login to admin panel or request administrator access
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Request Access</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@institution.edu"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
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
                        id="admin-remember"
                        checked={loginData.rememberMe}
                        onCheckedChange={(checked) => 
                          setLoginData({ ...loginData, rememberMe: checked as boolean })
                        }
                      />
                      <Label htmlFor="admin-remember" className="text-sm font-normal cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Signup Form */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="admin-firstName"
                          placeholder="Jane"
                          className="pl-10"
                          value={signupData.firstName}
                          onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-lastName">Last Name</Label>
                      <Input
                        id="admin-lastName"
                        placeholder="Smith"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-signup-email">Institutional Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-signup-email"
                        type="email"
                        placeholder="admin@institution.edu"
                        className="pl-10"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-code">Administrator Code</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-code"
                        placeholder="Enter admin authorization code"
                        className="pl-10"
                        value={signupData.adminCode}
                        onChange={(e) => setSignupData({ ...signupData, adminCode: e.target.value })}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Contact your IT department for the admin authorization code
                    </p>
                  </div>
                  

                  <div className="space-y-2">
                    <Label htmlFor="admin-department">Department</Label>
                    <Input
                      id="admin-department"
                      placeholder="e.g. Student Affairs"
                      value={signupData.department}
                      onChange={(e) => setSignupData({ ...signupData, department: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a secure password"
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
                    <Label htmlFor="admin-confirmPassword">Confirm Password</Label>
                    <Input
                      id="admin-confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="admin-terms"
                      checked={signupData.agreeTerms}
                      onCheckedChange={(checked) => 
                        setSignupData({ ...signupData, agreeTerms: checked as boolean })
                      }
                      required
                    />
                    <Label htmlFor="admin-terms" className="text-sm font-normal cursor-pointer">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:underline">Administrator Terms</a>
                      {' '}and verify my institutional affiliation
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Submitting Request...' : 'Request Admin Access'}
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

export default AdminAuth;
