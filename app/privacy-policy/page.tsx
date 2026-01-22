import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Sudoku Clash',
  description: 'Privacy Policy explaining data collection and protection for Sudoku Clash',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1117] to-[#1a1a2e] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1a2e] rounded-xl shadow-xl border-2 border-[#14F195]/30 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to Sudoku Clash ("we", "us", or "our"). We are committed to protecting your 
                privacy and ensuring transparency about how we collect, use, and protect your 
                information. This Privacy Policy explains our practices regarding data collection, 
                use, and disclosure when you use our mobile application (the "App").
              </p>
              <p className="mt-4">
                By using Sudoku Clash, you agree to the collection and use of information in 
                accordance with this Privacy Policy. If you do not agree with our policies and 
                practices, please do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Information You Provide</h3>
              <p>We collect information that you voluntarily provide when using the App, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Player Profile Information:</strong> Your chosen player name and optional Solana wallet public key</li>
                <li><strong>Game Preferences:</strong> Difficulty settings, theme preferences, sound and music settings</li>
                <li><strong>Game Statistics:</strong> Games played, scores, win/loss records, achievements, and progression data</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p>When you use the App, we may automatically collect certain information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Device Information:</strong> Device type, operating system version, and unique device identifiers</li>
                <li><strong>Usage Data:</strong> How you interact with the App, features used, and gameplay patterns</li>
                <li><strong>Local Storage Data:</strong> Information stored locally on your device using browser storage mechanisms</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Third-Party Services</h3>
              <p>
                The App integrates with Solana blockchain wallets. When you connect a wallet, we may 
                receive your wallet's public key. We do not have access to your private keys or 
                wallet seed phrases. Your use of third-party wallet services is subject to their 
                respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To provide, maintain, and improve the App's functionality</li>
                <li>To personalize your gaming experience and track your progress</li>
                <li>To save your game statistics, achievements, and preferences</li>
                <li>To enable wallet connectivity and blockchain-related features</li>
                <li>To analyze usage patterns and improve App performance</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To detect, prevent, and address technical issues or security concerns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Data Storage and Location</h2>
              <p>
                Your data is primarily stored locally on your device using browser storage mechanisms 
                (localStorage). This means:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Your game data, statistics, and preferences are stored on your device</li>
                <li>Data is not automatically synchronized across devices unless you use wallet-based authentication</li>
                <li>If you uninstall the App or clear browser data, your local data may be lost</li>
                <li>We do not maintain centralized servers storing your personal game data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Data Sharing and Disclosure</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating the App, subject to confidentiality obligations</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Blockchain and Wallet Data</h2>
              <p>
                When you connect a Solana wallet to the App, we receive your wallet's public key. 
                This information is used solely to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Associate your wallet with your player profile</li>
                <li>Enable blockchain-related features and transactions</li>
                <li>Provide wallet-based authentication</li>
              </ul>
              <p className="mt-4">
                <strong>Important:</strong> We never have access to your private keys, seed phrases, 
                or wallet passwords. All wallet operations are handled by your wallet provider. 
                You are solely responsible for the security of your wallet and private keys.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your 
                information. However, no method of transmission over the internet or electronic 
                storage is 100% secure. While we strive to use commercially acceptable means to 
                protect your data, we cannot guarantee absolute security.
              </p>
              <p className="mt-4">
                Since your data is stored locally on your device, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Keeping your device secure and protected with passwords or biometric authentication</li>
                <li>Not sharing your device with unauthorized users</li>
                <li>Using security features provided by your device's operating system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Your Rights and Choices</h2>
              <p>You have the following rights regarding your information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Access:</strong> You can view your player profile and game statistics within the App</li>
                <li><strong>Modification:</strong> You can update your player name and preferences at any time</li>
                <li><strong>Deletion:</strong> You can delete your player profile and all associated data through the App settings</li>
                <li><strong>Wallet Disconnection:</strong> You can disconnect your wallet at any time</li>
                <li><strong>Data Export:</strong> Your data is stored locally and accessible through your device's storage</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, use the settings and profile management features within the App.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Sudoku Clash is not intended for children under the age of 13. We do not knowingly 
                collect personal information from children under 13. If you are a parent or guardian 
                and believe your child has provided us with personal information, please contact us 
                immediately. If we become aware that we have collected personal information from a 
                child under 13, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. International Users</h2>
              <p>
                If you are using the App from outside the United States, please be aware that your 
                information may be transferred to, stored, and processed in the United States. By 
                using the App, you consent to the transfer of your information to the United States 
                and processing in accordance with this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                material changes by updating the "Last Updated" date at the top of this page and, 
                where appropriate, through in-App notifications. Your continued use of the App after 
                such changes constitutes your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. California Privacy Rights</h2>
              <p>
                If you are a California resident, you have additional rights under the California 
                Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>The right to know what personal information we collect, use, and disclose</li>
                <li>The right to delete your personal information</li>
                <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
                <li>The right to non-discrimination for exercising your privacy rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">13. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or 
                our data practices, please contact us at:
              </p>
              <p className="mt-4">
                Email: support@sudokuclash.com<br />
                Website: https://sudokuclash.com
              </p>
            </section>

            <section className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-500">
                By using Sudoku Clash, you acknowledge that you have read and understood this 
                Privacy Policy and agree to the collection and use of your information as described 
                herein.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
