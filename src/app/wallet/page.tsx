'use client'
import React, {useState} from 'react';
import {Header} from '@/components/Header';
import styled from 'styled-components';
import {useTonAddress} from '@tonconnect/ui-react';
import {useAppContext} from '@/context/AppContext';

const WalletPage = () => {
    const {isConnected} = useAppContext();
    const userFriendlyAddress = useTonAddress();
    const shortenedAddress = userFriendlyAddress
        ? `${userFriendlyAddress.slice(0, 5)}...${userFriendlyAddress.slice(-5)}`
        : '';

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (userFriendlyAddress) {
            await navigator.clipboard.writeText(userFriendlyAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Wrapper>
            <Header isWallet={true} />
            <Content>
                {isConnected ? (
                    <AddressBlock>
                        <Title>Wallet Address</Title>
                        <AddressText>{shortenedAddress}</AddressText>
                        <CopyButton onClick={handleCopy}>
                            {copied ? 'Copied!' : 'Copy Address'}
                        </CopyButton>
                    </AddressBlock>
                ) : (
                    <Message>Please connect your wallet</Message>
                )}
            </Content>
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

const Content = styled.div`
    width: 100%;
    margin-top: 20px;
`;

const Title = styled.h2`
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 10px;
    color: #333;
`;

const AddressBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const AddressText = styled.div`
    background-color: #fff;
    color: #333;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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

const Message = styled.div`
    font-size: 1.2rem;
    color: #333;
    text-align: center;
`;

export default WalletPage;