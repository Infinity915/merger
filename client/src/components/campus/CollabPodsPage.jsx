import { useEffect, useState } from 'react'
import api from '@/lib/api.js'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { useNavigate } from 'react-router-dom'

export default function CollabPodsPage({ user }) {
    const [pods, setPods] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('looking')
    const navigate = useNavigate()

    useEffect(() => {
        let mounted = true
        const fetchPods = async () => {
            try {
                const res = await api.get('/api/pods')
                if (!mounted) return
                setPods(res.data || [])
            } catch (err) {
                console.error('Failed to load pods', err)
                setError('Could not load pods')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchPods()
        return () => { mounted = false }
    }, [])

    const currentUserId = user?.id || 'placeholder-user-id'

    const lookingForPods = pods.filter(p => p.status === 'ACTIVE' || p.status === 'ACTIVE')
    const myPods = pods.filter(p => Array.isArray(p.memberIds) && p.memberIds.includes(currentUserId))

    if (loading) return <div className="p-4">Loading pods...</div>
    if (error) return <div className="p-4 text-red-500">{error}</div>

    return (
        <div className="space-y-6">
            <div className="flex gap-3">
                <button onClick={() => setActiveTab('looking')} className={`px-4 py-2 rounded ${activeTab === 'looking' ? 'bg-primary text-primary-foreground' : 'bg-muted/20'}`}>Looking For</button>
                <button onClick={() => setActiveTab('mine')} className={`px-4 py-2 rounded ${activeTab === 'mine' ? 'bg-primary text-primary-foreground' : 'bg-muted/20'}`}>My Teams</button>
            </div>

            {activeTab === 'looking' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lookingForPods.map(pod => (
                        <Card key={pod.id} className="bg-slate-800/20 border-slate-700 text-white">
                            <CardContent>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{pod.name}</h3>
                                        <p className="text-sm text-slate-300">{pod.description}</p>
                                        <div className="text-xs text-slate-400 mt-2">Topics: {(pod.topics || []).join(', ')}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-sm text-slate-300">{(pod.memberIds || []).length}/{pod.maxCapacity || '—'}</div>
                                        <Button onClick={() => navigate(`/collab-pods/${pod.id}`)} className="bg-gradient-to-r from-green-600 to-teal-600 text-white">Join</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === 'mine' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myPods.length === 0 && <div className="text-slate-400 p-4">You are not a member of any pods yet.</div>}
                    {myPods.map(pod => (
                        <Card key={pod.id} className="bg-slate-800/20 border-slate-700 text-white">
                            <CardContent>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{pod.name}</h3>
                                        <p className="text-sm text-slate-300">{pod.description}</p>
                                        <div className="text-xs text-slate-400 mt-2">Members: {(pod.memberIds || []).length}/{pod.maxCapacity || '—'}</div>
                                    </div>
                                    <div>
                                        <Button onClick={() => navigate(`/collab-pods/${pod.id}`)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Open</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
