import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft,
  Send,
  UserCheck,
  MessageSquare,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Building,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useComplaints } from '@/lib/ComplaintContext';
import { useUsers } from '@/lib/UserContext';

const ComplaintDetail = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [responseText, setResponseText] = useState('');
  
  const { complaints, updateComplaintStatus, assignComplaint, addResponse } = useComplaints();
  const { users } = useUsers();
  
  const complaint = complaints.find(c => c.id === complaintId);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-background flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Complaint Not Found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 mr-1" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case 'rejected': return <XCircle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20';
      default: return 'text-gray-600 bg-gray-50 border-gray-100 dark:bg-gray-500/10 dark:border-gray-500/20';
    }
  };

  const handleAssign = (assignee: string) => {
    const newAssignedTo = assignee === 'unassigned' ? null : assignee;
    assignComplaint(complaint.id, newAssignedTo);
    toast({
      title: 'Assignment Updated',
      description: `Complaint has been ${newAssignedTo ? 'assigned to ' + newAssignedTo : 'unassigned'}.`
    });
  };

  const handleStatusUpdate = (newStatus: any) => {
    updateComplaintStatus(complaint.id, newStatus);
    toast({
      title: 'Status Updated',
      description: `Complaint status changed to ${newStatus.replace('-', ' ')}.`
    });
  };

  const handleSendResponse = () => {
    if (responseText.trim()) {
      addResponse(complaint.id, {
        senderName: 'System Admin',
        senderRole: 'Admin',
        text: responseText
      });
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the student automatically.'
      });
      setResponseText('');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background pb-12">
      {/* Premium Header */}
      <div className="bg-white dark:bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mr-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full w-10 h-10 p-0"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </Button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {complaint.id}
                </h1>
                <Badge variant="outline" className={`capitalize px-3 py-1 flex items-center ${getStatusColor(complaint.status)}`}>
                  {getStatusIcon(complaint.status)}
                  {complaint.status.replace('-', ' ')}
                </Badge>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Submitted by {complaint.studentName} ({complaint.matricNo}) on {new Date(complaint.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Detail Area */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Title & Description Card */}
            <Card className="border-0 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden rounded-2xl relative bg-white dark:bg-card">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
              <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className={`capitalize ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority} Priority
                    </Badge>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                      {complaint.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400 font-medium">
                  <FileText className="w-5 h-5" />
                  <h3>Complaint Description</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] border border-slate-100 dark:border-slate-800">
                  {complaint.description}
                </div>
              </CardContent>
            </Card>

            {/* Response Section */}
            <Card className="border-0 shadow-lg shadow-slate-200/40 dark:shadow-none rounded-2xl bg-white dark:bg-card">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100 text-lg">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Previous Messages */}
                <div className="space-y-4">
                  {complaint.responses && complaint.responses.length > 0 ? (
                    complaint.responses.map(response => (
                      <div key={response.id} className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-5 border border-indigo-100 dark:border-indigo-500/20">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 ring-2 ring-white dark:ring-slate-950 shadow-sm">
                              <AvatarFallback className="bg-indigo-600 text-white text-xs">
                                {response.senderRole === 'Admin' ? 'AD' : response.senderRole === 'Staff' ? 'ST' : 'US'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{response.senderName}</span>
                          </div>
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(response.date).toLocaleDateString()} at {new Date(response.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm pl-10">
                          {response.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p>No communications yet. Start the conversation below.</p>
                    </div>
                  )}
                </div>

                {/* Reply Box */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 relative">
                  <Label className="sr-only">Reply to student</Label>
                  <Textarea
                    placeholder="Type your official response to the student here..."
                    className="min-h-[120px] resize-none bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus-visible:ring-indigo-500 focus-visible:border-indigo-500 placeholder:text-slate-400 p-4"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <Button 
                      onClick={handleSendResponse}
                      disabled={!responseText.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none transition-all rounded-full px-6"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            
            {/* Student Profile Card */}
            <Card className="border-0 shadow-lg shadow-slate-200/40 dark:shadow-none bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="w-20 h-20 ring-4 ring-white/20 shadow-xl">
                    <AvatarFallback className="bg-white/10 text-2xl font-bold">
                      {complaint.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{complaint.studentName}</h2>
                    <p className="text-indigo-200 font-medium">{complaint.matricNo}</p>
                  </div>
                </div>
                
                <div className="mt-8 space-y-4 bg-black/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-indigo-100 text-sm">
                    <Building className="w-4 h-4 text-indigo-300" />
                    <span>{complaint.department}</span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-100 text-sm">
                    <FileText className="w-4 h-4 text-indigo-300" />
                    <span>{complaint.category} Issue</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-0 shadow-lg shadow-slate-200/40 dark:shadow-none rounded-2xl bg-white dark:bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Assignment Dropdown */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Current Assignee</Label>
                  <Select 
                    value={complaint.assignedTo || 'unassigned'} 
                    onValueChange={handleAssign}
                  >
                    <SelectTrigger className="w-full h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-indigo-500">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-500" />
                        <SelectValue placeholder="Select staff member" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      <SelectItem value="unassigned" className="text-slate-500 italic font-medium">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.name}>
                          {user.name} ({user.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Dropdown */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Label className="text-xs font-bold tracking-wider text-slate-500 uppercase">Update Status</Label>
                  <Select 
                    value={complaint.status} 
                    onValueChange={handleStatusUpdate}
                  >
                    <SelectTrigger className="w-full h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-indigo-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                      <SelectItem value="pending" className="font-medium text-amber-600">Pending</SelectItem>
                      <SelectItem value="in-progress" className="font-medium text-blue-600">In Progress</SelectItem>
                      <SelectItem value="resolved" className="font-medium text-emerald-600">Resolved</SelectItem>
                      <SelectItem value="rejected" className="font-medium text-rose-600">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintDetail;
