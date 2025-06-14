import React from 'react';
import PageHeader from '../components/PageHeader.jsx'; // Adjust the path as needed
import AppLogosFooter from '../components/AppLogosFooter.jsx';

const StudentSub = () => {
    return (
        <div>
            <PageHeader />
            <h1>Student Membership</h1>
            {/* Add your component content here */}
            <p>This is the student membership page where students can access their benefits.</p>
            <AppLogosFooter />
        </div>
    );
};

export default StudentSub;