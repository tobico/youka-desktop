import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Browse, { BrowseSection } from "../comps/Browse";
import { usePageView } from "../lib/hooks";
import store from "../lib/store";
import { Video } from "../lib/video";
import VideoPlayer from "../comps/VideoPlayer";
import styles from "./Home.module.css";
import TitleBar from "../comps/TitleBar";
import { Environment } from "../comps/Environment";
import VideoList from "../comps/VideoList";
import TitleSearch from "../comps/TitleSearch";
import { Playback } from "../lib/playback";

export default function HomePage() {
  const location = useLocation();
  const history = useHistory();
  const [playback] = useState(() => new Playback());
  const [browseSection, setBrowseSection] = useState(BrowseSection.Trending);
  const [searchText, setSearchText] = useState("");
  const [nowPlaying, setNowPlaying] = useState<Video | undefined>();
  const [queue, setQueue] = useState<Video[]>([]);

  useEffect(() => {
    playback.getNowPlaying().then(setNowPlaying);
    playback.getQueue().then(setQueue);
    playback.on("nowPlayingChanged", setNowPlaying);
    playback.on("queueChanged", setQueue);
    return () => {
      playback.off("nowPlayingChanged", setNowPlaying);
      playback.off("queueChanged", setQueue);
    };
  }, [playback]);

  usePageView(location.pathname);

  useEffect(() => {
    if (!store.has("eula")) {
      history.push("/eula");
    }
    // eslint-disable-next-line
  }, []);

  const showQueue = queue.length > 0;

  return (
    <Environment>
      <div
        className={[styles.wrapper, showQueue && styles.showQueue]
          .filter(Boolean)
          .join(" ")}
      >
        <TitleSearch
          searchText={searchText}
          onFocus={() => setBrowseSection(BrowseSection.Search)}
          onSearch={(value) => {
            setBrowseSection(BrowseSection.Search);
            setSearchText(value);
          }}
        />
        <TitleBar />
        <Browse
          section={browseSection}
          searchText={searchText}
          onSelectVideo={(video) => playback.enqueueVideo(video)}
          onSwitchSection={setBrowseSection}
        />
        <div className={styles.player}>
          {nowPlaying ? (
            <VideoPlayer
              video={nowPlaying}
              onEnded={() => playback.finishPlayback(nowPlaying.id)}
            />
          ) : (
            <ZeroState />
          )}
        </div>
        {showQueue && (
          <div className={styles.queue}>
            <div className={styles.queueTitle}>Up Next</div>
            <VideoList
              kind="horizontal"
              videos={queue}
              onSelect={(video) => playback.skipToQueuedVideo(video.id)}
            />
          </div>
        )}
      </div>
    </Environment>
  );
}

function ZeroState() {
  return <div className={styles.zeroState}>Youka</div>;
}
