import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Terms of Service | Justwrite",
  description: "Terms of Service for Justwrite.",
};

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <p>
            Last updated: September 2026. Please read these Terms of Service carefully before using the Justwrite application and website.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">1. Service Description</h2>
          <p>
            Justwrite is a web-based, local-first note-taking application designed to provide a distraction-free environment for writing. The service is accessible directly through your modern web browser and operates primarily offline after the initial load.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">2. Acceptance of Terms</h2>
          <p>
            By accessing or using Justwrite, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the application.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">3. User Responsibilities</h2>
          <p>
            You are entirely responsible for the content you create and store using Justwrite. Because the application operates on a local-first basis, you are responsible for maintaining backups of your own notes. We strongly encourage users to regularly export their important data.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">4. Content Ownership</h2>
          <p>
            You retain full ownership of all content you create, type, or store within Justwrite. We claim no intellectual property rights over the material you provide to the service. Your notes belong solely to you.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">5. Local Storage Disclaimer</h2>
          <p>
            Justwrite utilizes your browser's local storage (such as IndexedDB and localStorage) to save your work. Clearing your browser data, running certain system cleanup tools, or using browsing in incognito/private modes may result in the permanent loss of your notes. We are not liable for any data loss that occurs on your device.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">6. Third-Party Services</h2>
          <p>
            The service may display advertisements provided by third-party services, such as Google AdSense. These third parties may use cookies and similar technologies to serve personalized ads based on your visit to this and other websites. We do not endorse or take responsibility for the products or services advertised by these third parties.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">7. Intellectual Property</h2>
          <p>
            The Justwrite application, including its original code, features, functionality, and design, is owned by its creator. You may not copy, modify, distribute, sell, or lease any part of our services or included software without prior authorization.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">8. Limitation of Liability</h2>
          <p>
            This website and application are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis, without warranties of any kind, either express or implied. In no event shall Justwrite or its developer be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of data, loss of use, or other intangible losses resulting from your use of the service.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">9. Modifications to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. We will try to provide adequate notice for substantial changes, but it is your responsibility to check this page periodically for updates.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">10. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please feel free to reach out to us through the appropriate channels on our primary website.
          </p>
        </div>

        <AdBanner className="mt-8" />

        <Footer />
      </div>
    </main>
  );
}
