import React, { createContext, FC, ReactNode, useRef, useState } from "react";
import { SimplePool , Event } from "nostr-tools";
import { Profile } from "../nostr/types";
import { Throttler } from "../nostr/requestThrottler";

interface ApplicationProviderProps {
  children?: ReactNode;
}

export interface ApplicationContextType {
  poolRef: React.MutableRefObject<SimplePool>;
  isTemplateModalOpen: boolean;
  openTemplateModal: () => void;
  closeTemplateModal: () => void;
  profiles: Map<string, Profile> | undefined;
  addEventToProfiles: (event: Event) => void;
  fetchUserProfileThrottled: (pubkey: string) => void;
}

export const ApplicationContext = createContext<
  ApplicationContextType | undefined
>(undefined);

export const ApplicationProvider: FC<ApplicationProviderProps> = ({
  children,
}) => {

  const poolRef = useRef(new SimplePool());
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const openTemplateModal = () => setIsTemplateModalOpen(true); 
  const closeTemplateModal = () => setIsTemplateModalOpen(false);

  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());


  const addEventToProfiles = (event: Event) => {
    if (profiles.has(event.pubkey)) return;
    try {
      let content = JSON.parse(event.content);
      profiles.set(event.pubkey, { ...content, event: event });
      setProfiles(profiles);
    } catch (e) {
      console.error("Error parsing event", e);
    }
  };

  const addEventsToProfiles = (events: Event[]) => {
    events.forEach((event: Event) => {
      addEventToProfiles(event);
    });
  };


  const ProfileThrottler = useRef(
    new Throttler(50, poolRef.current, addEventsToProfiles, "profiles", 500)
  );

  const fetchUserProfileThrottled = (pubkey: string) => {
    ProfileThrottler.current.addId(pubkey);
  };


  const contextValue: ApplicationContextType = {
    poolRef,
    isTemplateModalOpen,
    openTemplateModal,
    closeTemplateModal,
    profiles,
    addEventToProfiles,
    fetchUserProfileThrottled,
  };

  return (
    <ApplicationContext.Provider value={ contextValue }>
      {children}
    </ApplicationContext.Provider>
  );
};
