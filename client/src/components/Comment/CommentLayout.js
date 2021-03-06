import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams} from 'react-router-dom'
import Background from '../rockthevoteimage.jpeg'
import userAxios from '../../config/requestinterceptor'
import parse from 'html-react-parser'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const IssuesLayout = styled.div`
    padding: 0 15px;
    background: #DAE0E6;
    min-height: 100vh;
    background-image: url("${Background}");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    overflow: hidden;


    .comment-container {
        margin: 20px 0;
    }

    .comment-container .username {
        font-weight: 700;
    }

    .username-container {
        margin-bottom: 10px;
    }

    .comment-box {
        margin: 20px;
        padding-bottom: 20px;
    }

    .image-container {
        padding-top: 20px;
    }

    .image-container img {
        width: 100%;
        height: auto;
    }

    .button-box {
        padding: 7px;
        border-radius: 0 0 5px 5px;
        background: #eaecec;
        display: flex;
    }

    .button-box button {
        margin-left: auto;
    }

    p {
        margin: 0;
    }

    .first-column {
        margin: 20px 0;
        padding: 20px 20px;
        background: white;
        border-radius: 5px;
    }

    .second-column {
        margin: 20px 0;
    }
    .second-column div {
        background: white;
    }

    .second-column {
        display: none;
    }

    .fa-icon {
        margin: 0 5px;
    }

    .create-new-issue-container {
        margin: 20px 0;
    }

    .issue-header {
        text-align: center;
    }

    .issue-text {
        padding: 0 10px;
    }

    .description {
        padding: 0 10px;
    }

    .description-text {
        padding: 0 10px;
    }

    .link-url {
        color: blue;
    }

    .rules-for-posting-container {
        border-radius: 5px;
        overflow: hidden;
    }

    .rules-for-posting {
        background: lightgray;
        padding: 5px;
    }
    
    @media only screen and (min-width: 768px) {
        .grid-parent {
            width: 100%;
            align-self: center;
            max-width: 915px;
    
            display: grid;
            grid-template-columns: 2fr 1fr;
            grid-gap: 20px;
        }

        .second-column {
            display: block;
        }
    }

`


const Styled = styled.div`
body {
    background: #DAE0E6; 
}

.app {
    margin: 1rem 4rem;
    background: blue;
}

.app .ql-container {
    border-bottom-left-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
}

.app .ql-snow.ql-toolbar {
    display: block;
    background: #eaecec;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
}

.app .ql-bubble .ql-editor {
    border: 1px solid #ccc;
    border-radius: 0.5em;
}

.app .ql-editor {
    min-height: 18em;   
}

.themeSwitcher {
    margin-top: 0.5em;
    font-size: small;
}

.ql-blank {
    background: white;
}

.ql-snow {
    background: #eaecec;
    border: none;
}

.ql-editor {
    background: white;
}

.quill {
    border: 1px solid lightgray;
}

.quill:selected {
    border: 1px solid blue;
}
`

export default function CommentLayout() {
    const [issue, setIssue] = useState({})
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])


    const { issueId } = useParams()

    function removeBorder() {
        document.querySelector('.quill').style.border = '1px solid lightgray'
        document.querySelector('.button-box').style.borderBottom = '1px solid lightgray'
        document.querySelector('.button-box').style.borderLeft = '1px solid lightgray'
        document.querySelector('.button-box').style.borderRight = '1px solid lightgray'
    } 

    function addBorder() {
        document.querySelector('.quill').style.borderTop = '1px solid black'
        document.querySelector('.quill').style.borderRight = '1px solid black'
        document.querySelector('.quill').style.borderLeft = '1px solid black'

        document.querySelector('.button-box').style.borderBottom = '1px solid black'
        document.querySelector('.button-box').style.borderRight = '1px solid black'
        document.querySelector('.button-box').style.borderLeft = '1px solid black'
    }

    function handleQuillChange(html) {
        setComment(html)
    }

    function makeComment() {
        const user = JSON.parse(localStorage.getItem('user'))

        const newComment = {
            comment,
            user: {
                id: user._id, 
                userName: user.username
            }, 
            issueId: issueId
        }

        userAxios.post(`/api/comment`, newComment)
            .then(res => {
                setComments(prev => {
                    return [...prev, newComment]
                })
                setComment('')
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    function getComments(id) {
        userAxios.get(`/api/issue/getcomments/${id}`)
            .then(res => {
                setComments(res.data.comments)
            })
            .catch(err => {
                console.log(err);
            })
    }
    
    useEffect(() => {
        getComments(issueId)
        
        // Get issue by id
        userAxios.get(`/api/issue/${issueId}`)
            .then(res => {
                setIssue(res.data.issue)
            })
    }, [])

    const description = issue.description ? issue.description : ''
    const issueString = issue.issue ? issue.issue : ''
    const type = issue.type ? issue.type : ''
    const link = issue.link ? issue.link : ''


    const renderedComments = comments.map((comment, i) => {
        return (<div key={i} className="comment-container">
                    <div className="username-container">
                        <span className="username">{comment.user.userName}</span>
                    </div>
                {parse(comment.comment)}
            </div>)
    })

    return (
        <IssuesLayout>
            <div className="grid-parent">
                <div className="first-column">
                    {type === 'post' ? (<div className="post-type">
                        <div className="issue-text">
                            {parse(issueString)}
                        </div>
                        <h2 className="description">Issue Description</h2>
                        <hr />
                        <div className="description-text">
                            {parse(description)}
                        </div>
                        
                    </div>) : null}

                    {type === 'image' ? (<div className="image-container">
                        <div className="issue-text">
                            {parse(issueString)}
                        </div>
                        <div>
                            <img src={issue.imgUrl} alt="issue-image" />
                        </div>
                        <div>
                            {parse(description)}
                        </div>
                    </div>) : null}

                    {type === 'link' ? (<div className="content">
                        <div className="issue-text">
                            {parse(issueString)}
                        </div>
                        <div className="link-url-container">
                            <span className="link-url">{link}</span>
                        </div>
                    </div>) : null} 


                    <div className="comment-box">
                        <Styled>
                            <ReactQuill 
                                onFocus={addBorder}
                                onBlur={removeBorder}
                                onChange={handleQuillChange}
                                placeholder="Speak your mind..."
                                value={comment}
                                theme="snow" 
                                bounds={'.app'} 
                                modules={CommentLayout.modules}
                                formats={CommentLayout.formats}
                                />
                        </Styled> 
                        <div className="button-box">
                            <button onClick={makeComment}>Comment</button>
                        </div>
                    </div>
                    {renderedComments}
                </div>
                <div className="second-column">
                    
                    <div className="rules-for-posting-container">
                        <p className="rules-for-posting">Rules Posting to Rock The Vote</p>
                            <ol>
                            <li>No Profanity</li>
                                <li>Be nice</li>
                                <li>Speak your mind</li>
                            </ol>
                    </div>
                </div>
            </div>
        </IssuesLayout>
    )
}


CommentLayout.modules = {
    toolbar: [
      [{size: []}],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
    //   ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  CommentLayout.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

