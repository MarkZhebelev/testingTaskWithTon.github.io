'use client'
import React from 'react';
import {Header} from '@/components/Header';
import {useRouter} from 'next/navigation';
import styled from 'styled-components';

const TransactionPage = () => {
    const router = useRouter()
    const handleBackRouter = () => {router.push('/wallet'); }

    return (
        <Wrapper>
            <Header isWallet={false} handleBackRouter={handleBackRouter}/>
            {/*<label htmlFor="countTon"></label>*/}
            {/*<input type="text" value={}/>*/}
            <CopyButton>send transaction</CopyButton>
        </Wrapper>
    );
};
const Wrapper = styled.div`
    max-width: 360px;
    height: 100vh;
    margin: 0 auto;
    background-color: #f0f4f8;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
`;
const CopyButton = styled.button`
    font-size: 1rem;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #0056b3;
    }
`;
export default TransactionPage;