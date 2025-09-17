"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/privacy & terms/sidebar"
import TopNav from "@/components/privacy & terms/top-nav"

const privacySections = [
  { key: "overview", label: "Quick Overview" },
  { key: "information", label: "Information We Collect" },
  { key: "usage", label: "How We Use Information" },
  { key: "security", label: "Data Security & Storage" },
  { key: "sharing", label: "Data Sharing" },
  { key: "rights", label: "Your Rights & Choices" },
  { key: "contact", label: "Contact Us" },
  { key: "updates", label: "Policy Updates" },
]

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const handleScroll = () => {
      const sections = privacySections.map((section) => section.key)
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
        <Sidebar name="Privacy Policy" items={privacySections} activeKey={activeSection} onSelect={scrollToSection} />

        {/* Main Content */}
        <div className="flex-1 w-full">
          {/* Top Navigation for Mobile */}
          <TopNav items={privacySections} activeKey={activeSection} onSelect={scrollToSection} />

          {/* Content */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-[#2D3748] mb-4 font-['Roboto_Slab']">Privacy Policy</h1>
              <p className="text-lg text-[#2D3748] mb-2 font-['Poppins']">
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-gray-500 font-['Poppins']">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Quick Overview */}
            <section id="overview" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">Quick Overview</h2>
              <p className="text-[#2D3748] mb-6 font-['Poppins'] leading-relaxed">
                Keativ is committed to protecting your privacy. We collect only the
                information necessary to provide our social media management services, and we never sell your personal
                data to third parties.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#F3F4F6] p-6 rounded-lg">
                  <h3 className="font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">What we do:</h3>
                  <ul className="text-[#2D3748] space-y-2 font-['Poppins']">
                    <li>• Encrypt your data</li>
                    <li>• Use secure authentication</li>
                    <li>• Give you data control</li>
                    <li>• Follow industry standards</li>
                  </ul>
                </div>
                <div className="bg-[#F3F4F6] p-6 rounded-lg">
                  <h3 className="font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">What we don't do:</h3>
                  <ul className="text-[#2D3748] space-y-2 font-['Poppins']">
                    <li>• Sell your personal data</li>
                    <li>• Share with unauthorized parties</li>
                    <li>• Store unnecessary information</li>
                    <li>• Track you across other sites</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section id="information" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">Information We Collect</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">
                    Account Information
                  </h3>
                  <p className="text-[#2D3748] mb-3 font-['Poppins'] leading-relaxed">
                    When you create an account, we collect:
                  </p>
                  <ul className="list-disc list-inside text-[#2D3748] space-y-1 ml-4 font-['Poppins']">
                    <li>Name and email address</li>
                    <li>Password (encrypted)</li>
                    <li>Profile picture (optional)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">
                    Social Media Integration Data
                  </h3>
                  <p className="text-[#2D3748] mb-3 font-['Poppins'] leading-relaxed">
                    When you connect your social media accounts:
                  </p>
                  <ul className="list-disc list-inside text-[#2D3748] space-y-1 ml-4 font-['Poppins']">
                    <li>Social media account handles and IDs</li>
                    <li>Access tokens (encrypted)</li>
                    <li>Published posts and analytics data</li>
                    <li>Follower counts and engagement metrics</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Usage Information</h3>
                  <p className="text-[#2D3748] mb-3 font-['Poppins'] leading-relaxed">We automatically collect:</p>
                  <ul className="list-disc list-inside text-[#2D3748] space-y-1 ml-4 font-['Poppins']">
                    <li>Usage patterns and preferences</li>
                    <li>Performance and error data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section id="usage" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                How We Use Your Information
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-2 font-['Roboto_Slab']">Service Provision</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    We use your information to provide, maintain, and improve our social media management services,
                    including posting content, analyzing performance, and managing your social media accounts.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-2 font-['Roboto_Slab']">Communication</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    We may send you service-related notifications, updates, and promotional emails (you can opt out of
                    promotional emails at any time).
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-2 font-['Roboto_Slab']">
                    Analytics and Improvement
                  </h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    We analyze usage patterns to improve our services, develop new features, and ensure optimal
                    performance.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section id="security" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">Data Security & Storage</h2>
              <p className="text-[#2D3748] mb-6 font-['Poppins'] leading-relaxed">
                We implement industry-standard security measures to protect your data:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Encryption</h3>
                  <ul className="text-[#2D3748] space-y-1 font-['Poppins']">
                    <li>• Data encrypted in transit (HTTPS/TLS)</li>
                    <li>• Passwords hashed with bcrypt</li>
                    <li>• API keys encrypted at rest</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Access Controls</h3>
                  <ul className="text-[#2D3748] space-y-1 font-['Poppins']">
                    <li>• Multi-factor authentication</li>
                    <li>• Role-based access control</li>
                    <li>• Regular access reviews</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Infrastructure</h3>
                  <ul className="text-[#2D3748] space-y-1 font-['Poppins']">
                    <li>• Secure cloud hosting (AWS/Render)</li>
                    <li>• Regular security updates</li>
                    <li>• Automated backups</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-3 font-['Roboto_Slab']">Monitoring</h3>
                  <ul className="text-[#2D3748] space-y-1 font-['Poppins']">
                    <li>• 24/7 security monitoring</li>
                    <li>• Intrusion detection</li>
                    <li>• Regular security audits</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section id="sharing" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">
                Data Sharing & Third Parties
              </h2>
              <p className="text-[#2D3748] mb-6 font-['Poppins'] leading-relaxed">
                We do not sell your personal information. We may share your data only in the following circumstances:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-2 font-['Roboto_Slab']">Service Providers</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    We work with trusted third-party services (like cloud hosting, email delivery, and analytics) that
                    help us operate our platform. These providers are contractually bound to protect your data.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-2 font-['Roboto_Slab']">
                    Social Media Platforms
                  </h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    When you connect your social media accounts, we interact with their APIs to post content and
                    retrieve analytics on your behalf.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#2D3748] mb-2 font-['Roboto_Slab']">Legal Requirements</h3>
                  <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                    We may disclose information if required by law, court order, or to protect our rights and safety.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="rights" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">Your Rights & Choices</h2>
              <p className="text-[#2D3748] mb-6 font-['Poppins'] leading-relaxed">
                You have the following rights regarding your personal data:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2D3748] font-['Roboto_Slab']">Access</h3>
                    <p className="text-[#2D3748] text-sm font-['Poppins']">Request a copy of your personal data</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2D3748] font-['Roboto_Slab']">Correction</h3>
                    <p className="text-[#2D3748] text-sm font-['Poppins']">Update or correct your information</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2D3748] font-['Roboto_Slab']">Deletion</h3>
                    <p className="text-[#2D3748] text-sm font-['Poppins']">Request deletion of your data</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2D3748] font-['Roboto_Slab']">Portability</h3>
                    <p className="text-[#2D3748] text-sm font-['Poppins']">Export your data in a usable format</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2D3748] font-['Roboto_Slab']">Opt-out</h3>
                    <p className="text-[#2D3748] text-sm font-['Poppins']">Unsubscribe from marketing emails</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2D3748] font-['Roboto_Slab']">Restriction</h3>
                    <p className="text-[#2D3748] text-sm font-['Poppins']">Limit how we process your data</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F3F4F6] p-4 rounded-lg">
                <p className="text-[#2D3748] text-sm font-['Poppins']">
                  <strong>How to exercise your rights:</strong> Contact us at privacy@keativ.com or use the settings in
                  your account dashboard to manage your data preferences.
                </p>
              </div>
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

            {/* Updates */}
            <section id="updates" className="mb-12">
              <h2 className="text-2xl font-bold text-[#2D3748] mb-6 font-['Roboto_Slab']">Policy Updates</h2>
              <p className="text-[#2D3748] mb-4 font-['Poppins'] leading-relaxed">
                We may update this Privacy Policy from time to time. When we do, we will:
              </p>
              <ul className="list-disc list-inside text-[#2D3748] space-y-1 ml-4 mb-4 font-['Poppins']">
                <li>Post the updated policy on this page</li>
                <li>Update the "Last updated" date</li>
                <li>Notify you via email for significant changes</li>
                <li>Provide a 30-day notice for material changes</li>
              </ul>
              <p className="text-[#2D3748] font-['Poppins'] leading-relaxed">
                Your continued use of our services after the effective date constitutes acceptance of the updated
                policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
