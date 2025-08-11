import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, UserCheck, Database, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 mb-2">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Quick Overview */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Quick Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                SMMS (Social Media Management System) is committed to protecting your privacy. We collect only the information necessary to provide our social media management services, and we never sell your personal data to third parties.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">What we do:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Encrypt your data</li>
                    <li>• Use secure authentication</li>
                    <li>• Give you data control</li>
                    <li>• Follow industry standards</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">What we don't do:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Sell your personal data</li>
                    <li>• Share with unauthorized parties</li>
                    <li>• Store unnecessary information</li>
                    <li>• Track you across other sites</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Account Information</h4>
                <p className="text-gray-700 mb-3">When you create an account, we collect:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Name and email address</li>
                  <li>Company name (optional)</li>
                  <li>Password (encrypted)</li>
                  <li>Profile picture (optional)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Social Media Integration Data</h4>
                <p className="text-gray-700 mb-3">When you connect your social media accounts:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Social media account handles and IDs</li>
                  <li>Access tokens (encrypted)</li>
                  <li>Published posts and analytics data</li>
                  <li>Follower counts and engagement metrics</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Usage Information</h4>
                <p className="text-gray-700 mb-3">We automatically collect:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Log data (IP address, browser type, pages visited)</li>
                  <li>Device information (device type, operating system)</li>
                  <li>Usage patterns and preferences</li>
                  <li>Performance and error data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Provision</h4>
                  <p className="text-gray-700">
                    We use your information to provide, maintain, and improve our social media management services, including posting content, analyzing performance, and managing your social media accounts.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
                  <p className="text-gray-700">
                    We may send you service-related notifications, updates, and promotional emails (you can opt out of promotional emails at any time).
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics and Improvement</h4>
                  <p className="text-gray-700">
                    We analyze usage patterns to improve our services, develop new features, and ensure optimal performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-600" />
                Data Security & Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your data:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Encryption</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Data encrypted in transit (HTTPS/TLS)</li>
                    <li>• Passwords hashed with bcrypt</li>
                    <li>• API keys encrypted at rest</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Access Controls</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Multi-factor authentication</li>
                    <li>• Role-based access control</li>
                    <li>• Regular access reviews</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Infrastructure</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Secure cloud hosting (AWS/Render)</li>
                    <li>• Regular security updates</li>
                    <li>• Automated backups</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Monitoring</h4>
                  <ul className="text-gray-600 space-y-1">
                    <li>• 24/7 security monitoring</li>
                    <li>• Intrusion detection</li>
                    <li>• Regular security audits</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Data Sharing & Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We do not sell your personal information. We may share your data only in the following circumstances:
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Service Providers</h4>
                  <p className="text-gray-600">
                    We work with trusted third-party services (like cloud hosting, email delivery, and analytics) that help us operate our platform. These providers are contractually bound to protect your data.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Social Media Platforms</h4>
                  <p className="text-gray-600">
                    When you connect your social media accounts, we interact with their APIs to post content and retrieve analytics on your behalf.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Legal Requirements</h4>
                  <p className="text-gray-600">
                    We may disclose information if required by law, court order, or to protect our rights and safety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights & Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">You have the following rights regarding your personal data:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Access</h4>
                    <p className="text-gray-600 text-sm">Request a copy of your personal data</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Correction</h4>
                    <p className="text-gray-600 text-sm">Update or correct your information</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Deletion</h4>
                    <p className="text-gray-600 text-sm">Request deletion of your data</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Portability</h4>
                    <p className="text-gray-600 text-sm">Export your data in a usable format</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Opt-out</h4>
                    <p className="text-gray-600 text-sm">Unsubscribe from marketing emails</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Restriction</h4>
                    <p className="text-gray-600 text-sm">Limit how we process your data</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>How to exercise your rights:</strong> Contact us at privacy@smms.com or use the settings in your account dashboard to manage your data preferences.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Email:</strong> privacy@smms.com</p>
                <p><strong>Support:</strong> support@smms.com</p>
                <p><strong>Address:</strong> SMMS Privacy Team, [Your Business Address]</p>
                <p><strong>Response Time:</strong> We typically respond within 48 hours</p>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. When we do, we will:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4 mb-4">
                <li>Post the updated policy on this page</li>
                <li>Update the "Last updated" date</li>
                <li>Notify you via email for significant changes</li>
                <li>Provide a 30-day notice for material changes</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of our services after the effective date constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Bottom Action */}
        <div className="text-center mt-12">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
