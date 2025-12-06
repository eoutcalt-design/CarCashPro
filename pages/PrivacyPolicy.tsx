
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Card, Button } from '../components/Components';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
            <div className="w-16 h-16">
                <Logo className="w-full h-full" />
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="!w-auto px-4 py-2 h-10 text-sm">
                <ArrowLeft size={16} className="mr-2" /> Back
            </Button>
        </div>

        <Card className="p-8 md:p-12 bg-slate-900 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <div className="space-y-6 text-sm leading-relaxed">
                <p className="font-bold">Last Updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                    <p>CarCashPro ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website or use our mobile application (the "App") and tell you about your privacy rights and how the law protects you.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Identity Data:</strong> First name, last name.</li>
                        <li><strong>Contact Data:</strong> Email address, telephone number.</li>
                        <li><strong>Financial Data:</strong> We do not store credit card details. All payment processing is handled by our third-party processor, Stripe.</li>
                        <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us.</li>
                        <li><strong>Usage Data:</strong> Information about how you use our App, products, and services (e.g., deals logged, commissions calculated).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>To provide the service of calculating and tracking your sales commissions.</li>
                        <li>To manage your subscription and account.</li>
                        <li>To send you notifications about your daily pace or weekly summaries (which you can opt-out of).</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. Data Security</h2>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. Your data is stored securely using Google Cloud Firestore with industry-standard encryption.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">5. New York State Privacy Rights</h2>
                    <p>If you are a resident of New York, you have specific rights regarding your personal information. We maintain compliance with applicable state laws ensuring:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>We do not sell your personal information to third parties.</li>
                        <li>You have the right to request access to the data we hold about you.</li>
                        <li>You have the right to request deletion of your data upon account closure.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">6. Contact Us</h2>
                    <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
                    <p className="mt-2 text-blue-400">info@carcashpro.com</p>
                </section>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
