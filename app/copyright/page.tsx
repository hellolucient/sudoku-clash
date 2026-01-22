import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Copyright - Sudoku Clash',
  description: 'Copyright Notice and Ownership Information for Sudoku Clash',
};

export default function CopyrightPage() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D1117] to-[#1a1a2e] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1a2e] rounded-xl shadow-xl border-2 border-[#14F195]/30 p-8 md:p-12">
          <h1 className="text-4xl font-bold text-white mb-2">Copyright Notice</h1>
          <p className="text-gray-400 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Copyright Ownership</h2>
              <p>
                Copyright © {currentYear} Sudoku Clash. All rights reserved.
              </p>
              <p className="mt-4">
                The Sudoku Clash mobile application, including but not limited to its software, 
                code, graphics, user interface, design, text, images, sounds, music, and all 
                other content (collectively, the "Content"), is the exclusive property of Sudoku 
                Clash and is protected by United States and international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Protected Materials</h2>
              <p>The following materials are protected by copyright:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>All source code, object code, and software architecture</li>
                <li>Graphical user interface (GUI) designs and layouts</li>
                <li>Game mechanics, rules, and algorithms</li>
                <li>Visual assets including icons, logos, and artwork</li>
                <li>Audio files including sound effects and background music</li>
                <li>Text content, documentation, and user guides</li>
                <li>Brand names, trademarks, and service marks</li>
                <li>Database structures and data organization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Prohibited Uses</h2>
              <p>
                Without the express written permission of Sudoku Clash, you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Reproduce, copy, or duplicate any portion of the App</li>
                <li>Create derivative works based on the App</li>
                <li>Distribute, publish, or transmit the App or any portion thereof</li>
                <li>Use the App's name, logo, or branding for commercial purposes</li>
                <li>Reverse engineer, decompile, or disassemble the App</li>
                <li>Remove or alter any copyright, trademark, or proprietary notices</li>
                <li>Use automated systems to extract data from the App</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Fair Use</h2>
              <p>
                This copyright notice does not limit your rights under fair use or other applicable 
                copyright exceptions. You may use limited portions of the App for purposes such as 
                criticism, comment, news reporting, teaching, scholarship, or research, as permitted 
                by applicable copyright law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Third-Party Content</h2>
              <p>
                The App may contain content, features, or functionality provided by third parties, 
                including open-source software components. Such third-party content is subject to 
                its respective copyright notices and license terms. Sudoku Clash respects the 
                intellectual property rights of others and expects its users to do the same.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">User-Generated Content</h2>
              <p>
                While you retain ownership of content you create or submit through the App (such as 
                player profiles, game statistics, and preferences), you grant Sudoku Clash a 
                non-exclusive, worldwide, royalty-free license to use, display, and process such 
                content for the purpose of providing and improving the App's services. This does 
                not affect your ownership rights in your original content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Trademark Notice</h2>
              <p>
                "Sudoku Clash" and related logos, names, and marks are trademarks or service marks 
                of Sudoku Clash. You may not use these trademarks without our prior written consent. 
                All other trademarks, service marks, and trade names are the property of their 
                respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Digital Millennium Copyright Act (DMCA)</h2>
              <p>
                Sudoku Clash respects the intellectual property rights of others and complies with 
                the Digital Millennium Copyright Act (DMCA). If you believe that your copyrighted 
                work has been copied in a way that constitutes copyright infringement, please 
                provide our designated copyright agent with the following information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>A physical or electronic signature of the copyright owner or authorized agent</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information including name, address, telephone number, and email</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                <li>A statement that the information in the notification is accurate</li>
              </ul>
              <p className="mt-4">
                Please send DMCA notices to: support@sudokuclash.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Enforcement</h2>
              <p>
                Sudoku Clash will vigorously enforce its intellectual property rights to the fullest 
                extent of the law. Unauthorized use of copyrighted materials may result in civil 
                and/or criminal penalties, including monetary damages and injunctive relief.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Information</h2>
              <p>
                For questions regarding copyright, licensing, or permission to use our materials, 
                please contact:
              </p>
              <p className="mt-2">
                Email: support@sudokuclash.com<br />
                Website: https://sudokuclash.com
              </p>
            </section>

            <section className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-500">
                This copyright notice is provided for informational purposes and does not constitute 
                legal advice. For specific legal questions regarding copyright, please consult with 
                a qualified attorney.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
