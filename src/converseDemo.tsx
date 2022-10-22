import * as React from 'react';
import { useCallback, useMemo } from 'react';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'

import { v4 as uuidv4 } from 'uuid';

export const AzureConversation = () => {
  const setUp = (conversation : speechSDK.Conversation, transcriber : speechSDK.ConversationTranscriber) => {
  }
  
  let transcript = "";
  // const filepath = "./female.wav";
  const [azureConverseTranscripts, setTranscripts] = React.useState<string[]>([]);
  const azureConverseListen = useCallback(
    async (transcriptsFull: string) =>
      new Promise((resolve, reject) => {
        const key : string = process.env.REACT_APP_KEY!;
        const region : string = process.env.REACT_APP_REGION!;
        console.log(key, region);
        try {
          let lastStartedAt = new Date().getTime();

          console.log(key, region);
          let speechTranslationConfig : speechSDK.SpeechTranslationConfig = speechSDK.SpeechTranslationConfig.fromSubscription(key, region);
          speechTranslationConfig.setProfanity(2);

          speechTranslationConfig.setProperty("DeviceGeometry", "Circular6+1");
          speechTranslationConfig.setProperty("SelectedGeometry", "Raw");
          speechTranslationConfig.setProperty("ConversationTranscriptionInRoomAndOnline", "true");
          speechTranslationConfig.setProperty("DifferentiateGuestSpeakers", "true");
          // speechTranslationConfig.setProperty('TranscriptionService_SingleChannel', "true");
          speechTranslationConfig.setServiceProperty("transcriptionMode", "RealTimeAndAsync", speechSDK.ServicePropertyChannel.UriQueryParameter);

          // // Create an audio stream from a wav file or from the default microphone if you want to stream live audio from the supported devices
          // // Replace with your own audio file name and Helper class which implements AudioConfig using PullAudioInputStreamCallback
          // let wavfilePullStreamCallback : speechSDK.PullAudioInputStreamCallback = Helper.OpenWavFile("16kHz16Bits8channelsOfRecordedPCMAudio.wav");
          // // Create an audio stream format assuming the file used above is 16kHz, 16 bits and 8 channel pcm wav file
          // // let audioStreamFormat : speechSDK.AudioStreamFormat = speechSDK.AudioStreamFormat.getWaveFormatPCM((long)16000, (short)16,(short)8);
          // let audioStreamFormat : speechSDK.AudioStreamFormat = speechSDK.AudioStreamFormat.getDefaultInputFormat();
          // // Create an input stream
          // let audioStream : speechSDK.AudioInputStream = speechSDK.AudioInputStream.createPullStream(wavfilePullStreamCallback, audioStreamFormat);

          // create conversation and transcriber
          let conversation : speechSDK.Conversation = speechSDK.Conversation.createConversationAsync(speechTranslationConfig, uuidv4()); // pick a conversation Id that is a GUID.
          // let audioConfig : speechSDK.AudioConfig = speechSDK.AudioConfig.fromWavFileInput(fs.readFileSync(filepath));
          let transcriber : speechSDK.ConversationTranscriber = new speechSDK.ConversationTranscriber(speechSDK.AudioConfig.fromDefaultMicrophoneInput());
          
          // attach the transcriber to the conversation
          transcriber.joinConversationAsync(conversation,
            () => {
              // let user1 = speechSDK.Participant.From("yunw3@illinois.edu", "en-us", "");
              // let user2 = speechSDK.Participant.From("user2@example.com", "en-us", "");
              // let user1 = new speechSDK.Participant("yunw3@illinois.edu", "#FF0000", "u1", true, false, false, "en-us");
              // let user2 = new speechSDK.Participant("example@illinois.edu", "#00FF00", "u2", false, false, false, "en-us");
              // conversation.addParticipantAsync(user1, undefined, (err)=>{console.trace("err - adding user1: " + err);});
              // conversation.addParticipantAsync(user2, undefined, (err)=>{console.trace("err - adding user2: " + err);});
              console.log(40, transcriber, conversation, '\n', conversation.isConnected, '\n', conversation.participants);
            },
            (err) => {
              console.trace("err - joining conversation: " + err);
            }
          );

          let lastRecognized = ""
          transcriber.conversationStarted = (s, e) => {
            console.log("conversation started");
          };
          transcriber.conversationStopped = (s, e) => {
            console.log("conversation stopped");
          };
          transcriber.conversationCanceled = (s, e) => {
            console.log("conversation canceled");
          };
          transcriber.sessionStarted = function(s, e) {
            console.log("(sessionStarted)", s, e);
            // console.log(50, transcriber, conversation, '\n', conversation.isConnected, '\n', conversation.participants);
          };
          transcriber.sessionStopped = function(s, e) {
            console.log("(sessionStopped)");
            const timeSinceStart = new Date().getTime() - lastStartedAt;
          };
          transcriber.canceled = function(s, e) {
            console.log("(canceled)", s, e);
            // transcriber.startTranscribingAsync();
          };
          transcriber.transcribing = (s, e) => {
            console.log("(transcribing) speakerId: ", e.result.speakerId, "; text: " + e.result.text);
            transcript = lastRecognized + `${e.result.speakerId}: ${e.result.text}`;
            setTranscripts([...azureConverseTranscripts, transcript]);
            transcriptsFull = transcript
          };
          transcriber.transcribed = (s, e) => {
            console.log("(transcribed) speakerId: ", e.result.speakerId, "; text: " + e.result.text);
            lastRecognized += `${e.result.speakerId}: ${e.result.text}` + " ";
            transcript = lastRecognized
            setTranscripts([...azureConverseTranscripts, transcript]);
            transcriptsFull = transcript
          };
          transcriber.startTranscribingAsync(
            ()=>{console.log(90, transcriber, conversation, '\n', conversation.isConnected, '\n', conversation.participants);},
            (err)=>{console.trace("err - starting transcribing: " + err);}
          );
        } catch (error) {
          resolve(false)
        }
      }),
    [setTranscripts]
  );
  return useMemo(() => ({ azureConverseTranscripts, azureConverseListen }), [azureConverseTranscripts]);
};