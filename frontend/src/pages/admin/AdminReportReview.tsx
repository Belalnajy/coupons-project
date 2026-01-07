import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiFlag,
  FiBox,
  FiCheck,
  FiX,
  FiEye,
} from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { getAdminReport, reviewReport } from '@/services/api/admin.api'; // Ensure this path is correct
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const AdminReportReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      try {
        const data = await getAdminReport(id);
        setReportData(data);
      } catch (error) {
        console.error('Failed to fetch report:', error);
        toast.error('Failed to load report details');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleAction = async (action: 'resolve' | 'dismiss') => {
    if (!id) return;

    const isResolve = action === 'resolve';
    const result = await Swal.fire({
      title: isResolve ? 'Suspend Both Content & User?' : 'Dismiss Report?',
      text: isResolve
        ? 'This will disable the content and suspend the creator user account.'
        : 'This will mark the report as rejected/reviewed.',
      icon: isResolve ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isResolve ? '#d33' : '#333',
      cancelButtonColor: '#3085d6',
      confirmButtonText: isResolve ? 'Yes, suspend both!' : 'Yes, dismiss it',
    });

    if (result.isConfirmed) {
      try {
        await reviewReport(id, {
          status: isResolve ? 'resolved' : 'reviewed',
          notes: isResolve
            ? 'Content suspended and creator user account suspended'
            : 'Report dismissed',
        });
        toast.success(
          `Report ${isResolve ? 'resolved' : 'dismissed'} successfully`
        );
        navigate('/admin/reports');
      } catch (error) {
        console.error('Failed to process report:', error);
        toast.error('Failed to process report');
      }
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-white">Loading report...</div>;
  }

  if (!reportData) {
    return (
      <div className="p-12 text-center text-white">
        Report not found or failed to load.
      </div>
    );
  }

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
            Report #{reportData.id.slice(0, 8)} •{' '}
            {new Date(reportData.createdAt).toLocaleString()}
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
                Reported by {reportData.reporter?.username || 'Anonymous'}
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
                  {reportData.contentType}
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
                Description / Notes
              </p>
              <p className="text-light-grey leading-relaxed font-medium">
                {reportData.notes || 'No additional notes.'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs font-black text-[#a0a0a0] uppercase tracking-widest mb-2 opacity-40">
              Report Status
            </p>
            <p
              className={`font-bold ${
                reportData.status === 'pending'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}>
              {reportData.status.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Reported Content */}
        <div className="bg-[#333333] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-[#49b99f]/10 rounded-2xl">
                <FiBox className="w-6 h-6 text-[#49b99f]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                  Reported Content
                </h2>
                <p className="text-light-grey text-sm opacity-60">
                  {reportData.contentType === 'deal'
                    ? 'Actual Deal Details'
                    : reportData.contentType === 'comment'
                    ? 'Actual Comment Text'
                    : 'User Information'}
                </p>
              </div>
            </div>

            {/* Direct Link to Content */}
            {(reportData.contentType === 'deal' ||
              reportData.contentType === 'comment') && (
              <a
                href={
                  reportData.contentType === 'deal'
                    ? `/deals/${reportData.contentId}`
                    : `/deals/${reportData.content?.dealId}#comment-${reportData.contentId}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#49b99f] hover:bg-[#49b99f]/90 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-[#49b99f]/20 hover:-translate-y-0.5 active:scale-95">
                <FiEye className="w-4 h-4" />
                View on Site
              </a>
            )}
          </div>

          <div className="bg-[#252525] rounded-3xl p-8 border border-white/5 mb-8">
            {reportData.content ? (
              <div className="space-y-4">
                {reportData.contentType === 'deal' && (
                  <>
                    <h3 className="text-xl font-bold text-white">
                      {reportData.content.title}
                    </h3>
                    <p className="text-light-grey leading-relaxed">
                      {reportData.content.description}
                    </p>
                  </>
                )}
                {reportData.contentType === 'comment' && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#49b99f]/20 flex items-center justify-center text-[#49b99f] font-bold text-xs">
                        {reportData.content.user?.username?.[0] || 'U'}
                      </div>
                      <span className="text-white font-bold text-sm">
                        {reportData.content.user?.username}
                      </span>
                    </div>
                    <p className="text-light-grey leading-relaxed text-lg italic">
                      "{reportData.content.content}"
                    </p>
                    <p className="text-xs text-light-grey opacity-40 mt-4">
                      On Deal: {reportData.content.deal?.title}
                    </p>
                  </>
                )}
                {reportData.contentType === 'user' && (
                  <>
                    <p className="text-white font-bold text-lg">
                      Username: {reportData.content.username}
                    </p>
                    <p className="text-light-grey">
                      Email: {reportData.content.email}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <p className="text-red-400 font-bold">
                Could not fetch content details. It might have been deleted or
                an error occurred.
              </p>
            )}
          </div>
        </div>

        {/* Take Action */}
        <div className="bg-[#333333] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden p-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
            Take Action
          </h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Button
              onClick={() => handleAction('resolve')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest h-16 rounded-2xl gap-3 shadow-xl shadow-red-500/20 border-0 transition-transform hover:-translate-y-1">
              <FiCheck className="w-6 h-6" />
              Suspend Both Content & User
            </Button>
            <Button
              onClick={() => handleAction('dismiss')}
              className="flex-1 bg-[#252525] hover:bg-[#2a2a2a] text-[#a0a0a0] hover:text-white font-black uppercase tracking-widest h-16 rounded-2xl gap-3 border border-white/5 transition-transform hover:-translate-y-1">
              <FiX className="w-6 h-6" />
              Dismiss Report
            </Button>
          </div>

          <p className="text-light-grey text-xs font-medium opacity-40">
            Taking action will disable the reported content and suspend the
            creator user account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminReportReview;
