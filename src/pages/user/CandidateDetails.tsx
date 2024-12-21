import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectCandidate, rejectCandidate } from '../../service/Api/candidateApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  Mail,
  User,
  Phone,
  Globe,
  Linkedin,
  Github,
} from 'lucide-react';
import { useToast } from '../../@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

const CandidateDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { candidate } = location.state || {};
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSelectDialogOpen, setSelectDialogOpen] = useState(false);

  const selectMutation = useMutation({
    mutationFn: selectCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Candidate Selected',
        description: `${candidate.fullName} has been selected successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        description: `Failed to select candidate: ${error.message}`,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      toast({
        title: 'Candidate Rejected',
        description: `${candidate.fullName} has been rejected.`,
      });
      navigate(-1);
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        description: `Failed to reject candidate: ${error.message}`,
      });
    },
  });

  const handleSelect = () => {
    selectMutation.mutate({ candidateId: candidate.id });
    setSelectDialogOpen(false); // Close dialog after action
  };

  const handleReject = () => {
    rejectMutation.mutate({ candidateId: candidate.id });
    setDeleteDialogOpen(false); // Close dialog after action
  };

  const handleBack = () => navigate(-1);

  if (!candidate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-medium text-gray-600">No candidate data found</p>
      </div>
    );
  }

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
                  <AlertDialog open={isSelectDialogOpen} onOpenChange={setSelectDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Select
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Selection</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to select this candidate?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectDialogOpen(false)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleSelect}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently reject the candidate and remove them from your list.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleReject}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-9/12 h-screen">
        {candidate.resumeUrl ? (
          <iframe
            src={candidate.resumeUrl}
            title="Candidate Resume"
            className="w-full h-full border rounded-md shadow-md"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-lg text-gray-500">
            No Resume Available
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetails;
