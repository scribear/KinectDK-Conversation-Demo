import * as React from 'react';
// import { useCallback, useMemo } from 'react';
// import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'

export const MultiChannelAudio = () => {

    // A function that uses ChannelSplitterNode and ChannelMergerNode to split audio into 8 channels and merge them back into 1 channel
    const splitAndMerge = (audioContext: AudioContext, audioBuffer: AudioBuffer) => {
        // Create a ChannelSplitterNode
        const splitter = audioContext.createChannelSplitter(7);
        // Create 7 GainNode
        const gainNodes = Array.from({ length: 8 }, () => audioContext.createGain());
        // Create a ChannelMergerNode
        const merger = audioContext.createChannelMerger(8);
        // Create a destination node
        const destination = audioContext.createMediaStreamDestination();

        // Connect the audioBuffer to the splitter
        audioBuffer
            .getChannelData(0)
            .forEach((data, i) => splitter.connect(gainNodes[i % 8], i % 8, 0));
        // Connect the gainNodes to the merger
        gainNodes.forEach((gainNode, i) => gainNode.connect(merger, 0, i));
        // Connect the merger to the destination
        merger.connect(destination);

        // Play the audio
        const audio = new Audio();
        audio.srcObject = destination.stream;
        audio.play();
    }
};