import Link from "next/link";
import { AdBanner } from "@/components/ad-banner";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Disclaimer | Justwrite",
  description: "Disclaimer for Justwrite.",
};

export default function DisclaimerPage() {
  return (
    <main className="flex min-h-screen w-full justify-center px-6 py-12 text-zinc-800 dark:text-zinc-100">
      <div className="w-full max-w-3xl text-left space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Disclaimer</h1>
        
        <div className="space-y-6 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">General Disclaimer</h2>
          <p>
            The information and services provided by Justwrite are intended for general personal productivity and note-taking purposes only. By using this application, you acknowledge and agree that your use is entirely at your own risk.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">No Warranty</h2>
          <p>
            Justwrite is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no representations or warranties of any kind, express or implied, regarding the operation of the application, the reliability of the software, or the security of the underlying browser technologies. We disclaim all warranties, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">Content Accuracy</h2>
          <p>
            Content written in this app is strictly user-generated. We do not monitor, endorse, or guarantee the completeness, reliability, accuracy, or suitability of any notes you create for legal, medical, financial, or any other professional purposes. Always seek the advice of qualified professionals for critical matters.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">Data Loss and Technical Limitations</h2>
          <p>
            As a local-first application, Justwrite relies heavily on your web browser's storage mechanisms (such as localStorage and IndexedDB). There are inherent technical limitations to browser storage. Your data may be permanently lost if you clear your browsing history, uninstall your browser, use aggressive system cleaning tools, or if the browser enforces storage limits. We are not responsible for any lost, damaged, or unrecoverable data. Users are strongly advised to manually export and back up their work regularly.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">Third-Party Advertising</h2>
          <p>
            This application may display third-party advertisements. We do not control the content of these advertisements, nor do we endorse the products or services they promote. Interactions with third-party advertisers are solely between you and the advertiser.
          </p>
          
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">External Links</h2>
          <p>
            Justwrite may contain links to external websites that are not operated by us. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies or disclaimers.
          </p>

          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mt-8 mb-2">Updates to this Disclaimer</h2>
          <p>
            We may update this disclaimer from time to time to reflect changes in our service or applicable laws. Continued use of the application following any changes indicates your acceptance of the updated terms.
          </p>
        </div>

        <AdBanner className="mt-8" />

        <Footer />
      </div>
    </main>
  );
}
