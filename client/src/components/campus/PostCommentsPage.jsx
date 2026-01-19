import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '@/lib/api.js'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import HelpChatSection from '@/components/ui/HelpChatSection.jsx'

export default function PostCommentsPage({ user }) {
    const { postId } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                const res = await api.get(`/api/posts/${postId}`)
                if (mounted) setPost({ ...res.data, type: res.data.postType || res.data.type })
            } catch (err) {
                console.error('Failed to load post', err)
            } finally {
                if (mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [postId])

    if (loading) return <div className="p-6">Loading post...</div>
    if (!post) return <div className="p-6 text-red-500">Post not found.</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
                <div className="text-lg font-semibold">Replies for this post</div>
                <div />
            </div>

            <Card className="bg-slate-800/20 border-slate-700 text-white">
                <CardContent className="p-6">
                    <div className="mb-2 font-semibold">{post.title}</div>
                    {post.content && <div className="text-slate-300 mb-3">{post.content}</div>}
                    <div className="text-sm text-slate-400">{new Date(post.createdAt).toLocaleString()}</div>
                </CardContent>
            </Card>

            <HelpChatSection post={post} currentUserName={user?.fullName || user?.email || 'You'} />
        </div>
    )
}
