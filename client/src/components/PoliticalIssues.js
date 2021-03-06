import React, { useState, useEffect } from 'react'
import IssueList from '../components/IssueList'
import userAxios from '../config/requestinterceptor'


export default function PoliticalIssuesPage() {
    // Items will be ordered by upvotes (the most being at the top)
    const [issues, setIssues] = useState([])

    useEffect(() => {
        userAxios
            .get('/api/issue')
            .then(res => {
                setIssues(res.data)
            })
            .catch(res => console.log(res))
    }, [])

    return (
        <div>
            <IssueList issues={issues} />
        </div>
    )
}