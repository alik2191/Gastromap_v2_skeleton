import React, { useState } from 'react'
import PageHeader from '@/components/layout/public/PageHeader'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

const ContactPage = () => {
    const [status, setStatus] = useState('idle')

    const handleSubmit = (e) => {
        e.preventDefault()
        setStatus('sending')
        setTimeout(() => {
            setStatus('success')
        }, 1500)
    }

    return (
        <div className="bg-base-100 min-h-screen">
            <PageHeader
                title="Get in Touch"
                subtitle="Have a question or improved a hidden gem? Let us know."
                highlight="Contact"
            />

            <section className="py-20 px-6">
                <div className="container mx-auto max-w-2xl bg-base-100 rounded-[40px] border border-base-200 shadow-xl p-8 md:p-12">
                    {status === 'success' ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                            <p className="text-gray-500">We'll get back to you as soon as possible.</p>
                            <Button variant="outline" className="mt-8 rounded-full" onClick={() => setStatus('idle')}>Send another</Button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-base-content ml-1">Name</label>
                                <input required type="text" className="input input-bordered w-full h-12 px-4 rounded-xl bg-base-200 transition-all font-medium" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-base-content ml-1">Email</label>
                                <input required type="email" className="input input-bordered w-full h-12 px-4 rounded-xl bg-base-200 transition-all font-medium" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 ml-1">Subject</label>
                                <select className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-600">
                                    <option>General Inquiry</option>
                                    <option>Support</option>
                                    <option>Partnership</option>
                                    <option>Report a Bug</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-base-content ml-1">Message</label>
                                <textarea required rows={5} className="textarea textarea-bordered w-full p-4 rounded-xl bg-base-200 transition-all font-medium" placeholder="How can we help?" />
                            </div>

                            <Button type="submit" className="btn btn-primary w-full h-14 rounded-full text-lg shadow-lg" disabled={status === 'sending'}>
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    )
}

export default ContactPage
