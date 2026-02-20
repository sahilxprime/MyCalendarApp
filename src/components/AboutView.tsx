import { motion } from 'framer-motion';

export function AboutView() {
    return (
        <div className="pt-8 pb-24 px-2 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-ios-blue to-ios-green rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-6">
                    <span className="text-5xl">📅</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Festivals 2026</h1>
                <p className="text-ios-gray">Version 1.0.0</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-ios-card rounded-3xl overflow-hidden shadow-sm border border-ios-gray-light"
            >
                <div className="p-4 flex items-center justify-between border-b border-ios-gray-light/50">
                    <span className="font-medium">Developer</span>
                    <span className="text-ios-gray">AI Studio</span>
                </div>
                <div className="p-4 flex items-center justify-between border-b border-ios-gray-light/50">
                    <span className="font-medium">Design System</span>
                    <span className="text-ios-gray">iOS Inspired</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                    <span className="font-medium">Technologies</span>
                    <span className="text-ios-gray text-right text-sm">React, Tailwind,<br />Framer Motion</span>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center text-sm text-ios-gray px-6"
            >
                <p>A comprehensive calendar application capturing important dates, and festivals globally.</p>
            </motion.div>
        </div>
    );
}
