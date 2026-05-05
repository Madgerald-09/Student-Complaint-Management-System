import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Plus, 
  Bell, 
  Settings, 
  LogOut,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  Paperclip,
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { useComplaints } from '@/lib/ComplaintContext';

const StudentDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('studentProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.studentId && !parsed.matricNo) {
        parsed.matricNo = parsed.studentId;
        delete parsed.studentId;
      }
      return parsed;
    }
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@university.edu',
      matricNo: 'STU12345',
      department: 'Computer Science'
    };
  });
  
  const handleSaveProfile = () => {
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
  };
  
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    category: '',
    priority: 'medium',
    description: '',
  });

  const { complaints, addComplaint } = useComplaints();
  // Filter for only this student's complaints
  const myComplaints = complaints.filter(c => c.matricNo === profile.matricNo);

  const stats = {
    total: myComplaints.length,
    pending: myComplaints.filter(c => c.status === 'pending').length,
    inProgress: myComplaints.filter(c => c.status === 'in-progress').length,
    resolved: myComplaints.filter(c => c.status === 'resolved').length,
  };

  // Generate dynamic notifications based on user's complaints
  const generateNotifications = () => {
    const notifs: any[] = [];
    myComplaints.forEach(c => {
      if (c.status === 'resolved') {
        notifs.push({
          id: `res-${c.id}`,
          message: `Complaint ${c.id} has been resolved`,
          time: 'Recently',
          read: true,
          dateMs: new Date(c.date).getTime() + 86400000
        });
      }
      if (c.responses && c.responses.length > 0) {
        c.responses.forEach((r: any, idx: number) => {
          notifs.push({
            id: `resp-${c.id}-${idx}`,
            message: `New response on ${c.id} from ${r.senderName}`,
            time: new Date(r.date).toLocaleDateString(),
            read: false,
            dateMs: new Date(r.date).getTime()
          });
        });
      }
    });
    return notifs.sort((a, b) => b.dateMs - a.dateMs).slice(0, 10);
  };

  const notifications = generateNotifications();

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    addComplaint({
      title: newComplaint.title,
      category: newComplaint.category,
      priority: newComplaint.priority as any,
      description: newComplaint.description,
      studentName: `${profile.firstName} ${profile.lastName}`,
      matricNo: profile.matricNo,
      department: newComplaint.category
    });
    
    toast({
      title: 'Complaint Submitted',
      description: 'Your complaint has been submitted successfully.',
    });
    setIsNewComplaintOpen(false);
    setNewComplaint({ title: '', category: '', priority: 'medium', description: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredComplaints = myComplaints.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Logo size="sm" />
                <span className="text-lg font-bold hidden sm:block">Portal</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium">{profile.firstName} {profile.lastName}</div>
                  <div className="text-xs text-muted-foreground">Student</div>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-muted/30 border-r border-border min-h-screen hidden lg:block">
          <div className="p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'complaints' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span>My Complaints</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'notifications' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {notifications.some(n => !n.read) && (
                  <Badge variant="destructive" className="ml-auto text-xs">{notifications.filter(n => !n.read).length}</Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </nav>
            
            <div className="mt-8 pt-8 border-t border-border">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                  <p className="text-muted-foreground">Welcome back, {profile.firstName}! Here's your complaint summary.</p>
                </div>
                <Button onClick={() => setIsNewComplaintOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Complaint
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Complaints</p>
                        <p className="text-3xl font-bold">{stats.total}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Resolved</p>
                        <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Complaints */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Complaints</CardTitle>
                  <CardDescription>Your most recent complaint submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myComplaints.slice(0, 3).map((complaint) => (
                      <div 
                        key={complaint.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-sm font-medium text-muted-foreground">{complaint.id}</span>
                            <Badge variant="outline" className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                            <span className={`text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority} priority
                            </span>
                          </div>
                          <h4 className="font-medium">{complaint.title}</h4>
                          <p className="text-sm text-muted-foreground">{complaint.category} • {complaint.date}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('complaints')}
                  >
                    View All Complaints
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">My Complaints</h1>
                  <p className="text-muted-foreground">Manage and track all your complaints</p>
                </div>
                <Button onClick={() => setIsNewComplaintOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Complaint
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search complaints..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Complaints List */}
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <Card 
                    key={complaint.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-muted-foreground">{complaint.id}</span>
                            <Badge variant="outline" className={getStatusColor(complaint.status)}>
                              {complaint.status}
                            </Badge>
                            <span className={`text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority} priority
                            </span>
                          </div>
                          <h4 className="text-lg font-medium mb-1">{complaint.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{complaint.category} • Submitted on {complaint.date}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{complaint.responses?.length || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Notifications</h1>
              <Card>
                <CardContent className="p-0">
                  {notifications.map((notification, index) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-center justify-between p-4 ${index !== notifications.length - 1 ? 'border-b' : ''} ${!notification.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-primary' : 'bg-transparent'}`} />
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input 
                        value={profile.firstName} 
                        onChange={e => setProfile({...profile, firstName: e.target.value})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input 
                        value={profile.lastName} 
                        onChange={e => setProfile({...profile, lastName: e.target.value})} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      value={profile.email} 
                      type="email" 
                      onChange={e => setProfile({...profile, email: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Matric No</Label>
                    <Input value={profile.matricNo} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input 
                      value={profile.department} 
                      onChange={e => setProfile({...profile, department: e.target.value})} 
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* New Complaint Dialog */}
      <Dialog open={isNewComplaintOpen} onOpenChange={setIsNewComplaintOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Complaint</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your complaint. We'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Complaint Title</Label>
              <Input
                id="title"
                placeholder="Brief description of your issue"
                value={newComplaint.title}
                onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newComplaint.category} 
                onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Issues</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="food">Food Services</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select 
                value={newComplaint.priority} 
                onValueChange={(value) => setNewComplaint({ ...newComplaint, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information about your complaint..."
                rows={4}
                value={newComplaint.description}
                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Paperclip className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsNewComplaintOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Submit Complaint
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{selectedComplaint.id}</span>
                  <Badge variant="outline" className={getStatusColor(selectedComplaint.status)}>
                    {selectedComplaint.status}
                  </Badge>
                </div>
                <DialogTitle>{selectedComplaint.title}</DialogTitle>
                <DialogDescription>
                  {selectedComplaint.category} • Submitted on {selectedComplaint.date}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedComplaint.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Responses ({selectedComplaint.responses?.length || 0})</h4>
                  {selectedComplaint.responses?.length > 0 ? (
                    <div className="space-y-3">
                      {selectedComplaint.responses.map((response: any) => (
                        <div key={response.id} className="bg-muted p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{response.senderName} ({response.senderRole})</span>
                            <span className="text-sm text-muted-foreground">{new Date(response.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {response.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No responses yet. We'll notify you when there's an update.</p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedComplaint(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
