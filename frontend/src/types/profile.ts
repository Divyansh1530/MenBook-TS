export interface ProfileForm {
  name: string;
  bio: string;
  expertise: string;
  title: string;
  pricing: string;
  experience: string;
  linkedin: string;
  portfolio: string;
}

export interface PasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}