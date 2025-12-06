
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Card, Button } from '../components/Components';
import { ArrowLeft } from 'lucide-react';

const RefundPolicy = () => {
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
            <h1 className="text-3xl font-bold text-white mb-8">Refund Policy</h1>
            
            <div className="space-y-6 text-sm leading-relaxed">
                <p className="font-bold">Last Updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Subscription Cancellations</h2>
                    <p>CarCashPro is a subscription-based service. You may cancel your monthly subscription at any time via your Profile page or by contacting support. </p>
                    <p className="mt-2">If you cancel, your access to the Pro features will continue until the end of your current billing cycle. You will not be charged for the following month.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. Refund Eligibility</h2>
                    <p>Since our service is digital and access is granted immediately upon payment, <strong>we generally do not offer refunds for partial months or unused time.</strong></p>
                    <p className="mt-2">However, exceptions may be made in the following circumstances:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>If you were charged due to a technical error.</li>
                        <li>If you requested cancellation prior to your renewal date but were charged anyway.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. How to Request a Refund</h2>
                    <p>If you believe you are eligible for a refund based on the criteria above, please contact our support team within 7 days of the transaction.</p>
                    <p className="mt-2">Email: <span className="text-blue-400">info@carcashpro.com</span></p>
                    <p>Please include your account email address and the date of the transaction in your request.</p>
                </section>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default RefundPolicy;
