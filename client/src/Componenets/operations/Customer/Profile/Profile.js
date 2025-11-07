// Profile.js
function Profile({ name, email, phonenumber }) {
    return (
        <div className="profileContainer">
            <div className="profileDetails">
                <div className="userName">Name: {name}</div>
                <div className="userMobile">Phone: {phonenumber}</div>
                <div className="userEmail">Email: {email}</div>
            </div>
        </div>
    );
}

export default Profile;
