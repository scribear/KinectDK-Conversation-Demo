import React from "react";

import * as speechSDK from 'microsoft-cognitiveservices-speech-sdk'

// use Microsoft Azure to transcribe speech to text
export const AzureRecog : React.FC = () => {

    const [transcript, setTranscript] = React.useState<string>("");

    const setUpRecognizer = (recognizer : speechSDK.SpeechRecognizer) => {
        recognizer.recognizing = (s, e) => {
            console.log(`RECOGNIZING: Text=${e.result.text}`);
            // setTranscript(transcript => transcript + e.result.text);
        };
        
        recognizer.recognized = (s, e) => {
            if (e.result.reason == speechSDK.ResultReason.RecognizedSpeech) {
                console.log(`RECOGNIZED: Text=${e.result.text}`);
                setTranscript(transcript => transcript + e.result.text);
            }
            else if (e.result.reason == speechSDK.ResultReason.NoMatch) {
                console.log("NOMATCH: Speech could not be recognized.");
            }
        };
        
        recognizer.canceled = (s, e) => {
            console.log(`CANCELED: Reason=${e.reason}`);
        
            if (e.reason == speechSDK.CancellationReason.Error) {
                console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
                console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
                console.log("CANCELED: Did you set the speech resource key and region values?");
            }
        
            recognizer.stopContinuousRecognitionAsync();
        };
        
        recognizer.sessionStopped = (s, e) => {
            console.log("\n    Session stopped event.");
            recognizer.stopContinuousRecognitionAsync();
        };
    }

    // React.useEffect(() => {
        // not working
        const key : string | undefined = process.env.REACT_APP_CUS_KEY;
        const region : string | undefined = process.env.REACT_APP_CUS_REGION;
        if (!key || !region) {
            throw new Error("Missing environment variables");
        }

        console.log(51);

        // set up speech recognition
        const speechConfig : speechSDK.SpeechConfig = speechSDK.SpeechConfig.fromSubscription('key', 'region');
        speechConfig.speechRecognitionLanguage = "en-US";
        const audioConfig : speechSDK.AudioConfig = speechSDK.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer : speechSDK.SpeechRecognizer = new speechSDK.SpeechRecognizer(speechConfig, audioConfig);
        setUpRecognizer(recognizer);
        recognizer.startContinuousRecognitionAsync();
    // }, []);

    // const setUpRecognizer = (recognizer : speechSDK.SpeechRecognizer) => {
    //     recognizer.recognizing = (s, e) => {
    //         console.log(`RECOGNIZING: Text=${e.result.text}`);
    //         // setTranscript(transcript => transcript + e.result.text);
    //     };
        
    //     recognizer.recognized = (s, e) => {
    //         if (e.result.reason == speechSDK.ResultReason.RecognizedSpeech) {
    //             console.log(`RECOGNIZED: Text=${e.result.text}`);
    //             setTranscript(transcript => transcript + e.result.text);
    //         }
    //         else if (e.result.reason == speechSDK.ResultReason.NoMatch) {
    //             console.log("NOMATCH: Speech could not be recognized.");
    //         }
    //     };
        
    //     recognizer.canceled = (s, e) => {
    //         console.log(`CANCELED: Reason=${e.reason}`);
        
    //         if (e.reason == speechSDK.CancellationReason.Error) {
    //             console.log(`"CANCELED: ErrorCode=${e.errorCode}`);
    //             console.log(`"CANCELED: ErrorDetails=${e.errorDetails}`);
    //             console.log("CANCELED: Did you set the speech resource key and region values?");
    //         }
        
    //         recognizer.stopContinuousRecognitionAsync();
    //     };
        
    //     recognizer.sessionStopped = (s, e) => {
    //         console.log("\n    Session stopped event.");
    //         recognizer.stopContinuousRecognitionAsync();
    //     };
    // }

    return (
        <div>
            <h1> {transcript} </h1>
        </div>
    )
}