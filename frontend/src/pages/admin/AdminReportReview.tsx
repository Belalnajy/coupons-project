import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiFlag,
  FiBox,
  FiAlertTriangle,
  FiCheck,
  FiX,
  FiExternalLink,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';

const AdminReportReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data for the specific report based on the design image
  const reportData = {
    id: '#1',
    date: '2023-12-16 14:30',
    reporter: 'TrustedUser99',
    type: 'Deal',
    reason: 'Spam content',
    description:
      'This deal contains suspicious links and appears to be spam. The website redirects to questionable third-party sites.',
    content: {
      title: 'Fake iPhone Deal - Too Good to Be True',
      submittedBy: 'Spammer123',
      date: '2023-12-16 09:00',
      price: '£50',
      url: 'https://suspicious-site.example.com',
      description: 'Amazing iPhone 15 Pro for just £50! Click here now!!!',
    },
    warningSigns: [
      'Suspicious external URL domain',
      'Price significantly below market value',
      'Multiple spam reports from trusted users',
    ],
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/admin/reports')}
          className="p-3 bg-[#333333] hover:bg-[#404040] text-white rounded-2xl border border-white/5 transition-all hover:-translate-x-1">
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
            Review Report
          </h1>
          <p className="text-light-grey text-lg font-medium opacity-60">
            Report {id || reportData.id} • {reportData.date}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Report Details */}
        <div className="bg-[#333333] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-4 bg-red-500/10 rounded-2xl">
              <FiFlag className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                Report Details
              </h2>
              <p className="text-light-grey text-sm opacity-60">
                Reported by {reportData.reporter}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-40">
                  Report Type
                </p>
                <p className="text-white font-bold text-lg">
                  {reportData.type}
                </p>
              </div>
              <div>
                <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-40">
                  Reason
                </p>
                <p className="text-white font-bold text-lg">
                  {reportData.reason}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-40">
                Description
              </p>
              <p className="text-light-grey leading-relaxed font-medium">
                {reportData.description}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-40">
              Reported Date
            </p>
            <p className="text-[#a0a0a0] font-bold">{reportData.date}</p>
          </div>
        </div>

        {/* Reported Content */}
        <div className="bg-[#333333] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="p-4 bg-[#49b99f]/10 rounded-2xl">
              <FiBox className="w-6 h-6 text-[#49b99f]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                Reported Content
              </h2>
            </div>
          </div>

          <div className="bg-[#252525] rounded-3xl p-8 border border-white/5 mb-8">
            <h3 className="text-xl font-black text-white mb-6 underline decoration-[#49b99f]/30 underline-offset-8">
              {reportData.content.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="mb-6">
                  <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-30">
                    Submitted By
                  </p>
                  <p className="text-white font-black">
                    {reportData.content.submittedBy}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-30">
                    Price
                  </p>
                  <p className="text-[#49b99f] font-black text-xl">
                    {reportData.content.price}
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-30">
                    Date
                  </p>
                  <p className="text-white font-bold">
                    {reportData.content.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-30">
                    URL
                  </p>
                  <a
                    href={reportData.content.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 font-bold hover:underline flex items-center gap-2">
                    {reportData.content.url}
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-30">
                Description
              </p>
              <p className="text-light-grey leading-relaxed font-black">
                {reportData.content.description}
              </p>
            </div>
          </div>

          {/* Warning Signs */}
          <div className="bg-red-500/80 rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertTriangle className="w-6 h-6 text-white" />
              <h4 className="text-lg font-black text-white uppercase tracking-tight">
                Warning Signs Detected
              </h4>
            </div>
            <ul className="space-y-3">
              {reportData.warningSigns.map((sign, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-white font-bold text-sm">
                  <span className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Take Action */}
        <div className="bg-[#333333] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden p-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
            Take Action
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest h-16 rounded-2xl gap-3 shadow-xl shadow-red-500/20 border-0 transition-transform hover:-translate-y-1">
              <FiCheck className="w-6 h-6" />
              Delete Content & Suspend User
            </Button>
            <Button className="flex-1 bg-[#252525] hover:bg-[#2a2a2a] text-[#a0a0a0] hover:text-white font-black uppercase tracking-widest h-16 rounded-2xl gap-3 border border-white/5 transition-transform hover:-translate-y-1">
              <FiX className="w-6 h-6" />
              Dismiss Report
            </Button>
          </div>

          <p className="text-light-grey text-xs font-medium opacity-40">
            Taking action will remove the reported content and may suspend the
            user account if multiple violations are detected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminReportReview;
