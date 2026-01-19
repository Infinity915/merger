import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar } from '@/components/ui/avatar.jsx';
import api from '@/lib/api.js';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { useTheme } from '@/lib/theme.js';
import { useNavigate } from 'react-router-dom';

// Custom hook to fetch and manage CampusFeed posts (ASK_HELP, OFFER_HELP, POLL, LOOKING_FOR only)
const usePosts = (activeFilter) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true
    const fetchPosts = async () => {
      setLoading(true)
      try {
        let url = '/api/posts'
        if (activeFilter && activeFilter !== 'all') url += `?type=${activeFilter}`
        const response = await api.get(url)
        if (!mounted) return
        // Filter to ONLY show CampusFeed post types: ASK_HELP, OFFER_HELP, POLL, LOOKING_FOR
        const CAMPUS_TYPES = ['ASK_HELP', 'OFFER_HELP', 'POLL', 'LOOKING_FOR'];
        const normalizedPosts = (response.data || [])
          .filter(post => CAMPUS_TYPES.includes(post.type || post.postType))
          .map(post => ({
            ...post,
            postType: post.postType || post.type || 'GENERAL',
            type: post.type || post.postType || 'GENERAL'
          }))
        setPosts(normalizedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      } catch (err) {
        if (!mounted) return
        setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPosts()
    return () => { mounted = false }
  }, [activeFilter])

  return { posts, setPosts, loading, error };
};

// Post type definitions and UI labels/icons
const RESTRICTED_POST_TYPES = [
  { id: 'ASK_HELP', label: '🔴 Ask for Help', icon: '❓', color: 'text-red-400' },
  { id: 'OFFER_HELP', label: '🟢 SOS Offer Help', icon: '🆘', color: 'text-green-400' },
  { id: 'POLL', label: '🔵 Poll', icon: '📊', color: 'text-blue-400' },
  { id: 'LOOKING_FOR', label: '🟣 Looking For...', icon: '👀', color: 'text-violet-400' },
];

export default function CampusFeed() {
  // Simulate current user ID (replace with real user ID in production)
  const currentUserId = "placeholder-user-id";
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('ASK_HELP');
  const { posts, setPosts, loading, error } = usePosts(activeFilter);
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    let mounted = true
    const fetchCounts = async () => {
      try {
        const res = await api.get('/api/posts?type=ASK_HELP,OFFER_HELP,POLL,LOOKING_FOR')
        if (!mounted) return
        const data = res.data || []
        const CAMPUS_TYPES = ['ASK_HELP', 'OFFER_HELP', 'POLL', 'LOOKING_FOR'];
        const filtered = data.filter(p => CAMPUS_TYPES.includes(p.type || p.postType))
        const countObj = {
          ASK_HELP: filtered.filter(p => (p.type || p.postType) === 'ASK_HELP').length,
          OFFER_HELP: filtered.filter(p => (p.type || p.postType) === 'OFFER_HELP').length,
          POLL: filtered.filter(p => (p.type || p.postType) === 'POLL').length,
          LOOKING_FOR: filtered.filter(p => (p.type || p.postType) === 'LOOKING_FOR').length
        }
        setCounts(countObj)
      } catch (e) {
        // ignore
      }
    }
    fetchCounts()
    return () => { mounted = false }
  }, [])

  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(null);

  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [pollOptions, setPollOptions] = useState(['', '']);

  // Form helper functions for polls
  const handlePollOptionChange = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };
  const addPollOption = () => {
    if (pollOptions.length < 5) setPollOptions([...pollOptions, '']);
  };
  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  // Function to create any type of post
  const handleCreatePost = async () => {
    if (!selectedPostType || !newPost.title.trim()) {
      alert('Please select a post type and fill in the title.');
      return;
    }

    // For LOOKING_FOR posts we send a social post to the server and
    // the backend will create a CollabPod and link it. No special-case here.

    try {
      const isSocialPost = ['POLL', 'ASK_HELP', 'OFFER_HELP', 'LOOKING_FOR'].includes(selectedPostType);
      const payload = {
        title: newPost.title,
        content: newPost.content,
        type: selectedPostType,
        authorId: "placeholder-user-id",
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      if (selectedPostType === 'POLL') {
        payload.pollOptions = pollOptions.filter(opt => opt.trim() !== '').map(opt => ({ text: opt }));
        if (payload.pollOptions.length < 2) {
          alert('A poll must have at least two options.');
          return;
        }
      }
      // Use the correct endpoint based on post type
      const endpoint = isSocialPost ? '/api/posts/social' : '/api/posts/team-finding';

      const response = await api.post(endpoint, payload);
      setPosts(currentPosts => [response.data, ...currentPosts]);
    } catch (err) {
      console.error('Failed to create post:', err);
      alert('Failed to create post. Please try again.');
    } finally {
      setShowCreatePost(false);
      setSelectedPostType(null);
      setNewPost({ title: '', content: '' });
      setPollOptions(['', '']);
    }
  };

  // Function to handle voting
  const handleVote = async (postId, optionId) => {
    try {
      const response = await api.put(`/api/posts/${postId}/vote/${optionId}`);
      const updatedPost = response.data;
      setPosts(currentPosts => currentPosts.map(p => p.id === postId ? updatedPost : p));
    } catch (err) {
      console.error('Failed to vote:', err);
      alert('Failed to cast vote.');
    }
  };

  const filters = [
    { id: 'ASK_HELP', label: 'Ask for Help', count: (counts && counts.ASK_HELP) ? counts.ASK_HELP : posts.filter(p => p.postType === 'ASK_HELP').length },
    { id: 'OFFER_HELP', label: 'Offer Help', count: (counts && counts.OFFER_HELP) ? counts.OFFER_HELP : posts.filter(p => p.postType === 'OFFER_HELP').length },
    { id: 'POLL', label: 'Polls', count: (counts && counts.POLL) ? counts.POLL : posts.filter(p => p.postType === 'POLL').length },
    { id: 'LOOKING_FOR', label: 'Looking For', count: (counts && counts.LOOKING_FOR) ? counts.LOOKING_FOR : posts.filter(p => p.postType === 'LOOKING_FOR').length },
  ];

  const getFilteredPosts = () => {
    if (activeFilter === 'all') return posts;
    return posts.filter(post => {
      if (activeFilter === 'POLL' && post.pollOptions && post.pollOptions.length > 0) {
        return true;
      }
      return post.postType === activeFilter;
    });
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Could not load feed.</div>;

  return (
    <div className="space-y-8">
      {/* --- Header & Create Post Button --- */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text">Campus Feed</h1>
        <p className="text-lg text-muted-foreground">Connect with your campus community</p>
      </div>
      <div className="flex justify-center">
        <Button onClick={() => setShowCreatePost(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg">✨ Create Post</Button>
      </div>

      {/* --- Filter Tabs --- */}
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-muted/30 rounded-xl">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${activeFilter === filter.id
              ? 'bg-primary text-primary-foreground shadow-md transform scale-105'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
          >
            <div className="flex items-center space-x-2">
              <span>{filter.label}</span>
              <Badge variant="outline" className="text-xs">{filter.count}</Badge>
            </div>
          </button>
        ))}
      </div>

      {/* --- Posts Display --- */}
      <div className="space-y-6">
        {getFilteredPosts().map((post) => {
          const typeInfo = RESTRICTED_POST_TYPES.find(t => t.id === post.postType) || {};
          const pollOptions = post.pollOptions || [];
          const totalVotes = post.postType === 'POLL'
            ? pollOptions.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0)
            : 0;

          // Check if current user has already voted in this poll
          let userHasVoted = false;
          if (post.postType === 'POLL' && pollOptions.length > 0) {
            userHasVoted = pollOptions.some(opt => Array.isArray(opt.votes) && opt.votes.includes(currentUserId));
          }

          return (
            <Card key={post.id} className="bg-slate-800/20 border-slate-700 text-white backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 bg-slate-600">U</Avatar>
                    <div>
                      <div className="font-semibold">Anonymous User</div>
                      <div className="text-sm text-slate-400">
                        {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`border-slate-600 bg-slate-700/50 font-semibold ${typeInfo.color || ''}`}>{typeInfo.icon} {typeInfo.label || 'Post'}</Badge>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-xl">{post.title}</h3>
                  {post.content && <p className="text-slate-300">{post.content}</p>}

                  {/* Poll Rendering Logic */}
                  {post.postType === 'POLL' && pollOptions.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {pollOptions.map((option, index) => {
                        const voteCount = option.votes?.length || 0;
                        const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                        return (
                          <button
                            key={option.id || index}
                            onClick={() => {
                              if (!userHasVoted) handleVote(post.id, option.id || index);
                            }}
                            className={`w-full relative p-3 rounded-lg border border-slate-700 text-left bg-slate-900/30 transition-colors ${userHasVoted ? 'opacity-70 cursor-not-allowed' : 'hover:bg-slate-800/50'}`}
                            disabled={userHasVoted}
                          >
                            <div
                              className="absolute left-0 top-0 bottom-0 bg-blue-500/30 rounded-lg transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                            <div className="flex justify-between items-center relative z-10">
                              <span className="font-medium text-slate-100">{option.text}</span>
                              <span className="text-sm font-bold text-slate-300">{voteCount}</span>
                            </div>
                          </button>
                        );
                      })}
                      <div className="text-sm text-slate-400 text-right pr-2">Total votes: {totalVotes}</div>

                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-700">
                  {post.postType === 'LOOKING_FOR' ? (
                    <div className="text-slate-400">&nbsp;</div>
                  ) : post.postType === 'POLL' ? (
                    <div className="text-slate-400">Total votes: {post.pollOptions?.reduce((s, o) => s + (o.votes?.length || 0), 0)}</div>
                  ) : (
                    <div className="flex items-center space-x-6 text-slate-400">
                      <button className="flex items-center gap-2 hover:text-white"><span>👍</span>{post.likes?.length || 0}</button>
                      <button onClick={() => navigate(`/post/${post.id}/comments`)} className="flex items-center gap-2 hover:text-white"><span>💬</span>{post.comments?.length || 0}</button>
                      <button className="flex items-center gap-2 hover:text-white"><span>🔗</span>Share</button>
                    </div>
                  )}

                  {post.postType === 'LOOKING_FOR' ? (
                    <Button onClick={() => {
                      if (post.linkedPodId) navigate(`/collab-pods/${post.linkedPodId}`)
                      else alert('Pod is being prepared. Please try again shortly.')
                    }} className="bg-gradient-to-r from-green-600 to-teal-600 text-white">Join</Button>
                  ) : (
                    <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 hover:bg-slate-700">Reply</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* --- Create Post Modal --- */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full p-8 shadow-2xl bg-slate-900/80 border-slate-700 text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create New Post</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreatePost(false)} className="hover:bg-slate-700">✕</Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2 text-slate-300">Post Type *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {RESTRICTED_POST_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedPostType(type.id)}
                      className={`p-4 border-2 rounded-xl text-center transition-colors ${selectedPostType === type.id ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'}`}
                    >
                      <div className="text-2xl">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-slate-300">Title *</label>
                <Input placeholder="What's the title?" value={newPost.title} onChange={(e) => setNewPost(p => ({ ...p, title: e.target.value }))} className="bg-slate-800/50 border-slate-700 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-slate-300">Content / Description</label>
                <Textarea placeholder="What are the details?" value={newPost.content} onChange={(e) => setNewPost(p => ({ ...p, content: e.target.value }))} className="bg-slate-800/50 border-slate-700 focus:ring-blue-500" />
              </div>

              {selectedPostType === 'POLL' && (
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">Poll Options *</label>
                  <div className="space-y-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handlePollOptionChange(index, e.target.value)} className="bg-slate-800/50 border-slate-700 focus:ring-blue-500" />
                        {pollOptions.length > 2 && <Button variant="ghost" size="sm" onClick={() => removePollOption(index)} className="hover:bg-slate-700">✕</Button>}
                      </div>
                    ))}
                    {pollOptions.length < 5 && <Button variant="outline" size="sm" onClick={addPollOption} className="border-slate-700 bg-slate-800/50 hover:bg-slate-700">+ Add Option</Button>}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => setShowCreatePost(false)} className="hover:bg-slate-700">Cancel</Button>
                <Button onClick={handleCreatePost} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Create Post</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}