import React, { useState, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'framer-motion';

// Define progress state type for react-player
type ProgressState = {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
};

import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize,
  Settings,
  Download,
  Share,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  url: string;
  title?: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onProgress?: (progress: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
  onDuration?: (duration: number) => void;
  onEnded?: () => void;
  onError?: (error: unknown) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  poster,
  width = '100%',
  height = 'auto',
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  onProgress,
  onDuration,
  onEnded,
  onError,
  className
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(autoplay);
  const [volume, setVolume] = useState(0.8);
  const [mute, setMute] = useState(muted);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  const formatDuration = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  const handlePlayPause = useCallback(() => {
    setPlaying(!playing);
  }, [playing]);

  const handleSeekMouseDown = useCallback(() => {
    setSeeking(true);
  }, []);

  const handleSeekChange = useCallback((value: number[]) => {
    setPlayed(value[0] / 100);
  }, []);

  const handleSeekMouseUp = useCallback((value: number[]) => {
    setSeeking(false);
    if (playerRef.current) {
      playerRef.current.seekTo(value[0] / 100, 'fraction');
    }
  }, []);

  const handleDuration = useCallback((duration: number) => {
    setDuration(duration);
    onDuration?.(duration);
  }, [onDuration]);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0] / 100);
    setMute(value[0] === 0);
  }, []);

  const toggleMute = useCallback(() => {
    setMute(!mute);
  }, [mute]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
  }, []);

  const skipTime = useCallback((seconds: number) => {
    if (playerRef.current) {
      const currentTime = playedSeconds + seconds;
      const newTime = Math.max(0, Math.min(currentTime, duration));
      playerRef.current.seekTo(newTime, 'seconds');
    }
  }, [playedSeconds, duration]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = url;
    link.download = title || 'video';
    link.click();
  }, [url, title]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Video',
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
    }
  }, [url, title]);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className={cn("relative bg-black rounded-lg overflow-hidden", className)}>
      {/* Video Player */}
      <div 
        className="relative group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {React.createElement(ReactPlayer as any, {
          ref: playerRef,
          url: url,
          width: width,
          height: height,
          playing: playing,
          loop: loop,
          controls: false,
          volume: volume,
          muted: mute,
          playbackRate: playbackRate,
          onProgress: (state: ProgressState) => {
            if (!seeking) {
              setPlayed(state.played);
              setLoaded(state.loaded);
              setPlayedSeconds(state.playedSeconds);
            }
            onProgress?.(state);
          },
          onDuration: handleDuration,
          onEnded: onEnded,
          onError: onError,
          poster: poster
        })}

        {/* Loading Indicator */}
        {loaded < 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Custom Controls Overlay */}
        <AnimatePresence>
          {(controls && showControls) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"
            >
              {/* Top Controls */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                {title && (
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {title}
                  </Badge>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 hover:bg-black/70"
                    onClick={handleShare}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 hover:bg-black/70"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-black/50 hover:bg-black/70 w-16 h-16 rounded-full"
                  onClick={handlePlayPause}
                >
                  {playing ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                {/* Progress Bar */}
                <div className="space-y-1">
                  <Slider
                    value={[played * 100]}
                    onValueChange={handleSeekChange}
                    onPointerDown={handleSeekMouseDown}
                    onPointerUp={() => handleSeekMouseUp([played * 100])}
                    max={100}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/70">
                    <span>{formatDuration(playedSeconds)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Skip Back */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => skipTime(-10)}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>

                    {/* Play/Pause */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={handlePlayPause}
                    >
                      {playing ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Skip Forward */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => skipTime(10)}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>

                    {/* Volume Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={toggleMute}
                      >
                        {mute || volume === 0 ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="w-24">
                        <Slider
                          value={[mute ? 0 : volume * 100]}
                          onValueChange={handleVolumeChange}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Playback Speed */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48">
                        <div className="space-y-2">
                          <h4 className="font-semibold">Playback Speed</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {playbackRates.map((rate) => (
                              <Button
                                key={rate}
                                size="sm"
                                variant={playbackRate === rate ? "default" : "outline"}
                                onClick={() => handlePlaybackRateChange(rate)}
                                className="text-xs"
                              >
                                {rate}x
                              </Button>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Fullscreen */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleFullscreen}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Info */}
      {title && (
        <div className="p-4 bg-muted">
          <h3 className="font-semibold">{title}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Duration: {formatDuration(duration)}</span>
            <span>Quality: Auto</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
