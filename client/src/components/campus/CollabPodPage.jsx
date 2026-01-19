import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import api from '@/lib/api.js'
import usePodWs from '@/hooks/usePodWs'
import ChatBubble from '@/components/ui/ChatBubble.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'

function PodChat({ pod, currentUserName }) {
    const [messages, setMessages] = useState([])

    const handleIncoming = useCallback((payload) => {
        setMessages(prev => [...(prev || []), payload])
    }, [])

    const { send } = usePodWs({ podId: pod.id, onMessage: handleIncoming })

    useEffect(() => { /* could fetch historic messages if stored */ }, [pod.id])

    const sendMessage = (content) => {
        send({ content, parentId: null, authorName: currentUserName })
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600">Pod Chat</div>
            <div className="space-y-3">
                {messages.map((m, idx) => (
                    <ChatBubble key={idx} comment={m} postType={'DISCUSSION'} isOP={false} onReply={() => { }} />
                ))}
            </div>
            <div className="mt-3">
                <div className="flex gap-2">
                    <input className="flex-1 border rounded p-2" placeholder="Say something to the pod..." id="podMessageInput" />
                    <Button onClick={() => { const el = document.getElementById('podMessageInput'); if (el && el.value.trim()) { sendMessage(el.value.trim()); el.value = ''; } }} className="bg-blue-600 text-white">Send</Button>
                </div>
            </div>
        </div>
    )
}

export default function CollabPodPage({ user }) {
    const { podId } = useParams()
    const [pod, setPod] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let mounted = true
        const fetchPod = async () => {
            try {
                const res = await api.get(`/api/pods/${podId}`)
                if (!mounted) return
                setPod(res.data)
            } catch (err) {
                console.error('Failed to load pod', err)
                setError('Could not load pod')
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchPod()
        return () => { mounted = false }
    }, [podId])

    if (loading) return <div className="p-4">Loading pod...</div>
    if (error) return <div className="p-4 text-red-500">{error}</div>
    if (!pod) return <div className="p-4">Pod not found</div>

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardContent>
                    <h2 className="text-2xl font-bold">{pod.name}</h2>
                    <p className="text-sm text-slate-400">{pod.description}</p>
                    <div className="mt-3 text-sm text-slate-300">Members: {pod.memberIds?.length || 0} / {pod.maxCapacity || '—'}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <PodChat pod={pod} currentUserName={user?.fullName || 'You'} />
                </CardContent>
            </Card>
        </div>
    )
}
