'use client'
import {useTonConnectUI} from '@tonconnect/ui-react';
import {useEffect} from 'react';
import styled from 'styled-components';
import {useAppContext} from '@/context/AppContext';

interface isWhatHeader {
    handleBackRouter?: () => void,
    isWallet?: boolean
}

export const Header = ({isWallet, handleBackRouter}: isWhatHeader) => {
    const [tonConnectUI] = useTonConnectUI();
    const {isConnected, setIsConnected, balanceTon, setBalanceTon} = useAppContext()

    useEffect(() => {
        const checkWalletConnection = async () => {
            const wallet = tonConnectUI.wallet;
            setIsConnected(!!wallet);
        };

        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
            setIsConnected(!!wallet);
        });

        checkWalletConnection();

        return () => unsubscribe();
    }, [setIsConnected, tonConnectUI]);

    useEffect(() => {
        const fetchData = async () => {
            if (isConnected) {
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
                    // цикл для повторных попыток запроса с задержкой при 429 статусе ответа
                    for (let i = 0; i < retries; i++) {
                        const response = await getInfoAddress(walletAddress);

                        if (response?.ok) {
                            return response;
                        } else if (response?.ok === 429) {
                            console.warn(`Retrying... Attempt ${i + 1}`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                        } else {
                            // Для других ошибок не нужно вызывать повторный запрос
                            return response;
                        }
                    }
                    throw new Error('Too many retries');
                };

                const walletAddress = tonConnectUI.wallet?.account.publicKey;

                if (walletAddress && balanceTon === null) {
                    try {
                        const response = await retryFetch(walletAddress, 3, 3000);
                        console.log('API Response:', response);

                        if (response && response.result) {
                            setBalanceTon(response.result.balance);
                        }
                    } catch (error) {
                        console.error('Failed to fetch balance after retries:', error);
                    }
                }
            }
        };

        fetchData();

    }, [balanceTon, isConnected, setBalanceTon, tonConnectUI.wallet?.account.publicKey]);

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
    const handleDisconnect = async () => {
        if (isConnected) {
            try {
                await tonConnectUI.disconnect();
                if (setIsConnected) {
                    setIsConnected(false);
                    setBalanceTon(null);
                }
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
                            }}> {balanceTon} <img width='20px' height='20px' src='https://tonkeeper.com/assets/tonconnect-icon.png'
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    gap: 5px;
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
    margin-left: auto;
    &:hover {
        background-color: #f1f1f1;
    }
    @media (max-width: 300px) {
        margin-left: inherit;
    }
`;
