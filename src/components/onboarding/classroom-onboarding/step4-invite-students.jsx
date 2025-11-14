'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { inviteStudents } from '@/actions/classroom/invite-students';

export function Step4InviteStudents({
  formData,
  onComplete,
  onNext,
  classroomId,
  onSkip,
  isLoading,
  setIsLoading,
}) {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState([]);

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (emails.includes(email)) {
      toast.error('This email is already added');
      return;
    }

    setEmails([...emails, email]);
    setEmailInput('');
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSendInvites = async () => {
    if (emails.length === 0) {
      toast.error('Please add at least one email address');
      return;
    }

    if (!classroomId) {
      toast.error('Classroom ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await inviteStudents(classroomId, emails);

      if (error) {
        toast.error(error);
        return;
      }

      const successCount = data.results.filter((r) => r.success).length;
      onComplete({ studentEmails: emails });
      toast.success(`Invitations sent to ${successCount} student(s)!`);
      onNext();
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error('Failed to send invitations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Invite students to join your classroom. You can also do this later
          from the classroom dashboard.
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email-input">Student Email Addresses</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="email-input"
                type="email"
                placeholder="student@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="h-12"
              />
              <Button
                type="button"
                onClick={handleAddEmail}
                disabled={isLoading || !emailInput.trim()}
                className="h-12"
              >
                <Mail className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {emails.length > 0 && (
            <div className="space-y-2">
              <Label>Added Emails ({emails.length})</Label>
              <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50 min-h-[100px]">
                {emails.map((email) => (
                  <Badge
                    key={email}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(email)}
                      className="ml-1 hover:text-red-600"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          disabled={isLoading}
        >
          Skip for now
        </Button>
        <div className="flex gap-2">
          {emails.length > 0 && (
            <Button
              onClick={handleSendInvites}
              disabled={isLoading || emails.length === 0}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Invitations
                  <Mail className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

