import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'License - Sudoku Clash',
  description: 'License and Terms of Use for Sudoku Clash',
};

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1117] to-[#1a1a2e] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1a2e] rounded-xl shadow-xl border-2 border-[#14F195]/30 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-2">License Agreement</h1>
          <p className="text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Grant of License</h2>
              <p>
                Subject to your compliance with the terms and conditions of this License Agreement, 
                Sudoku Clash ("we", "us", or "our") grants you a limited, non-exclusive, non-transferable, 
                revocable license to access and use the Sudoku Clash mobile application (the "App") for 
                your personal, non-commercial use on devices that you own or control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Restrictions</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Copy, modify, distribute, sell, or lease any part of the App</li>
                <li>Reverse engineer or attempt to extract the source code of the App</li>
                <li>Remove, alter, or obscure any proprietary notices or labels on the App</li>
                <li>Use the App for any illegal purpose or in violation of any laws</li>
                <li>Interfere with or disrupt the App or servers connected to the App</li>
                <li>Use automated systems or bots to access the App</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Intellectual Property</h2>
              <p>
                The App, including all content, features, functionality, graphics, user interface, 
                and code, is owned by Sudoku Clash and is protected by copyright, trademark, and 
                other intellectual property laws. This License Agreement does not grant you any 
                rights to use our trademarks, service marks, logos, or other brand features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. User Content</h2>
              <p>
                You retain ownership of any content you create or submit through the App, including 
                player profiles, game statistics, and preferences. By using the App, you grant us a 
                worldwide, non-exclusive, royalty-free license to use, store, and process your content 
                solely for the purpose of providing and improving the App's services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Third-Party Services</h2>
              <p>
                The App may integrate with third-party services, including but not limited to Solana 
                blockchain wallets. Your use of such third-party services is subject to their respective 
                terms of service and privacy policies. We are not responsible for the availability, 
                accuracy, or content of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Disclaimer of Warranties</h2>
              <p>
                THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF 
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT 
                WARRANT THAT THE APP WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS 
                OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, 
                GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE APP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Termination</h2>
              <p>
                We may terminate or suspend your access to the App at any time, with or without cause 
                or notice, for any reason, including if you breach this License Agreement. Upon 
                termination, your right to use the App will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Changes to License</h2>
              <p>
                We reserve the right to modify this License Agreement at any time. We will notify 
                you of any material changes by updating the "Last Updated" date at the top of this 
                page. Your continued use of the App after such changes constitutes your acceptance 
                of the modified License Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Governing Law</h2>
              <p>
                This License Agreement shall be governed by and construed in accordance with the laws 
                of the jurisdiction in which Sudoku Clash operates, without regard to its conflict 
                of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about this License Agreement, please contact us at:
              </p>
              <p className="mt-2">
                Email: support@sudokuclash.com<br />
                Website: https://sudokuclash.com
              </p>
            </section>

            <section className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-500">
                By using Sudoku Clash, you acknowledge that you have read, understood, and agree 
                to be bound by this License Agreement.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
