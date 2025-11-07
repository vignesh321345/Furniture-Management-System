import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();
export const useProfileContext = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profileId, setProfileId] = useState("");

const [profile, setProfile] = useState({ name: '', email: '', isAdmin: false, isApproved: false });


 useEffect(() => {
    try {
        const res = localStorage.getItem("id");
        if (res) {
            setProfileId(JSON.parse(res));
        }
    } catch (error) {
        console.error("Error parsing profileId from localStorage:", error);
        localStorage.removeItem("id");
    }
}, []);

    useEffect(() => {
        if (profileId) {
            localStorage.setItem("id", JSON.stringify(profileId));
        }
    }, [profileId]);

    const [status, setStatus] = useState(false);



    const value = {
        profileId,
        setProfileId,
        status,
        setStatus,
      
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
