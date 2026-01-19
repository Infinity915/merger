import { useEffect, useState } from "react";
import api from "../lib/api";

const statusColors = {
    PENDING: "#facc15", // yellow
    ACCEPTED: "#22c55e", // green
    REJECTED: "#ef4444", // red
};

export default function AppliedPosts() {
    const [appliedPosts, setAppliedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAppliedPosts()
            .then((res) => setAppliedPosts(res.data))
            .catch(() => setAppliedPosts([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!appliedPosts.length) return <div>No applied posts found.</div>;

    return (
        <div>
            <h2>Applied Posts</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {appliedPosts.map(({ post, application }) => (
                    <li key={application.id} style={{ border: "1px solid #eee", margin: 8, padding: 12, borderRadius: 8 }}>
                        <div><b>{post?.title || post?.content || "Untitled Post"}</b></div>
                        <div>Status: <span style={{ color: statusColors[application.status] }}>{application.status}</span></div>
                        <div>Applied at: {application.createdAt ? new Date(application.createdAt).toLocaleString() : "-"}</div>
                        {application.rejectionReason && (
                            <div>Reason: {application.rejectionReason} {application.rejectionNote && `- ${application.rejectionNote}`}</div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
