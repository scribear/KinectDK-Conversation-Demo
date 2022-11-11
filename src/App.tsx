import React, {useEffect}  from 'react';
import logo from './logo.svg';
import { AzureRecog } from './azureRecog';

import './App.css';
import { AzureConversation } from './converseDemo';
import { MultiChannelAudio } from './multiChannel';
import FromStream from './testCustomStream';

let transcriptsFull = "testing";
let audioContext: AudioContext;
// let audioRunning : boolean = false;

function App() {
    const [audioRunning, setAudioRunning] = React.useState<boolean>(false);

    const { azureConverseTranscripts, azureConverseListen } = AzureConversation();

    // Existing code unchanged.
    window.onload = function() {
        audioContext = new AudioContext();
        console.log(12, `${(audioContext.state === 'suspended')? 'AudioContext suspended, click start to create/resume' : 'state: '}`, audioContext.state);
        // Setup all nodes
        // ...

        // One-liner to resume playback when user interacted with the page.
        document.querySelector('button')!.addEventListener('click', function() {
            audioContext.resume().then(() => {
                console.log(26, 'Playback resumed successfully, state: ' + audioContext.state);
                if (audioContext.state === 'running') {
                    setAudioRunning(true);
                }
            });
        });
    }

    React.useEffect(()=>{
        console.log("In App effect");
        if (audioRunning) {
            MultiChannelAudio(audioContext);
        }
    }, [audioRunning]);

    const azureHandler = async () => {
        const recognizedMessage = await azureConverseListen(transcriptsFull).then(response => {  
            transcriptsFull = transcriptsFull + response
            azureHandler()
        });
    };

    return (
        <div className="App">
            <button>Start</button>
                <ul >
                    {azureConverseTranscripts.map(transcript => (
                        <h3 id = "captionsSpace" style = {{position: 'fixed', width: '90%', textAlign: 'left', left: '0', fontSize: '12px', paddingLeft: '5%', paddingRight: '60%', overflowY: 'scroll', height: '40%', color: '#000000'}}>{transcript}</h3>
                    ))}
                </ul>
            <FromStream/>
        </div>
    );
}

export default App;
