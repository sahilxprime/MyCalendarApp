import { memo } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { getUpcomingHolidays } from '../utils/dateUtils';

export const AgendaView = memo(function AgendaView() {
    const upcomingHolidays = getUpcomingHolidays(new Date("2026-01-01T00:00:00"), 20); // Get next 20 holidays from start of 2026

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="pt-2 pb-24 space-y-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4 px-2"
            >
                {upcomingHolidays.map((holiday, index) => {
                    const date = parseISO(holiday.date);
                    const monthStr = format(date, 'MMM');
                    const dayStr = format(date, 'd');
                    const dayOfWeekStr = format(date, 'EEEE');

                    // Add month dividers if it's the first item of a new month
                    const showMonthDivider = index === 0 || format(parseISO(upcomingHolidays[index - 1].date), 'MMM') !== monthStr;

                    return (
                        <div key={holiday.id}>
                            {showMonthDivider && (
                                <div className="flex items-center mt-6 mb-4">
                                    <h3 className="text-xl font-bold tracking-tight">{format(date, 'MMMM yyyy')}</h3>
                                    <div className="ml-4 flex-1 h-[1px] bg-ios-gray-light/50" />
                                </div>
                            )}

                            <motion.div
                                variants={itemVariants}
                                className="bg-ios-card rounded-3xl p-5 shadow-sm border border-ios-gray-light flex items-center mb-4 overflow-hidden relative group active:scale-[0.98] transition-transform"
                            >
                                {/* Decoration edge line */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80"
                                    style={{ backgroundColor: holiday.color }}
                                />

                                <div className="flex flex-col items-center justify-center min-w-[60px] pr-4 border-r border-ios-gray-light/40">
                                    <span className="text-sm font-semibold text-ios-red uppercase tracking-wide">{monthStr}</span>
                                    <span className="text-3xl font-bold tracking-tighter -mt-1">{dayStr}</span>
                                </div>

                                <div className="pl-5 flex-1 flex items-center justify-between">
                                    <div>
                                        <h4 className="text-[17px] font-semibold tracking-tight">{holiday.name}</h4>
                                        <span className="text-xs text-ios-gray font-medium mt-0.5 block">
                                            {dayOfWeekStr} • {holiday.type.charAt(0).toUpperCase() + holiday.type.slice(1)}
                                        </span>
                                    </div>
                                    <div className="text-4xl pl-2 drop-shadow-sm">
                                        {holiday.emoji}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
});
