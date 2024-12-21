import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  User,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const CandidateDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidate } = location.state || {};

  if (!candidate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">No candidate data found</p>
      </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelect = () => {
    // Add your select logic here
    console.log('Candidate selected:', candidate.fullName);
  };

  const handleReject = () => {
    // Add your reject logic here
    console.log('Candidate rejected:', candidate.fullName);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Section */}
      <div className="w-3/12 bg-muted">
        <div className="p-1">
          <Button
            variant="ghost"
            className="flex items-center gap-1 mb-1 hover:bg-gray-200"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="p-2">
          <Card className="border-none shadow-lg">
            <CardHeader className="py-2 px-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <CardTitle className="text-lg">{candidate.fullName}</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="px-4 py-2">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Date of Birth</span>
                  </div>
                  <p className="text-sm font-medium">{candidate.dob}</p>
                </div>

                <Separator className="my-1" />

                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Mail className="h-3 w-3" />
                    <span>Email Address</span>
                  </div>
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>

                <Separator className="my-1" />

                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Phone className="h-3 w-3" />
                    <span>Phone Number</span>
                  </div>
                  <p className="text-sm font-medium">{candidate.contactNo}</p>
                </div>

                <Separator className="my-1" />

                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Globe className="h-3 w-3" />
                    <span>Country</span>
                  </div>
                  <p className="text-sm font-medium">{candidate.country}</p>
                </div>

                <Separator className="my-1" />

                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Linkedin className="h-3 w-3" />
                    <span>LinkedIn Profile</span>
                  </div>
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Profile
                  </a>
                </div>

                <Separator className="my-1" />

                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <Github className="h-3 w-3" />
                    <span>GitHub Profile</span>
                  </div>
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Profile
                  </a>
                </div>

                <Separator className="my-1" />

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSelect}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Select
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleReject}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-9/12 h-screen">
  {candidate.resumeUrl ? (
    <div className="h-full pt-0">
      <iframe
        src={candidate.resumeUrl}
        title="Candidate Resume"
        className="w-full h-screen border rounded-md shadow-md"
      />
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500">No resume available</p>
    </div>
  )}
</div>

    </div>
  );
};

export default CandidateDetails;