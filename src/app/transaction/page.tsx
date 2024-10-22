'use client';
import React, {useRef, useState} from 'react';
import {Header} from '@/components/Header';
import {useRouter} from 'next/navigation';
import styled from 'styled-components';
import {useAppContext} from '@/context/AppContext';
import {UserRejectsError, useTonConnectUI} from '@tonconnect/ui-react';

const TransactionPage = () => {
    const {isConnected} = useAppContext();
    const router = useRouter();
    const handleBackRouter = () => {
        router.push('/wallet');
    };

    const [tonConnectUI] = useTonConnectUI();
    const countTonRef = useRef<HTMLInputElement>(null);
    const addressHolderRef = useRef<HTMLInputElement>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [notificationError, setNotificationError] = useState<string | null>(null);

    async function transaction() {
        const countTon = countTonRef.current?.value;
        const addressHolder = addressHolderRef.current?.value;
        const amountInNanoTon = Number(countTon) * 1e9;
        if (!countTon || !addressHolder) {
            alert("Заполните все поля");
            return;
        }

        const transaction = {
            validUntil: Math.round(Date.now() / 1000) + 10,
            messages: [
                {
                    address: addressHolder,
                    amount: amountInNanoTon.toString(),
                },
            ],
        };

        try {
            const result = await tonConnectUI.sendTransaction(transaction);
            console.log(result);
            setNotification(`Transaction successful! Your boc: ${result.boc}`);
            setNotificationError(null);
            if (countTonRef.current) {
                countTonRef.current.value = '';
            }
            if (addressHolderRef.current) {
                addressHolderRef.current.value = '';
            }
        } catch (error) {
            if (error instanceof UserRejectsError) {
                console.warn('Transaction was rejected by the user:', error.message);
                setNotification(null);
                setNotificationError('Transaction was rejected by the user');
                if (countTonRef.current) {
                    countTonRef.current.value = '';
                }
                if (addressHolderRef.current) {
                    addressHolderRef.current.value = '';
                }

            } else {
                console.error('Error sending transaction:', error);
                setNotification(null);
                setNotificationError('An error occurred while sending the transaction.');
                if (countTonRef.current) {
                    countTonRef.current.value = '';
                }
                if (addressHolderRef.current) {
                    addressHolderRef.current.value = '';
                }
            }
        } finally {
            setTimeout(() => {
                setNotification(null);
                setNotificationError(null)
            }, 5000);
        }
    }

    return (
        <Wrapper>
            <Header isWallet={false} handleBackRouter={handleBackRouter}/>
            {isConnected ? (
                <Flex>
                    <Label>
                        Count TON
                        <InputBlock
                            type="text"
                            placeholder="Введите количество TON"
                            ref={countTonRef}
                        />
                    </Label>
                    <Label>
                        Address holder
                        <InputBlock
                            type="text"
                            placeholder="Введите адрес получателя"
                            ref={addressHolderRef}
                        />
                    </Label>
                    <SendButton onClick={transaction}>Send Transaction</SendButton>
                    {notification && <Notification>{notification}</Notification>}
                    {notificationError && <Notification error>{notificationError}</Notification>}
                </Flex>
            ) : null}
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

const SendButton = styled.button`
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

const InputBlock = styled.input`
    height: 35px;
    background-color: #ffffff;
    border: 2px solid #0056b3;
    border-radius: 5px;
    padding: 5px;
    margin-top: 5px;
`;

const Flex = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    color: #333;
`;

const Notification = styled.div<{ error?: boolean }>`
    margin-top: 10px;
    padding: 10px;
    background-color: ${({ error }) => (error ? 'rgba(255, 0, 6, 0.43)' : '#d4edda')};
    color: ${({ error }) => (error ? '#721c24' : '#155724')};
    border: 1px solid ${({ error }) => (error ? 'rgba(255, 0, 6, 0.43)' : '#c3e6cb')};
    border-radius: 5px;
    width: 100%;
    text-align: center;
    word-wrap: break-word;
`;

export default TransactionPage;
