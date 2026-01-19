import { useEffect, useState, useCallback } from 'react'
import useCommentWs from '@/hooks/useCommentWs'
import ChatBubble from './ChatBubble'

export default function HelpChatSection({ post, currentUserName }) {
    const [comments, setComments] = useState(post.comments || [])

    const handleIncoming = useCallback((payload) => {
        const saved = payload.comment
        const parentId = payload.parentId
        setComments(prev => {
            const copy = JSON.parse(JSON.stringify(prev || []))
            if (!parentId) {
                copy.push(saved)
                return copy
            }
            const appended = (function append(list) {
                for (let c of list) {
                    if (c.id === parentId) { c.replies = c.replies || []; c.replies.push(saved); return true }
                    if (c.replies && c.replies.length) {
                        const ok = append(c.replies)
                        if (ok) return true
                    }
                }
                return false
            })(copy)
            if (!appended) copy.push(saved)
            return copy
        })
    }, [])

    const { send } = useCommentWs({ postId: post.id, onMessage: handleIncoming })

    useEffect(() => { setComments(post.comments || []) }, [post.comments])

    const handleReply = (parentId, content) => {
        send({ content, parentId, authorName: currentUserName })
    }

    return (
        <div className={post.type === 'ASK_HELP' ? 'bg-blue-50 p-3 rounded' : 'bg-white p-3 rounded'}>
            <div className="text-sm text-gray-600 mb-2">Help Chat</div>
            <div className="space-y-3">
                {(comments || []).map(c => (
                    <ChatBubble key={c.id} comment={c} postType={post.type} isOP={c.authorName === post.authorName} onReply={handleReply} />
                ))}
            </div>
            <div className="mt-3">
                <ReplyBox postId={post.id} onSend={(content) => send({ content, parentId: null, authorName: currentUserName })} />
            </div>
        </div>
    )
}

function ReplyBox({ onSend }) {
    const [text, setText] = useState('')
    return (
        <div className="flex gap-2">
            <input className="flex-1 border rounded p-2" value={text} onChange={e => setText(e.target.value)} placeholder="Write a reply..." />
            <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={() => { if (text.trim()) { onSend(text.trim()); setText('') } }}>Send</button>
        </div>
    )
}
