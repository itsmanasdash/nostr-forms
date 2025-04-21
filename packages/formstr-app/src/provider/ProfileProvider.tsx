import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
  useEffect,
} from "react";
import { LOCAL_STORAGE_KEYS, getItem, setItem } from "../utils/localStorage";
import { Modal } from "antd";

interface ProfileProviderProps {
  children?: ReactNode;
}

export interface ProfileContextType {
  pubkey?: string;
  requestPubkey: () => void;
  logout: () => void;
  privatekey?: string;
  setPrivatekey: (key: string | undefined) => void;
}

export interface IProfile {
  pubkey: string;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export const ProfileProvider: FC<ProfileProviderProps> = ({ children }) => {
  // const [user, setUser] = useState<User | null>(null);
  const [pubkey, setPubkey] = useState<string | undefined>(undefined);
  const [usingNip07, setUsingNip07] = useState(false);
  const [privatekey, setPrivatekey] = useState<string | undefined>(undefined);

  useEffect(() => {
    const profile = getItem<IProfile>(LOCAL_STORAGE_KEYS.PROFILE);
    if (profile) {
      setPubkey(profile.pubkey);
    } else {
      console.log("Couldn't find npub");
    }
  }, []);

  const logout = () => {
    setItem(LOCAL_STORAGE_KEYS.PROFILE, null);
    setPubkey(undefined);
  };

  const requestPubkey = async () => {
    try{
      setUsingNip07(true);
      let publicKey = await window.nostr.getPublicKey();
      setPubkey(publicKey);
      setItem(LOCAL_STORAGE_KEYS.PROFILE, { pubkey: publicKey });
      return pubkey;
    } catch (error) {
      console.error("Error getting public key:", error);
      return undefined;
    } finally {
      setUsingNip07(false);
    }
  };

  return (
    <ProfileContext.Provider value={{ pubkey, requestPubkey, logout , privatekey , setPrivatekey}}>
      {children}
      <Modal
        open={usingNip07}
        footer={null}
        onCancel={() => setUsingNip07(false)}
      >
        {" "}
        Check your NIP07 Extension. If you do not have one, or wish to read
        more, checkout these{" "}
        <a
          href="https://github.com/aljazceru/awesome-nostr?tab=readme-ov-file#nip-07-browser-extensions"
          target="_blank noreferrer"
        >
          Awesome Nostr Recommendations
        </a>
      </Modal>
    </ProfileContext.Provider>
  );
};