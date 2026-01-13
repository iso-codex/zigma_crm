import { useEffect, useState } from 'react';
import { useOpportunityStore, type Opportunity } from '@/store/useOpportunityStore';
import { useOpportunityStore, type Opportunity } from '@/store/useOpportunityStore';
import { Plus } from 'lucide-react';
import { OpportunityModal } from '@/components/opportunities/OpportunityModal';

const STAGES: Opportunity['stage'][] = [
    'Prospecting',
    'Engagement',
    'Due Diligence',
    'Commitment',
    'Subscription',
    'Closed'
];

export default function Opportunities() {
    const { opportunities, fetchOpportunities, updateStage } = useOpportunityStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

    const onDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('id', id);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = async (e: React.DragEvent, stage: Opportunity['stage']) => {
        const id = e.dataTransfer.getData('id');
        if (id) {
            await updateStage(id, stage);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pipeline</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage deal flow and stages</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Opportunity
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-[1200px] h-full">
                    {STAGES.map((stage) => {
                        const stageOpps = opportunities.filter(o => o.stage === stage);
                        const stageTotal = stageOpps.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

                        return (
                            <div
                                key={stage}
                                className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex flex-col border border-gray-200 dark:border-gray-700 min-w-[280px]"
                                onDragOver={onDragOver}
                                onDrop={(e) => onDrop(e, stage)}
                            >
                                <div className="mb-3 flex justify-between items-center px-1">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{stage}</h3>
                                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">{stageOpps.length}</span>
                                </div>

                                <div className="mb-3 px-1">
                                    <p className="text-xs text-gray-500 font-medium">
                                        ${(stageTotal / 1000000).toFixed(1)}M
                                    </p>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto">
                                    {stageOpps.map((opp) => (
                                        <div
                                            key={opp.id}
                                            draggable
                                            onDragStart={(e) => onDragStart(e, opp.id)}
                                            className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-gray-100 dark:border-gray-700 cursor-move hover:shadow-md transition-shadow"
                                        >
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">{opp.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1 truncate">{opp.investor?.name}</p>
                                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50 dark:border-gray-700">
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                    ${(opp.amount / 1000).toFixed(0)}k
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateStage(opp.id, 'Closed')}
                                                        className="text-[10px] text-green-600 hover:text-green-800 bg-green-50 px-1.5 py-0.5 rounded border border-green-100"
                                                        title="Mark as Closed Won"
                                                    >
                                                        Won
                                                    </button>
                                                    <button
                                                        onClick={() => updateStage(opp.id, 'Lost')}
                                                        className="text-[10px] text-red-600 hover:text-red-800 bg-red-50 px-1.5 py-0.5 rounded border border-red-100"
                                                        title="Mark as Lost"
                                                    >
                                                        Lost
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isModalOpen && <OpportunityModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}
