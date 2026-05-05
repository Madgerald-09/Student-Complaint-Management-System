import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ResponseItem {
  id: string;
  senderName: string;
  senderRole: string;
  text: string;
  date: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  date: string;
  description: string;
  studentName: string;
  matricNo: string;
  department: string;
  assignedTo: string | null;
  responses: ResponseItem[];
}

interface ComplaintContextType {
  complaints: Complaint[];
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  assignComplaint: (id: string, assignee: string | null) => void;
  addResponse: (id: string, response: Omit<ResponseItem, 'id' | 'date'>) => void;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'date' | 'responses' | 'assignedTo'>) => void;
}

const initialComplaints: Complaint[] = [
  {
    id: 'CMP001',
    title: 'Wi-Fi Connectivity Issues in Dormitory',
    category: 'Infrastructure',
    status: 'in-progress',
    priority: 'high',
    date: '2024-01-15',
    description: 'The Wi-Fi in Building C has been extremely slow and frequently disconnects. This is affecting my ability to attend online classes and complete assignments.',
    studentName: 'John Doe',
    matricNo: 'STU12345',
    department: 'IT Services',
    assignedTo: 'Mike Johnson',
    responses: [
      {
        id: 'r1',
        senderName: 'System Admin',
        senderRole: 'Admin',
        text: 'We\'ve received your complaint and will assign it to the IT department for immediate resolution.',
        date: '2024-01-15T10:30:00Z'
      }
    ]
  },
  {
    id: 'CMP002',
    title: 'Cafeteria Food Quality Concern',
    category: 'Food Services',
    status: 'resolved',
    priority: 'medium',
    date: '2024-01-10',
    description: 'The food quality in the main cafeteria has declined significantly. Multiple students have reported finding undercooked meals.',
    studentName: 'Sarah Smith',
    matricNo: 'STU12346',
    department: 'Food Services',
    assignedTo: 'Lisa Chen',
    responses: [
      {
        id: 'r2',
        senderName: 'Lisa Chen',
        senderRole: 'Staff',
        text: 'We take this very seriously. We have addressed the vendor regarding the undercooked meals.',
        date: '2024-01-11T14:15:00Z'
      }
    ]
  },
  {
    id: 'CMP003',
    title: 'Library Extended Hours Request',
    category: 'Academic Facilities',
    status: 'pending',
    priority: 'low',
    date: '2024-01-18',
    description: 'Request to extend library hours during exam period until midnight.',
    studentName: 'Michael Brown',
    matricNo: 'STU12347',
    department: 'Library Services',
    assignedTo: null,
    responses: []
  },
  {
    id: 'CMP004',
    title: 'Parking Space Allocation Issue',
    category: 'Transportation',
    status: 'resolved',
    priority: 'medium',
    date: '2024-01-05',
    description: 'Unable to find parking despite having a valid permit. Need additional parking spaces for commuter students.',
    studentName: 'Emily Davis',
    matricNo: 'STU12348',
    department: 'Facilities',
    assignedTo: 'Tom Wilson',
    responses: []
  },
  {
    id: 'CMP005',
    title: 'Classroom Projector Not Working',
    category: 'Infrastructure',
    status: 'pending',
    priority: 'high',
    date: '2024-01-19',
    description: 'The projector in Room 302 has not been working for 3 days, affecting lectures.',
    studentName: 'Alex Johnson',
    matricNo: 'STU12349',
    department: 'IT Services',
    assignedTo: null,
    responses: []
  }
];

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('complaints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse complaints from local storage");
      }
    }
    return initialComplaints;
  });

  useEffect(() => {
    localStorage.setItem('complaints', JSON.stringify(complaints));
  }, [complaints]);

  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const assignComplaint = (id: string, assignee: string | null) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, assignedTo: assignee } : c));
  };

  const addResponse = (id: string, response: Omit<ResponseItem, 'id' | 'date'>) => {
    const newResponse: ResponseItem = {
      ...response,
      id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString()
    };
    
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          responses: [...c.responses, newResponse]
        };
      }
      return c;
    }));
  };

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'status' | 'date' | 'responses' | 'assignedTo'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: `CMP00${complaints.length + 1}`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      assignedTo: null,
      responses: []
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  return (
    <ComplaintContext.Provider value={{ complaints, updateComplaintStatus, assignComplaint, addResponse, addComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};
