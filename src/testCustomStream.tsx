// import fs from 'fs';
import { useEffect, useState } from 'react';
import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'

import { v4 as uuidv4 } from 'uuid';

const FromStream : React.FC = () => {
    const key : string = process.env.REACT_APP_KEY!;
    const region : string = process.env.REACT_APP_REGION!;
    let speechTranslationConfig : speechSDK.SpeechTranslationConfig;
    useEffect(() => {
        speechTranslationConfig = speechSDK.SpeechTranslationConfig.fromSubscription(key, region);
        // set language to "en-us"
        speechTranslationConfig.speechRecognitionLanguage = "en-US";
        speechTranslationConfig.addTargetLanguage("en-US");
        speechTranslationConfig.setProfanity(2);

        speechTranslationConfig.setProperty("DeviceGeometry", "Circular6+1");
        speechTranslationConfig.setProperty("SelectedGeometry", "Raw");
        speechTranslationConfig.setProperty("ConversationTranscriptionInRoomAndOnline", "true");
        speechTranslationConfig.setProperty("DifferentiateGuestSpeakers", "true");
        speechTranslationConfig.setServiceProperty("transcriptionMode", "RealTimeAndAsync", speechSDK.ServicePropertyChannel.UriQueryParameter);
    }, [key, region]);
    const [azureConverseTranscripts, setTranscripts] = useState<string[]>([]);


    const onFileChange = (event: { target: any; })=> {
        console.log(event.target.files[0]);

        const audioContext = new AudioContext();
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result!;
            console.log("arrayBuffer: ", arrayBuffer);

            if (typeof arrayBuffer === 'string') return;
            audioContext.decodeAudioData(arrayBuffer, setUpRecognizer);
        };

        // const in_file_blob : Blob = event.target.files[0];
        reader.readAsArrayBuffer(event.target.files[0]);
    }

    let pushStream : speechSDK.PushAudioInputStream = speechSDK.AudioInputStream.createPushStream();
    const setUpRecognizer = (decoded: any) => {
        let typedArray = new Float32Array(decoded.length);
        typedArray = decoded.getChannelData(0);
        // console.log("typedArray: ", typedArray);

        pushStream.write(typedArray.buffer);
        pushStream.close();

        let audioConfig = speechSDK.AudioConfig.fromStreamInput(pushStream);
        let conversation : speechSDK.Conversation = speechSDK.Conversation.createConversationAsync(speechTranslationConfig, uuidv4()); // pick a conversation Id that is a GUID.
        let transcriber : speechSDK.ConversationTranscriber = new speechSDK.ConversationTranscriber(audioConfig);

        // attach the transcriber to the conversation
        transcriber.joinConversationAsync(conversation,
            () => {
              let user1 = speechSDK.Participant.From("yunw3@illinois.edu", "en-us", "");
              let user2 = speechSDK.Participant.From("user2@example.com", "en-us", "");
              // let user1 = new speechSDK.Participant("yunw3@illinois.edu", "#FF0000", "u1", true, false, false, "en-us");
              // let user2 = new speechSDK.Participant("example@illinois.edu", "#00FF00", "u2", false, false, false, "en-us");
              conversation.addParticipantAsync(user1, undefined, (err)=>{console.trace("err - adding user1: " + err);});
              conversation.addParticipantAsync(user2, undefined, (err)=>{console.trace("err - adding user2: " + err);});
              console.log(40, transcriber, conversation, '\n', conversation.isConnected, '\n', conversation.participants);
            },
            (err) => {
              console.trace("err - joining conversation: " + err);
            }
        );

        let lastRecognized = ""
        transcriber.conversationStarted = (s, e) => { console.log("conversation started") };
        transcriber.conversationStopped = (s, e) => { console.log("conversation stopped") };
        transcriber.conversationCanceled = (s, e) => { console.log("conversation canceled") };
        transcriber.sessionStarted = (s, e) => { console.log("(sessionStarted)", s, e) };
        transcriber.sessionStopped = (s, e) => { console.log("(sessionStopped)") };
        transcriber.canceled = (s, e) => { console.log("(canceled)", s, e) }; // restart? transcriber.startTranscribingAsync();
        transcriber.transcribing = (s, e) => {
            console.log("(transcribing) speakerId: ", e.result.speakerId, "; text: " + e.result.text);
            // transcript = lastRecognized + `${e.result.speakerId}: ${e.result.text}`;
            // setTranscripts([...azureConverseTranscripts, transcript]);
            // transcriptsFull = transcript
        };
        transcriber.transcribed = (s, e) => {
            console.log("(transcribed) speakerId: ", e.result.speakerId, "; text: " + e.result.text);
            // lastRecognized += `${e.result.speakerId}: ${e.result.text}` + " ";
            // transcript = lastRecognized
            // setTranscripts([...azureConverseTranscripts, transcript]);
            // transcriptsFull = transcript
        };
        transcriber.startTranscribingAsync(
            ()=>{console.log(90, transcriber, conversation, '\n', conversation.isConnected, '\n', conversation.participants);},
            (err)=>{console.trace("err - starting transcribing: " + err);}
        );
    }

    return (
        <div>
            <input type="file" name="audioFile" id="audioFile"
                   onChange={onFileChange} accept="audio/wav"/>
        </div>
    )
}

export default FromStream;
