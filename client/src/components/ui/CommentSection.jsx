import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Avatar } from "@/components/ui/avatar.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

function Comment({ comment, onReply, user, postId }) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    if (!replyText.trim()) return;
    await onReply(comment.id, replyText);
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div style={{ marginLeft: comment.parentId ? 24 : 0, marginTop: 12 }}>
      <div className="flex items-center space-x-2">
        <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 text-white text-sm">
          {comment.authorName?.charAt(0) || "U"}
        </Avatar>
        <b>{comment.authorName}</b>
        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
      </div>
      <div className="ml-10 mb-2 text-sm">{comment.content}</div>
      <Button size="xs" variant="outline" onClick={() => setShowReply(!showReply)}>
        Reply
      </Button>
      {showReply && (
        <div className="flex space-x-2 mt-2 ml-10">
          <Input
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="rounded-xl"
          />
          <Button size="sm" onClick={handleReply} className="rounded-xl">Send</Button>
        </div>
      )}
      {comment.replies && comment.replies.map(reply => (
        <Comment key={reply.id} comment={reply} onReply={onReply} user={user} postId={postId} />
      ))}
    </div>
  );
}

export default function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    api.get(`/api/posts/${postId}`).then(res => {
      setComments(res.data.comments || []);
    });
  }, [postId]);

  const handleAddComment = async (parentId, content) => {
    await api.post(`/api/posts/${postId}/comment`, {
      content,
      parentId,
      authorName: user?.fullName || user?.name || "You",
    });
    // Refresh comments after posting
    const res = await api.get(`/api/posts/${postId}/comments`);
    setComments(res.data || []);
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm">
          {user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'Y'}
        </Avatar>
        <Input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="rounded-xl"
        />
        <Button
          size="sm"
          onClick={() => {
            if (newComment.trim()) {
              handleAddComment(null, newComment);
              setNewComment("");
            }
          }}
          className="rounded-xl"
        >
          Comment
        </Button>
      </div>
      <div>
        {comments.filter(c => !c.parentId).map(comment => (
          <Comment key={comment.id} comment={comment} onReply={handleAddComment} user={user} postId={postId} />
        ))}
      </div>
    </div>
  );
}
