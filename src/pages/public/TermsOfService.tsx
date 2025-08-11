import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FileText, Shield, AlertTriangle, Mail, Calendar } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FileText className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these Terms of Service carefully before using Keativ.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: August 11, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Agreement to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-500" />
                1. Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                By accessing and using Keativ ("Service"), you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the 
                above, please do not use this service.
              </p>
              <p className="text-gray-600">
                These Terms of Service ("Terms") govern your use of our social media management 
                platform operated by Keativ ("us", "we", or "our").
              </p>
            </CardContent>
          </Card>

          {/* Description of Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-red-500" />
                2. Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Keativ is a social media management platform that allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Schedule and publish posts across multiple social media platforms</li>
                <li>Analyze social media performance and engagement</li>
                <li>Manage social media accounts and collaborations</li>
                <li>Access automation tools for social media management</li>
                <li>Store and organize media content</li>
              </ul>
              <p className="text-gray-600">
                We reserve the right to modify, suspend, or discontinue the Service at any time 
                without prior notice.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-500" />
                3. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                To access certain features of the Service, you must register for an account. 
                When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p className="text-gray-600">
                You must be at least 13 years old to create an account. If you are under 18, 
                you represent that you have your parent's or guardian's permission to use the Service.
              </p>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                4. Acceptable Use Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                You agree not to use the Service for any unlawful purpose or in any way that 
                could damage, disable, or impair the Service. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Posting illegal, harmful, or offensive content</li>
                <li>Violating intellectual property rights</li>
                <li>Transmitting spam, viruses, or malicious code</li>
                <li>Attempting to gain unauthorized access to accounts or systems</li>
                <li>Impersonating others or providing false information</li>
                <li>Violating applicable laws or regulations</li>
                <li>Interfering with or disrupting the Service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Content and Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-red-500" />
                5. Content and Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Your Content</h4>
                <p className="text-gray-600">
                  You retain ownership of content you post through the Service. By posting content, 
                  you grant us a worldwide, non-exclusive license to use, display, and distribute 
                  your content as necessary to provide the Service.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Our Content</h4>
                <p className="text-gray-600">
                  The Service and its original content, features, and functionality are owned by 
                  Keativ and are protected by international copyright, trademark, and other 
                  intellectual property laws.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-500" />
                6. Privacy and Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Your privacy is important to us. Our Privacy Policy explains how we collect, 
                use, and protect your information when you use the Service. By using the Service, 
                you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information, 
                but cannot guarantee absolute security of data transmitted over the internet.
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-red-500" />
                7. Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                The Service may integrate with third-party social media platforms and services. 
                Your use of these integrations is subject to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>The terms and policies of the respective third-party services</li>
                <li>Our ability to maintain these integrations (subject to change)</li>
                <li>The availability and functionality of third-party APIs</li>
              </ul>
              <p className="text-gray-600">
                We are not responsible for the practices or content of third-party services.
              </p>
            </CardContent>
          </Card>

          {/* Subscription and Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-red-500" />
                8. Subscription and Billing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Paid Services</h4>
                <p className="text-gray-600">
                  Some features of the Service require a paid subscription. Subscription fees 
                  are billed in advance on a recurring basis and are non-refundable except 
                  as required by law.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cancellation</h4>
                <p className="text-gray-600">
                  You may cancel your subscription at any time. Cancellation will be effective 
                  at the end of the current billing period. You will continue to have access 
                  to paid features until the end of the billing period.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers and Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                9. Disclaimers and Limitations of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Service Availability</h4>
                <p className="text-gray-600">
                  The Service is provided "as is" without warranties of any kind. We do not 
                  guarantee that the Service will be available at all times or free from errors.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Limitation of Liability</h4>
                <p className="text-gray-600">
                  In no event shall Keativ be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including loss of profits, data, or use, 
                  arising out of your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                10. Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice, for conduct that we believe violates these Terms or is 
                harmful to other users, us, or third parties.
              </p>
              <p className="text-gray-600">
                Upon termination, your right to use the Service will cease immediately, and 
                we may delete your account and content without liability to you.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-red-500" />
                11. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. We will notify users 
                of material changes by posting the new Terms on this page and updating the 
                "Last updated" date.
              </p>
              <p className="text-gray-600">
                Your continued use of the Service after changes become effective constitutes 
                acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-red-500" />
                12. Governing Law and Dispute Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                These Terms shall be governed by and construed in accordance with the laws 
                of the jurisdiction in which Keativ operates, without regard to conflict 
                of law provisions.
              </p>
              <p className="text-gray-600">
                Any disputes arising from these Terms or your use of the Service shall be 
                resolved through binding arbitration in accordance with the rules of the 
                applicable arbitration organization.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-red-500" />
                13. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> legal@keativ.com
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> Keativ Legal Department
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Response Time:</strong> We aim to respond within 5 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Notice */}
        <div className="mt-12 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Important Notice
              </h3>
              <p className="text-red-700">
                By using Keativ, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms of Service. If you do not agree with any part 
                of these terms, you must not use our Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
