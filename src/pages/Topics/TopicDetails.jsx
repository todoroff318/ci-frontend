import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReplyForm from './ReplyForm.jsx';
import '../../styling/Topics.css'

const TopicDetails = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [editingTopic, setEditingTopic] = useState(false);
  const [editTopicText, setEditTopicText] = useState('');
  const [editingReply, setEditingReply] = useState(null);
  const [editText, setEditText] = useState('');
  const pageSize = 2;

  useEffect(() => {

    const fetchTopic = async () => {
      try {
        const response = await fetch(`http://localhost:8080/topics/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTopic(data);
          setEditTopicText(data.description);
          await fetch(`http://localhost:8080/topics/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ...data,
              views: data.views + 1
            })
          });
        } else {
          console.error('Failed to fetch topic');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchReplies = async (page) => {
      try {
        const response = await fetch(`http://localhost:8080/replies/${id}?page=${page}&pageSize=${pageSize}`);
        if (response.ok) {
          const data = await response.json();
          setReplies(data);
        } else {
          console.error('Failed to fetch replies');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (id) {
      fetchTopic();
      fetchReplies(currentPage);
    }

    const getUser = async () => {
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
      if (userCookie) {
        const username = userCookie.split('=')[1];
        try {
          const response = await fetch(`http://localhost:8080/users/${username}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentUser(userData);
            setIsLoggedIn(true);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    getUser();
  }, [id, currentPage]);

  const handleEditReply = (reply) => {
    setEditingReply(reply.id);
    setEditText(reply.description);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const editReply = {
      description: editText,
      topicId: id,
      username: currentUser.username,
      id: editingReply,
      created: replies.find(reply => reply.id === editingReply).created,
      modified: new Date().toISOString()
    }

    try {
      const response = await fetch(`http://localhost:8080/replies/${editingReply}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editReply)
      });
      if (response.ok) {
        setReplies((prevReplies) => prevReplies.map(reply => 
          reply.id === editingReply ? { ...reply, reply: { ...reply, description: editText } } : reply
        ));
        setEditingReply(null);
        setEditText('');
      } else {
        console.error('Failed to edit reply');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    setEditText('');
  };

  const handleEditTopic = () => {
    setEditingTopic(true);
  };

  const handleEditTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/topics/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...topic,
          description: editTopicText,
          modified: new Date().toISOString()
        })
      });
      if (response.ok) {
        setTopic((prevTopic) => ({
          ...prevTopic,
          description: editTopicText
        }));
        setEditingTopic(false);
      } else {
        console.error('Failed to edit topic');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancelEditTopic = () => {
    setEditingTopic(false);
    setEditTopicText(topic.description);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchReplies = async (page) => {
    try {
      const response = await fetch(`http://localhost:8080/replies/${id}?page=${page}&pageSize=${pageSize}`);
      if (response.ok) {
        const data = await response.json();
        setReplies(data);
      } else {
        console.error('Failed to fetch replies');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleReplySubmit = () => {
    fetchReplies(currentPage);
  };

  if (id && !topic) {
    return <div>Loading...</div>;
  }

  const userCanEdit = (authorID) => {
    return currentUser && (currentUser.role === 'Moderator' || currentUser.role === 'Administrator' || currentUser.userID === authorID);
  };

  return (
      <div>
        {topic ? (
            <div className='topic-details-container'>
              <div className='topic-details-card'>
                <div className='topic-details-header'>
                  <h2 className="topic-details-title">{topic.title}</h2>
                  <p className="topic-details-text">Created by: {topic.userName} | {new Date(topic.created).toLocaleString()} | {topic.views} view(s)</p>
                  {userCanEdit(topic.username) && (
                      <>
                        <button
                            onClick={handleEditTopic}
                            className="btn-edit-topic"
                        >
                          Edit
                        </button>
                      </>
                  )}
                </div>
                <div className='topic-details-body'>
                  {editingTopic ? (
                      <form onSubmit={handleEditTopicSubmit}>
                        <div className="form-group">
                    <textarea
                        className="form-control"
                        rows="3"
                        value={editTopicText}
                        onChange={(e) => setEditTopicText(e.target.value)}
                        required
                    />
                        </div>
                        <button type="submit" className="btn-save">Save</button>
                        <button type="button" onClick={handleCancelEditTopic} className="btn-cancel">Cancel</button>
                      </form>
                  ) : (
                      <p className="topic-details-text">{topic.description}</p>
                  )}
                </div>
              </div>

              {/*<hr/>*/}
              {isLoggedIn && <ReplyForm topicID={id} onReplySubmit={handleReplySubmit} />}
              {/*<hr/>*/}

              {replies.map((reply) => (
                  <div key={reply.id} className="reply-card">
                    <div className='reply-card-header'>
                      <p className="reply-card-text">Replied by: {reply.username} | {new Date(reply.created).toLocaleString()}</p>
                      {userCanEdit(reply.userID) && (
                          <>
                            <button
                                onClick={() => handleEditReply(reply)}
                                className="btn-edit-reply"
                            >
                              Edit
                            </button>
                          </>
                      )}
                    </div>
                    <div className="reply-card-body">
                      {editingReply === reply.id ? (
                          <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                      <textarea
                          className="form-control"
                          rows="3"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          required
                      />
                            </div>
                            <button type="submit" className="btn-save">Save</button>
                            <button type="button" onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
                          </form>
                      ) : (
                          <p className="reply-card-text">{reply.description}</p>
                      )}
                    </div>
                  </div>
              ))}

              <div className="pagination-container">
                <button
                    className="btn-pagination"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                  Previous
                </button>
                <span className='pagination-text'>Page {currentPage}</span>
                <button
                    className="btn-pagination"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={replies.length < pageSize}
                >
                  Next
                </button>
              </div>

            </div>
        ) : (
            <p>No topic found.</p>
        )}
      </div>
  );
};


export default TopicDetails;
