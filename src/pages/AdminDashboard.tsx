import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Users, 
  Bell, 
  Settings, 
  LogOut,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
  Send,
  UserCheck,
  Trash2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';
import { useComplaints } from '@/lib/ComplaintContext';
import { useUsers } from '@/lib/UserContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [adminProfile, setAdminProfile] = useState(() => {
    const saved = localStorage.getItem('adminProfile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'Admin User',
      role: 'admin',
      department: 'Administration',
      institution: 'State University'
    };
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [responseText, setResponseText] = useState('');
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'staff' as const,
    department: '',
    status: 'active' as const
  });
  
  const { complaints, updateComplaintStatus, assignComplaint, addResponse } = useComplaints();
  
  const dashboardComplaints = adminProfile.role === 'admin' 
    ? complaints 
    : complaints.filter(c => c.assignedTo === adminProfile.name);
  const { users, addUser, deleteUser } = useUsers();

  type ActivityItem = {
    action: string;
    detail: string;
    time: string;
    type: string;
  };

  const stats = {
    total: dashboardComplaints.length,
    pending: dashboardComplaints.filter(c => c.status === 'pending').length,
    inProgress: dashboardComplaints.filter(c => c.status === 'in-progress').length,
    resolved: dashboardComplaints.filter(c => c.status === 'resolved').length,
    highPriority: dashboardComplaints.filter(c => c.priority === 'high' && c.status !== 'resolved').length,
  };

  const notifications = [
    { id: 1, message: 'New high priority complaint submitted', time: '5 minutes ago', read: false },
    { id: 2, message: 'CMP002 has been resolved by Lisa Chen', time: '1 hour ago', read: false },
    { id: 3, message: 'Weekly report is ready for download', time: '3 hours ago', read: true },
  ];

  const departmentStats = [
    { name: 'IT Services', count: 12, resolved: 8 },
    { name: 'Food Services', count: 5, resolved: 4 },
    { name: 'Facilities', count: 8, resolved: 6 },
    { name: 'Library Services', count: 3, resolved: 2 },
    { name: 'Academic Affairs', count: 6, resolved: 5 },
  ];

  const filteredComplaints = dashboardComplaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Generate recent activities from actual complaints
  const generateRecentActivities = () => {
    const activities: ActivityItem[] = [];

    // Add new complaints (most recent by date)
    const sortedComplaints = [...dashboardComplaints].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    sortedComplaints.slice(0, 2).forEach(complaint => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(complaint.date).getTime()) / (1000 * 60 * 60 * 24));
      const timeAgo = daysDiff === 0 ? 'Today' : daysDiff === 1 ? '1 day ago' : `${daysDiff} days ago`;
      activities.push({
        action: 'New complaint submitted',
        detail: `${complaint.id} - ${complaint.title}`,
        time: timeAgo,
        type: 'new'
      });
    });

    // Add resolved complaints
    const resolvedComplaints = dashboardComplaints.filter(c => c.status === 'resolved').slice(0, 1);
    resolvedComplaints.forEach(complaint => {
      activities.push({
        action: 'Status updated',
        detail: `${complaint.id} marked as resolved`,
        time: 'Recently',
        type: 'update'
      });
    });

    // Add assigned complaints
    const assignedComplaints = dashboardComplaints.filter(c => c.assignedTo).slice(0, 1);
    assignedComplaints.forEach(complaint => {
      activities.push({
        action: 'Complaint assigned',
        detail: `${complaint.id} assigned to ${complaint.assignedTo}`,
        time: 'Recently',
        type: 'assign'
      });
    });

    // Add complaints with responses
    const complaintsWithResponses = dashboardComplaints.filter(c => c.responses.length > 0).slice(0, 1);
    complaintsWithResponses.forEach(complaint => {
      activities.push({
        action: 'Response sent',
        detail: `Reply sent for ${complaint.id}`,
        time: 'Recently',
        type: 'response'
      });
    });

    return activities.slice(0, 4); // Return only the 4 most recent activities
  };

  const recentActivities = generateRecentActivities();

  const handleAssignComplaint = (complaintId: string, assignee: string) => {
    assignComplaint(complaintId, assignee);
    toast({
      title: 'Complaint Assigned',
      description: `Complaint ${complaintId} has been assigned to ${assignee}`,
    });
  };

  const handleUpdateStatus = (complaintId: string, newStatus: string) => {
    updateComplaintStatus(complaintId, newStatus as any);
    toast({
      title: 'Status Updated',
      description: `Complaint ${complaintId} status changed to ${newStatus}`,
    });
  };

  const handleSendResponse = () => {
    if (!responseText.trim() || !selectedComplaint) return;
    
    addResponse(selectedComplaint.id, {
      senderName: 'System Admin',
      senderRole: 'Admin',
      text: responseText
    });
    
    toast({
      title: 'Response Sent',
      description: 'Your response has been sent to the student.',
    });
    setResponseText('');
  };

  const handleAddUser = () => {
    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.department.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    addUser(newUserData);
    toast({
      title: 'User Added',
      description: `${newUserData.name} has been added successfully`,
    });
    
    setNewUserData({
      name: '',
      email: '',
      role: 'staff',
      department: '',
      status: 'active'
    });
    setShowAddUserDialog(false);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <Logo size="sm" />
                <span className="text-lg font-bold hidden sm:block">{adminProfile.institution || 'Portal'}</span>
              </Link>
              <Badge variant="secondary" className="hidden sm:inline-flex">Admin</Badge>
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
                  <div className="text-sm font-medium">{adminProfile.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{adminProfile.role}</div>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {adminProfile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
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
                <span>All Complaints</span>
                {stats.pending > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">{stats.pending}</Badge>
                )}
              </button>
              {adminProfile.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>Users</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'reports' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Reports</span>
                  </button>
                </>
              )}
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
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Overview of all complaints and system metrics</p>
              </div>

              {/* Stats Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
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
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">High Priority</p>
                        <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Complaints by Department</CardTitle>
                    <CardDescription>Distribution of complaints across departments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {departmentStats.map((dept) => (
                        <div key={dept.name} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium">{dept.name}</span>
                              <span className="text-sm text-muted-foreground">{dept.count} total</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${(dept.resolved / dept.count) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="ml-4 text-right">
                            <span className="text-sm font-medium text-green-600">{dept.resolved}</span>
                            <span className="text-sm text-muted-foreground"> resolved</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            item.type === 'new' ? 'bg-green-500' :
                            item.type === 'update' ? 'bg-blue-500' :
                            item.type === 'assign' ? 'bg-yellow-500' : 'bg-purple-500'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{item.action}</p>
                            <p className="text-sm text-muted-foreground">{item.detail}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Complaints Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pending Complaints</CardTitle>
                      <CardDescription>Complaints awaiting assignment or action</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('complaints')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardComplaints.filter(c => c.status === 'pending').map((complaint) => (
                      <div 
                        key={complaint.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/complaint/${complaint.id}`)}
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
                          <p className="text-sm text-muted-foreground">{complaint.studentName} ({complaint.matricNo}) • {complaint.date}</p>
                        </div>
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          handleAssignComplaint(complaint.id, 'IT Team');
                        }}>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Assign
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">All Complaints</h1>
                  <p className="text-muted-foreground">Manage and respond to all student complaints</p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, title, or student name..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Complaints Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">ID</th>
                          <th className="text-left p-4 font-medium">Title</th>
                          <th className="text-left p-4 font-medium">Student</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Priority</th>
                          <th className="text-left p-4 font-medium">Assigned To</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredComplaints.map((complaint) => (
                          <tr key={complaint.id} className="border-t hover:bg-muted/50">
                            <td className="p-4 text-sm font-medium text-muted-foreground">{complaint.id}</td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{complaint.title}</p>
                                <p className="text-sm text-muted-foreground">{complaint.category}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{complaint.studentName}</p>
                                <p className="text-sm text-muted-foreground">{complaint.matricNo}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className={getStatusColor(complaint.status)}>
                                {complaint.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className={`text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority}
                              </span>
                            </td>
                            <td className="p-4 text-sm">
                              {complaint.assignedTo || (
                                <span className="text-muted-foreground italic">Unassigned</span>
                              )}
                            </td>
                            <td className="p-4">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/complaint/${complaint.id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button onClick={() => setShowAddUserDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Name</th>
                          <th className="text-left p-4 font-medium">Email</th>
                          <th className="text-left p-4 font-medium">Role</th>
                          <th className="text-left p-4 font-medium">Department</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Joined</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id} className="border-t hover:bg-muted/50">
                              <td className="p-4">
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-sm">{user.email}</td>
                              <td className="p-4">
                                <Badge variant="outline" className="capitalize">
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm">{user.department}</td>
                              <td className="p-4">
                                <Badge 
                                  className={user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800'}
                                  variant="outline"
                                >
                                  {user.status}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm text-muted-foreground">{user.dateJoined}</td>
                              <td className="p-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    deleteUser(user.id);
                                    toast({
                                      title: 'User Deleted',
                                      description: `${user.name} has been removed`,
                                    });
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                              No users found. Click "Add User" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Reports & Analytics</h1>
              
              {(() => {
                const statusCounts = { pending: 0, 'in-progress': 0, resolved: 0, rejected: 0 };
                dashboardComplaints.forEach(c => {
                  if (statusCounts[c.status as keyof typeof statusCounts] !== undefined) {
                    statusCounts[c.status as keyof typeof statusCounts]++;
                  }
                });
                
                const pieData = [
                  { name: 'Pending', value: statusCounts.pending, color: '#eab308' },
                  { name: 'In Progress', value: statusCounts['in-progress'], color: '#3b82f6' },
                  { name: 'Resolved', value: statusCounts.resolved, color: '#22c55e' },
                  { name: 'Rejected', value: statusCounts.rejected, color: '#ef4444' },
                ].filter(d => d.value > 0);

                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthlyCounts: Record<string, number> = {};
                dashboardComplaints.forEach(c => {
                  const d = new Date(c.date);
                  const monthStr = months[d.getMonth()];
                  monthlyCounts[monthStr] = (monthlyCounts[monthStr] || 0) + 1;
                });

                const barData = Object.keys(monthlyCounts).map(key => ({
                  name: key,
                  Complaints: monthlyCounts[key]
                }));

                return (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 w-full">
                          {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="Complaints" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground flex-col">
                              <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                              <p>No data available</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Resolution Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 w-full">
                          {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground flex-col">
                              <PieChart className="w-16 h-16 mb-4 opacity-20" />
                              <p>No data available</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Admin Settings</h1>
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Institution Name</Label>
                    <Input value={adminProfile.institution} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input value={adminProfile.email} type="email" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Auto-Assignment Rules</Label>
                    <Select defaultValue="category">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Based on Category</SelectItem>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                        <SelectItem value="workload">Based on Workload</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                  Submitted by {selectedComplaint.studentName} ({selectedComplaint.matricNo}) on {selectedComplaint.date}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedComplaint.studentName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedComplaint.studentName}</p>
                    <p className="text-sm text-muted-foreground">{selectedComplaint.matricNo} • {selectedComplaint.department}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedComplaint.description}</p>
                </div>

                {/* Assignment & Status */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assign To</Label>
                    <Select 
                      value={selectedComplaint.assignedTo || ''}
                      onValueChange={(value) => handleAssignComplaint(selectedComplaint.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        <SelectItem value="Mike Johnson">Mike Johnson (IT)</SelectItem>
                        <SelectItem value="Lisa Chen">Lisa Chen (Food Services)</SelectItem>
                        <SelectItem value="Tom Wilson">Tom Wilson (Facilities)</SelectItem>
                        <SelectItem value="Sarah Adams">Sarah Adams (Library)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select 
                      value={selectedComplaint.status}
                      onValueChange={(value) => handleUpdateStatus(selectedComplaint.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Response */}
                <div className="space-y-2">
                  <Label>Send Response to Student</Label>
                  <Textarea
                    placeholder="Type your response here..."
                    rows={3}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <Button onClick={handleSendResponse} disabled={!responseText.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Response
                  </Button>
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

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account in the system</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@university.edu"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUserData.role}
                onValueChange={(value: any) => setNewUserData({ ...newUserData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={newUserData.department}
                onValueChange={(value) => setNewUserData({ ...newUserData, department: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT Services">IT Services</SelectItem>
                  <SelectItem value="Food Services">Food Services</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
                  <SelectItem value="Library Services">Library Services</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Academic Affairs">Academic Affairs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
