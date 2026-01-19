import { useState } from 'react'

export default function ChatBubble({ comment, postType, isOP, onReply }) {
    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState('')

    const handleSend = () => {
        if (!replyText.trim()) return
        onReply(comment.id, replyText)
        setReplyText('')
        setShowReply(false)
    }

    return (
        <div className="pl-4 border-l-2">
            <div className={`p-2 rounded-md ${isOP ? 'bg-yellow-50' : 'bg-white'}`}>
                <div className="text-sm font-medium">{comment.authorName}</div>
                <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
                <div className="mt-2 text-sm">{comment.content}</div>
                <div className="mt-2">
                    <button className="text-xs text-blue-600" onClick={() => setShowReply(s => !s)}>Reply</button>
                </div>
            </div>
            {showReply && (
                <div className="mt-2 ml-4">
                    <textarea className="w-full border rounded p-2" value={replyText} onChange={e => setReplyText(e.target.value)} />
                    <div className="flex gap-2 mt-2">
                        <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={handleSend}>Send</button>
                        <button className="px-2 py-1 border rounded" onClick={() => setShowReply(false)}>Cancel</button>
                    </div>
                </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {comment.replies.map(r => (
                        <ChatBubble key={r.id} comment={r} postType={postType} isOP={isOP} onReply={onReply} />
                    ))}
                </div>
            )}
        </div>
    )
}
