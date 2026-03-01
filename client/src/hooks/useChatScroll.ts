import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type UseChatScrollArgs = {
  selectedFriend: number | null;
  messagesLength: number;
  isMessagesFetching: boolean;
  limit: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const useChatScroll = ({
  selectedFriend,
  messagesLength,
  isMessagesFetching,
  limit,
  setPage,
}: UseChatScrollArgs) => {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);

  const loadingMoreRef = useRef(false);
  const prevScrollHeightRef = useRef<number | null>(null);
  const wasFetchingRef = useRef(false);

  const resetScrollState = useCallback(() => {
    setShouldScrollToBottom(true);
    loadingMoreRef.current = false;
    prevScrollHeightRef.current = null;
    wasFetchingRef.current = false;
  }, []);

  useEffect(() => {
    resetScrollState();
  }, [selectedFriend, resetScrollState]);

  useEffect(() => {
    if (wasFetchingRef.current && !isMessagesFetching) {
      loadingMoreRef.current = false;
    }
    wasFetchingRef.current = isMessagesFetching;
  }, [isMessagesFetching]);

  useLayoutEffect(() => {
    const c = messagesContainerRef.current;
    const prevH = prevScrollHeightRef.current;
    if (!c || prevH == null) return;

    const delta = c.scrollHeight - prevH;
    c.scrollTop = c.scrollTop + delta;
  }, [messagesLength]);

  useEffect(() => {
    const c = messagesContainerRef.current;
    if (!c) return;
    if (!shouldScrollToBottom) return;
    if (prevScrollHeightRef.current != null) return;

    c.scrollTop = c.scrollHeight;
  }, [messagesLength, shouldScrollToBottom]);

  useEffect(() => {
    if (prevScrollHeightRef.current != null) {
      prevScrollHeightRef.current = null;
    }
  }, [messagesLength]);

  useEffect(() => {
    const c = messagesContainerRef.current;
    const top = topSentinelRef.current;
    if (!c || !top || !selectedFriend) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (isMessagesFetching) return;
        if (loadingMoreRef.current) return;
        if (messagesLength < limit) return;

        prevScrollHeightRef.current = c.scrollHeight;
        loadingMoreRef.current = true;
        setShouldScrollToBottom(false);
        setPage((p) => p + 1);
      },
      {
        root: c,
        threshold: 0,
        rootMargin: "0px 0px -90% 0px",
      }
    );

    obs.observe(top);
    return () => obs.disconnect();
  }, [selectedFriend, isMessagesFetching, messagesLength, limit, setPage]);

  return {
    messagesContainerRef,
    topSentinelRef,

    shouldScrollToBottom,
    setShouldScrollToBottom,

    resetScrollState,
  };
};

export default useChatScroll;