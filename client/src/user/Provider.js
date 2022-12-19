import { useState } from 'react';
import Context from './Context'

function Provider({ children }) {
    const [user, setUser] = useState(null)
    const loginUser = (data) => {
        setUser(data)
    }
    const value = {
        user,
        loginUser
    }
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default Provider;