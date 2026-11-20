import React, { useState } from 'react';
import { Shield, KeyRound, Mail, User, Check, AlertCircle, AtSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUpdateAdminProfile } from '../../hooks/useMenu';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toFriendlyErrorMessage } from '../../utils/friendlyErrors';

interface AccountSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSecurityModal: React.FC<AccountSecurityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUser } = useAuth();
  const updateProfileMutation = useUpdateAdminProfile();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || 'admin');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync initial state when modal opens
  React.useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setUsername(user.username || 'admin');
      setEmail(user.email || '');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!username.trim()) {
      setErrorMessage('Admin username is required.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    try {
      const res = await updateProfileMutation.mutateAsync({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (res?.admin) {
        updateUser(res.admin, res.token);
      }

      setSuccessMessage('Account credentials updated! New login details are now active.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: any) {
      setErrorMessage(
        toFriendlyErrorMessage(
          err,
          "We couldn't update your account details. Please double-check your current password and try again."
        )
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Account & Security"
      subtitle="Update your administrator credentials, username, and login password"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-green-950/40 border border-green-500/30 rounded-xl text-green-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-green-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Name, Username & Email */}
        <div className="space-y-3">
          <Input
            label="Display Name"
            placeholder="e.g. Kabun Manager"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            leftIcon={<User className="w-4 h-4 text-[#C5D5D3]" />}
          />

          <div>
            <Input
              label="Admin Username (Login ID)"
              placeholder="e.g. admin or kabun"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              leftIcon={<AtSign className="w-4 h-4 text-[#C5D5D3]" />}
            />
            <p className="mt-1 text-[11px] text-[#A2B8B5]">
              You can log in at <span className="text-[#E5CFAF] font-mono">/admin/login</span> using this username.
            </p>
          </div>

          <Input
            label="Admin Email Address"
            type="email"
            placeholder="admin@kabuncoffee.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4 text-[#C5D5D3]" />}
          />
        </div>

        {/* Password Change Section */}
        <div className="pt-3 border-t border-[#1D4D47] space-y-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#E5CFAF]" />
            <span className="font-headline text-xs uppercase tracking-wider text-white font-bold">
              Change Password (Optional)
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0B2523] border border-[#1D4D47] text-[11px] text-[#C5D5D3] leading-relaxed">
            Leave blank if keeping current password. Whenever you save a new password, your <span className="text-[#FAF7F2] font-semibold">old password is permanently removed</span> and cannot be used to log in.
          </div>

          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password to verify"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1D4D47]">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="yellow"
            type="submit"
            isLoading={updateProfileMutation.isPending}
            leftIcon={<Shield className="w-4 h-4 text-[#0E2F2C]" />}
          >
            Save Account
          </Button>
        </div>
      </form>
    </Modal>
  );
};

