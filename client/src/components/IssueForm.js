import React, { useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { FaFileImage, FaLink } from 'react-icons/fa'
import isUrl from 'is-url'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


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



const StyledForm = styled.form`
    background: white;
    border-radius: 5px;
    padding-bottom: 10px;

    input, 
    textarea {
        border: 1px solid lightgray;
        border-radius: 3px;
        line-height: 2;
        padding-left: 10px;
        resize: vertical;
    }

    input:focus, 
    textarea:focus {
        outline: 1px solid black;
        border: 1px solid lightgray;
    }

    .inputs {
        margin: 0 10px;
        display: flex;
        flex-direction: column;
    }

    .type-of-submission {
        overflow: hidden;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding-bottom: 10px;
    }

    .type-of-submission .type {
        margin-top: unset;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid lightgray;
        margin-top: unset;
        border-right: none;
        cursor: pointer;
    } 

    .type-of-submission .type:last-child {
        border-right: 1px solid lightgray;
    }

    .type-of-submission .type div {
        margin-top: unset;
        padding: 10px 0;
    }
    
    .type-of-submission .type:hover {
        background-color: rgba(0, 121, 211, 0.05);
    }

    .input, 
    .textarea {
        margin-top: 10px;
    }

    .input-title {
        margin-bottom: 10px;
    }
   
    .selected {
        position: relative;
    }

    .selected:after {
        content: " ";
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: blue;
        position: absolute;
    }

    .link-type {
        border-radius: 0 5px 0 0;
    }

    .post-type {
        border-radius: 5px 0 0 0;
    }

    .type-container {
        display: flex;
        align-items: center;
    }

    .type-container span {
        margin-left: 5px;
    }

    .add-issue {
        margin: 10px 0;
    }

    .link-inputs, 
    .imgurl-inputs {
        display: flex;
        flex-direction: column;
    }

    .link-inputs input {
        margin-bottom: 10px;
    }

    .imgurl-inputs input {
        margin-bottom: 10px;
    }

    .link-error, 
    .imgurl-error {
        color: red;
        text-align: center;
    }
`


const initInputs = {
    issue: "", 
    description: "", 
    imgUrl: "", 
    link: "", 
}


const initErrorInputs = {
    issue: '', 
    description: '', 
    imgUrl: '', 
    link: '', 
}

export default function IssueForm(props) {
    const [inputs, setInputs] = useState(initInputs)
    const { addIssue } = props 
    const params = useParams()

    const [errors, setErrors] = useState(initErrorInputs)

    let type;
    if (params.extension) {
        type = params.extension
    } else {
        type = "post"
    }

    function handleChange(e) {
        const {name, value} = e.target 
        setInputs(prevInputs => ({
            ...prevInputs, 
            [name]: value
        }))

        setErrors(prevInputs => {
            return {
                initErrorInputs, 

            }
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (type === 'image' && errors.image === false) return 

        if (type === 'link' && inputs.link.length === 0) {
            setErrors(prevInputs => {
                return {
                    ...prevInputs, 
                    link: 'Field cannot be left blank'
                }
            })
            return 
        }

        if (type === 'link' && !isUrl(inputs.link)) {
            setErrors(prevInputs => {
                return {
                    ...prevInputs, 
                    link: 'The value must be a valid URL'
                }
            })
            return 
        }

        if (type === 'link' && isUrl(inputs.link) && inputs.link.length) {
            setErrors(prevInputs => {
                return {
                    ...prevInputs, 
                    link: ''
                }
            })
        }

        if (type === 'image' && inputs.imgUrl.length === 0) {
            setErrors(prevInputs => {
                return {
                    ...prevInputs, 
                    imgUrl: 'Field cannot be left blank'
                }
            })
            return 
        }
        

        if (type === 'image' && !isUrl(inputs.imgUrl)) {
            setErrors(prevInputs => {
                return {
                    ...prevInputs, 
                    imgUrl: 'The value must be a valid URL'
                }
            })
            return 
        }

        const userFromStorage = JSON.parse(localStorage.getItem('user'))

        const user = {
            id: userFromStorage._id, 
            userName: userFromStorage.username
        }


        // if (type === 'link' && errors.link === false) return 
        if (!inputs.issue.length) return 
        let h1 = `<h1>${inputs.issue}</h1>`
        addIssue({
            ...inputs, 
            type: type,
            issue: h1, 
            user
        })
        setInputs(initInputs)
    }

    function removeBorder() {
        document.querySelector('.quill').style.border = '1px solid lightgray'
    } 

    function addBorder() {
        document.querySelector('.quill').style.border = '1px solid black'
    }

    function handleQuillChange(html) {
        setInputs(prevInputs => ({
            ...prevInputs, 
            description: html
        }))
    }


    return (
        <StyledForm onSubmit={handleSubmit}>
            <div className="type-of-submission">
                <div className={`type ${type === 'post' ? "selected" : ""} post-type`} onClick={() => window.location.replace('/submit/post')}>
                    <div>Post</div>
                </div>
                <div className={`type ${type === 'image' ? "selected" : ""}`} onClick={() => window.location.replace('/submit/image')}>
                    <div className="type-container">
                        <FaFileImage />
                        <span>Image</span>
                    </div>  
                </div>
                <div className={`type ${type === 'link' ? "selected" : ""} link-type`} onClick={() => window.location.replace('/submit/link')}>
                    <div className="type-container">
                        <FaLink />
                        <span>Link</span>
                    </div>  
                </div>
            </div>
                
            <div className="inputs">
                <input 
                    name="issue"
                    className="input-title"
                    type="text"
                    autoComplete="off"
                    placeholder="Title Your Issue"
                    onChange={handleChange}
                    value={inputs.issue}
                />

                {type === 'post' ? 
                <Styled>
                    <ReactQuill 
                        onFocus={addBorder}
                        onBlur={removeBorder}
                        onChange={handleQuillChange}
                        value={inputs['description']}
                        theme="snow" 
                        bounds={'.app'} 
                        modules={IssueForm.modules}
                        formats={IssueForm.formats}
                    />
                </Styled> : null}
                {type === 'image' ? 
                <div className="imgurl-inputs">
                    <input name="imgUrl" autoComplete="off" value={inputs.imgUrl} type="text" placeholder="Image URL" onChange={handleChange} />
                    <div className="imgurl-error">{errors.imgUrl}</div>
                </div>
                    : null
                }

                {type === 'link' ? 
                (<div className="link-inputs">
                    <input name="link" autoComplete="off" value={inputs.link} type="text" placeholder="URL" onChange={handleChange} />
                    <div className="link-error">{errors.link}</div>
                </div>)
                    : null
                }

                <button className="add-issue">Add Issue</button>
            </div>
        </StyledForm>
    )
}


IssueForm.modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
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
  IssueForm.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]


