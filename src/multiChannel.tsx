import * as React from 'react';
// import { useCallback, useMemo } from 'react';
// import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'

const setSource = async (audioContext: AudioContext) => {
    const newMediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });

    return audioContext.createMediaStreamSource(newMediaStream);
};

export const MultiChannelAudio = (audioContext : AudioContext) => {
    const channelCount = 7;
    console.log("in multi channel");

    setSource(audioContext).then((source : MediaStreamAudioSourceNode) => {
        console.log(source);

        const splitter = audioContext.createChannelSplitter(channelCount);
        const merger = audioContext.createChannelMerger(channelCount);

        source.connect(splitter);
        // console.log(source);
        // console.log(splitter);
        // splitter

        // for (let i = 0; i < channelCount; i++) {
        //     splitter.connect(merger, i, i);
        // }
        
        // console.log(merger)
        // merger.connect(audioContext.destination);

        // return merger;
    });

    


    // // A function that uses ChannelSplitterNode and ChannelMergerNode to split audio into 7 channels and merge them back into 1 channel
    // const splitAndMerge = (audioContext: AudioContext, audioBuffer: AudioBuffer) => {
    //     // Create a ChannelSplitterNode
    //     const splitter : ChannelSplitterNode = audioContext.createChannelSplitter(channelCount);
    //     // Create 7 GainNode
    //     const gainNodes : Array<GainNode> = Array.from({ length: channelCount }, () => audioContext.createGain());
    //     // Create a ChannelMergerNode
    //     const merger : ChannelMergerNode = audioContext.createChannelMerger(channelCount);
    //     // Create a destination node
    //     const destination : MediaStreamAudioDestinationNode = audioContext.createMediaStreamDestination();

    //     // Connect the audioBuffer to the splitter
    //     audioBuffer
    //         .getChannelData(0)
    //         .forEach((data, i) => splitter.connect(gainNodes[i % channelCount], i % channelCount, 0));
    //     // Connect the gainNodes to the merger
    //     gainNodes.forEach((gainNode, i) => gainNode.connect(merger, 0, i));
    //     // Connect the merger to the destination
    //     merger.connect(destination);

    //     // Play the audio
    //     const audio = new Audio();
    //     audio.srcObject = destination.stream;
    //     audio.play();
    // }
};

// const ac = new AudioContext();
// let someStereoBuffer : ArrayBuffer = new ArrayBuffer(0);
// ac.decodeAudioData(someStereoBuffer, (data : AudioBuffer) => {
//     const source : AudioBufferSourceNode = ac.createBufferSource();
//     source.buffer = data;
//     const splitter : ChannelSplitterNode = ac.createChannelSplitter(2);
//     source.connect(splitter);
//     const merger : ChannelMergerNode = ac.createChannelMerger(2);

//     // Reduce the volume of the left channel only
//     const gainNode = ac.createGain();
//     gainNode.gain.setValueAtTime(0.5, ac.currentTime);
//     splitter.connect(gainNode, 0);

//     // Connect the splitter back to the second input of the merger: we
//     // effectively swap the channels, here, reversing the stereo image.
//     gainNode.connect(merger, 0, 1);
//     splitter.connect(merger, 1, 0);

//     const dest : MediaStreamAudioDestinationNode = ac.createMediaStreamDestination();

//     // Because we have used a ChannelMergerNode, we now have a stereo
//     // MediaStream we can use to pipe the Web Audio graph to WebRTC,
//     // MediaRecorder, etc.
//     merger.connect(dest);
// });
