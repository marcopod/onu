"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Heart,
  Phone,
  Activity,
  Pill,
  Brain,
  Shield,
  FileText,
  Image,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Settings
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CompleteProfile {
  user: {
    id: number;
    email: string;
    fullName: string;
    isVerified: boolean;
    createdAt: string;
    lastLogin: string;
  };
  profile: {
    age: number;
    gender: string;
    sexualOrientation: string;
    address: string;
    educationLevel: string;
    occupation: string;
    hobbies: string;
    frequentPlaces: string;
    identityDocumentUrl: string;
    profilePhotoUrl: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    createdAt: string;
  }>;
  physicalHealth: {
    weight: number;
    height: number;
    bloodType: string;
    hasDisability: boolean;
    disabilityDescription: string;
    chronicConditions: string;
    allergies: {
      medical: string;
      food: string;
      environmental: string;
    };
    createdAt: string;
    updatedAt: string;
  } | null;
  medications: Array<{
    name: string;
    dose: string;
    frequency: string;
    type: string;
    createdAt: string;
  }>;
  mentalHealth: {
    psychiatricConditions: string;
    hasAnxietyAttacks: boolean;
    anxietyFrequency: string;
    familyHistory: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  harassmentExperiences: Array<{
    id: number;
    category: string;
    location: string;
    incidentDate: string;
    description: string;
    reportedToAuthorities: boolean;
    evidenceFiles: Array<{
      id: number;
      file_url: string;
      file_name: string;
      file_type: string;
      file_size: number;
    }>;
    createdAt: string;
  }>;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<CompleteProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Use cookies for authentication
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch profile data');
        }

        setProfileData(result.data);
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        setError(error.message || 'Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </main>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/" className="text-green-800 mr-4">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800">My Profile</h1>
          </div>
          <div className="flex gap-2">
            
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* User Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-green-500">
                {profileData.profile?.profilePhotoUrl ? (
                  <AvatarImage src={profileData.profile.profilePhotoUrl} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                    {getInitials(profileData.user.fullName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800">{profileData.user.fullName}</h2>
                  {profileData.user.isVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(profileData.user.createdAt)}</span>
                  </div>
                  {profileData.user.lastLogin && (
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>Last login {formatDate(profileData.user.lastLogin)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.profile ? (
                <>
                  {profileData.profile.age && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Age</label>
                      <p className="text-gray-800">{profileData.profile.age} years old</p>
                    </div>
                  )}
                  {profileData.profile.gender && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Gender</label>
                      <p className="text-gray-800 capitalize">{profileData.profile.gender}</p>
                    </div>
                  )}
                  {profileData.profile.sexualOrientation && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sexual Orientation</label>
                      <p className="text-gray-800 capitalize">{profileData.profile.sexualOrientation}</p>
                    </div>
                  )}
                  {profileData.profile.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <p className="text-gray-800">{profileData.profile.address}</p>
                      </div>
                    </div>
                  )}
                  {profileData.profile.educationLevel && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Education Level</label>
                      <p className="text-gray-800 capitalize">{profileData.profile.educationLevel}</p>
                    </div>
                  )}
                  {profileData.profile.occupation && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Occupation</label>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-800">{profileData.profile.occupation}</p>
                      </div>
                    </div>
                  )}
                  {profileData.profile.hobbies && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Hobbies & Interests</label>
                      <p className="text-gray-800">{profileData.profile.hobbies}</p>
                    </div>
                  )}
                  {profileData.profile.frequentPlaces && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Frequent Places</label>
                      <p className="text-gray-800">{profileData.profile.frequentPlaces}</p>
                    </div>
                  )}
                  {profileData.profile.identityDocumentUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Identity Document</label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        <a
                          href={profileData.profile.identityDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 underline"
                        >
                          View Document
                        </a>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">No personal information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileData.emergencyContacts.length > 0 ? (
                <div className="space-y-4">
                  {profileData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{contact.name}</h4>
                        <Badge variant="secondary">{contact.relationship}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{contact.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No emergency contacts added</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Health Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Physical Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Physical Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.physicalHealth ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {profileData.physicalHealth.weight && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Weight</label>
                        <p className="text-gray-800">{profileData.physicalHealth.weight} kg</p>
                      </div>
                    )}
                    {profileData.physicalHealth.height && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Height</label>
                        <p className="text-gray-800">{profileData.physicalHealth.height} cm</p>
                      </div>
                    )}
                  </div>
                  {profileData.physicalHealth.bloodType && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Blood Type</label>
                      <Badge variant="outline" className="ml-2">{profileData.physicalHealth.bloodType}</Badge>
                    </div>
                  )}
                  {profileData.physicalHealth.hasDisability && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Disability Information</label>
                      <p className="text-gray-800">{profileData.physicalHealth.disabilityDescription || 'Has disability (no description provided)'}</p>
                    </div>
                  )}
                  {profileData.physicalHealth.chronicConditions && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Chronic Conditions</label>
                      <p className="text-gray-800">{profileData.physicalHealth.chronicConditions}</p>
                    </div>
                  )}
                  {(profileData.physicalHealth.allergies.medical ||
                    profileData.physicalHealth.allergies.food ||
                    profileData.physicalHealth.allergies.environmental) && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Allergies</label>
                      <div className="space-y-2 mt-2">
                        {profileData.physicalHealth.allergies.medical && (
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">Medical</Badge>
                            <span className="text-gray-800">{profileData.physicalHealth.allergies.medical}</span>
                          </div>
                        )}
                        {profileData.physicalHealth.allergies.food && (
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">Food</Badge>
                            <span className="text-gray-800">{profileData.physicalHealth.allergies.food}</span>
                          </div>
                        )}
                        {profileData.physicalHealth.allergies.environmental && (
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">Environmental</Badge>
                            <span className="text-gray-800">{profileData.physicalHealth.allergies.environmental}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">No physical health information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Mental Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Mental Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData.mentalHealth ? (
                <>
                  {profileData.mentalHealth.psychiatricConditions && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Psychiatric Conditions</label>
                      <p className="text-gray-800">{profileData.mentalHealth.psychiatricConditions}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Anxiety Attacks</label>
                      <p className="text-gray-800">{profileData.mentalHealth.hasAnxietyAttacks ? 'Yes' : 'No'}</p>
                    </div>
                    {profileData.mentalHealth.hasAnxietyAttacks && profileData.mentalHealth.anxietyFrequency && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Frequency</label>
                        <p className="text-gray-800">{profileData.mentalHealth.anxietyFrequency}</p>
                      </div>
                    )}
                  </div>
                  {profileData.mentalHealth.familyHistory && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Family History</label>
                      <p className="text-gray-800">{profileData.mentalHealth.familyHistory}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500 italic">No mental health information provided</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Medications */}
        {profileData.medications.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-500" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.medications.map((medication, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{medication.name}</h4>
                      <Badge variant={medication.type === 'psychiatric' ? 'secondary' : 'outline'}>
                        {medication.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Dose:</span> {medication.dose}</p>
                      <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Harassment Experiences */}
        {profileData.harassmentExperiences.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Harassment Experiences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profileData.harassmentExperiences.map((experience, index) => (
                  <div key={experience.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {experience.category}
                        </Badge>
                        {experience.reportedToAuthorities && (
                          <Badge variant="default" className="bg-blue-500">
                            Reported to Authorities
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(experience.createdAt)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {experience.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{experience.location}</span>
                        </div>
                      )}
                      {experience.incidentDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Incident Date: {formatDate(experience.incidentDate)}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="text-gray-800 mt-1">{experience.description}</p>
                    </div>

                    {experience.evidenceFiles.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Evidence Files</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {experience.evidenceFiles.map((file, fileIndex) => (
                            <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                              {file.file_type.startsWith('image/') ? (
                                <Image className="h-4 w-4 text-green-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-blue-500" />
                              )}
                              <a
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-green-600 hover:text-green-700 underline"
                              >
                                {file.file_name}
                              </a>
                              <span className="text-xs text-gray-500">
                                ({(file.file_size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Completion Status */}
        <Card className="mt-6 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  profileData.user ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <User className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Basic Info</p>
                <p className="text-xs text-gray-500">Complete</p>
              </div>

              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  profileData.profile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Personal</p>
                <p className="text-xs text-gray-500">{profileData.profile ? 'Complete' : 'Incomplete'}</p>
              </div>

              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  profileData.physicalHealth || profileData.mentalHealth ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Heart className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Health</p>
                <p className="text-xs text-gray-500">
                  {profileData.physicalHealth || profileData.mentalHealth ? 'Complete' : 'Incomplete'}
                </p>
              </div>

              <div className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  profileData.emergencyContacts.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Phone className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Contacts</p>
                <p className="text-xs text-gray-500">
                  {profileData.emergencyContacts.length > 0 ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-center gap-4">
              
              <Link href="/settings">
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
