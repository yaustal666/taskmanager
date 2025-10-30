import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './ProjectMembers.css'

const roleLabels = {
    1: 'Owner',
    2: 'Admin',
    3: 'Member'
}

export const ProjectMembers = ({ projectId, isPublic = false }) => {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [invite, setInvite] = useState({ name: '', email: '', role: 3 })

    const loadMembers = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await axios.get(`http://localhost:5000/api/get-all-project-members/${projectId}`)
            setMembers(res.data.members || [])
        } catch (e) {
            setError(e?.response?.data?.error || 'Failed to load members')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMembers()
    }, [projectId])

    const canEdit = useMemo(() => true, [])

    const inviteMember = async () => {
        setError('')
        try {
            await axios.post(`http://localhost:5000/api/add-project-member/${projectId}`, {
                name: invite.name,
                email: invite.email,
                desiredMemberRole: invite.role
            })
            setInvite({ name: '', email: '', role: 3 })
            await loadMembers()
        } catch (e) {
            setError(e?.response?.data?.error || 'Failed to add member')
        }
    }

    const updateRole = async (email, newRole) => {
        setError('')
        try {
            await axios.put(`http://localhost:5000/api/update-project-member-role/${projectId}`, {
                email,
                desiredMemberRole: Number(newRole)
            })
            await loadMembers()
        } catch (e) {
            setError(e?.response?.data?.error || 'Failed to update role')
        }
    }

    const removeMember = async (email) => {
        setError('')
        try {
            await axios.delete(`http://localhost:5000/api/delete-project-member/${projectId}`, {
                data: { email }
            })
            await loadMembers()
        } catch (e) {
            setError(e?.response?.data?.error || 'Failed to remove member')
        }
    }

    return (
        <div className="members-card">
            <div className="members-header">
                <h3>Project Members</h3>
                {loading && <span className="tag muted">Loading…</span>}
                {!!error && <span className="tag error">{error}</span>}
            </div>

            <ul className="members-list">
                {members.map((m) => (
                    <li key={m.email} className="member-item">
                        <div className="member-main">
                            <div className="avatar" aria-hidden>{(m.name || '?').slice(0,1).toUpperCase()}</div>
                            <div className="meta">
                                <div className="name">{m.name}</div>
                                <div className="email">{m.email}</div>
                            </div>
                        </div>
                        <div className="member-actions">
                            <select
                                className="role-select"
                                value={m.role}
                                onChange={(e) => updateRole(m.email, e.target.value)}
                                disabled={!canEdit || m.role === 1}
                                title={m.role === 1 ? 'Owner role cannot be changed' : 'Change role'}
                            >
                                <option value={1}>Owner</option>
                                <option value={2}>Admin</option>
                                <option value={3}>Member</option>
                            </select>
                            <button
                                className="btn danger"
                                onClick={() => removeMember(m.email)}
                                disabled={!canEdit || m.role === 1}
                                title={m.role === 1 ? 'Owner cannot be removed' : 'Remove member'}
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
                {!members.length && !loading && (
                    <li className="member-empty">No members yet</li>
                )}
            </ul>

            {isPublic && (
            <div className="invite-block">
                <h4>Invite member</h4>
                <div className="invite-row">
                    <input
                        className="input"
                        placeholder="Name"
                        value={invite.name}
                        onChange={(e) => setInvite({ ...invite, name: e.target.value })}
                    />
                    <input
                        className="input"
                        placeholder="Email"
                        value={invite.email}
                        onChange={(e) => setInvite({ ...invite, email: e.target.value })}
                    />
                    <select
                        className="input"
                        value={invite.role}
                        onChange={(e) => setInvite({ ...invite, role: Number(e.target.value) })}
                    >
                        <option value={2}>Admin</option>
                        <option value={3}>Member</option>
                    </select>
                    <button className="btn primary" onClick={inviteMember}>Add</button>
                </div>
            </div>
            )}
        </div>
    )
}

export default ProjectMembers


