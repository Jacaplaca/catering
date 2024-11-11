import { type MessageStatusType } from '@root/app/_components/ui/form/Message';
import translate from '@root/app/lib/lang/translate';
import { type SettingParsedType } from '@root/types';
import { BrowserProvider, type Eip1193Provider, getDefaultProvider, toNumber, type JsonRpcSigner } from 'ethers';
import { useEffect, useState } from 'react';

const defaultMessage = { status: 'info', text: '' } as { status: MessageStatusType, text: string }

// need web3 dictionary and web3 settings
const useMetamask = ({ dictionary, settings }: {
    dictionary: Record<string, string>
    settings: SettingParsedType
}) => {

    const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(true);
    const [message, setMessage] = useState<{ status: MessageStatusType, text: string }>(defaultMessage);

    const cleanMessage = () => {
        setMessage(defaultMessage);
    };

    useEffect(() => {
        if (window.ethereum) {
            setIsMetamaskInstalled(true);
            cleanMessage();
        } else {
            setIsMetamaskInstalled(false);
            setMessage({ status: 'warning', text: translate(dictionary, 'web3:install_metamask') })
        }
    }, [dictionary]);

    const connectMetamask = async ({ callStart, callEnd }: {
        callStart: () => void
        callEnd: () => void
    }): Promise<JsonRpcSigner | undefined> => {
        callStart();
        let signer = null;

        let provider;
        if (window.ethereum == null) {

            console.log("MetaMask not installed; using read-only defaults")
            provider = getDefaultProvider()

        } else {
            provider = new BrowserProvider(window.ethereum as Eip1193Provider)
            signer = await provider.getSigner();
        }

        if (signer) {
            const network = await provider.getNetwork();
            const { chainId, name } = network;
            const goodChainId = settings['network-chainId'];
            const goodNetworkName = settings['network-name'] as string;
            const goodHumanNetworkName = settings['human-network-name'] as string;
            const isCorrectNetwork = toNumber(chainId) === goodChainId && name === goodNetworkName;
            if (!isCorrectNetwork) {
                setMessage({ status: 'warning', text: translate(dictionary, 'wrong_network', [goodHumanNetworkName]) });
                callEnd();
                return;
            }
            return signer;
        }
    };

    return {
        message,
        connectMetamask,
        isMetamaskInstalled,
    }

}

export default useMetamask;