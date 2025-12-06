
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Card, Button } from '../components/Components';
import { ArrowLeft } from 'lucide-react';

const ReturnsPolicy = () => {
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
            <h1 className="text-3xl font-bold text-white mb-8">Returns Policy</h1>
            
            <div className="space-y-6 text-sm leading-relaxed">
                <p className="font-bold">Last Updated: {new Date().toLocaleDateString()}</p>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">1. Digital Goods</h2>
                    <p>CarCashPro provides access to software as a service (SaaS). As such, there are no physical goods to be shipped, received, or returned.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">2. No Returns Accepted</h2>
                    <p>Due to the nature of digital products, <strong>we do not accept returns.</strong> Once a subscription is active, the service is considered "delivered."</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. Defective Service</h2>
                    <p>If you experience technical issues that prevent you from using the application, please contact support immediately. We are committed to ensuring the software functions as described.</p>
                    <p className="mt-2">Contact: <span className="text-blue-400">info@carcashpro.com</span></p>
                </section>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
