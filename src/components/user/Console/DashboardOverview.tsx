import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clock, Users, Briefcase, FileText, Calendar, ArrowUpRight, ArrowDownRight, Activity, MapPin, Video, User, Phone } from 'lucide-react';

const RecruitmentDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Sample data - in a real app, this would come from your API
  const candidateData = [
    { name: 'Jan', visited: 65, applied: 42, hired: 8 },
    { name: 'Feb', visited: 59, applied: 39, hired: 10 },
    { name: 'Mar', visited: 80, applied: 48, hired: 12 },
    { name: 'Apr', visited: 81, applied: 52, hired: 15 },
    { name: 'May', visited: 56, applied: 35, hired: 9 },
    { name: 'Jun', visited: 75, applied: 49, hired: 14 },
    { name: 'Jul', visited: 92, applied: 65, hired: 16 },
  ];

  const jobRequirements = [
    { name: 'Software Engineer', count: 12, fill: '#1a1a1a' },
    { name: 'Product Manager', count: 8, fill: '#333333' },
    { name: 'UX Designer', count: 6, fill: '#4d4d4d' },
    { name: 'Data Analyst', count: 9, fill: '#666666' },
    { name: 'DevOps', count: 5, fill: '#808080' },
  ];

  const sourcesData = [
    { name: 'LinkedIn', value: 45 },
    { name: 'Indeed', value: 25 },
    { name: 'Referrals', value: 15 },
    { name: 'Company Site', value: 10 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666'];

  const upcomingInterviews = [
    { 
      candidate: "Alex Johnson", 
      position: "Senior Developer", 
      time: "10:00 AM",
      interviewType: "Technical",
      duration: "60 min",
      location: "Online / Zoom",
      interviewers: ["Sarah Chen", "Mark Williams"],
      avatar: "/api/placeholder/32/32",
      resumeLink: "#",
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "alex.johnson@example.com"
    },
    {
      candidate: "Maya Patel",
      position: "UX Designer",
      time: "1:30 PM",
      interviewType: "Portfolio Review",
      duration: "45 min",
      location: "Office HQ / Room 305",
      interviewers: ["David Kim"],
      avatar: "/api/placeholder/32/32"
    },
    {
      candidate: "Sam Taylor",
      position: "Product Manager",
      time: "3:00 PM",
      interviewType: "Final Round",
      duration: "90 min",
      location: "Online / Google Meet",
      interviewers: ["Jennifer Lopez", "Robert Singh", "Tina Ford"],
      avatar: "/api/placeholder/32/32"
    },
    {
      candidate: "Jordan Lee",
      position: "Data Scientist",
      time: "4:15 PM",
      interviewType: "Technical Assessment",
      duration: "60 min",
      location: "Office HQ / Room 210",
      interviewers: ["Michael Brown"],
      avatar: "/api/placeholder/32/32"
    }
  ];

  // Calculate time until tomorrow's first interview
  const calculateTimeUntilTomorrow = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // Setting to 10:00 AM tomorrow
    
    const diffTime = tomorrow.getTime() - now.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours: diffHours, minutes: diffMinutes };
  };

  const { hours, minutes } = calculateTimeUntilTomorrow();

  // Format for tooltip
  const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any[], label: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md">
          <p className="font-bold">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 bg-white text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Recruitment Dashboard</h1>
          <p className="text-gray-500">Real-time recruitment analytics</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="text-xl font-medium">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Total Candidates Visited
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold">468</div>
                <div className="flex items-center text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candidateData.slice(-5)}>
                    <Line type="monotone" dataKey="visited" stroke="#000000" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Applications Received
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold">301</div>
                <div className="flex items-center text-xs text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+8% from last month</span>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candidateData.slice(-5)}>
                    <Line type="monotone" dataKey="applied" stroke="#000000" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Open Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-3xl font-bold">40</div>
                <div className="flex items-center text-xs text-emerald-600">
                  <span>5 new this month</span>
                </div>
              </div>
              <div className="h-12 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobRequirements.slice(0, 5)}>
                    <Bar dataKey="count" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
       
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recruitment Pipeline</CardTitle>
            <CardDescription>Candidates visited vs. applications received vs. hired</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={candidateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip active={false} payload={[]} label={''} />} />
                <Legend />
                <Line type="monotone" dataKey="visited" stroke="#000000" strokeWidth={2} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="applied" stroke="#666666" strokeWidth={2} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="hired" stroke="#a3a3a3" strokeWidth={2} dot={{ r: 4, strokeWidth: 1 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Interviews Tomorrow
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="text-4xl font-bold">4</div>
              <div className="bg-black text-white p-2 rounded-md flex items-center text-sm font-medium">
          <Clock className="h-4 w-4 mr-1" />
          <span>{hours}h {minutes}m until first interview</span>
              </div>
            </div>
            
            {upcomingInterviews.length > 0 && (
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{upcomingInterviews[0].candidate}</h3>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 font-medium">{upcomingInterviews[0].position}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">{upcomingInterviews[0].duration}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 my-3">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-semibold">{upcomingInterviews[0].time}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {upcomingInterviews[0].location.includes("Online") ? (
                <Video className="h-4 w-4 mr-2 text-gray-500" />
              ) : (
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              )}
              <span>{upcomingInterviews[0].location}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 mr-2">Interviewers:</span>
              <div className="flex">
                {upcomingInterviews[0].interviewers.map((interviewer, idx) => (
            <div key={idx} className="flex items-center mr-3">
              <User className="h-3 w-3 mr-1 text-gray-500" />
              <span className="text-xs text-gray-600">{interviewer}</span>
            </div>
                ))}
              </div>
            </div>
            
          
          </div>
              </div>
            )}

            <div className="text-xs text-gray-500 text-right flex items-center justify-end cursor-pointer hover:text-black">
              <span>View full schedule</span>
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Job Requirements</CardTitle>
            <CardDescription>Open positions by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobRequirements} layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {jobRequirements.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tomorrow's Interviews</CardTitle>
              <CardDescription>Scheduled for {new Date(currentTime.getTime() + 86400000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</CardDescription>
            </div>
            <div className="bg-black text-white p-2 rounded-md flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{hours}h {minutes}m</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingInterviews.map((interview, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
                  <img src={interview.avatar} alt="candidate" className="w-10 h-10 rounded-full mr-4" />
                  <div className="flex-1">
                    <h3 className="font-bold">{interview.candidate}</h3>
                    <p className="text-sm text-gray-600">{interview.position}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm px-3 py-1 bg-black text-white rounded-full">{interview.interviewType}</span>
                    <span className="font-medium text-gray-800">{interview.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;