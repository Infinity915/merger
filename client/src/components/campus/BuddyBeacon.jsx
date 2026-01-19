import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar } from '@/components/ui/avatar.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useTheme } from '@/lib/theme.js';
import {
    getBuddyBeaconFeed,
    getMyBeaconPosts,
    getAppliedPosts,
    acceptApplication,
    rejectApplication,
    deleteMyPost
} from '@/lib/api.js';
import { loadScoped, saveScoped } from '@/lib/session.js';
import LoadingSpinner from '@/components/animations/LoadingSpinner';
import api from '@/lib/api.js';

export default function BuddyBeacon({ user }) {
    const { theme } = useTheme();

    // State for data from the API
    const [posts, setPosts] = useState([]);
    const [myPosts, setMyPosts] = useState([]);
    const [appliedPosts, setAppliedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventName, setEventName] = useState('');

    // State for UI interactions
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [applicationData, setApplicationData] = useState({
        message: '',
        relevantSkills: [],
        newSkill: ''
    });
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [rejectionData, setRejectionData] = useState({ applicationId: '', postId: '', reason: '', note: '' });

    // Tabs: All, My Posts, Applied Posts (rightmost)
    const filters = [
        { id: 'all', label: 'All Posts', count: posts.length },
        { id: 'my-posts', label: 'My Posts', count: myPosts.length },
        { id: 'applied-posts', label: 'Applied Posts', count: appliedPosts.length }
    ];

    useEffect(() => {
        const fetchFeed = async () => {
            setIsLoading(true);
            try {
                const feedRes = await getBuddyBeaconFeed();
                console.log("API Response:", feedRes.data); // Debugging API response
                console.log("Post Map Debug:", feedRes.data.map(postMap => postMap.post)); // Debugging post structure
                setPosts(feedRes.data.map(postMap => ({
                    id: postMap.post.id || postMap.post.postId, // Ensure ID mapping
                    title: postMap.post.title || postMap.post.eventName,
                    description: postMap.post.description,
                    requiredSkills: postMap.post.requiredSkills,
                    createdAt: postMap.post.createdAt,
                    author: postMap.post.author,
                    teamSize: postMap.post.teamSize,
                    currentMembers: postMap.post.currentTeamMembers,
                    hasApplied: postMap.hasApplied,
                    status: postMap.status,
                    hoursElapsed: postMap.hoursElapsed
                })));
                const myRes = await getMyBeaconPosts();
                let my = myRes.data || [];
                const appliedRes = await getAppliedPosts();
                let applied = appliedRes.data || [];

                // Merge any locally pending team posts for this user (created while offline)
                const pending = loadScoped(user?.email, 'pendingTeamPosts') || [];
                if (pending.length) {
                    // add pending to posts and myPosts
                    const pendingMap = pending.map(p => ({ post: p, hasApplied: false, hostId: p.author?.id || user?.id, hoursElapsed: 0 }));
                    setPosts(prev => [...pendingMap, ...prev]);
                    my = [...pending, ...my];
                }

                setMyPosts(my);
                setAppliedPosts(applied);
            } catch (err) {
                setError('Could not fetch posts.');
                // Load pending posts from local storage as fallback
                const pending = loadScoped(user?.email, 'pendingTeamPosts') || [];
                if (pending.length) {
                    const pendingMap = pending.map(p => ({ post: p, hasApplied: false, hostId: p.author?.id || user?.id, hoursElapsed: 0 }));
                    setPosts(pendingMap);
                    setMyPosts(pending);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeed();
    }, []);

    useEffect(() => {
        const fetchFeed = async () => {
            setIsLoading(true);
            try {
                const feedRes = await getBuddyBeaconFeed();
                setPosts(feedRes.data);
                const myRes = await getMyBeaconPosts();
                setMyPosts(myRes.data);
            } catch (err) {
                setError('Could not fetch posts.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeed();
    }, []);

    const filteredPosts = useMemo(() => {
        // NOTE: Your full filtering logic should be here
        return posts.filter(post => {
            if (!searchQuery.trim()) return true;
            const lowercasedQuery = searchQuery.toLowerCase();
            return (
                post.eventName?.toLowerCase().includes(lowercasedQuery) ||
                post.description?.toLowerCase().includes(lowercasedQuery) ||
                post.requiredSkills?.some(skill => skill.toLowerCase().includes(lowercasedQuery))
            );
        });
    }, [posts, activeFilter, searchQuery, user]);

    // Helper to get post lifecycle state
    const getPostState = (createdAt) => {
        if (!createdAt) return 'active';
        const hours = (Date.now() - new Date(createdAt).getTime()) / 36e5;
        if (hours < 20) return 'active';
        if (hours < 24) return 'review';
        return 'expired';
    };

    // Updated Post Card rendering
    // Backend-driven post card rendering
    const renderPostCard = (postMap, isHostView = false) => {
        const post = postMap.post || postMap;
        const hasApplied = postMap.hasApplied;
        const hoursElapsed = postMap.hoursElapsed;
        const status = postMap.status;
        const hostId = postMap.hostId;
        const isOwnPost = hostId === user?.id;
        const currentTeamSize = post.currentMembers?.length || 1;

        // Button logic
        let buttonLabel = 'Apply';
        let buttonDisabled = false;
        if (hasApplied) {
            buttonLabel = 'Applied';
            buttonDisabled = true;
        } else if (hoursElapsed >= 20 && hoursElapsed < 24) {
            buttonLabel = 'Reviewing';
            buttonDisabled = true;
        } else if (isOwnPost) {
            buttonLabel = 'Manage';
            buttonDisabled = false;
        }

        return (
            <Card key={post.id} className="transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar src={post.author?.profilePic} alt={post.author?.name} />
                            <div className="ml-4">
                                <h3 className="text-lg font-bold">{post.author?.name}</h3>
                                <p className="text-sm text-gray-500">{post.author?.college}</p>
                            </div>
                        </div>
                        <Badge variant="info">Team Request</Badge>
                    </div>
                    <h2 className="mt-4 text-xl font-bold">{post.title}</h2>
                    <p className="mt-2 text-gray-700">{post.description}</p>
                    <div className="mt-4">
                        <h4 className="text-sm font-bold">Required Skills:</h4>
                        <div className="flex flex-wrap mt-2">
                            {post.requiredSkills?.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            {hoursElapsed < 24 ? `${24 - hoursElapsed} hours remaining` : 'Expired'}
                        </p>
                        <p className="text-sm text-gray-500">
                            {currentTeamSize}/{post.teamSize} spots filled
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            if (!buttonDisabled) {
                                handleApplyToTeam(post);
                            }
                        }}
                        disabled={buttonDisabled}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    >
                        {buttonLabel}
                    </Button>
                </CardContent>
            </Card>
        );
    };

    // Accept/Reject handlers
    const handleAccept = async (applicationId, postId) => {
        try {
            await acceptApplication(applicationId, postId);
            alert('User invited to Collab Pod!');
            // Optionally refresh myPosts
        } catch (err) {
            alert('Error accepting applicant.');
        }
    };
    const openRejectionModal = (applicationId, postId) => {
        setRejectionData({ applicationId, postId, reason: '', note: '' });
        setShowRejectionModal(true);
    };
    const handleReject = async () => {
        try {
            await rejectApplication(rejectionData.applicationId, rejectionData.postId, rejectionData.reason, rejectionData.note);
            setShowRejectionModal(false);
            alert('Applicant rejected.');
            // Optionally refresh myPosts
        } catch (err) {
            alert('Error rejecting applicant.');
        }
    };
    const handleDeletePost = async (postId) => {
        try {
            await deleteMyPost(postId);
            alert('Post deleted.');
            // Optionally refresh myPosts
        } catch (err) {
            alert('Error deleting post.');
        }
    };

    // Function to begin apply flow: open modal for message input
    const handleApplyToTeam = (post) => {
        setSelectedPost(post);
        setApplicationData({ message: '', relevantSkills: [], newSkill: '' });
        setShowApplicationModal(true);
    };

    const MAX_MESSAGE_LENGTH = 300;

    const addSkill = () => {
        const val = (applicationData.newSkill || '').trim();
        if (!val) return;
        if ((applicationData.relevantSkills || []).includes(val)) {
            setApplicationData(prev => ({ ...prev, newSkill: '' }));
            return;
        }
        setApplicationData(prev => ({ ...prev, relevantSkills: [...(prev.relevantSkills || []), val], newSkill: '' }));
    };

    const removeSkill = (skill) => {
        setApplicationData(prev => ({ ...prev, relevantSkills: (prev.relevantSkills || []).filter(s => s !== skill) }));
    };

    const handleSubmitApplication = async () => {
        if (!selectedPost) return;
        const msg = (applicationData.message || '').trim();
        if (!msg || msg.length > MAX_MESSAGE_LENGTH) return;
        try {
            const res = await api.post(`/api/beacon/apply/${selectedPost.id}`, { message: msg });
            // Update UI
            setShowApplicationModal(false);
            setAppliedPosts(prev => [...prev, { applicationId: res.data.id, post: selectedPost, applicationStatus: res.data.status }]);
            setPosts(prev => prev.map(p => p.id === selectedPost.id ? { ...p, hasApplied: true } : p));
            setSelectedPost(null);
            setApplicationData({ message: '', relevantSkills: [], newSkill: '' });
            alert('Application Submitted Successfully!');
        } catch (err) {
            console.error('Error applying to team:', err);
            alert('Failed to apply to the team. Please try again later.');
        }
    };

    const renderAppliedPosts = () => {
        return appliedPosts.map(postMap => renderPostCard(postMap));
    };

    const renderTabs = () => {
        switch (activeFilter) {
            case 'my-posts':
                return myPosts.map(postMap => renderPostCard(postMap));
            case 'applied-posts':
                return renderAppliedPosts();
            default:
                return filteredPosts.map(postMap => renderPostCard(postMap));
        }
    };

    const renderPosts = () => {
        if (isLoading) {
            return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
        }
        if (error) {
            return <div className="text-center text-red-400 p-12">{error}</div>;
        }
        if (filteredPosts.length === 0) {
            return (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
                        <p className="text-muted-foreground">
                            {'No posts match your search criteria.'}
                        </p>
                    </CardContent>
                </Card>
            );
        }
        return filteredPosts.map((post) => renderPostCard(post, false));
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold gradient-text">🔍 Buddy Beacon</h1>
                <p className="text-lg text-muted-foreground">
                    {'Find teammates for events and projects'}
                </p>
            </div>
            <div className="max-w-2xl mx-auto">
                <Input placeholder="Search by event or skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-xl p-4 text-lg w-full" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {filters.map((filter, idx) => (
                    <Button
                        key={filter.id}
                        variant={activeFilter === filter.id ? 'default' : 'outline'}
                        onClick={() => setActiveFilter(filter.id)}
                        style={filter.id === 'applied-posts' ? { order: 2 } : filter.id === 'my-posts' ? { order: 1 } : { order: 0 }}
                    >
                        {filter.label} <Badge variant="secondary" className="ml-2">{filter.count}</Badge>
                    </Button>
                ))}
            </div>
            <div className="space-y-6">{
                (() => {
                    if (isLoading) {
                        return <div className="flex justify-center p-12"><LoadingSpinner /></div>;
                    }
                    if (error) {
                        return <div className="text-center text-red-400 p-12">{error}</div>;
                    }
                    if (activeFilter === 'applied-posts') {
                        if (!appliedPosts.length) return <div>No applied posts found.</div>;
                        return (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {appliedPosts.map((item, idx) => {
                                    const key = item.applicationId || item.post?.id || `applied-${idx}`;
                                    return (
                                        <li key={key} style={{ border: '1px solid #eee', margin: 8, padding: 12, borderRadius: 8 }}>
                                            <div><b>{item.post?.title || item.post?.content || 'Untitled Post'}</b></div>
                                            <div>Status: <span>{item.applicationStatus}</span></div>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    }
                    if (activeFilter === 'my-posts') {
                        if (!myPosts.length) return <div>No posts found.</div>;
                        return myPosts.map((p) => renderPostCard(p.post, true));
                    }
                    if (filteredPosts.length === 0) {
                        return (
                            <Card className="text-center py-12">
                                <CardContent>
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
                                    <p className="text-muted-foreground">
                                        {'No posts match your search criteria.'}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    }
                    return filteredPosts.map((post) => renderPostCard(post, false));
                })()
            }</div>
            {showApplicationModal && selectedPost && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-bold">Apply to Team</h3>
                                <p className="text-muted-foreground">{selectedPost.eventName}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowApplicationModal(false)} className="rounded-full">✕</Button>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-2">Team Details:</h4>
                                <div className="space-y-1 text-sm text-blue-700">
                                    <div><strong>Leader:</strong> {selectedPost?.author?.name || selectedPost?.authorName || 'Unknown'}</div>
                                    <div><strong>Current Size:</strong> {(selectedPost?.applicants?.length || selectedPost?.currentMembers?.length || 0) + 1}/{selectedPost?.maxTeamSize || selectedPost?.teamSize || 'N/A'} members</div>
                                    <div><strong>Skills Needed:</strong> {Array.isArray(selectedPost?.requiredSkills) ? selectedPost.requiredSkills.join(', ') : (selectedPost?.requiredSkills || 'None')}</div>
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold mb-3 text-lg">Your Relevant Skills</label>
                                <div className="space-y-3">
                                    {applicationData.relevantSkills.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {applicationData.relevantSkills.map((skill) => (
                                                <Badge key={skill} variant="outline" className="cursor-pointer hover:bg-destructive/10" onClick={() => removeSkill(skill)}>
                                                    {skill} ✕
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex space-x-2">
                                        <Input placeholder="Add a skill..." value={applicationData.newSkill} onChange={(e) => setApplicationData(prev => ({ ...prev, newSkill: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addSkill()} className="rounded-xl" />
                                        <Button variant="outline" onClick={addSkill} className="rounded-xl">Add</Button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold mb-3 text-lg">Why do you want to join this team? *</label>
                                <Textarea placeholder="Tell them about your experience..." value={applicationData.message} onChange={(e) => setApplicationData(prev => ({ ...prev, message: e.target.value }))} rows={4} className="rounded-xl p-4" />
                                <div className="text-sm text-right mt-1" style={{ color: (applicationData.message || '').length > MAX_MESSAGE_LENGTH ? 'red' : undefined }}>
                                    {(applicationData.message || '').length}/{MAX_MESSAGE_LENGTH}
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Button onClick={handleSubmitApplication} disabled={!applicationData.message.trim() || (applicationData.message || '').length > MAX_MESSAGE_LENGTH} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                                    🚀 Submit Application
                                </Button>
                                <Button variant="outline" onClick={() => setShowApplicationModal(false)} className="py-3 rounded-xl">Cancel</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <Card className="max-w-md w-full p-8 rounded-2xl shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Reject Applicant</h3>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Reason</label>
                            <select value={rejectionData.reason} onChange={e => setRejectionData(prev => ({ ...prev, reason: e.target.value }))} className="w-full p-2 rounded">
                                <option value="">Select reason...</option>
                                <option value="NOT_A_GOOD_FIT">Skill mismatch</option>
                                <option value="TEAM_FULL">Team full</option>
                                <option value="LATE_APPLICATION">Late application</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Custom Note (optional)</label>
                            <Textarea value={rejectionData.note} onChange={e => setRejectionData(prev => ({ ...prev, note: e.target.value }))} rows={3} className="w-full p-2 rounded" />
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={handleReject} disabled={!rejectionData.reason}>Reject</Button>
                            <Button variant="outline" onClick={() => setShowRejectionModal(false)}>Cancel</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}