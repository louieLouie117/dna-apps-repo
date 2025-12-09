import React from 'react';
import { safeCookieParser } from '../utils/cookieUtils';

const UserInfo = ({ 
    showUsername = true, 
    showUserId = true, 
    style = {}, 
    className = '',
    usernameLabel = 'Username',
    userIdLabel = 'User ID'
}) => {
    // Get username and userId from cookies using safe parser
    const username = safeCookieParser.getUserEmail('userEmail');
    const userId = safeCookieParser.getCookie('userId');

    return (
        <div className={`user-info ${className}`} style={style}>
            {showUsername && username && (
                <p className="user-info__username">
                    <strong>{usernameLabel}:</strong> {username}
                </p>
            )}
            {showUserId && userId && (
                <p className="user-info__user-id">
                    <strong>{userIdLabel}:</strong> {userId}
                </p>
            )}
        </div>
    );
};

export default UserInfo;