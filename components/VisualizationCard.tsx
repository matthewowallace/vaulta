import React from 'react';

const VisualizationCard = () => {
    // Dummy data representing the image content
    const data = {
        percentage: 45,
        label: "Detect issues faster",
        title: "How does 3D visualization improve task clarity and issue detection on-site?"
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            {/* Card Container */}
            <div className="w-full max-w-xl bg-[#F9F9F7] rounded-xl p-12 shadow-sm border border-gray-100">

                {/* Title Section */}
                <h2 className="text-2xl font-light text-gray-800 leading-tight mb-16">
                    <span className="font-semibold text-black">How does</span> 3D visualization improve task
                    clarity and issue detection on-site?
                </h2>

                {/* Data Display */}
                <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-7xl font-light text-gray-900">{data.percentage}%</span>
                    <span className="text-2xl text-gray-400 font-light">/ {data.label}</span>
                </div>

                {/* Custom Progress Bar */}
                <div className="relative w-full pt-4">
                    {/* Tick Container */}
                    <div className="flex justify-between items-end h-10 w-full gap-[2px]">
                        {[...Array(60)].map((_, i) => {
                            const threshold = (i / 60) * 100;
                            const isActive = threshold <= data.percentage;
                            return (
                                <div
                                    key={i}
                                    className={`h-full w-[2px] transition-colors duration-500 ${
                                        isActive ? 'bg-[#FF5A1F]' : 'bg-[#FF5A1F] opacity-20'
                                    }`}
                                />
                            );
                        })}
                    </div>

                    {/* Indicator Dot/Square */}
                    <div
                        className="absolute top-2 w-3 h-3 bg-[#FF5A1F] transition-all duration-500"
                        style={{ left: `${data.percentage}%`, transform: 'translateX(-50%)' }}
                    />

                    {/* X-Axis Labels */}
                    <div className="flex justify-between mt-4 text-xs font-medium text-gray-400">
                        <span>0</span>
                        <span>20</span>
                        <span>40</span>
                        <span>60</span>
                        <span>80</span>
                        <span>100</span>
                    </div>

                    {/* Axis Line */}
                    <div className="h-[1px] w-full bg-gray-200 mt-1" />
                </div>
            </div>
        </div>
    );
};

export default VisualizationCard;