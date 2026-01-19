import { useState, useEffect } from 'react';
import { Card } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Textarea } from './ui/textarea.jsx';

// Main component
export default function LoginFlow({ onComplete, initialFlowState }) {
  // Sets the starting step based on whether the user was redirected from LinkedIn
  const [currentStep, setCurrentStep] = useState(initialFlowState.step);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // A single state object for all form data.
  const [formData, setFormData] = useState({
    id: null,
    email: '',
    fullName: '',
    collegeName: '',
    yearOfStudy: '1st Year',
    department: 'Computer Science',
    skills: [],
    rolesOpenTo: [],
    goals: '',
    excitingTags: [],
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    profilePicUrl: '',
  });

  // Pre-populates the form with data fetched after the LinkedIn redirect
  useEffect(() => {
    if (initialFlowState.data) {
      setFormData(prev => ({ ...prev, ...initialFlowState.data }));
    }
  }, [initialFlowState]);

  const [emailValid, setEmailValid] = useState(false);

  // --- Options ---
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG/Masters', 'PhD'];
  const departmentOptions = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Other'];
  const skillOptions = ['React', 'Python', 'JavaScript', 'Node.js', 'Java', 'C++', 'UI/UX Design', 'AI/ML'];
  const roleOptions = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer'];
  const excitingTagsOptions = ['AI x Health', 'Startup x Campus', 'Social Impact', 'FinTech', 'EdTech'];

  // --- INPUT HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    validateCollegeEmail(email);
  };

  const toggleArrayItem = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(item => item !== value) : [...prev[field], value]
    }));
  };

  // --- BACKEND API CALLS ---
  const handleCollegeEmailSubmit = async () => {
    if (!emailValid) return;
    setIsLoading(true);
    setError('');
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock successful registration
      const mockUser = {
        id: 'temp-' + Date.now(),
        email: formData.email,
        collegeName: formData.collegeName
      };
      setFormData(prev => ({ ...prev, ...mockUser }));
      setCurrentStep('linkedin');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock successful profile update
      const finalUser = {
        ...formData,
        badges: ['Core Looped ⭐'],
        level: 1,
        xp: 50,
        totalXP: 100,
        isModerator: true // <-- Kept this line for testing moderator features
      };
      setFormData(finalUser);
      setCurrentStep('success');
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => onComplete(formData);

  const validateCollegeEmail = (email) => {
    const collegePattern = /^[^\s@]+@[^\s@]+\.(edu|ac\.in|edu\.in)$/i;
    const isValid = collegePattern.test(email);
    setEmailValid(isValid);
    if (isValid) {
      const domain = email.split('@')[1];
      const collegeName = domain.split('.')[0].toUpperCase().replace(/[^A-Z]/g, ' ');
      setFormData(prev => ({ ...prev, email, collegeName }));
    } else {
      setFormData(prev => ({ ...prev, email }));
    }
  };

  // --- RENDER METHODS ---
  if (currentStep === 'login') {
    return (
      <div className="flow-login-signup min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 flex items-center justify-center p-4">
        <Card className="frame-login-start w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="logo-looped w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center"><span className="text-white text-2xl font-bold">L</span></div>
            <h1 className="title-welcome-msg text-3xl font-bold mb-2">Welcome to Looped 🚀</h1>
            <p className="text-muted-foreground">Connect, collaborate, and build amazing things together</p>
          </div>
          <div className="space-y-6">
            <div>
              <Input
                className="input-college-email"
                placeholder="Enter your college email (e.g. you@iitb.ac.in)"
                value={formData.email}
                onChange={handleEmailChange}
                onKeyDown={(e) => e.key === 'Enter' && emailValid && handleCollegeEmailSubmit()}
              />
              {formData.email && !emailValid && (<p className="text-destructive text-sm mt-1">Please enter a valid college email.</p>)}
              {emailValid && (<p className="text-green-600 text-sm mt-1">✓ Valid college email detected</p>)}
              {error && <p className="text-destructive text-sm mt-1">{error}</p>}
            </div>
            <Button className="btn-signin w-full" onClick={handleCollegeEmailSubmit} disabled={!emailValid || isLoading}>
              {isLoading ? 'Verifying...' : 'Sign In with College Email'}
            </Button>
            <p className="note-college-validation text-sm text-muted-foreground text-center">Only .edu or college domains allowed</p>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === 'linkedin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="frame-linkedin-connect w-full max-w-md p-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center"><span className="text-white text-2xl">⚡</span></div>
            <h2 className="title-linkedin-fetch text-2xl font-bold mb-2">Let's make it fast!</h2>
            <p className="text-subtext text-muted-foreground">We'll pull your name and profile pic from your LinkedIn account.</p>
          </div>
          <div className="space-y-4">
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setError("LinkedIn integration will be available soon. Click 'Skip for now' to continue.");
              }}
            >
              <span className="mr-2">💼</span>
              Connect with LinkedIn
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setCurrentStep('step1')}
              disabled={isLoading}
            >
              Skip for now
            </Button>
            <p className="text-sm text-muted-foreground">
              Your email: {formData.email}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Multi-step profile form
  return (
    <form onSubmit={handleProfileSubmit}>
      {currentStep === 'step1' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="frame-profile-builder-step1 w-full max-w-2xl p-8">
            <div className="mb-8"><h2 className="title-step1 text-2xl font-bold mb-2">Step 1: Basic Info</h2><div className="w-full bg-muted rounded-full h-2 mb-4"><div className="bg-primary h-2 rounded-full w-1/4"></div></div></div>
            <div className="space-y-6">
              <div><label className="block font-medium mb-2">Full Name</label><Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" /></div>
              <div><label className="block font-medium mb-2">College Name</label><Input name="collegeName" value={formData.collegeName} disabled /><p className="text-sm text-muted-foreground mt-1">Detected from your email domain</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block font-medium mb-2">Year of Study</label><select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleInputChange} className="dropdown-year-of-study w-full p-3 border border-border rounded-lg"><option value="">Select year</option>{yearOptions.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                <div><label className="block font-medium mb-2">Department</label><select name="department" value={formData.department} onChange={handleInputChange} className="dropdown-department w-full p-3 border border-border rounded-lg"><option value="">Select department</option>{departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              </div>
              <div><label className="block font-medium mb-2">Profile Picture</label><div className="upload-profile-pic border-2 border-dashed border-border rounded-lg p-6 text-center"><div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">{formData.profilePicUrl ? <img src={formData.profilePicUrl} alt="Profile" className="rounded-full w-full h-full object-cover" /> : (formData.fullName.charAt(0) || 'U')}</div><Button type="button" variant="outline" size="sm">📸 Upload Photo</Button><p className="text-sm text-muted-foreground mt-2">JPG, PNG up to 5MB</p></div></div>
              <Button type="button" className="btn-next-step w-full" onClick={() => setCurrentStep('step2')} disabled={!formData.fullName || !formData.yearOfStudy || !formData.department}>Next →</Button>
            </div>
          </Card>
        </div>
      )}
      {currentStep === 'step2' && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl p-8">
            <div className="mb-8"><h2 className="text-2xl font-bold mb-2">Step 2: Skills & Proof</h2><div className="w-full bg-muted rounded-full h-2 mb-4"><div className="bg-primary h-2 rounded-full w-1/2"></div></div></div>
            <div className="space-y-8">
              <div><label className="block font-medium mb-4">Select Your Skills</label><div className="flex flex-wrap gap-2 mb-4">{skillOptions.map(s => <button type="button" key={s} onClick={() => toggleArrayItem('skills', s)} className={`px-4 py-2 rounded-lg border transition-all ${formData.skills.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'}`}>{s}</button>)}</div></div>
              <Button type="button" className="w-full" onClick={() => setCurrentStep('step3')} disabled={formData.skills.length === 0}>Next →</Button>
            </div>
          </Card>
        </div>
      )}
      {currentStep === 'step3' && (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl p-8">
            <div className="mb-8"><h2 className="text-2xl font-bold mb-2">Step 3: Roles & Interests</h2><div className="w-full bg-muted rounded-full h-2 mb-4"><div className="bg-primary h-2 rounded-full w-3/4"></div></div></div>
            <div className="space-y-8">
              <div><label className="block font-medium mb-4">Roles You're Open To</label><div className="flex flex-wrap gap-2">{roleOptions.map(r => <button type="button" key={r} onClick={() => toggleArrayItem('rolesOpenTo', r)} className={`px-4 py-2 rounded-lg border transition-all ${formData.rolesOpenTo.includes(r) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:bg-muted'}`}>{r}</button>)}</div></div>
              <div><label className="block font-medium mb-2">Goals for This Semester</label><Textarea name="goals" value={formData.goals} onChange={handleInputChange} placeholder="What do you want to build..." rows={4} /></div>
              <div><label className="block font-medium mb-4">What Excites You?</label><div className="flex flex-wrap gap-2">{excitingTagsOptions.map(t => <button type="button" key={t} onClick={() => toggleArrayItem('excitingTags', t)} className={`px-4 py-2 rounded-lg border transition-all ${formData.excitingTags.includes(t) ? 'bg-purple-600 text-white border-purple-600' : 'bg-background border-border hover:bg-muted'}`}>✨ {t}</button>)}</div></div>
              <Button type="button" className="w-full" onClick={() => setCurrentStep('step4')} disabled={formData.rolesOpenTo.length === 0 || !formData.goals.trim()}>Next →</Button>
            </div>
          </Card>
        </div>
      )}
      {currentStep === 'step4' && (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl p-8">
            <div className="mb-8"><h2 className="text-2xl font-bold mb-2">Step 4: Final Touches</h2><div className="w-full bg-muted rounded-full h-2 mb-4"><div className="bg-primary h-2 rounded-full w-full"></div></div></div>
            <div className="space-y-6">
              <div><label className="block font-medium mb-2">GitHub Profile</label><Input name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} placeholder="https://github.com/yourusername" /></div>
              <div><label className="block font-medium mb-2">Portfolio Website</label><Input name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://yourportfolio.com" /></div>
              <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" disabled={isLoading}>{isLoading ? 'Saving...' : '🚀 Complete Profile'}</Button>
            </div>
          </Card>
        </div>
      )}
      {currentStep === 'success' && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="frame-profile-complete-success w-full max-w-lg p-8 text-center">
            <div className="mb-8"><div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse"><span className="text-white text-4xl">🎉</span></div><h2 className="title text-3xl font-bold mb-2">🎉 You're Looped In!</h2><p className="text-muted-foreground mb-4">Welcome to the Looped community! Your profile is complete.</p></div>
            <div className="mb-8"><div className="text-badge-earned bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-4"><div className="text-2xl mb-2">⭐</div><p className="font-medium text-yellow-800">Badge Earned: Core Looped</p><p className="text-sm text-yellow-700">Successfully completed your profile setup</p></div></div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div><div className="font-semibold text-lg text-blue-600">{formData.skills.length}</div><div className="text-muted-foreground">Skills Added</div></div>
                <div><div className="font-semibold text-lg text-green-600">{formData.rolesOpenTo.length}</div><div className="text-muted-foreground">Roles Open To</div></div>
                <div><div className="font-semibold text-lg text-purple-600">100%</div><div className="text-muted-foreground">Profile Complete</div></div>
              </div>
              <Button
                type="button"
                onClick={goToDashboard}
                className="btn-go-to-dashboard w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                🚀 Go to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      )}
    </form>
  );
}