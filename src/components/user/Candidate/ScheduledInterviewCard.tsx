import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { 
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  User,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Video
} from "lucide-react";

const InterviewCard = ({ interviewData }:any) => {
    const { candidate, selectionStatus, meetUrl, date, time, job } = interviewData;
  
    const handleMeetingJoin = () => {
      if (meetUrl) {
        window.open(meetUrl, '_blank');
      }
    };
  
    const handleLinkedIn = () => {
      if (candidate.linkedin) {
        window.open(candidate.linkedin, '_blank');
      }
    };
  
    const handleGithub = () => {
      if (candidate.github) {
        window.open(candidate.github, '_blank');
      }
    };
  
    const handleResume = () => {
      if (candidate.resumeUrl) {
        window.open(candidate.resumeUrl, '_blank');
      }
    };
  
    return (
      <Card className="w-full max-w-xl bg-black text-white border-gray-700">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-xl font-semibold">{candidate.fullName}</span>
            </div>
            <span className="px-3 py-1 text-sm bg-green-800 text-green-200 rounded-full">
              {selectionStatus}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{job.jobTitle}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">{job.jobLevel}</span>
          </div>
        </CardHeader>
  
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{job.jobLocation}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{candidate.country}</span>
            </div>
          </div>
  
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{candidate.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{candidate.contactNo}</span>
            </div>
          </div>
        </CardContent>
  
        <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-gray-800">
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleLinkedIn}
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleGithub}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleResume}
            >
              View Resume
            </Button>
          </div>
          
          <Button 
            variant="default" 
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
            onClick={handleMeetingJoin}
          >
            <Video className="w-4 h-4 mr-2" />
            {'Join Meeting'}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  export default InterviewCard;