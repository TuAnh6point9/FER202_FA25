import React from 'react';
import ProfileWizard from '../components/ProfileWizard';

export default function AccountPage() {
  return (
    <div className="container mt-4">
      <ProfileWizard show={true} onClose={(data)=>{ console.log('profile data', data); alert('Profile saved (mock)'); }} />
    </div>
  );
}
