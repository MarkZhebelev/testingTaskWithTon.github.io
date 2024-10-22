// components/Notification.tsx
import React from 'react';
import styled from 'styled-components';

const NotificationContainer = styled.div`
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #4caf50;
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 1000;
`;

const Notification: React.FC<{ message: string }> = ({ message }) => {
    return <NotificationContainer>{message}</NotificationContainer>;
};

export default Notification;