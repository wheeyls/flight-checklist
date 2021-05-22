import React from 'react';
import ReactDOM from 'react-dom';
import { Checklist } from './Checklist';
import { ChecklistComponent } from './ChecklistComponent';
import { packingList } from './packingList';
import { skyhawkRChecklist } from './skyhawkRChecklist';
import { skyhawkPChecklist } from './skyhawkPChecklist';
import { playbacker } from './playbacker';
import { VoiceComponent } from './VoiceComponent';
import './app.scss';

const checklists = [skyhawkRChecklist, skyhawkPChecklist, packingList].map(
  (list) => {
    return Checklist.fromMarkdown(list);
  }
);
const checklist = checklists[0];

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('serviceWorker.js')
      .then((res) => console.log('service worker registered'))
      .catch((err) => console.log('service worker not registered', err));
  });
}

const voice = playbacker(checklist.sections[0]);

function App() {
  return (
    <>
      <VoiceComponent voice={voice} />
      <ChecklistComponent
        checklist={checklist}
        checklists={checklists}
        voice={voice}
      />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('container'));
