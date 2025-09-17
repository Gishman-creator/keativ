import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "@/components/privacy & terms/sidebar"
import TopNav from "@/components/privacy & terms/top-nav"

const termsSections = [
  { key: "agreement", label: "Agreement to Terms" },
  { key: "description", label: "Description of Service" },
  { key: "accounts", label: "User Accounts" },
  { key: "acceptable-use", label: "Acceptable Use Policy" },
  { key: "content", label: "Content & Intellectual Property" },
  { key: "privacy", label: "Privacy & Data Protection" },
  { key: "third-party", label: "Third-Party Integrations" },
  { key: "billing", label: "Subscription & Billing" },
  { key: "disclaimers", label: "Disclaimers & Limitations" },
  { key: "termination", label: "Termination" },
  { key: "changes", label: "Changes to Terms" },
  { key: "governing-law", label: "Governing Law" },
  { key: "contact", label: "Contact Information" },
]

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("agreement")

  useEffect(() => {
    const handleScroll = () => {
      const sections = termsSections.map((section) => section.key)
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionKey: string) => {
    const element = document.getElementById(sectionKey)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setActiveSection(sectionKey)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* Sidebar Navigation */}
        <Sidebar name="Terms of Service" items={termsSections} activeKey={activeSection} onSelect={scrollToSection} />

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Top Navigation for Mobile */}
          <TopNav items={termsSections} activeKey={activeSection} onSelect={scrollToSection} />

          {/* Content */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-[#2D3748] mb-4 font-['Roboto_Slab']">Terms of Service</h1>
              <p className="text-lg text-[#2D3748] mb-2 font-['Poppins']">
                Please read these Terms of Service carefully before using Keativ.
              </p>
              <p className="text-sm text-gray-500 font-['Poppins']">Last updated: August 11, 2025</p>
            </div>

            {/* Agreement to Terms */}
            <section id="agreement" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">1. Agreement to Terms</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                By accessing and using Keativ services, you accept and agree to be bound by the terms and provision
                of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                These Terms of Service govern your use of our social media management platform operated by
                Keativ.
              </p>
            </section>

            {/* Description of Service */}
            <section id="description" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">2. Description of Service</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                Keativ is a social media management platform that allows users to:
              </p>
              <ul className="list-disc list-inside text-[#2D3748] space-y-2 ml-4 mb-4 font-['Poppins']">
                <li>Schedule and publish posts across multiple social media platforms</li>
                <li>Analyze social media performance and engagement</li>
                <li>Manage social media accounts and collaborations</li>
                <li>Access automation tools for social media management</li>
                <li>Store and organize media content</li>
              </ul>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                We reserve the right to modify, suspend, or discontinue the Service at any time without prior notice.
              </p>
            </section>

            {/* User Accounts */}
            <section id="accounts" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">3. User Accounts</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                To access certain features of the Service, you must register for an account. When creating an account,
                you agree to:
              </p>
              <ul className="list-disc list-inside text-[#2D3748] space-y-2 ml-4 mb-4 font-['Poppins']">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your login credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                You must be at least 13 years old to create an account. If you are under 18, you represent that you have
                your parent's or guardian's permission to use the Service.
              </p>
            </section>

            {/* Acceptable Use */}
            <section id="acceptable-use" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">4. Acceptable Use Policy</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or
                impair the Service. Prohibited activities include:
              </p>
              <ul className="list-disc list-inside text-[#2D3748] space-y-2 ml-4 font-['Poppins']">
                <li>Violating intellectual property rights</li>
                <li>Transmitting spam, viruses, or malicious code</li>
                <li>Attempting to gain unauthorized access to accounts or systems</li>
                <li>Impersonating others or providing false information</li>
                <li>Violating applicable laws or regulations</li>
                <li>Interfering with or disrupting the Service</li>
              </ul>
            </section>

            {/* Content and Intellectual Property */}
            <section id="content" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                5. Content and Intellectual Property
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Your Content</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    You retain ownership of content you post through the Service. By posting content, you grant us a
                    worldwide, non-exclusive license to use, display, and distribute your content as necessary to
                    provide the Service.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Our Content</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    The Service and its original content, features, and functionality are owned by Keativ and are
                    protected by international copyright, trademark, and other intellectual property laws.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy and Data */}
            <section id="privacy" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                6. Privacy and Data Protection
              </h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                information when you use the Service. By using the Service, you agree to the collection and use of
                information in accordance with our Privacy Policy.
              </p>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                We implement appropriate security measures to protect your personal information, but cannot guarantee
                absolute security of data transmitted over the internet.
              </p>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                7. Third-Party Integrations
              </h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                The Service may integrate with third-party social media platforms and services. Your use of these
                integrations is subject to:
              </p>
              <ul className="list-disc list-inside text-[#2D3748] space-y-2 ml-4 mb-4 font-['Poppins']">
                <li>The terms and policies of the respective third-party services</li>
                <li>Our ability to maintain these integrations (subject to change)</li>
                <li>The availability and functionality of third-party APIs</li>
              </ul>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                We are not responsible for the practices or content of third-party services.
              </p>
            </section>

            {/* Subscription and Billing */}
            <section id="billing" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                8. Subscription and Billing
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Paid Services</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    Some features of the Service require a paid subscription. Subscription fees are billed in advance on
                    a recurring basis and are non-refundable except as required by law.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Cancellation</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    You may cancel your subscription at any time. Cancellation will be effective at the end of the
                    current billing period. You will continue to have access to paid features until the end of the
                    billing period.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimers and Limitations */}
            <section id="disclaimers" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                9. Disclaimers and Limitations of Liability
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">
                    Service Availability
                  </h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service
                    will be available at all times or free from errors.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">
                    Limitation of Liability
                  </h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    In no event shall Keativ be liable for any indirect, incidental, special, consequential, or punitive
                    damages, including loss of profits, data, or use, arising out of your use of the Service.
                  </p>
                </div>
              </div>
            </section>

            {/* Termination */}
            <section id="termination" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">10. Termination</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, without prior notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                Upon termination, your right to use the Service will cease immediately, and we may delete your account
                and content without liability to you.
              </p>
            </section>

            {/* Changes to Terms */}
            <section id="changes" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">11. Changes to Terms</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of material changes by
                posting the new Terms on this page and updating the "Last updated" date.
              </p>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                Your continued use of the Service after changes become effective constitutes acceptance of the new
                Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section id="governing-law" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                12. Governing Law and Dispute Resolution
              </h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
                Keativ operates, without regard to conflict of law provisions.
              </p>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding
                arbitration in accordance with the rules of the applicable arbitration organization.
              </p>
            </section>

            {/* Contact Information */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">Contact Us</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[#F3F4F6] p-6 rounded-lg space-y-2">
                <p className="font-['Poppins']">
                  <strong>Email:</strong> privacy@keativ.com
                </p>
                <p className="font-['Poppins']">
                  <strong>Support:</strong> support@keativ.com
                </p>
                <p className="font-['Poppins']">
                  <strong>Address:</strong> Keativ Privacy Team, San Francisco, CA
                </p>
                <p className="font-['Poppins']">
                  <strong>Response Time:</strong> We typically respond within 48 hours
                </p>
              </div>
            </section>

            {/* Bottom Notice */}
            <div className="mt-12 p-6 bg-[#F3F4F6] rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-[#2D3748] mb-2 font-['Roboto_Slab']">Important Notice</h3>
                <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                  By using Keativ, you acknowledge that you have read, understood, and agree to be bound by these Terms
                  of Service. If you do not agree with any part of these terms, you must not use our Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
