'use client'
import {useTonConnectUI} from '@tonconnect/ui-react';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useAppContext} from '@/context/AppContext';

interface isWhatHeader {
    handleBackRouter?: () => void,
    isWallet?: boolean
}

export const Header = ({isWallet, handleBackRouter}: isWhatHeader) => {
    const [tonConnectUI] = useTonConnectUI();
    const {isConnected, setIsConnected, balanceTon, setBalanceTon} = useAppContext()
    const [tonImg, setTonImg] = useState<string | null>(null)

    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
            setIsConnected(!!wallet);
        });

        return () => unsubscribe();
    }, [tonConnectUI]);

    useEffect(() => {
        const fetchData = async () => {
            if (isConnected) {
                console.log('tonConnectUI', tonConnectUI);
                console.log('balanceTon',balanceTon)
                const getInfoAddress = async (walletAddress: string) => {
                    try {
                        const response = await fetch(`https://testnet.toncenter.com/api/v2/getAddressInformation?address=${walletAddress}`);
                        return await response.json();
                    } catch (e) {
                        console.error(e);
                        return null;
                    }
                };
                const retryFetch = async (walletAddress: string, retries: number, delay: number) => {
                    // написал цикл для повторных попыток запроса с задержкой при 429 статусе ответа
                    for (let i = 0; i < retries; i++) {
                        const response = await getInfoAddress(walletAddress);

                        if (response?.ok) {
                            return response;
                        } else if (response?.ok === 429) {
                            console.warn(`Retrying... Attempt ${i + 1}`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                        } else {
                            return response; // Другие ошибки не требуют повторной попытки
                        }
                    }
                    throw new Error('Too many retries');
                };

                const walletAddress = tonConnectUI.wallet?.account.publicKey;

                if (walletAddress && balanceTon === null) {
                    try {
                        const response = await retryFetch(walletAddress, 3, 3000); // 5 попыток с задержкой 2000мс (2 сек)

                        if (response && response.result) {
                            setBalanceTon(response.result.balance);
                        }
                    } catch (error) {
                        console.error('Failed to fetch balance after retries:', error);
                    }
                }

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const walletIcon = tonConnectUI.wallet?.imageUrl;
                setTonImg(walletIcon);

            }
        };

        fetchData();

    }, [isConnected, setBalanceTon, tonConnectUI.wallet]);

    const handleConnect = async () => {
        if (!isConnected) {
            try {
                await tonConnectUI.openSingleWalletModal('tonkeeper');
                setIsConnected(true)
            } catch (error) {
                console.error('Error during wallet connection:', error);
            }
        }
    };
    // Функция для отключения кошелька
    const handleDisconnect = async () => {
        if (isConnected) {
            try {
                await tonConnectUI.disconnect(); // Отключение кошелька
                if (setIsConnected) {
                    setIsConnected(false);
                }
                setBalanceTon(null); // Сброс баланса при отключении
            } catch (error) {
                console.error('Error during wallet disconnection:', error);
            }
        }
    };


    return (
        <HeaderWrapper>
            <HeaderContent>
                {isConnected && (
                    <BalanceDisplay>
                        <div>Balance:</div>
                        {balanceTon !== null ?
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '5px'
                            }}> {balanceTon} <img width='20px' height='20px' src={tonImg !== null ? `${tonImg}` : '' }
                                                    alt="imgTon"/></div>
                            : <div>Loading...</div>}</BalanceDisplay>
                )}
                {isWallet ? (
                        <ConnectButton onClick={isConnected ? handleDisconnect : handleConnect}>
                            {isConnected ? 'Disconnect' : 'Connect'}
                        </ConnectButton>
                    ) :
                    (
                        <ConnectButton onClick={handleBackRouter}>
                            {'back'}
                        </ConnectButton>
                    )
                }
            </HeaderContent>
        </HeaderWrapper>
    );
};
const HeaderWrapper = styled.header`
    width: 100%;
    background-color: #007bff;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    gap: 5px;
    @media (max-width: 300px) {
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }
`;

const BalanceDisplay = styled.div`
    font-size: 1.2rem;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    flex-wrap: wrap;

`;

const ConnectButton = styled.button`
    background-color: white;
    color: #007bff;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 3s ease;

    &:hover {
        background-color: #f1f1f1;
    }
`;
