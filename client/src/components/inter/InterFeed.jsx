import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Avatar } from '@/components/ui/avatar.jsx';
import api from '@/lib/api.js';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';

// Custom hook to fetch and manage InterFeed posts (DISCUSSION, POLL, COLLAB only)
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
        // Filter to ONLY show InterFeed post types: DISCUSSION, POLL, COLLAB
        const INTER_TYPES = ['DISCUSSION', 'POLL', 'COLLAB'];
        const normalizedPosts = (response.data || [])
          .filter(post => INTER_TYPES.includes(post.type || post.postType))
          .map(post => ({
            ...post,
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

// Post type definitions with icons
const POST_TYPES = [
  { id: 'DISCUSSION', label: '💬 Discussion', icon: '💬', description: 'Start meaningful conversations across colleges', color: 'text-blue-400' },
  { id: 'POLL', label: '📊 Poll', icon: '📊', description: 'Create interactive, single-answer polls', color: 'text-cyan-400' },
  { id: 'COLLAB', label: '🤝 Collab', icon: '🤝', description: 'Post a collaboration opportunity', color: 'text-green-400' },
];

export default function InterFeed({ user }) {
  const currentUserId = user?.id || "placeholder-user-id";
  const [activeFilter, setActiveFilter] = useState('DISCUSSION');
  const { posts, setPosts, loading, error } = usePosts(activeFilter);
  const [counts, setCounts] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [skillTags, setSkillTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [expandedComments, setExpandedComments] = useState({});

  // Fetch counts for filter badges
  useEffect(() => {
    let mounted = true
    const fetchCounts = async () => {
      try {
        const res = await api.get('/api/posts?type=DISCUSSION,POLL,COLLAB')
        if (!mounted) return
        const data = res.data || []
        const countObj = {
          DISCUSSION: data.filter(p => p.type === 'DISCUSSION').length,
          POLL: data.filter(p => p.type === 'POLL').length,
          COLLAB: data.filter(p => p.type === 'COLLAB').length
        }
        setCounts(countObj)
      } catch (e) {
        // ignore
      }
    }
    fetchCounts()
    return () => { mounted = false }
  }, [])

  // Poll helpers
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

  // Tag helpers
  const addSkillTag = () => {
    if (newTag.trim() && !skillTags.includes(newTag.trim())) {
      setSkillTags([...skillTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeSkillTag = (tag) => {
    setSkillTags(skillTags.filter(t => t !== tag));
  };

  // Get filtered posts list
  const getFilteredPosts = () => {
    if (activeFilter === 'all') return posts;
    return posts.filter(post => {
      if (activeFilter === 'POLL' && post.pollOptions && post.pollOptions.length > 0) {
        return true;
      }
      return post.type === activeFilter;
    });
  };

  const filters = [
    { id: 'DISCUSSION', label: 'Discussion', count: (counts && counts.DISCUSSION) ? counts.DISCUSSION : posts.filter(p => p.type === 'DISCUSSION').length },
    { id: 'POLL', label: 'Polls', count: (counts && counts.POLL) ? counts.POLL : posts.filter(p => p.type === 'POLL').length },
    { id: 'COLLAB', label: 'Collab', count: (counts && counts.COLLAB) ? counts.COLLAB : posts.filter(p => p.type === 'COLLAB').length },
  ];

  // Create post
  const handleCreatePost = async () => {
    if (!selectedPostType || !newPost.title.trim()) {
      alert('Please select a post type and fill in the title.');
      return;
    }

    try {
      // Only send fields the backend expects
      const payload = {
        title: newPost.title,
        content: newPost.content || newPost.title,
        type: selectedPostType.toUpperCase(),
        requiredSkills: skillTags,
        likes: [],
        comments: []
      };

      if (selectedPostType === 'POLL') {
        payload.pollOptions = pollOptions.filter(opt => opt.trim() !== '').map(opt => ({ text: opt, votes: [] }));
        if (payload.pollOptions.length < 2) {
          alert('A poll must have at least two options.');
          return;
        }
      } else {
        payload.pollOptions = [];
      }

      console.log('Sending payload:', payload);
      const response = await api.post('/api/posts/social', payload);
      console.log('Post created:', response.data);
      setPosts(currentPosts => [response.data, ...currentPosts]);
      alert('Post created successfully!');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Failed to create post. Please try again. ' + (err.response?.data?.message || ''));
    } finally {
      setShowCreatePost(false);
      setSelectedPostType(null);
      setNewPost({ title: '', content: '' });
      setPollOptions(['', '']);
      setSkillTags([]);
      setNewTag('');
    }
  };

  // Vote handler
  const handleVote = async (postId, optionId) => {
    try {
      console.log(`Voting on post ${postId}, option ${optionId}`);
      const response = await api.put(`/api/posts/${postId}/vote/${optionId}`);
      console.log('Vote response:', response.data);
      const updatedPost = response.data;
      setPosts(currentPosts => currentPosts.map(p => p.id === postId ? updatedPost : p));
    } catch (err) {
      console.error('Vote error:', err);
      alert('Failed to cast vote. ' + (err.response?.data?.message || ''));
    }
  };

  // Toggle comment visibility for DISCUSSION posts
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  if (loading) return <div className="p-4 text-center">Loading Inter-College Feed...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Could not load feed.</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
          Inter-College Feed
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect, collaborate, and share across college boundaries
        </p>
      </div>

      {/* Create Post Button */}
      <div className="flex justify-center">
        <Button onClick={() => setShowCreatePost(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg">
          ✨ Create Post
        </Button>
      </div>

      {/* Filter Tabs */}
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

      {/* Create Post Modal */}
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
                <div className="grid grid-cols-3 gap-3">
                  {POST_TYPES.map((type) => (
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

              {selectedPostType !== 'POLL' && (
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skillTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-slate-700 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-slate-600"
                        onClick={() => removeSkillTag(tag)}
                      >
                        {tag} ✕
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkillTag()}
                      className="bg-slate-800/50 border-slate-700 focus:ring-blue-500"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSkillTag}
                      className="hover:bg-slate-700"
                    >
                      Add
                    </Button>
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

      {/* Posts Display */}
      <div className="space-y-6">
        {getFilteredPosts().map((post) => {
          // Handle both pollOptions and options field names
          const pollOptions = post.pollOptions || post.options || [];
          const totalVotes = post.type === 'POLL'
            ? pollOptions.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0)
            : 0;

          let userHasVoted = false;
          if (post.type === 'POLL' && pollOptions.length > 0) {
            userHasVoted = pollOptions.some(opt => Array.isArray(opt.votes) && opt.votes.includes(currentUserId));
          }

          const typeInfo = POST_TYPES.find(t => t.id === post.type) || {};

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

                  {/* Display Tags */}
                  {(post.requiredSkills?.length > 0 || post.skillTags?.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {(post.requiredSkills || post.skillTags || []).map(tag => (
                        <Badge key={tag} variant="outline" className="border-slate-600 bg-slate-700/30 text-slate-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Poll Rendering Logic */}
                  {post.type === 'POLL' && pollOptions.length > 0 && (
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
                  {post.type === 'POLL' ? (
                    <div className="text-slate-400">Total votes: {post.pollOptions?.reduce((s, o) => s + (o.votes?.length || 0), 0)}</div>
                  ) : (
                    <div className="flex items-center space-x-6 text-slate-400">
                      <button className="flex items-center gap-2 hover:text-white"><span>👍</span>{post.likes?.length || 0}</button>
                      <button className="flex items-center gap-2 hover:text-white"><span>💬</span>{post.comments?.length || 0}</button>
                      <button className="flex items-center gap-2 hover:text-white"><span>🔗</span>Share</button>
                    </div>
                  )}

                  <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 hover:bg-slate-700">Reply</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
